"use client";

import { useEffect, useRef } from "react";
import { gsap, FINE_POINTER, prefersReducedMotion } from "@/lib/gsap";
import styles from "./Cursor.module.css";

const INTERACTIVE =
  '[data-cursor], a, button, [role="button"], input, select, textarea, label';

/**
 * Desktop-only custom cursor. Small dot that grows and shows contextual
 * text ("View", "Drag", "Scroll") from data-cursor attributes.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const label = labelRef.current;
    if (!el || !label) return;
    if (!window.matchMedia(FINE_POINTER).matches || prefersReducedMotion())
      return;

    document.documentElement.dataset.cursor = "on";
    const xTo = gsap.quickTo(el, "x", { duration: 0.3, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.3, ease: "power3" });
    let visible = false;

    const move = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!visible) {
        visible = true;
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
      }
    };

    const over = (e: MouseEvent) => {
      const target = (e.target as Element | null)?.closest?.(INTERACTIVE) as
        HTMLElement | null | undefined;
      if (!target) {
        el.dataset.state = "";
        label.textContent = "";
        return;
      }
      const text = target.dataset.cursor;
      if (text) {
        label.textContent = text;
        el.dataset.state = "label";
      } else {
        label.textContent = "";
        el.dataset.state = "hover";
      }
    };

    const leave = () => {
      visible = false;
      gsap.to(el, { autoAlpha: 0, duration: 0.3 });
    };

    document.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over);
    document.documentElement.addEventListener("mouseleave", leave);

    return () => {
      delete document.documentElement.dataset.cursor;
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div ref={ref} className={styles.cursor} aria-hidden="true">
      <span ref={labelRef} className={styles.label} />
    </div>
  );
}
