"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";

/**
 * Single registration point. Import gsap from here everywhere so plugins are
 * registered exactly once, client-side only.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip);
  gsap.defaults({ ease: "power3.out", duration: 1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
}

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const MOTION_REDUCED = "(prefers-reduced-motion: reduce)";
export const DESKTOP = "(min-width: 1024px)";
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOTION_REDUCED).matches;
}

export { gsap, ScrollTrigger, SplitText, Flip };
