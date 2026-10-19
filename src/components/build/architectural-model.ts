import * as THREE from "three";
import { assemblyTransform, phase, type AssemblyPart } from "./assembly";
import type { Completion } from "./scene-contract";

/** One parametric home, with independently assembled members. Replaceable by
 * a grouped production GLB without changing the viewport or scroll controller. */
export function createArchitecturalModel(scene: THREE.Scene) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const resources: THREE.BufferGeometry[] = [geometry];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];
  const root = new THREE.Group();
  root.name = "Citysky architectural assembly";
  scene.add(root);
  let seed = 17;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  function surface(wood = false) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const context = canvas.getContext("2d")!;
    const pixels = context.createImageData(128, 128);
    for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
      const i = (y * 128 + x) * 4;
      const grain = wood ? Math.sin(x * 0.7 + Math.sin(y * 0.06) * 0.7) * 12 : 0;
      const value = 238 + random() * 12 + grain;
      pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value;
      pixels.data[i + 3] = 255;
    }
    context.putImageData(pixels, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.push(texture);
    return texture;
  }
  const grain = surface();
  const timberGrain = surface(true);
  function mat(color: string, roughness = 0.85, texture?: THREE.Texture) {
    const material = new THREE.MeshStandardMaterial({ color, roughness, map: texture ?? null, bumpMap: texture ?? null, bumpScale: texture ? 0.006 : 0 });
    materials.push(material);
    return material;
  }
  const concrete = mat("#aaa99f", 0.95, grain);
  const plaster = mat("#e9e4d8", 0.9, grain);
  const limestone = mat("#b5b0a0", 0.85, grain);
  const timber = mat("#976f48", 0.7, timberGrain);
  const metal = mat("#303a36", 0.42);
  const floor = mat("#d1c8b6", 0.72, grain);
  const upholstery = mat("#ddd0b8", 0.95, grain);
  const foliage = mat("#617053", 0.92);
  const leavesLight = mat("#879171", 0.93);
  const trunk = mat("#736858");
  const earth = mat("#efeee6", 1, grain);
  const glass = new THREE.MeshPhysicalMaterial({ color: "#b8ccc6", roughness: 0.12, metalness: 0.15, transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide });
  materials.push(glass);
  const luminous = mat("#ffe3a8", 0.5);
  luminous.emissive.set("#ffc57a");

  type Part = AssemblyPart & { group: string; material: THREE.Material };
  const parts: Part[] = [];
  function box(group: string, material: THREE.Material, x: number, y: number, z: number, w: number, h: number, d: number, start: number, end: number, axis: 0 | 1 | 2 = 1, settle = 0) {
    parts.push({ group, material, position: [x, y, z], size: [w, h, d], start, end, axis, settle });
  }
  box("site", earth, 0, -0.16, 0, 13.3, 0.12, 11.3, -1, -0.5);

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
    box("walls", plaster, 0, y, -2.8, 8.2, 2.8, 0.2, start, start + 0.06);
    box("walls", plaster, -4, y, 0, 0.2, 2.8, 5.6, start + 0.008, start + 0.065);
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
    box("flooring", floor, -1.7, y - 1.25, 0, 4.4, 0.035, 5.5, 0.73 + level * 0.025, 0.78 + level * 0.025, 2);
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
    const mesh = new THREE.InstancedMesh(geometry, members[0].material, members.length);
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

  // Clustered foliage and visible branching give trees spatial detail without
  // individual leaf draw calls or external textures.
  const leafGeo = new THREE.SphereGeometry(1, 10, 7);
  const branchGeo = new THREE.CylinderGeometry(0.035, 0.065, 1, 6);
  resources.push(leafGeo, branchGeo);
  const plants: { group: THREE.Group; start: number; scale: number }[] = [];
  const matrixObject = new THREE.Object3D();
  function plant(x: number, z: number, scale: number, tree: boolean, start: number) {
    const group = new THREE.Group(); group.position.set(x, -0.06, z); root.add(group);
    const count = tree ? 160 : 32;
    const leaves = new THREE.InstancedMesh(leafGeo, tree ? foliage : leavesLight, count);
    leaves.castShadow = true;
    for (let i = 0; i < count; i++) {
      const angle = random() * Math.PI * 2;
      const radius = Math.sqrt(random()) * (tree ? 1.05 : 0.42);
      matrixObject.position.set(Math.cos(angle) * radius, (tree ? 2.3 : 0.32) + random() * (tree ? 1.1 : 0.4), Math.sin(angle) * radius);
      matrixObject.scale.set(tree ? 0.14 : 0.095, tree ? 0.055 : 0.035, tree ? 0.24 : 0.18);
      matrixObject.rotation.set(random(), angle, random()); matrixObject.updateMatrix();
      leaves.setMatrixAt(i, matrixObject.matrix);
    }
    group.add(leaves);
    if (tree) {
      for (let i = 0; i < 5; i++) {
        const branch = new THREE.Mesh(branchGeo, trunk);
        branch.position.set(i === 0 ? 0 : Math.cos(i * 1.8) * 0.25, i === 0 ? 1.1 : 2.05, i === 0 ? 0 : Math.sin(i * 1.8) * 0.25);
        branch.scale.y = i === 0 ? 2.2 : 1.5;
        if (i > 0) branch.rotation.set(Math.cos(i * 1.8) * 0.6, 0, Math.sin(i * 1.8) * 0.6);
        branch.castShadow = true; group.add(branch);
      }
    }
    plants.push({ group, start, scale });
  }
  plant(-5.1, -2.8, 1.1, true, 0.8); plant(5.4, -2.5, 0.95, true, 0.82);
  for (let i = 0; i < 6; i++) plant(-4.5 + i * 0.75, 4.3, 0.75, false, 0.79 + i * 0.012);
  for (let i = 0; i < 5; i++) plant(5.25, -0.8 + i * 0.95, 0.95, false, 0.81 + i * 0.012);

  const interiorLights: THREE.PointLight[] = [];
  for (const y of [2.6, 5.6]) {
    const light = new THREE.PointLight(0xffcc8a, 0, 6.5, 2);
    light.position.set(-1.5, y, 1.7); root.add(light); interiorLights.push(light);
  }
  const raw = new THREE.Color("#aaa99f");
  const finishedPlaster = new THREE.Color("#e9e4d8");
  const finishedTimber = new THREE.Color("#976f48");
  const finishedStone = new THREE.Color("#b5b0a0");
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
    glass.opacity = 0.07 + 0.14 * finishAmount;
    for (const { line, count, start, vertical } of drawing) {
      line.geometry.setDrawRange(0, Math.floor(count * phase(p, start, start + 0.14)));
      line.scale.y = vertical ? Math.max(0.001, phase(p, 0.12, 0.25)) : 1;
      line.visible = p < 0.59;
    }
    drawingMaterial.opacity = 0.38 * (1 - phase(p, 0.32, 0.59));
    for (const plant of plants) {
      const amount = phase(p, plant.start, plant.start + 0.08);
      plant.group.visible = amount > 0;
      plant.group.scale.set(0.55 + amount * 0.45, amount, 0.55 + amount * 0.45).multiplyScalar(plant.scale);
    }
    const warmth = completion ? phase(finish, 0.55, 1) : phase(p, 0.86, 0.965);
    luminous.emissiveIntensity = warmth * 1.4;
    interiorLights.forEach(light => { light.intensity = warmth * 24; });
    return warmth;
  }
  return {
    update,
    dispose() {
      resources.forEach(resource => resource.dispose());
      materials.forEach(material => material.dispose());
      textures.forEach(texture => texture.dispose());
      root.traverse(object => { if (object instanceof THREE.InstancedMesh) object.dispose(); });
      scene.remove(root);
    },
  };
}
