"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { gsap, MOTION_OK, MOTION_REDUCED } from "@/lib/gsap";
import { imageBlur, imageSrc, type ImageRef } from "@/lib/images";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

interface Props {
  image: ImageRef;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
  priority?: boolean;
  /** px of vertical travel while the wrapper crosses the viewport (max 80) */
  parallax?: number;
  /** disable the wipe panel (e.g. inside dark sections handled elsewhere) */
  noPanel?: boolean;
  quality?: number;
  width?: number;
  cursor?: string;
  /** CSS object-position, e.g. "50% 25%" to keep faces in frame on tall crops */
  position?: string;
}

/**
 * Overflow-hidden wrapper. On enter: image scales 1.15 → 1 while a solid
 * panel wipes bottom → top. Optional scrubbed parallax. Set an aspect-ratio
 * or explicit height on the wrapper via className/style.
 */
export function RevealImage({
  image,
  className = "",
  style,
  sizes = "100vw",
  priority = false,
  parallax = 0,
  noPanel = false,
  quality = 80,
  width = 2000,
  cursor,
  position,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const travel = Math.min(Math.abs(parallax), 80);

  useIsomorphicLayoutEffect(() => {
    const w = wrap.current;
    const m = media.current;
    const p = panel.current;
    if (!w || !m) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      gsap.set(m, { scale: 1.15, transformOrigin: "50% 50%" });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: w, start: "top 80%", once: true },
        onComplete: () => gsap.set(m, { willChange: "auto" }),
      });
      if (p) {
        tl.to(p, { yPercent: -101, duration: 1.2, ease: "power3.inOut" }, 0);
      }
      tl.to(m, { scale: 1, duration: 1.4, ease: "power3.out" }, 0.05);

      if (travel > 0) {
        gsap.fromTo(
          m,
          { y: -travel / 2 },
          {
            y: travel / 2,
            ease: "none",
            scrollTrigger: {
              trigger: w,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    });

    mm.add(MOTION_REDUCED, () => {
      if (p) {
        gsap.to(p, {
          autoAlpha: 0,
          duration: 0.8,
          scrollTrigger: { trigger: w, start: "top 85%", once: true },
        });
      }
    });

    return () => mm.revert();
  }, [travel]);

  const blur = imageBlur(image);

  return (
    <div
      ref={wrap}
      className={`reveal-img ${className}`}
      style={style}
      data-cursor={cursor}
    >
      <div
        ref={media}
        className="media"
        style={{
          position: "absolute",
          inset: travel ? `-${travel / 2}px 0` : 0,
        }}
      >
        <Image
          src={imageSrc(image, width, quality)}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={quality}
          placeholder={blur ? "blur" : "empty"}
          blurDataURL={blur}
          style={{ objectFit: "cover", objectPosition: position }}
        />
      </div>
      {!noPanel && (
        <div ref={panel} className="reveal-img__panel" aria-hidden />
      )}
    </div>
  );
}
