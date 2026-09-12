"use client";

import { useRef } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

interface Props {
  value: number;
  className?: string;
  suffix?: string;
}

/** Serif numeral that counts from 0 when scrolled into view. */
export function Counter({ value, className, suffix = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const obj = { v: 0 };
      el.textContent = "0" + suffix;
      gsap.to(obj, {
        v: value,
        duration: 2.2,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onUpdate: () => {
          el.textContent = Math.round(obj.v).toString() + suffix;
        },
      });
    });
    return () => mm.revert();
  }, [value, suffix]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
