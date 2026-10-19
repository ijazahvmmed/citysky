import * as THREE from "three";
import { createArchitecturalModel } from "./architectural-model";
import { phase } from "./assembly";
import type { BuildingScene, Completion } from "./scene-contract";

/** Demand-rendered perspective scene. Scroll is the construction clock;
 * only inspection and its gentle return use time-based interpolation. */
export function createBuildingScene(host: HTMLElement, onFailure: () => void): BuildingScene {
  const mobileQuery = matchMedia("(max-width: 767px)");
  const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
  let mobile = mobileQuery.matches;
  let reduced = motionQuery.matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setClearColor(0xfafaf8, 0);
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  const ambient = new THREE.HemisphereLight(0xfaf9f3, 0x969c92, 1.95);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xfff6e6, 3.2);
  sun.position.set(-6, 13, 8);
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 0.5, far: 40 });
  sun.shadow.normalBias = 0.025;
  sun.shadow.bias = -0.00015;
  sun.shadow.radius = 3;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xe6eef2, 0.7);
  fill.position.set(7, 8, -5); scene.add(fill);
  const groundMaterial = new THREE.ShadowMaterial({ color: 0x485044, opacity: 0.11 });
  const groundGeometry = new THREE.PlaneGeometry(200, 200);
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.225; ground.receiveShadow = true;
  scene.add(ground);
  const model = createArchitecturalModel(scene);

  let progress = 0;
  let completion: Completion | null = null;
  let finish = 0;
  let finishTarget = 0;
  let frame = 0;
  let disposed = false;
  let visible = false;
  let dirty = true;
  let lastTime = 0;
  let dragYaw = 0;
  let dragPitch = 0;
  let hoverYaw = 0;
  let hoverPitch = 0;
  let yaw = 0;
  let pitch = 0;
  let returnTimer: ReturnType<typeof setTimeout> | undefined;
  let pointer: { id: number; x: number; y: number; yaw: number; pitch: number; touch: boolean; direction: "pending" | "horizontal" | "vertical" } | null = null;
  const degrees = THREE.MathUtils.degToRad;
  const coldSun = new THREE.Color(0xfff6e6);
  const warmSun = new THREE.Color(0xffddb0);
  const coldAmbient = new THREE.Color(0xfaf9f3);
  const warmAmbient = new THREE.Color(0xffead1);

  function compose() {
    const p = completion ? 1 : progress;
    const movement = reduced ? 1 : phase(p, 0.08, 0.96);
    // Mobile uses its own more frontal composition and lens.
    const azimuth = degrees(mobile ? 18 + movement * 9 : 29 + movement * 10) + yaw;
    const elevation = degrees(mobile ? 30 - movement * 8 : 37 - movement * 12) + pitch;
    camera.fov = mobile ? 42 : 36;
    const tangent = Math.tan(degrees(camera.fov / 2));
    const verticalFit = (mobile ? 8.4 : 9.2) / (2 * tangent);
    const horizontalFit = (mobile ? 11.6 : 12.4) / (2 * tangent * camera.aspect);
    const distance = Math.max(verticalFit, horizontalFit) * (mobile ? 1.38 - movement * 0.14 : 1.54 - movement * 0.16);
    const targetY = mobile ? 2.4 : 2.35;
    camera.position.set(Math.sin(azimuth) * Math.cos(elevation) * distance, targetY + Math.sin(elevation) * distance, Math.cos(azimuth) * Math.cos(elevation) * distance);
    camera.lookAt(0, targetY, 0.25);
    camera.updateProjectionMatrix();
  }
  function requestRender() {
    if (frame || disposed || !visible || document.hidden) return;
    frame = requestAnimationFrame(render);
  }
  function render(time: number) {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const dt = Math.min(0.05, (time - lastTime) / 1000 || 1 / 60);
    lastTime = time;
    const damping = reduced ? 1 : 1 - Math.exp(-dt * 6.5);
    const targetYaw = THREE.MathUtils.clamp(dragYaw + hoverYaw, degrees(-15), degrees(15));
    const targetPitch = THREE.MathUtils.clamp(dragPitch + hoverPitch, degrees(-5), degrees(6));
    yaw += (targetYaw - yaw) * damping;
    pitch += (targetPitch - pitch) * damping;
    const finishBefore = finish;
    finish += (finishTarget - finish) * damping;
    if (Math.abs(finishTarget - finish) < 0.0001) finish = finishTarget;
    if (dirty || Math.abs(finishBefore - finish) > 0.00001) {
      const warmth = model.update(progress, completion, finish);
      sun.color.copy(coldSun).lerp(warmSun, warmth);
      sun.position.set(-6 - warmth * 2, 13 - warmth * 3, 8);
      sun.intensity = 3.2 - warmth * 0.65;
      ambient.color.copy(coldAmbient).lerp(warmAmbient, warmth * 0.4);
      ambient.intensity = 1.95 - warmth * 0.35;
      dirty = false;
    }
    compose();
    renderer.render(scene, camera);
    if (Math.abs(targetYaw - yaw) + Math.abs(targetPitch - pitch) > 0.00008 || Math.abs(finishTarget - finish) > 0.0001) requestRender();
  }
  function scheduleReturn(delay = 900) {
    clearTimeout(returnTimer);
    returnTimer = setTimeout(() => { dragYaw = dragPitch = 0; requestRender(); }, reduced ? 0 : delay);
  }
  function down(event: PointerEvent) {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    clearTimeout(returnTimer);
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw: dragYaw, pitch: dragPitch, touch: event.pointerType !== "mouse", direction: "pending" };
    hoverYaw = hoverPitch = 0;
    if (!pointer.touch) host.setPointerCapture(event.pointerId);
  }
  function move(event: PointerEvent) {
    if (pointer && event.pointerId === pointer.id) {
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      if (pointer.touch && pointer.direction === "pending" && Math.max(Math.abs(dx), Math.abs(dy)) > 7) {
        pointer.direction = Math.abs(dx) > Math.abs(dy) * 1.15 ? "horizontal" : "vertical";
        if (pointer.direction === "horizontal") host.setPointerCapture(event.pointerId);
      }
      if (pointer.touch && pointer.direction !== "horizontal") return;
      dragYaw = THREE.MathUtils.clamp(pointer.yaw - dx / Math.max(host.clientWidth, 1) * 0.75, degrees(-13), degrees(13));
      dragPitch = pointer.touch ? 0 : THREE.MathUtils.clamp(pointer.pitch + dy / Math.max(host.clientHeight, 1) * 0.32, degrees(-4), degrees(5));
      requestRender();
    } else if (event.pointerType === "mouse" && !mobile && !reduced) {
      const rect = host.getBoundingClientRect();
      hoverYaw = ((event.clientX - rect.left) / rect.width - 0.5) * degrees(4);
      hoverPitch = ((event.clientY - rect.top) / rect.height - 0.5) * degrees(2);
      requestRender();
    }
  }
  function up(event: PointerEvent) {
    if (pointer?.id !== event.pointerId) return;
    if (host.hasPointerCapture(event.pointerId)) host.releasePointerCapture(event.pointerId);
    pointer = null; scheduleReturn();
  }
  function leave() { hoverYaw = hoverPitch = 0; if (!pointer) scheduleReturn(150); requestRender(); }
  function key(event: KeyboardEvent) {
    if (!["ArrowLeft", "ArrowRight", "Home"].includes(event.key)) return;
    event.preventDefault();
    dragYaw = event.key === "Home" ? 0 : THREE.MathUtils.clamp(dragYaw + degrees(event.key === "ArrowLeft" ? -4 : 4), degrees(-13), degrees(13));
    requestRender(); scheduleReturn(1600);
  }
  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    mobile = mobileQuery.matches;
    renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.6));
    renderer.shadowMap.enabled = !mobile;
    sun.castShadow = !mobile;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    dirty = true; requestRender();
  }
  function motionChange() {
    reduced = motionQuery.matches;
    hoverYaw = hoverPitch = dragYaw = dragPitch = 0;
    if (reduced) { yaw = pitch = 0; finish = finishTarget; }
    dirty = true; requestRender();
  }
  function visibilityChange() {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else { lastTime = 0; dirty = true; requestRender(); }
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) { lastTime = 0; dirty = true; requestRender(); }
    else { cancelAnimationFrame(frame); frame = 0; }
  }, { rootMargin: "100px" });
  intersectionObserver.observe(host);
  const contextLost = (event: Event) => { event.preventDefault(); visible = false; cancelAnimationFrame(frame); frame = 0; onFailure(); };
  canvas.addEventListener("webglcontextlost", contextLost);
  host.addEventListener("pointerdown", down); host.addEventListener("pointermove", move);
  host.addEventListener("pointerup", up); host.addEventListener("pointercancel", up);
  host.addEventListener("pointerleave", leave); host.addEventListener("keydown", key);
  motionQuery.addEventListener("change", motionChange); mobileQuery.addEventListener("change", resize);
  document.addEventListener("visibilitychange", visibilityChange);
  resize();
  return {
    setProgress(value) { progress = THREE.MathUtils.clamp(value, 0, 1); dirty = true; requestRender(); },
    setCompletion(value) {
      const first = completion === null;
      completion = value;
      finishTarget = value === "pinnacle" ? 1 : value === "essentials" ? 0.5 : 0;
      if (first || reduced) finish = finishTarget;
      dirty = true; requestRender();
    },
    dispose() {
      disposed = true; cancelAnimationFrame(frame); clearTimeout(returnTimer);
      resizeObserver.disconnect(); intersectionObserver.disconnect();
      canvas.removeEventListener("webglcontextlost", contextLost);
      host.removeEventListener("pointerdown", down); host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerup", up); host.removeEventListener("pointercancel", up);
      host.removeEventListener("pointerleave", leave); host.removeEventListener("keydown", key);
      motionQuery.removeEventListener("change", motionChange); mobileQuery.removeEventListener("change", resize);
      document.removeEventListener("visibilitychange", visibilityChange);
      model.dispose(); groundGeometry.dispose(); groundMaterial.dispose();
      renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    },
  };
}
