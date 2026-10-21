import * as THREE from "three";
import { createArchitecturalModel } from "./architectural-model";
import { createDaylightEnvironment } from "./scene-surfaces";
import { createArchitecturalOcclusion } from "./architectural-occlusion";
import { phase } from "./assembly";
import type { BuildingScene, Completion } from "./scene-contract";
/** Scroll controls construction and the base camera. Inspection is an additive,
 * persistent orbit, never a competing timeline or a rotation of the building. */
export function createBuildingScene(host: HTMLElement, onFailure: () => void): BuildingScene {
    const mobileQuery = matchMedia("(max-width: 767px), (pointer: coarse)");
    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    let mobile = mobileQuery.matches, reduced = motionQuery.matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    renderer.setClearColor(0xfafaf8, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    const canvas = renderer.domElement;
    canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);
    const scene = new THREE.Scene();
    const environment = createDaylightEnvironment(renderer);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.55;
    const camera = new THREE.PerspectiveCamera(39, 1, .1, 120);
    const ambient = new THREE.HemisphereLight(0xe0e7ed, 0x797460, 0.48);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xfff3dc, 3);
    sun.position.set(-7, 11, 7);
    sun.castShadow = true;
    Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: .5, far: 40 });
    sun.shadow.normalBias = .035;
    sun.shadow.bias = -.00012;
    sun.shadow.radius = 9;
    sun.shadow.intensity = .65;
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xe3eaf1, .35);
    fill.position.set(8, 6, -6);
    scene.add(fill);
    const duskSun = new THREE.Color(0xc5d4e8);
    const duskSky = new THREE.Color(0x9fb5d3);
    const duskGround = new THREE.Color(0x46534e);
    const duskFill = new THREE.Color(0xabc7eb);
    const model = createArchitecturalModel(scene, mobile, Math.min(8, renderer.capabilities.getMaxAnisotropy()));
    let occlusion = mobile ? null : createArchitecturalOcclusion(renderer, scene, camera);
    let progress = 0, completion: Completion | null = null, finish = 0, finishTarget = 0;
    let frame = 0, timer: ReturnType<typeof setTimeout> | undefined, disposed = false, visible = false, dirty = true;
    let lastTime = 0, elapsed = 0, slowFrames = 0, dprLimit = 2;
    let targetYaw = 0, targetPitch = 0, yaw = 0, pitch = 0, zoom = 1, targetZoom = 1, inspected = false;
    let pointer: {
        id: number;
        x: number;
        y: number;
        yaw: number;
        pitch: number;
        touch: boolean;
        direction: "pending" | "horizontal" | "vertical";
    } | null = null;
    const degrees = THREE.MathUtils.degToRad;
    // Frame the architecture, not the whole garden. Separate bounds for the
    // lower porch keep the two-storey house prominent at every orbit angle.
    const framingPoints = [-4.4, 4.4].flatMap(x =>
        [-3.2, 3.75].flatMap(z => [-.2, 6.8].map(y => new THREE.Vector3(x, y, z))));
    const courtPoints = [2.9, 6.4].flatMap(x =>
        [2.9, 8.35].flatMap(z => [-.2, 3.1].map(y => new THREE.Vector3(x, y, z))));
    const allFramingPoints = [...framingPoints, ...courtPoints];
    const courtAnchor = new THREE.Vector3(4, 1.45, 2.9);
    const direction = new THREE.Vector3(), right = new THREE.Vector3(), viewUp = new THREE.Vector3(), point = new THREE.Vector3(), target = new THREE.Vector3();
    function compose() {
        const p = completion ? 1 : progress, movement = phase(p, .08, .96);
        const drift = !reduced && !inspected && p >= .97 ? Math.sin(elapsed * .17) * degrees(1.15) : 0;
        const azimuth = degrees(mobile ? 25 + movement * 8 : 26 + movement * 9) + yaw + drift;
        const elevation = THREE.MathUtils.clamp(degrees(34 - movement * 17) + pitch, degrees(10), degrees(48));
        camera.fov = mobile ? 43 : 39;
        const arrival = phase(p, .7, .94);
        target.set(.65 * arrival, THREE.MathUtils.lerp(2.25, 1.45, arrival), .3 + .75 * arrival);
        const tangent = Math.tan(degrees(camera.fov / 2));
        direction.set(Math.sin(azimuth) * Math.cos(elevation), Math.sin(elevation), Math.cos(azimuth) * Math.cos(elevation));
        right.set(Math.cos(azimuth), 0, -Math.sin(azimuth));
        viewUp.crossVectors(direction, right);
        let distance = 0, closestDistance = 0;
        for (const [index, vertex] of allFramingPoints.entries()) {
            point.copy(vertex);
            if (index >= framingPoints.length) point.lerp(courtAnchor, 1 - arrival);
            point.sub(target);
            const depth = point.dot(direction);
            const horizontal = Math.abs(point.dot(right)) / (tangent * camera.aspect);
            const vertical = Math.abs(point.dot(viewUp)) / tangent;
            distance = Math.max(distance, depth + Math.max(horizontal / .92, vertical / .86));
            closestDistance = Math.max(closestDistance, depth + Math.max(horizontal / .97, vertical / .91));
        }
        // Even at maximum zoom, keep the roof and driveway inside the frame.
        distance = Math.max(closestDistance, distance * (1.07 - movement * .07) * zoom);
        camera.position.copy(target).addScaledVector(direction, distance);
        camera.lookAt(target);
        camera.updateProjectionMatrix();
    }
    function requestRender() {
        if (frame || disposed || !visible || document.hidden)
            return;
        clearTimeout(timer);
        timer = undefined;
        frame = requestAnimationFrame(render);
    }
    function render(time: number) {
        frame = 0;
        if (disposed || !visible || document.hidden)
            return;
        const frameDuration = (time - lastTime) / 1000 || 1 / 60;
        const dt = Math.min(.05, frameDuration);
        lastTime = time;
        elapsed += dt;
        const damping = reduced ? 1 : 1 - Math.exp(-dt * 8);
        yaw += (targetYaw - yaw) * damping;
        pitch += (targetPitch - pitch) * damping;
        zoom += (targetZoom - zoom) * damping;
        const before = finish;
        finish += (finishTarget - finish) * damping;
        if (Math.abs(finishTarget - finish) < .0001)
            finish = finishTarget;
        if (dirty || Math.abs(before - finish) > .00001) {
            const warmth = model.update(progress, completion, finish);
            // The last construction beat settles into blue hour. Keep the
            // exterior legible while the rooms become the brightest surfaces.
            sun.color.set(0xfff3dc).lerp(duskSun, warmth);
            sun.intensity = THREE.MathUtils.lerp(3, .64, warmth);
            ambient.color.set(0xe0e7ed).lerp(duskSky, warmth);
            ambient.groundColor.set(0x797460).lerp(duskGround, warmth);
            ambient.intensity = THREE.MathUtils.lerp(.48, .24, warmth);
            fill.color.set(0xe3eaf1).lerp(duskFill, warmth);
            fill.intensity = THREE.MathUtils.lerp(.35, .48, warmth);
            scene.environmentIntensity = THREE.MathUtils.lerp(.55, .19, warmth);
            renderer.toneMappingExposure = THREE.MathUtils.lerp(1, .98, warmth);
            host.style.setProperty("--scene-dusk", warmth.toFixed(3));
            host.dataset.atmosphere = warmth > .5 ? "dusk" : "day";
            renderer.shadowMap.needsUpdate = true;
            dirty = false;
        }
        model.animate(reduced ? 0 : elapsed);
        compose();
        const started = performance.now();
        if (occlusion && !mobile)
            occlusion.render();
        else
            renderer.render(scene, camera);
        // Preserve crisp mobile architecture; only sustained slow rendering reduces
        // resolution, never below 1.5 on a high-DPI device. Plant density is reduced first.
        if (performance.now() - started > 28 || (pointer?.direction === "horizontal" && frameDuration > .06))
            slowFrames++;
        else
            slowFrames = Math.max(0, slowFrames - 1);
        if (slowFrames > 45 && occlusion) {
            occlusion.dispose();
            occlusion = null;
            slowFrames = 0;
        }
        else if (slowFrames > 45 && dprLimit > 1.5) {
            dprLimit -= .25;
            slowFrames = 0;
            resize();
        }
        const settling = Math.abs(targetYaw - yaw) + Math.abs(targetPitch - pitch) + Math.abs(targetZoom - zoom) + Math.abs(finishTarget - finish) > .0001;
        if (settling || pointer?.direction === "horizontal")
            requestRender();
        else if (!reduced && (completion !== null || progress > .8))
            timer = setTimeout(requestRender, 33);
    }
    function stopDrift() {
        if (!inspected) {
            if (!reduced && (completion || progress >= .97)) {
                const offset = Math.sin(elapsed * .17) * degrees(1.15);
                yaw += offset;
                targetYaw += offset;
            }
            inspected = true;
        }
    }
    function inspect() {
        stopDrift();
        host.dataset.inspected = "true";
    }
    function down(event: PointerEvent) {
        if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0))
            return;
        // Freeze drift on contact while preserving its current offset.
        stopDrift();
        pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw: targetYaw, pitch: targetPitch, touch: event.pointerType !== "mouse", direction: "pending" };
        if (!pointer.touch)
            host.setPointerCapture(event.pointerId);
    }
    function move(event: PointerEvent) {
        if (!pointer || event.pointerId !== pointer.id)
            return;
        const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
        if (pointer.direction === "pending" && Math.max(Math.abs(dx), Math.abs(dy)) > 6) {
            pointer.direction = !pointer.touch || Math.abs(dx) > Math.abs(dy) * 1.15 ? "horizontal" : "vertical";
            if (pointer.direction === "horizontal") {
                host.setPointerCapture(event.pointerId);
                host.dataset.inspected = "true";
            }
        }
        if (pointer.direction !== "horizontal")
            return;
        targetYaw = pointer.yaw - dx / Math.max(host.clientWidth, 1) * Math.PI * 2;
        targetPitch = pointer.touch ? pointer.pitch : THREE.MathUtils.clamp(pointer.pitch + dy / Math.max(host.clientHeight, 1) * .8, degrees(-22), degrees(30));
        requestRender();
    }
    function up(event: PointerEvent) {
        if (pointer?.id !== event.pointerId)
            return;
        if (host.hasPointerCapture(event.pointerId))
            host.releasePointerCapture(event.pointerId);
        pointer = null;
        requestRender();
    }
    function key(event: KeyboardEvent) {
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "+", "=", "-"].includes(event.key))
            return;
        event.preventDefault();
        inspect();
        if (event.key === "Home") {
            resetView();
        }
        if (event.key === "ArrowLeft" || event.key === "ArrowRight")
            targetYaw += degrees(event.key === "ArrowLeft" ? -15 : 15);
        if (event.key === "ArrowUp" || event.key === "ArrowDown")
            targetPitch = THREE.MathUtils.clamp(targetPitch + degrees(event.key === "ArrowUp" ? 4 : -4), degrees(-22), degrees(30));
        if (["+", "=", "-"].includes(event.key))
            zoomBy(event.key === "-" ? -1 : 1);
        requestRender();
    }
    function zoomBy(direction: 1 | -1) {
        inspect();
        targetZoom = THREE.MathUtils.clamp(targetZoom * (direction === 1 ? 1 / 1.08 : 1.08), .9, 1.22);
        requestRender();
    }
    function resetView() {
        inspect();
        targetYaw = Math.round(targetYaw / (Math.PI * 2)) * Math.PI * 2;
        targetPitch = 0;
        targetZoom = 1;
        requestRender();
    }
    function wheel(event: WheelEvent) {
        // Ordinary wheel/touch scrolling always belongs to the page.
        if (!event.ctrlKey && !event.metaKey)
            return;
        event.preventDefault();
        inspect();
        targetZoom = THREE.MathUtils.clamp(targetZoom * Math.exp(event.deltaY * .002), .9, 1.22);
        requestRender();
    }
    function resize() {
        const { width, height } = host.getBoundingClientRect();
        if (!width || !height)
            return;
        mobile = mobileQuery.matches;
        renderer.setPixelRatio(Math.min(devicePixelRatio, dprLimit));
        renderer.setSize(width, height);
        camera.aspect = width / height;
        occlusion?.resize(width, height);
        const shadowSize = mobile ? 1024 : 2048;
        if (sun.shadow.mapSize.x !== shadowSize) {
            sun.shadow.mapSize.set(shadowSize, shadowSize);
            sun.shadow.map?.dispose();
            sun.shadow.map = null;
        }
        dirty = true;
        requestRender();
    }
    function motionChange() { reduced = motionQuery.matches; if (reduced) {
        yaw = targetYaw;
        pitch = targetPitch;
        zoom = targetZoom;
        finish = finishTarget;
    } dirty = true; requestRender(); }
    function pause() { cancelAnimationFrame(frame); frame = 0; clearTimeout(timer); timer = undefined; }
    function visibilityChange() { if (document.hidden)
        pause();
    else {
        lastTime = 0;
        requestRender();
    } }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) {
        lastTime = 0;
        requestRender();
    }
    else
        pause(); });
    observer.observe(host);
    const contextLost = (event: Event) => { event.preventDefault(); visible = false; pause(); onFailure(); };
    canvas.addEventListener("webglcontextlost", contextLost);
    host.addEventListener("pointerdown", down);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerup", up);
    host.addEventListener("pointercancel", up);
    host.addEventListener("keydown", key);
    host.addEventListener("wheel", wheel, { passive: false });
    motionQuery.addEventListener("change", motionChange);
    mobileQuery.addEventListener("change", resize);
    document.addEventListener("visibilitychange", visibilityChange);
    resize();
    return {
        zoomBy,
        resetView,
        setProgress(value) { progress = THREE.MathUtils.clamp(value, 0, 1); dirty = true; requestRender(); },
        setCompletion(value) { const first = completion === null; completion = value; finishTarget = value === "pinnacle" ? 1 : value === "essentials" ? .5 : 0; if (first || reduced)
            finish = finishTarget; dirty = true; requestRender(); },
        dispose() {
            disposed = true;
            pause();
            resizeObserver.disconnect();
            observer.disconnect();
            canvas.removeEventListener("webglcontextlost", contextLost);
            host.removeEventListener("pointerdown", down);
            host.removeEventListener("pointermove", move);
            host.removeEventListener("pointerup", up);
            host.removeEventListener("pointercancel", up);
            host.removeEventListener("keydown", key);
            host.removeEventListener("wheel", wheel);
            motionQuery.removeEventListener("change", motionChange);
            mobileQuery.removeEventListener("change", resize);
            document.removeEventListener("visibilitychange", visibilityChange);
            occlusion?.dispose();
            model.dispose();
            environment.dispose();
            sun.shadow.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
            canvas.remove();
            delete host.dataset.inspected;
            delete host.dataset.atmosphere;
            host.style.removeProperty("--scene-dusk");
        },
    };
}
