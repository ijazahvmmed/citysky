import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { SSAOPass } from "three/addons/postprocessing/SSAOPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
/** Modest desktop contact occlusion. The beauty pass retains full resolution;
 * only the occlusion buffer is downsampled. Mobile uses the model's contact maps. */
export function createArchitecturalOcclusion(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 2 });
    const composer = new EffectComposer(renderer, target);
    const beauty = new RenderPass(scene, camera);
    const ao = new SSAOPass(scene, camera, 512, 512, 12);
    ao.kernelRadius = .42;
    ao.minDistance = .0005;
    ao.maxDistance = .025;
    const output = new OutputPass();
    composer.addPass(beauty);
    composer.addPass(ao);
    composer.addPass(output);
    // Transparent panes must not act as solid occluders over visible interiors.
    const glazing: THREE.Object3D[] = [];
    scene.traverse(o => { if (o.name === "glazing")
        glazing.push(o); });
    const renderAO = ao.render.bind(ao);
    ao.render = (...args: Parameters<typeof renderAO>) => {
        const states = glazing.map(o => o.visible);
        glazing.forEach(o => { o.visible = false; });
        try {
            renderAO(...args);
        }
        finally {
            glazing.forEach((o, i) => { o.visible = states[i]; });
        }
    };
    return {
        resize(width: number, height: number) {
            composer.setPixelRatio(renderer.getPixelRatio());
            composer.setSize(width, height);
            const factor = Math.min(1, 800 / width);
            ao.setSize(Math.round(width * factor), Math.round(height * factor));
        },
        render() {
            ao.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(camera.projectionMatrix);
            ao.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(camera.projectionMatrixInverse);
            composer.render();
        },
        dispose() { ao.ssaoMaterial.dispose(); ao.noiseTexture?.dispose(); ao.dispose(); output.dispose(); composer.dispose(); },
    };
}
