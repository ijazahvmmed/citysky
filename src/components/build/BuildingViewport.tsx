"use client";

import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import type { BuildingScene, Completion } from "./scene-contract";
import styles from "./Build.module.css";

export type BuildingHandle = Pick<BuildingScene, "setProgress">;

export const BuildingViewport = forwardRef<BuildingHandle, { completion?: Completion; className?: string }>(
  function BuildingViewport({ completion, className = "" }, ref) {
    const host = useRef<HTMLDivElement>(null);
    const scene = useRef<BuildingScene | null>(null);
    const progress = useRef(0);
    const selected = useRef(completion);
    const [state, setState] = useState<"waiting" | "ready" | "fallback">("waiting");
    const hintId = useId();

    useImperativeHandle(ref, () => ({
      setProgress(value) {
        progress.current = value;
        scene.current?.setProgress(value);
      },
    }), []);

    useEffect(() => {
      selected.current = completion;
      scene.current?.setCompletion(completion ?? null);
    }, [completion]);

    useEffect(() => {
      const element = host.current;
      if (!element) return;
      let cancelled = false;
      let adapter: BuildingScene | null = null;
      const observer = new IntersectionObserver(async ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        try {
          const { createBuildingScene } = await import("./procedural-building");
          if (cancelled) return;
          adapter = createBuildingScene(element, () => setState("fallback"));
          scene.current = adapter;
          adapter.setCompletion(selected.current ?? null);
          adapter.setProgress(progress.current);
          setState("ready");
        } catch {
          if (!cancelled) setState("fallback");
        }
      }, { rootMargin: "400px" });
      observer.observe(element);
      return () => {
        cancelled = true;
        observer.disconnect();
        adapter?.dispose();
        scene.current = null;
      };
    }, []);

    return (
      <div className={`${styles.viewport} ${className}`} data-scene-state={state}>
        <div ref={host} className={styles.canvas} hidden={state === "fallback"} tabIndex={state === "ready" ? 0 : -1} role="group" aria-label="Interactive 3D architectural model" aria-describedby={hintId} />
        {state === "ready" && <div className={styles.viewControls} role="group" aria-label="Model camera controls">
          <button type="button" aria-label="Zoom out" onClick={() => scene.current?.zoomBy(-1)}>−</button>
          <button type="button" aria-label="Zoom in" onClick={() => scene.current?.zoomBy(1)}>+</button>
          <button type="button" aria-label="Reset camera view" onClick={() => scene.current?.resetView()}>↺</button>
        </div>}
        <span id={hintId} className={styles.viewHint}>{state === "ready" ? <>Drag to explore<span className={styles.keyboardHint}>. Arrow keys rotate and tilt. Plus and minus zoom. Home resets the view. On touch screens, swipe vertically to scroll the page.</span></> : state === "fallback" ? "Architectural elevation · 3D view unavailable" : "Preparing your architectural model"}</span>
        {state !== "ready" && <svg className={styles.fallback} viewBox="0 0 700 480" aria-hidden="true">
          <g fill="none" stroke="#8c9589" strokeWidth="1">
            <path d="M70 400H630M90 425H610M130 425V405M570 425V405M130 180V400M570 180V400" />
            <path d="M160 205H540V390H160ZM150 195H550V205H150ZM150 288H550V300H150Z" fill="#e7e3d7" />
            <path d="M180 223H330V282H180ZM370 223H520V282H370ZM180 317H330V390H180ZM370 317H435V390H370Z" fill="#d8dfd7" />
            <path d="M230 223V282M280 223V282M420 223V282M470 223V282M230 317V390M280 317V390M340 205V390M160 390H540" />
          </g>
          <text x="350" y="458" textAnchor="middle" fill="#6b6b68" fontSize="11" fontFamily="sans-serif" letterSpacing="2">ARCHITECTURAL STUDY</text>
        </svg>}
      </div>
    );
  },
);
