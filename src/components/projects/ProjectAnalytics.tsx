"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

const marks = [25, 50, 75, 100] as const;

/** Fires project_view on mount and scroll_depth at 25/50/75/100%. */
export function ProjectAnalytics({ project }: { project: string }) {
  useEffect(() => {
    track({ name: "project_view", project });
    const fired = new Set<number>();
    let ticking = false;
    const check = () => {
      ticking = false;
      const doc = document.documentElement;
      const depth =
        ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100;
      for (const m of marks) {
        if (depth >= m && !fired.has(m)) {
          fired.add(m);
          track({ name: "scroll_depth", project, depth: m });
        }
      }
      if (fired.size === marks.length)
        window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    check();
    return () => window.removeEventListener("scroll", onScroll);
  }, [project]);
  return null;
}
