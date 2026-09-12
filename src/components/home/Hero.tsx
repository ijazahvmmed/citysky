"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { imageBlur, imageSrc, img } from "@/lib/images";
import { useNavInverse } from "@/components/layout/NavTheme";
import { RevealText } from "@/components/motion/RevealText";
import styles from "./Hero.module.css";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

const heroImage = img(
  "1600585154340-be6161a56a0c",
  "A Citysky villa at dusk, timber cladding lit from within beneath a mature tree",
);

export function Hero() {
  useNavInverse(true);
  const section = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const scroll = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const s = section.current;
    const m = media.current;
    if (!s || !m) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        m,
        { scale: 1.08 },
        {
          scale: 1,
          duration: 2.2,
          ease: "power3.out",
          clearProps: "willChange",
        },
      );
      gsap.fromTo(
        m,
        { y: 0 },
        {
          y: 80,
          ease: "none",
          scrollTrigger: {
            trigger: s,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      gsap.fromTo(
        scroll.current,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 1, delay: 1.4 },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={section} className={styles.hero} aria-label="Introduction">
      <div ref={media} className={styles.media}>
        <Image
          src={imageSrc(heroImage, 2400, 78)}
          alt={heroImage.alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={78}
          placeholder="blur"
          blurDataURL={imageBlur(heroImage)}
          style={{ objectFit: "cover", objectPosition: "50% 60%" }}
        />
      </div>
      <div className={styles.shade} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        <RevealText
          as="p"
          className={`eyebrow ${styles.eyebrow}`}
          immediate
          delay={0.5}
        >
          Citysky Builders — Kochi, Kerala
        </RevealText>
        <RevealText
          as="h1"
          className={`display ${styles.title}`}
          immediate
          delay={0.7}
        >
          Homes built to belong.
        </RevealText>
      </div>

      <div ref={scroll} className={styles.scroll} aria-hidden="true">
        <span className={styles.scrollLabel}>Scroll</span>
        <span className={styles.scrollLine} />
      </div>
    </section>
  );
}
