import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { phase } from "./assembly";
import type { createSceneSurfaces } from "./scene-surfaces";

type Surfaces = ReturnType<typeof createSceneSurfaces>;

/**
 * A separate arrival sequence beside the front-right elevation.
 * Roof: x 2.9–6.4, z 2.9–7.8; driveway: x 2.9–6.4, z 2.9–8.35.
 * The existing pedestrian approach at x < 2.8 remains unobstructed.
 */
export function createArrivalCourt(root: THREE.Group, surfaces: Surfaces, mobile: boolean) {
  const court = new THREE.Group();
  court.name = "Citysky arrival court";
  root.add(court);
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const carMaterials: THREE.MeshStandardMaterial[] = [];
  const register = <T extends THREE.BufferGeometry>(geometry: T) => {
    geometries.add(geometry);
    return geometry;
  };
  const cube = register(new THREE.BoxGeometry(1, 1, 1));
  const rounded = register(new RoundedBoxGeometry(1, 1, 1, mobile ? 1 : 2, 0.06));
  const sphere = register(new THREE.SphereGeometry(1, mobile ? 12 : 16, 8));
  const plane = register(new THREE.PlaneGeometry(1, 1));
  const material = (color: string, roughness: number, map?: THREE.Texture, metalness = 0) => {
    const result = new THREE.MeshStandardMaterial({
      color, roughness, metalness, map: map ?? null,
      bumpMap: map ?? null, bumpScale: map ? 0.003 : 0,
    });
    materials.add(result);
    return result;
  };
  const plaster = material("#d5d3c8", 0.78, surfaces.plaster);
  const charcoal = material("#333e3d", 0.42, undefined, 0.3);
  const timber = material("#775536", 0.7, surfaces.wood);
  const stone = material("#b4ac9a", 0.88, surfaces.paving);
  const joints = material("#6b695d", 0.95);
  const luminous = material("#ffdda1", 0.45);
  luminous.emissive.set("#ffbc67");
  const bodyPaint = material("#b5c0ba", 0.27, undefined, 0.65);
  const glazing = material("#1c2e34", 0.12, undefined, 0.28);
  glazing.envMapIntensity = 1.6;
  const rubber = material("#171c1d", 0.89);
  const brightwork = material("#a8b4b4", 0.23, undefined, 0.88);
  const carTrim = material("#2c3537", 0.5, undefined, 0.3);
  const headlamps = material("#d8e5df", 0.2, undefined, 0.2);
  headlamps.emissive.set("#d4e6d3");
  const tailLamps = material("#732c28", 0.33);
  tailLamps.emissive.set("#a63825");
  carMaterials.push(bodyPaint, glazing, rubber, brightwork, carTrim, headlamps, tailLamps);

  type Batch = Map<THREE.Material, THREE.BufferGeometry[]>;
  type Stage = {
    group: THREE.Group;
    start: number;
    end: number;
    mode: "vertical" | "horizontal" | "roof" | "details";
    y: number;
  };
  const stages: Stage[] = [];
  function stage(name: string, start: number, end: number, mode: Stage["mode"], pivotY: number) {
    const group = new THREE.Group();
    group.name = `Arrival / ${name}`;
    group.position.set(4.65, pivotY, 5.35);
    court.add(group);
    stages.push({ group, start, end, mode, y: pivotY });
    return { group, batch: new Map() as Batch };
  }
  const paving = stage("paving", 0.7, 0.77, "horizontal", -0.15);
  const posts = stage("slender supports", 0.75, 0.815, "vertical", -0.07);
  const roof = stage("covered porch", 0.79, 0.86, "roof", 2.92);
  const details = stage("soffit and fixtures", 0.845, 0.9, "details", 2.92);
  const transform = new THREE.Object3D();
  function part(
    target: { group: THREE.Group; batch: Batch },
    geometry: THREE.BufferGeometry,
    finish: THREE.Material,
    position: [number, number, number],
    scale: [number, number, number],
    rotation: [number, number, number] = [0, 0, 0],
    world = true,
  ) {
    transform.position.fromArray(position);
    if (world) transform.position.sub(target.group.position);
    transform.scale.fromArray(scale);
    transform.rotation.set(...rotation);
    transform.updateMatrix();
    // Non-indexed batching also accepts the custom window quads.
    const copy = geometry.index ? geometry.toNonIndexed() : geometry.clone();
    copy.applyMatrix4(transform.matrix);
    const list = target.batch.get(finish) ?? [];
    list.push(copy);
    target.batch.set(finish, list);
  }
  function box(
    target: { group: THREE.Group; batch: Batch }, finish: THREE.Material,
    x: number, y: number, z: number, w: number, h: number, d: number,
  ) {
    part(target, cube, finish, [x, y, z], [w, h, d]);
  }
  function flush(target: { group: THREE.Group; batch: Batch }) {
    for (const [finish, pieces] of target.batch) {
      const geometry = mergeGeometries(pieces, false);
      pieces.forEach(piece => piece.dispose());
      if (!geometry) continue;
      register(geometry);
      const mesh = new THREE.Mesh(geometry, finish);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      target.group.add(mesh);
    }
    target.batch.clear();
  }

  // Large limestone pavers, narrow joints and an open pedestrian edge.
  box(paving, joints, 4.65, -0.15, 5.625, 3.5, 0.13, 5.45);
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 4; col++) {
      box(paving, stone, 3.35 + col * 0.865, -0.076, 3.285 + row * 0.775, 0.85, 0.035, 0.76);
    }
  }
  // A recessed drain finishes the driveway mouth without blocking its approach.
  box(paving, charcoal, 4.65, -0.047, 8.24, 3.42, 0.012, 0.055);
  for (const [x, z] of [[6.24, 3.12], [6.24, 7.57], [3.06, 7.57]]) {
    box(posts, charcoal, x, 1.405, z, 0.085, 2.95, 0.085);
    box(posts, charcoal, x, -0.025, z, 0.2, 0.075, 0.2);
  }
  // Rear is fixed to the house; a thin fascia and warm soffit keep the roof light.
  box(roof, plaster, 4.65, 2.99, 5.35, 3.5, 0.16, 4.9);
  box(roof, charcoal, 6.36, 2.88, 5.35, 0.055, 0.08, 4.82);
  box(roof, charcoal, 4.65, 2.88, 7.76, 3.46, 0.08, 0.055);
  box(roof, charcoal, 4.65, 2.88, 2.94, 3.46, 0.08, 0.08);
  box(details, timber, 4.65, 2.895, 5.35, 3.32, 0.025, 4.72);
  // Fine joints retain the timber grain direction when seen from below.
  for (let slat = 0; slat < 11; slat++) {
    box(details, charcoal, 3.12 + slat * 0.306, 2.879, 5.35, 0.009, 0.004, 4.68);
  }
  const downlight = register(new THREE.CylinderGeometry(0.07, 0.07, 0.012, 12));
  for (const x of [3.6, 5.7]) {
    for (const z of [3.72, 6.92]) {
      part(details, downlight, charcoal, [x, 2.872, z], [1.35, 1, 1.35]);
      part(details, downlight, luminous, [x, 2.864, z], [0.86, 1, 0.86]);
    }
  }
  for (const target of [paving, posts, roof, details]) flush(target);

  // Soft contact light is deliberately inexpensive: no additional scene lights.
  const warmWash = new THREE.MeshBasicMaterial({
    color: "#e9b16d", alphaMap: surfaces.contact, transparent: true,
    depthWrite: false, opacity: 0, blending: THREE.AdditiveBlending,
  });
  materials.add(warmWash);
  const wash = new THREE.Mesh(plane, warmWash);
  wash.name = "Arrival / warm ground wash";
  wash.rotation.x = -Math.PI / 2;
  wash.position.set(4.65, -0.049, 5.35);
  wash.scale.set(3.1, 4.5, 1);
  court.add(wash);

  const car = new THREE.Group();
  car.name = "Arrival / parked sedan";
  car.position.set(4.68, -0.055, 5.24);
  court.add(car);
  const sedan = { group: car, batch: new Map() as Batch };
  const carPart = (
    geometry: THREE.BufferGeometry, finish: THREE.Material,
    position: [number, number, number], scale: [number, number, number],
    rotation: [number, number, number] = [0, 0, 0],
  ) => part(sedan, geometry, finish, position, scale, rotation, false);

  // A shaped, bevelled body with real wheel-arch cutouts, not stacked box volumes.
  const profile = new THREE.Shape();
  profile.moveTo(-2.12, 0.4);
  profile.quadraticCurveTo(-2.13, 0.7, -1.77, 0.8);
  profile.lineTo(-1.19, 0.85);
  profile.lineTo(1.24, 0.84);
  profile.quadraticCurveTo(1.95, 0.82, 2.12, 0.65);
  profile.lineTo(2.14, 0.43);
  profile.quadraticCurveTo(2.12, 0.3, 1.98, 0.3);
  profile.lineTo(1.7, 0.3);
  profile.absarc(1.32, 0.3, 0.38, 0, Math.PI, false);
  profile.lineTo(-0.94, 0.3);
  profile.absarc(-1.32, 0.3, 0.38, 0, Math.PI, false);
  profile.lineTo(-2.03, 0.3);
  profile.closePath();
  const shell = register(new THREE.ExtrudeGeometry(profile, {
    depth: 1.68, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025,
    bevelSegments: mobile ? 1 : 2, steps: 1, curveSegments: mobile ? 10 : 14,
  }));
  shell.rotateY(-Math.PI / 2);
  shell.translate(0.84, 0, 0);
  carPart(shell, bodyPaint, [0, 0, 0], [1, 1, 1]);

  function quad(points: number[], finish: THREE.Material) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 1], 2));
    geometry.setIndex([0, 1, 2, 0, 2, 3]);
    geometry.computeVertexNormals();
    register(geometry);
    carPart(geometry, finish, [0, 0, 0], [1, 1, 1]);
  }
  // Tapered cabin: raked windscreen and rear glass, darker uninterrupted side glass.
  glazing.side = THREE.DoubleSide;
  quad([-0.73, 0.85, 1.24, 0.73, 0.85, 1.24, 0.585, 1.43, 0.55, -0.585, 1.43, 0.55], glazing);
  quad([0.73, 0.85, -1.3, -0.73, 0.85, -1.3, -0.585, 1.43, -0.62, 0.585, 1.43, -0.62], glazing);
  for (const side of [-1, 1]) {
    quad([
      side * 0.73, 0.85, -1.3, side * 0.73, 0.85, 1.24,
      side * 0.585, 1.43, 0.55, side * 0.585, 1.43, -0.62,
    ], glazing);
  }
  carPart(rounded, bodyPaint, [0, 1.445, -0.035], [1.23, 0.065, 1.24]);
  const beamGeo = register(new THREE.CylinderGeometry(1, 1, 1, 6));
  const up = new THREE.Vector3(0, 1, 0);
  function beam(a: THREE.Vector3, b: THREE.Vector3, width: number, finish: THREE.Material) {
    const middle = a.clone().add(b).multiplyScalar(0.5);
    const rotation = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(up, b.clone().sub(a).normalize()));
    carPart(beamGeo, finish, [middle.x, middle.y, middle.z], [width, a.distanceTo(b), width], [rotation.x, rotation.y, rotation.z]);
  }
  for (const side of [-1, 1]) {
    for (const [lowerZ, roofZ] of [[1.24, 0.55], [-1.3, -0.62]]) {
      beam(new THREE.Vector3(side * 0.75, 0.84, lowerZ), new THREE.Vector3(side * 0.605, 1.44, roofZ), 0.026, bodyPaint);
    }
    beam(new THREE.Vector3(side * 0.735, 0.85, -0.14), new THREE.Vector3(side * 0.595, 1.43, -0.14), 0.022, carTrim);
    // Door shut lines, handles, narrow sills and sculpted mirrors.
    carPart(cube, carTrim, [side * 0.869, 0.59, -0.15], [0.007, 0.38, 0.012]);
    carPart(cube, carTrim, [side * 0.871, 0.365, 0], [0.012, 0.035, 1.85]);
    for (const z of [-0.78, 0.56]) {
      carPart(rounded, brightwork, [side * 0.87, 0.78, z], [0.016, 0.025, 0.15]);
    }
    carPart(sphere, bodyPaint, [side * 0.93, 0.89, 0.86], [0.115, 0.065, 0.105]);
    carPart(sphere, glazing, [side * 0.939, 0.889, 0.795], [0.095, 0.049, 0.025]);
  }
  // Thin lamps and neutral grille; intentionally no invented manufacturer badge.
  carPart(rounded, carTrim, [0, 0.43, 2.143], [1.13, 0.13, 0.018]);
  carPart(rounded, brightwork, [0, 0.49, 2.159], [1.04, 0.012, 0.015]);
  for (const x of [-0.59, 0.59]) {
    carPart(rounded, headlamps, [x, 0.69, 2.025], [0.36, 0.055, 0.11], [0, x > 0 ? -0.18 : 0.18, 0]);
    carPart(rounded, tailLamps, [x, 0.69, -2.044], [0.37, 0.065, 0.058]);
  }
  carPart(rounded, carTrim, [0, 0.38, -2.105], [1.35, 0.065, 0.032]);
  carPart(rounded, brightwork, [0, 0.53, -2.145], [0.33, 0.085, 0.012]);

  const tire = register(new THREE.CylinderGeometry(0.315, 0.315, 0.205, mobile ? 18 : 24));
  const rim = register(new THREE.CylinderGeometry(0.22, 0.22, 0.212, mobile ? 16 : 24));
  const hub = register(new THREE.CylinderGeometry(0.063, 0.063, 0.018, 12));
  const sidewall = register(new THREE.TorusGeometry(0.262, 0.05, 6, mobile ? 18 : 24));
  for (const side of [-1, 1]) {
    for (const z of [-1.32, 1.32]) {
      carPart(tire, rubber, [side * 0.81, 0.315, z], [1, 1, 1], [0, 0, Math.PI / 2]);
      carPart(sidewall, rubber, [side * 0.918, 0.315, z], [1, 1, 1], [0, Math.PI / 2, 0]);
      carPart(rim, carTrim, [side * 0.82, 0.315, z], [1, 1, 1], [0, 0, Math.PI / 2]);
      for (let spoke = 0; spoke < 5; spoke++) {
        const angle = spoke * Math.PI * 2 / 5;
        carPart(rounded, brightwork, [side * 0.932, 0.315 + Math.cos(angle) * 0.105, z + Math.sin(angle) * 0.105], [0.016, 0.19, 0.035], [angle, 0, 0]);
      }
      carPart(hub, brightwork, [side * 0.94, 0.315, z], [1, 1, 1], [0, 0, Math.PI / 2]);
    }
  }
  flush(sedan);
  const shadowMaterial = new THREE.MeshBasicMaterial({
    color: "#121d1c", alphaMap: surfaces.contact, transparent: true, depthWrite: false, opacity: 0.6,
  });
  materials.add(shadowMaterial);
  const contact = new THREE.Mesh(plane, shadowMaterial);
  contact.name = "Arrival / car contact shadow";
  contact.rotation.x = -Math.PI / 2;
  contact.position.set(0, 0.014, 0);
  contact.scale.set(2.7, 4.7, 1);
  car.add(contact);

  function update(progress: number, warmth: number) {
    for (const stage of stages) {
      const amount = phase(progress, stage.start, stage.end);
      stage.group.visible = amount > 0.001;
      stage.group.scale.set(1, 1, 1);
      if (stage.mode === "vertical") stage.group.scale.y = Math.max(0.001, amount);
      if (stage.mode === "horizontal" || stage.mode === "roof") stage.group.scale.x = Math.max(0.001, amount);
      stage.group.position.y = stage.y + (stage.mode === "roof" ? (1 - amount) * 0.2 : 0);
    }
    const lit = phase(progress, 0.87, 0.96) * THREE.MathUtils.clamp(warmth, 0, 1);
    luminous.emissiveIntensity = 0.22 + lit * 3;
    warmWash.opacity = lit * 0.2;
    wash.visible = lit > 0.001;
    const finished = phase(warmth, 0.45, 0.95);
    const arrival = phase(progress, 0.91, 0.98) * finished;
    car.visible = arrival > 0.001;
    car.position.z = 5.24 + (1 - arrival) * 2.8;
    // The car reverses under the canopy; a brief fade avoids a pop at the frame edge.
    const opacity = phase(progress, 0.91, 0.935) * finished;
    for (const material of carMaterials) {
      const transparent = opacity < 0.999;
      if (material.transparent !== transparent) {
        material.transparent = transparent;
        material.needsUpdate = true;
      }
      material.opacity = opacity;
    }
    headlamps.emissiveIntensity = 0.03 + lit * 0.15;
    tailLamps.emissiveIntensity = 0.03 + lit * 0.15;
    shadowMaterial.opacity = opacity * 0.58;
  }
  update(0, 0);
  return {
    update,
    dispose() {
      court.removeFromParent();
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
    },
  };
}
