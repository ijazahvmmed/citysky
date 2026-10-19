import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { assemblyTransform, phase, type AssemblyPart } from "./assembly";
import { createLandscape } from "./landscape";
import { createSceneSurfaces } from "./scene-surfaces";
import type { Completion } from "./scene-contract";

/** One parametric home, with independently assembled members. Replaceable by
 * a grouped production GLB without changing the viewport or scroll controller. */
export function createArchitecturalModel(scene: THREE.Scene, mobile: boolean, anisotropy: number) {
  const geometry = new RoundedBoxGeometry(1, 1, 1, 1, 0.005);
  const resources: THREE.BufferGeometry[] = [geometry];
  const furnitureGeometry = new RoundedBoxGeometry(1, 1, 1, 2, 0.065);
  resources.push(furnitureGeometry);
  const materials: THREE.Material[] = [];

  const root = new THREE.Group();
  root.name = "Citysky architectural assembly";
  scene.add(root);
  const surfaces = createSceneSurfaces(anisotropy);
  const grain = surfaces.plaster;
  const timberGrain = surfaces.wood;
  function mat(color: string, roughness = 0.85, texture?: THREE.Texture) {
    const material = new THREE.MeshStandardMaterial({ color, roughness, map: texture ?? null, bumpMap: texture ?? null, bumpScale: texture ? 0.006 : 0 });
    materials.push(material);
    return material;
  }
  const concrete = mat("#aaa99f", 0.95, grain);
  const plaster = mat("#e1ded1", 0.88, grain);
  const limestone = mat("#a49e8d", 0.86, grain);
  const timber = mat("#725035", 0.58, timberGrain);
  const metal = mat("#303a36", 0.42);
  const floor = mat("#d1c8b6", 0.72, grain);
  const upholstery = mat("#ddd0b8", 0.95, grain);
  const curtain = mat("#d8d3c5", 1, grain);
  const ceramic = mat("#aaa89b", 0.35);
  const glass = new THREE.MeshPhysicalMaterial({ color: "#d3e0dd", roughness: 0.08, metalness: 0, ior: 1.5, reflectivity: 0.4, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.1, transparent: true, opacity: 0.24, depthWrite: false, side: THREE.DoubleSide });
  materials.push(glass);
  const luminous = mat("#ffe3a8", 0.5);
  luminous.emissive.set("#ffc57a");

  type Part = AssemblyPart & { group: string; material: THREE.Material };
  const parts: Part[] = [];
  function box(group: string, material: THREE.Material, x: number, y: number, z: number, w: number, h: number, d: number, start: number, end: number, axis: 0 | 1 | 2 = 1, settle = 0) {
    parts.push({ group, material, position: [x, y, z], size: [w, h, d], start, end, axis, settle });
  }
  const landscape = createLandscape(root, surfaces, mobile);

  // Footings, ground frame and upper frame are timed independently, in load order.
  let i = 0;
  for (const z of [-2.8, 2.8]) for (const x of [-4, 0, 4]) {
    const delay = i++ * 0.009;
    box("foundation", concrete, x, 0.06, z, 0.95, 0.32, 0.95, 0.17 + delay, 0.23 + delay);
    box("columns", concrete, x, 1.8, z, 0.24, 2.9, 0.24, 0.28 + delay, 0.35 + delay);
    box("upper-columns", concrete, x, 4.85, z, 0.24, 2.9, 0.24, 0.415 + delay, 0.47 + delay);
  }
  box("ground-slab", concrete, 0, 0.3, 0, 8.4, 0.2, 6.2, 0.245, 0.29, 0);
  for (const [floorIndex, y] of [3.2, 6.2].entries()) {
    for (const [index, z] of [-2.8, 2.8].entries()) box("beams", concrete, 0, y, z, 8.25, 0.28, 0.28, 0.35 + floorIndex * 0.13 + index * 0.01, 0.395 + floorIndex * 0.13 + index * 0.01, 0);
    for (const [index, x] of [-4, 0, 4].entries()) box("beams", concrete, x, y, 0, 0.28, 0.28, 5.6, 0.36 + floorIndex * 0.13 + index * 0.008, 0.4 + floorIndex * 0.13 + index * 0.008, 2);
  }
  box("slabs", plaster, 0, 3.4, 0.2, 8.65, 0.22, 6.7, 0.395, 0.435, 0, 0.12);

  for (const [level, y] of [1.8, 4.85].entries()) {
    const start = 0.44 + level * 0.07;
    // Real openings and reveals on the rear and west elevations, not glass
    // placed over a solid wall. The existing massing and front stay intact.
    for (const [x, width] of [[-3.65, .9], [0, 1.2], [3.65, .9]])
      box("walls", plaster, x, y, -2.8, width, 2.8, .22, start, start+.065);
    for (const yy of [y-1.05,y+1.12])
      box("walls", plaster, 0, yy, -2.8, 8.2, .6, .22, start+.01,start+.07);
    for (const z of [-2.25,0,2.25])
      box("walls", plaster, -4, y, z, .22, 2.8, z===0?.8:1.1, start+.008,start+.065);
    for (const yy of [y-1.05,y+1.12])
      box("walls", plaster, -4, yy, 0, .22,.6,5.6,start+.015,start+.075);
    box("walls", plaster, 0.6, y, -0.65, 0.16, 2.8, 4.1, start + 0.018, start + 0.07);
    box("walls", plaster, 4, y, -1.7, 0.2, 2.8, 2.3, start + 0.025, start + 0.075);
    box("walls", plaster, 2.35, y, 2.8, 3.35, 2.8, 0.2, start + 0.015, start + 0.07);
    box("walls", plaster, -1.7, y + 1.17, 2.8, 4.6, 0.46, 0.2, start + 0.03, start + 0.08, 0);
  }
  box("roof", plaster, 0, 6.44, 0.2, 8.8, 0.26, 6.8, 0.575, 0.62, 0, 0.18);
  box("roof", plaster, 0, 6.65, -2.95, 8.8, 0.3, 0.18, 0.6, 0.63, 0);
  box("roof", plaster, -4.3, 6.65, 0.2, 0.18, 0.3, 6.3, 0.61, 0.64, 2);
  // Individual panes and frames install from their own sill, never from ground zero.
  for (const [level, y] of [1.7, 4.75].entries()) {
    for (let pane = 0; pane < 3; pane++) {
      const start = 0.62 + level * 0.035 + pane * 0.009;
      box("glazing", glass, -3.12 + pane * 1.44, y, 2.84, 1.39, 2.29, 0.025, start + 0.018, start + 0.052);
      box("frames", metal, -3.85 + pane * 1.45, y, 2.87, 0.045, 2.35, 0.065, start, start + 0.028);
    }
    box("frames", metal, 0.5, y, 2.87, 0.045, 2.35, 0.065, 0.65 + level * 0.035, 0.68 + level * 0.035);
    for (const yy of [y - 1.17, y + 1.17]) box("frames", metal, -1.67, yy, 2.87, 4.4, 0.045, 0.065, 0.62 + level * 0.04, 0.65 + level * 0.04, 0);
    for (let pane = 0; pane < 2; pane++) {
      box("glazing", glass, 4.02, y, 0.2 + pane * 1.6, 0.025, 2.3, 1.55, 0.66 + pane * 0.01 + level * 0.035, 0.7 + pane * 0.01 + level * 0.035);
    }
    for (const z of [-0.6, 1, 2.6]) box("frames", metal, 4.05, y, z, 0.06, 2.35, 0.045, 0.655 + level * 0.04, 0.69 + level * 0.04);
    for (const yy of [y - 1.17, y + 1.17]) box("frames", metal, 4.05, yy, 1, 0.06, 0.045, 3.2, 0.655 + level * 0.04, 0.69 + level * 0.04, 2);
    box("flooring", floor, 0, y - 1.25, 0, 7.9, 0.035, 5.5, 0.73 + level * 0.025, 0.78 + level * 0.025, 2);
  }
  box("facade", timber, 1.5, 1.65, 2.94, 1.2, 2.55, 0.16, 0.67, 0.715);
  box("facade", metal, 1.93, 1.65, 3.04, 0.035, 0.45, 0.045, 0.71, 0.735);
  for (let row = 0; row < 7; row++) box("stone", limestone, 3.2, 0.57 + row * 0.4, 2.96, 1.25, 0.38, 0.18, 0.68 + row * 0.006, 0.715 + row * 0.006, 0);
  for (let slat = 0; slat < 21; slat++) box("screens", timber, 0.8 + slat * 0.155, 4.9, 2.98, 0.055, 2.7, 0.18, 0.685 + slat * 0.003, 0.72 + slat * 0.003);
  box("balcony", plaster, -1.7, 3.45, 3.25, 4.9, 0.18, 1, 0.62, 0.66, 0);
  for (let rail = 0; rail < 25; rail++) box("railings", metal, -4 + rail * 0.2, 3.98, 3.65, 0.025, 0.96, 0.025, 0.69 + rail * 0.002, 0.72 + rail * 0.002);
  box("railings", metal, -1.6, 4.48, 3.65, 4.85, 0.045, 0.05, 0.75, 0.775, 0);
  for (let i = 0; i < 3; i++) box("steps", limestone, 1.5, 0.01 + i * 0.08, 4.05 - i * 0.28, 2.6, 0.14, 0.65, 0.73 + i * 0.009, 0.765 + i * 0.009, 0);
  for (let row = 0; row < 6; row++) for (let col = 0; col < 3; col++) box("paths", floor, 0.68 + col * 0.8, -0.06, 4.6 + row * 0.18, 0.77, 0.045, 0.16, 0.755 + row * 0.007 + col * 0.002, 0.79 + row * 0.007 + col * 0.002, 0);
  box("planter", limestone, -2.6, 0.1, 4.3, 4.9, 0.28, 0.7, 0.76, 0.8, 0);

  for (const [level, y] of [0.6, 3.7].entries()) {
    const start = 0.79 + level * 0.025;
    box("interiors", upholstery, -2.7, y, 0, 1.4, 0.35, 2.5, start, start + 0.05, 1, 0.15);
    box("interiors", upholstery, -3.25, y + 0.25, 0, 0.25, 0.7, 2.5, start + 0.01, start + 0.06);
    for (const z of [-1.1, 1.1]) box("interiors", upholstery, -2.7, y + 0.15, z, 1.4, 0.4, 0.22, start + 0.02, start + 0.065);
    box("interiors", timber, -0.9, y - 0.04, 0.5, 0.75, 0.13, 1.2, start + 0.04, start + 0.075, 0);
    for (const z of [0.05, 0.95]) box("interiors", metal, -0.9, y - 0.16, z, 0.6, 0.2, 0.035, start + 0.04, start + 0.075);
    box("curation", floor, -1.7, y - 0.19, 0.4, 3.4, 0.02, 2.8, 0.86 + level * 0.02, 0.9 + level * 0.02, 0);
    for (const z of [-0.65, 0.65]) box("curation", timber, -2.6, y + 0.23, z, 0.7, 0.15, 0.5, 0.88, 0.92, 1, 0.15);
    box("lighting", luminous, -1.7, y + 2.24, 2.3, 4.1, 0.025, 0.045, 0.875, 0.91, 0);
    box("ceiling", timber, -1.7, y + 2.48, 0.1, 4.25, 0.045, 5.1, 0.78 + level * 0.025, 0.825 + level * 0.025, 2);
  }

  for (const [level, y] of [1.8,4.85].entries()) {
    const start=.64+level*.04;
    for (const x of [-1.9,1.9]) {
      box("glazing",glass,x,y,-2.82,2.55,1.6,.045,start,start+.06);
      for(const xx of [x-1.28,x,x+1.28]) box("frames",metal,xx,y,-2.85,.055,1.7,.1,start,start+.045);
      for(const yy of [y-.83,y+.83]) {
        box("frames",metal,x,yy,-2.85,2.6,.06,.1,start,start+.045,0);
        box("reveals",limestone,x,yy,-2.84,2.7,.06,.3,start+.03,start+.07,0);
      }
    }
    for(const z of [-1.05,1.05]) {
      box("glazing",glass,-4.02,y,z,.045,1.6,1.24,start,start+.06);
      for(const zz of [z-.64,z+.64]) box("frames",metal,-4.05,y,zz,.1,1.7,.06,start,start+.045);
      for(const yy of [y-.83,y+.83]) box("frames",metal,-4.05,yy,z,.1,.06,1.35,start,start+.045,2);
    }
    // Both balcony returns and recessed curtain stacks remain readable from the side.
    if(level===1) for(const x of [-4,.8]) {
      for(let i=0;i<5;i++) box("railings",metal,x,3.98,2.9+i*.18,.035,.96,.035,.71,.77);
      box("railings",metal,x,4.48,3.3,.05,.05,.8,.74,.78,2);
    }
    for(const x of [-3.65,.25]) for(let fold=0;fold<7;fold++)
      box("curtains",curtain,x+fold*.055,y,2.64-(fold%2)*.07,.06,2.25,.055,.8+level*.025,.86+level*.025);
    if (level === 0) {
    // Kitchen and dining sit behind the living room, visible through the east glazing.
    for(let cabinet=0;cabinet<4;cabinet++) {
      box("interiors",timber,1.2+cabinet*.65,y-.92,-2.35,.63,.78,.65,.79,.86);
      box("interiors",metal,1.2+cabinet*.65,y-.6,-1.998,.27,.018,.025,.82,.88,0);
    }
    box("interiors",ceramic,2.2,y-.5,-2.35,2.7,.07,.72,.82,.88,0);
    box("interiors",limestone,2.2,y-.05,-2.66,2.7,.75,.055,.82,.89,0);
    for(let cabinet=0;cabinet<3;cabinet++)
      box("interiors",timber,1.3+cabinet*.82,y+.58,-2.52,.8,.55,.35,.83,.9);
    box("interiors",metal,2.6,y-.455,-2.32,.55,.025,.43,.84,.9,0);
    // A dining table and four chairs create a second layer behind the living room.
    box("interiors",timber,2.25,y-.7,.45,1.45,.1,1.5,.8,.87,0);
    for(const x of [1.7,2.8]) for(const z of [-.12,1.02])
      box("interiors",metal,x,y-1.1,z,.06,.75,.06,.8,.87);
    for(const [x,z] of [[1.1,.45],[3.4,.45],[2.25,-.65],[2.25,1.55]]) {
      box("interiors",upholstery,x,y-.99,z,.55,.12,.55,.82,.89);
      box("interiors",timber,x,y-.69,z-.22,.55,.6,.06,.83,.9);
      for(const dx of [-.21,.21]) for(const dz of [-.21,.21])
        box("interiors",metal,x+dx,y-1.2,z+dz,.035,.4,.035,.83,.9);
    }
    box("curation",ceramic,2.25,y-.59,.45,.32,.1,.32,.88,.94);
    } else {
      // Upstairs: a quiet bedroom with joinery, linen and a pair of side tables.
      box("interiors",timber,2.3,3.84,.6,1.85,.35,2.25,.8,.87,0);
      box("interiors",upholstery,2.3,4.1,.6,1.78,.22,2.18,.82,.89);
      box("interiors",upholstery,2.3,4.15,-.57,1.9,.85,.14,.82,.89);
      for(const x of [1.85,2.75]) box("curation",upholstery,x,4.27,-.05,.65,.13,.48,.88,.94);
      for(const x of [.95,3.65]) box("interiors",timber,x,3.91,-.2,.45,.5,.55,.83,.9);
      for(let panel=0;panel<3;panel++)
        box("interiors",timber,1.3+panel*.84,4.66,-2.35,.82,2.1,.55,.82,.89);
    }
    // Ceiling slots extend to the rear; no emissive window planes.
    box("lighting",luminous,2.1,y+1.28,-.7,2.8,.035,.04,.88,.94,0);
    box("ceiling",plaster,2.2,y+1.38,0,3.5,.06,5.3,.79,.86,2);
  }

  // Batch repeated members by material and construction group: each instance
  // still has its own origin and timing, while sharing geometry and draw calls.
  const batches = new Map<string, { mesh: THREE.InstancedMesh; parts: Part[] }>();
  const grouped = new Map<string, Part[]>();
  for (const part of parts) {
    const key = `${part.group}/${part.material.uuid}`;
    const members = grouped.get(key) ?? [];
    members.push(part); grouped.set(key, members);
  }
  for (const [key, members] of grouped) {
    const mesh = new THREE.InstancedMesh(members[0].material === upholstery ? furnitureGeometry : geometry, members[0].material, members.length);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.name = members[0].group;
    mesh.castShadow = members[0].material !== glass && members[0].group !== "site";
    mesh.receiveShadow = members[0].material !== glass;
    mesh.frustumCulled = false;
    root.add(mesh);
    batches.set(key, { mesh, parts: members });
  }

  // Fine drafting lines draw continuously, then withdraw as the structure forms.
  const drawingMaterial = new THREE.LineBasicMaterial({ color: "#535e58", transparent: true, opacity: 0.35, depthWrite: false });
  materials.push(drawingMaterial);
  const drawing: { line: THREE.Line; start: number; count: number; vertical: boolean }[] = [];
  function draft(points: number[][], start: number, vertical = false) {
    const dense: THREE.Vector3[] = [];
    for (let i = 0; i < points.length - 1; i++) for (let s = 0; s <= 24; s++) dense.push(new THREE.Vector3().lerpVectors(new THREE.Vector3(...points[i] as [number, number, number]), new THREE.Vector3(...points[i + 1] as [number, number, number]), s / 24));
    const geo = new THREE.BufferGeometry().setFromPoints(dense);
    resources.push(geo);
    const line = new THREE.Line(geo, drawingMaterial);
    root.add(line);
    drawing.push({ line, start, count: dense.length, vertical });
  }
  draft([[-5.8, -0.085, -4.5], [5.8, -0.085, -4.5], [5.8, -0.085, 4.5], [-5.8, -0.085, 4.5], [-5.8, -0.085, -4.5]], -0.06);
  draft([[-4, 0.01, -2.8], [4, 0.01, -2.8], [4, 0.01, 2.8], [-4, 0.01, 2.8], [-4, 0.01, -2.8]], 0.01);
  for (const x of [-4, 0, 4]) draft([[x, 0, -4], [x, 0, 4]], 0.04 + (x + 4) * 0.005);
  for (const z of [-2.8, 0, 2.8]) draft([[-5, 0, z], [5, 0, z]], 0.07);
  for (const y of [3.4, 6.4]) draft([[-4, y, -2.8], [4, y, -2.8], [4, y, 2.8], [-4, y, 2.8], [-4, y, -2.8]], 0.14, true);
  for (const x of [-4, 4]) for (const z of [-2.8, 2.8]) draft([[x, 0, z], [x, 6.4, z]], 0.12, true);

  const interiorLights: THREE.PointLight[] = [];
  for (const y of [2.6, 5.6]) {
    const light = new THREE.PointLight(0xffbc7d, 0, 6.5, 2);
    light.position.set(-1.5, y, 1.2); root.add(light); interiorLights.push(light);
    const rear = new THREE.PointLight(0xffd59b,0,6,2);
    rear.position.set(2.2,y,-.8); root.add(rear); interiorLights.push(rear);
  }
  const raw = new THREE.Color("#aaa99f");
  const finishedPlaster = new THREE.Color("#e1ded1");
  const finishedTimber = new THREE.Color("#725035");
  const finishedStone = new THREE.Color("#a49e8d");
  const object = new THREE.Object3D();
  function update(progress: number, completion: Completion | null, finish: number) {
    const p = completion ? 1 : progress;
    for (const { mesh, parts: members } of batches.values()) {
      for (const [index, part] of members.entries()) {
        const state = assemblyTransform(part, p);
        let visibility = 1;
        if (["screens", "stone", "flooring", "facade", "ceiling"].includes(part.group)) visibility = completion ? phase(finish, 0, 0.5) : 1;
        if (part.group === "interiors") visibility = completion ? phase(finish, 0.2, 0.5) : 1;
        if (part.group === "curation") visibility = completion ? phase(finish, 0.55, 1) : 1;
        object.position.set(...state.position);
        object.scale.set(...state.size).multiplyScalar(state.visible ? visibility : 0);
        object.updateMatrix(); mesh.setMatrixAt(index, object.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
    const finishAmount = completion ? phase(finish, 0, 0.5) : phase(p, 0.72, 0.85);
    plaster.color.copy(raw).lerp(finishedPlaster, finishAmount);
    timber.color.copy(raw).lerp(finishedTimber, completion ? finishAmount : phase(p, 0.76, 0.87));
    limestone.color.copy(raw).lerp(finishedStone, finishAmount);
    glass.opacity = 0.10 + 0.14 * finishAmount;
    landscape.update(p);
    for (const { line, count, start, vertical } of drawing) {
      line.geometry.setDrawRange(0, Math.floor(count * phase(p, start, start + 0.14)));
      line.scale.y = vertical ? Math.max(0.001, phase(p, 0.12, 0.25)) : 1;
      line.visible = p < 0.59;
    }
    drawingMaterial.opacity = 0.38 * (1 - phase(p, 0.32, 0.59));
    const warmth = completion ? phase(finish, 0.55, 1) : phase(p, 0.86, 0.965);
    luminous.emissiveIntensity = warmth * 1.4;
    interiorLights.forEach(light => { light.intensity = warmth * 26; });
    return warmth;
  }
  return {
    update,
    animate: landscape.animate,
    dispose() {
      resources.forEach(resource => resource.dispose());
      materials.forEach(material => material.dispose());
      landscape.dispose(); surfaces.dispose();
      root.traverse(object => { if (object instanceof THREE.InstancedMesh) object.dispose(); });
      scene.remove(root);
    },
  };
}
