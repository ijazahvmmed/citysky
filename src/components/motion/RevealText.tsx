"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import { gsap, SplitText, MOTION_OK, MOTION_REDUCED } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

type Tag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div" | "blockquote";

interface Props {
  as?: Tag;
  className?: string;
  children: ReactNode;
  /** seconds */
  delay?: number;
  /** ScrollTrigger start viewport percentage, default 80 */
  start?: number;
  /** play immediately on mount instead of on scroll */
  immediate?: boolean;
  id?: string;
}

/**
 * Splits text into lines, masks each line, and reveals y:100% → 0.
 * Falls back to an opacity fade under prefers-reduced-motion.
 */
export function RevealText({
  as = "h2",
  className,
  children,
  delay = 0,
  start = 80,
  immediate = false,
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    let split: SplitText | undefined;
    let tween: gsap.core.Tween | undefined;
    let cancelled = false;
    let played = false;

    mm.add(MOTION_OK, () => {
      // Failsafe: if SplitText throws, reveal the text anyway rather than
      // leaving the heading permanently invisible.
      const failsafe = window.setTimeout(() => {
        if (!cancelled) gsap.set(el, { visibility: "visible" });
      }, 1200);

      // Split immediately rather than awaiting document.fonts.ready: waiting
      // held headings invisible for the whole font-load on slow connections
      // (it made a nav word the LCP element). `autoSplit` re-splits once the
      // real font changes the line metrics, so line breaks still end correct.
      {
        try {
          split = SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            linesClass: "split-line",
            // Never let SplitText add aria-label: it is a prohibited attribute
            // on <p>, and the split lines already read in document order.
            aria: "none",
            onSplit(self) {
              window.clearTimeout(failsafe);
              gsap.set(el, { visibility: "visible" });
              if (played) {
                return gsap.set(self.lines, { yPercent: 0 });
              }
              tween = gsap.fromTo(
                self.lines,
                { yPercent: 110 },
                {
                  yPercent: 0,
                  duration: 1.1,
                  stagger: 0.08,
                  ease: "power4.out",
                  delay,
                  onComplete: () => {
                    played = true;
                    gsap.set(self.lines, { willChange: "auto" });
                  },
                  scrollTrigger: immediate
                    ? undefined
                    : { trigger: el, start: `top ${start}%`, once: true },
                },
              );
              return tween;
            },
          });
        } catch {
          window.clearTimeout(failsafe);
          gsap.set(el, { visibility: "visible" });
        }
      }

      return () => {
        window.clearTimeout(failsafe);
        tween?.scrollTrigger?.kill();
        tween?.kill();
        split?.revert();
      };
    });

    mm.add(MOTION_REDUCED, () => {
      // Opacity only — never touch visibility here, so the heading stays
      // readable even if this tween never runs.
      gsap.set(el, { visibility: "visible" });
      const tween = gsap.fromTo(
        el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          delay,
          scrollTrigger: immediate
            ? undefined
            : { trigger: el, start: `top ${start}%`, once: true },
        },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(el, { clearProps: "opacity" });
      };
    });

    return () => {
      cancelled = true;
      mm.revert();
    };
  }, []);

  const Tag = as as "div";
  return (
    <Tag
      ref={ref as RefObject<HTMLDivElement>}
      className={className}
      data-reveal=""
      id={id}
    >
      {children}
    </Tag>
  );
}
