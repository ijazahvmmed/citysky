import * as THREE from "three";
/** Small deterministic textures: no downloads, environment assets or image decode stalls. */
export function createSceneSurfaces(anisotropy: number) {
    const textures: THREE.Texture[] = [];
    let seed = 71;
    const random = () => { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; };
    function texture(kind: "plaster" | "wood" | "grass" | "paving") {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 256;
        const ctx = canvas.getContext("2d")!;
        const pixels = ctx.createImageData(256, 256);
        for (let y = 0; y < 256; y++)
            for (let x = 0; x < 256; x++) {
                const i = (y * 256 + x) * 4;
                const noise = random() - 0.5;
                const grain = Math.sin(x * 0.64 + Math.sin(y * 0.024) * 1.3) * 5 + Math.sin(x * 0.11) * 3;
                const patches = Math.sin(x * .045 + Math.sin(y * .027) * 2) * Math.cos(y * .036) * 6;
                const value = kind === "wood" ? 224 + grain + noise * 7 : kind === "grass" ? 193 + patches + noise * 22 : 237 + noise * (kind === "paving" ? 15 : 7);
                pixels.data[i] = value;
                pixels.data[i + 1] = value;
                pixels.data[i + 2] = value;
                pixels.data[i + 3] = 255;
            }
        ctx.putImageData(pixels, 0, 0);
        const map = new THREE.CanvasTexture(canvas);
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.colorSpace = THREE.SRGBColorSpace;
        map.anisotropy = anisotropy;
        textures.push(map);
        return map;
    }
    const plaster = texture("plaster"), wood = texture("wood"), grass = texture("grass"), paving = texture("paving");
    grass.repeat.set(10, 10);
    wood.repeat.set(3, 1);
    paving.repeat.set(2, 2);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    const radial = ctx.createRadialGradient(64, 64, 8, 64, 64, 63);
    radial.addColorStop(0, "#ffffff");
    radial.addColorStop(0.5, "#c0c0c0");
    radial.addColorStop(1, "#000000");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 128, 128);
    const contact = new THREE.CanvasTexture(canvas);
    textures.push(contact);
    return { plaster, wood, grass, paving, contact, dispose: () => textures.forEach(t => t.dispose()) };
}
/** A compact, filtered sky for rough surface response and gentle glass reflections. */
export function createDaylightEnvironment(renderer: THREE.WebGLRenderer) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    const sky = ctx.createLinearGradient(0, 0, 0, 256);
    sky.addColorStop(0, "#9baebc");
    sky.addColorStop(0.45, "#e5e8e3");
    sky.addColorStop(0.53, "#bcc2ad");
    sky.addColorStop(0.68, "#65735c");
    sky.addColorStop(1, "#6f715f");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 512, 256);
    const glow = ctx.createRadialGradient(110, 79, 4, 110, 79, 72);
    glow.addColorStop(0, "rgba(255,248,225,1)");
    glow.addColorStop(1, "rgba(255,248,225,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 512, 256);
    const source = new THREE.CanvasTexture(canvas);
    source.mapping = THREE.EquirectangularReflectionMapping;
    source.colorSpace = THREE.SRGBColorSpace;
    const generator = new THREE.PMREMGenerator(renderer);
    const environment = generator.fromEquirectangular(source);
    source.dispose();
    generator.dispose();
    return environment;
}
