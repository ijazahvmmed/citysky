import * as THREE from "three";
import { phase } from "./assembly";
import type { createSceneSurfaces } from "./scene-surfaces";
type Surfaces = ReturnType<typeof createSceneSurfaces>;
/** Composed planting beds, not a random scatter. All leaves/grass share instanced geometry. */
export function createLandscape(root: THREE.Group, surfaces: Surfaces, mobile: boolean) {
    const resources: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const meshes: THREE.InstancedMesh[] = [];
    const wind = { value: 0 };
    let seed = 302;
    const random = () => { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; };
    function material(color: string, map?: THREE.Texture) {
        const m = new THREE.MeshStandardMaterial({ color, roughness: 0.93, map: map ?? null, side: THREE.DoubleSide });
        materials.push(m);
        return m;
    }
    const lawn = material("#68754d", surfaces.grass);
    const soil = material("#50483a", surfaces.paving);
    const stone = material("#b7b1a1", surfaces.paving);
    const bark = material("#625447", surfaces.wood);
    const foliage = material("#4f683e");
    const grasses = material("#8b9560");
    for (const m of [foliage, grasses]) {
        m.onBeforeCompile = shader => {
            shader.uniforms.windTime = wind;
            shader.vertexShader = "uniform float windTime;\n" + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
        #ifdef USE_INSTANCING
          float seed = instanceMatrix[3].x * 1.8 + instanceMatrix[3].z;
          float strength = clamp(instanceMatrix[3].y * 0.006, 0.003, 0.025);
          transformed.x += sin(windTime * 0.7 + seed) * strength * (position.y + 0.5);
          transformed.z += cos(windTime * 0.53 + seed) * strength * 0.5;
        #endif`);
        };
        m.customProgramCacheKey = () => "citysky-garden-wind-v1";
    }
    const groundGeo = new THREE.CircleGeometry(17, 80);
    resources.push(groundGeo);
    // Ground merges into the page at the perimeter, without an exposed pedestal edge.
    const groundCanvas = document.createElement("canvas");
    groundCanvas.width = groundCanvas.height = 128;
    const ctx = groundCanvas.getContext("2d")!;
    const fade = ctx.createRadialGradient(64, 64, 22, 64, 64, 63);
    fade.addColorStop(0, "#ffffff");
    fade.addColorStop(0.45, "#ffffff");
    fade.addColorStop(1, "#000000");
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, 128, 128);
    const alpha = new THREE.CanvasTexture(groundCanvas);
    lawn.alphaMap = alpha;
    lawn.transparent = true;
    lawn.depthWrite = false;
    const ground = new THREE.Mesh(groundGeo, lawn);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.24;
    lawn.bumpMap = surfaces.grass;
    lawn.bumpScale = .0015;
    ground.receiveShadow = true;
    ground.renderOrder = -2;
    root.add(ground);
    const cube = new THREE.BoxGeometry(1, 1, 1);
    resources.push(cube);
    const leaf = new THREE.BufferGeometry();
    const vertices: number[] = [], uv: number[] = [];
    // Curved elliptical leaves, with a shallow central fold and tapered tips.
    for (let segment = 0; segment < 7; segment++) {
        const t = segment / 7, n = (segment + 1) / 7;
        const w = Math.pow(Math.sin(t * Math.PI), .8) * .25, v = Math.pow(Math.sin(n * Math.PI), .8) * .25;
        const a = [-w, t, Math.sin(t * Math.PI) * .05], b = [w, t, Math.sin(t * Math.PI) * .05];
        const c = [-v, n, Math.sin(n * Math.PI) * .05], d = [v, n, Math.sin(n * Math.PI) * .05];
        vertices.push(...a, ...b, ...c, ...b, ...d, ...c);
        uv.push(0, t, 1, t, 0, n, 1, t, 1, n, 0, n);
    }
    leaf.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    leaf.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    leaf.computeVertexNormals();
    resources.push(leaf);
    const blade = new THREE.BufferGeometry();
    blade.setAttribute("position", new THREE.Float32BufferAttribute([-.035, 0, 0, .035, 0, 0, .02, .5, .07, -.035, 0, 0, .02, .5, .07, -.02, .5, .07, -.02, .5, .07, .02, .5, .07, .05, 1, .2], 3));
    blade.computeVertexNormals();
    resources.push(blade);
    const branchGeo = new THREE.CylinderGeometry(0.5, 0.7, 1, 7);
    resources.push(branchGeo);
    type Instance = {
        position: THREE.Vector3;
        rotation: THREE.Quaternion;
        scale: THREE.Vector3;
        start: number;
        color: THREE.Color;
    };
    const leaves: Instance[] = [], branches: Instance[] = [], grass: Instance[] = [], paving: Instance[] = [], beds: Instance[] = [];
    const contacts: THREE.Mesh[] = [];
    const contactGeo = new THREE.PlaneGeometry(1, 1);
    resources.push(contactGeo);
    const contactMaterial = new THREE.MeshBasicMaterial({ color: "#272e20", alphaMap: surfaces.contact, transparent: true, opacity: 0.24, depthWrite: false });
    materials.push(contactMaterial);
    function contact(x: number, z: number, sx: number, sz: number) {
        const m = new THREE.Mesh(contactGeo, contactMaterial);
        m.rotation.x = -Math.PI / 2;
        m.position.set(x, -0.208, z);
        m.scale.set(sx, sz, 1);
        root.add(m);
        contacts.push(m);
    }
    const up = new THREE.Vector3(0, 1, 0);
    function item(list: Instance[], position: number[], scale: number[], start: number, angle = 0) {
        const color = new THREE.Color().setHSL(0.22 + random() * 0.025, 0.16 + random() * 0.13, 0.63 + random() * 0.27);
        list.push({ position: new THREE.Vector3(...position as [
                number,
                number,
                number
            ]), scale: new THREE.Vector3(...scale as [
                number,
                number,
                number
            ]), rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, angle, 0)), start, color });
    }
    function branch(a: THREE.Vector3, b: THREE.Vector3, width: number, start: number) {
        branches.push({ position: a.clone().add(b).multiplyScalar(0.5), scale: new THREE.Vector3(width, b.distanceTo(a), width), rotation: new THREE.Quaternion().setFromUnitVectors(up, b.clone().sub(a).normalize()), start, color: new THREE.Color("#d9cfbc") });
    }
    function tree(x: number, z: number, size: number, start: number) {
        const base = new THREE.Vector3(x, -0.2, z), fork = new THREE.Vector3(x + .1 * size, 2.1 * size, z);
        branch(base, fork, .19 * size, start);
        for (let arm = 0; arm < 7; arm++) {
            const angle = arm * 2.399;
            const radius = (.65 + random() * .8) * size;
            const end = new THREE.Vector3(x + Math.cos(angle) * radius, (3.1 + random() * 1.8) * size, z + Math.sin(angle) * radius);
            const joint = fork.clone();
            joint.y -= random() * .8 * size;
            branch(joint, end, .06 * size, start + .01);
            for (let twig = 0; twig < 3; twig++) {
                const tip = end.clone().add(new THREE.Vector3((random() - .5) * 1.4, .3 + random() * .5, (random() - .5) * 1.4).multiplyScalar(size));
                branch(end, tip, .022 * size, start + .02);
                for (let j = 0; j < (mobile ? 48 : 80); j++) {
                    const a = random() * Math.PI * 2, r = Math.sqrt(random()) * .85 * size;
                    item(leaves, [tip.x + Math.cos(a) * r, tip.y + (random() - .5) * 1.2 * size, tip.z + Math.sin(a) * r], [.46 * size, .43 * size, .4 * size], start + .025, random() * 6.28);
                    leaves[leaves.length - 1].rotation.setFromEuler(new THREE.Euler(random() * 2.3 - .7, a, random() * 1.2 - .6));
                }
            }
        }
        contact(x, z, 3 * size, 3 * size);
    }
    // The taller canopy anchors the rear-left; two smaller trees frame other views.
    tree(-6.5, .5, 1.08, .82);
    tree(5.9, -4.4, .94, .84);
    tree(-5.8, -6.8, .78, .86);
    function shrub(x: number, z: number, size: number, start: number) {
        item(beds, [x, -.225, z], [size * 1.3, .025, size * 1.1], .765);
        for (let j = 0; j < (mobile ? 90 : 140); j++) {
            const a = random() * 6.28, r = Math.sqrt(random()) * size * .55;
            item(leaves, [x + Math.cos(a) * r, .12 + (1 - r / (size * .85)) * size * .65 + (random() - .5) * .2, z + Math.sin(a) * r], [size * .6, size * .5, size * .45], start, a);
            leaves[leaves.length - 1].rotation.setFromEuler(new THREE.Euler(random() * 2 - .5, a, random() - .5));
        }
        contact(x, z, size * 1.5, size * 1.3);
    }
    function tuft(x: number, z: number, size: number, start: number) {
        for (let j = 0; j < (mobile ? 13 : 24); j++) {
            item(grass, [x + (random() - .5) * .22, .0, z + (random() - .5) * .22], [size, size * (.65 + random() * .45), size], start, random() * 6.28);
        }
    }
    for (let i = 0; i < 11; i++) {
        const x = -5.8 + i * .52;
        shrub(x, 4.9 + Math.sin(i * .5) * .25, .65 + random() * .25, .79 + i * .006);
        tuft(x, 5.65, .45 + random() * .25, .85);
    }
    for (let i = 0; i < 12; i++) {
        const z = -5.3 + i * .85;
        shrub(6.1 + Math.sin(i) * .3, z, .9 + random() * .3, .81 + i * .005);
        tuft(5.35, z, .65, .86);
    }
    for (let i = 0; i < 10; i++) {
        const z = -4.4 + i * .85;
        shrub(-6.3, z, .8 + random() * .4, .82);
        tuft(-5.3, z, .6, .88);
    }
    for (let i = 0; i < 10; i++) {
        const x = -4.8 + i * .95;
        shrub(x, -5.8, .8 + random() * .4, .84);
    }
    // Entrance and restrained side stepping stones provide a clear route around the home.
    for (let row = 0; row < 5; row++)
        for (let col = 0; col < 3; col++)
            item(paving, [.3 + col * .81, -.14, 4.5 + row * .68], [.78, .12, .65], .75 + row * .009);
    for (let i = 0; i < 9; i++)
        item(paving, [4.85, -.14, 3.4 - i * .92], [.82, .12, .62], .77 + i * .005);
    for (let i = 0; i < 9; i++)
        item(paving, [-4 + i * 1.05, -.14, -4.1], [.78, .12, .8], .79 + i * .004);
    // Small planting islands soften the arrival, kept out of the main sightline.
    for (let i = 0; i < 9; i++)
        tuft(3.4 + random() * 1.5, 5 + random() * 1.8, .45 + random() * .5, .88);
    contact(0, 0, 10, 8);
    const sets = [
        { geometry: leaf, material: foliage, data: leaves }, { geometry: branchGeo, material: bark, data: branches },
        { geometry: blade, material: grasses, data: grass }, { geometry: cube, material: stone, data: paving }, { geometry: cube, material: soil, data: beds },
    ].map(set => {
        const mesh = new THREE.InstancedMesh(set.geometry, set.material, set.data.length);
        mesh.castShadow = set.data !== grass;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;
        set.data.forEach((part, i) => mesh.setColorAt(i, part.color));
        root.add(mesh);
        meshes.push(mesh);
        return { ...set, mesh };
    });
    const object = new THREE.Object3D();
    const bare = new THREE.Color("#b3ae9b"), green = new THREE.Color("#788565");
    function update(p: number) {
        const planted = phase(p, .74, .94);
        lawn.color.copy(bare).lerp(green, planted);
        contactMaterial.opacity = .18 + .12 * planted;
        for (const { data, mesh } of sets) {
            data.forEach((part, i) => {
                const amount = phase(p, part.start, part.start + .075);
                object.position.copy(part.position);
                object.position.y = -.2 + (part.position.y + .2) * amount;
                object.quaternion.copy(part.rotation);
                object.scale.copy(part.scale).multiplyScalar(amount);
                object.updateMatrix();
                mesh.setMatrixAt(i, object.matrix);
            });
            mesh.instanceMatrix.needsUpdate = true;
        }
        contacts.forEach(m => { m.visible = p > .23; });
    }
    return { update, animate: (time: number) => { wind.value = time; }, dispose() { resources.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); meshes.forEach(m => { m.dispose(); m.removeFromParent(); }); alpha.dispose(); } };
}
