"use client";

import { useRef } from "react";
import { RevealText } from "@/components/motion/RevealText";
import { gsap, MOTION_OK, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { SpecIcon } from "./SpecIcon";
import styles from "./Specs.module.css";

export function Specs({
  specs,
}: {
  specs: { category: string; items: string[] }[];
}) {
  const listRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const media = gsap.matchMedia();
    media.add(MOTION_OK, () => {
      const reveal = gsap.fromTo(
        list.children,
        { y: 10, opacity: 0.55 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.055,
          ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: list, start: "top 88%", once: true },
        },
      );
      return () => {
        reveal.scrollTrigger?.kill();
        reveal.kill();
      };
    });
    return () => media.revert();
  }, []);

  return (
    <section
      className={`section ${styles.specs}`}
      aria-labelledby="specs-heading"
    >
      <div className={`container ${styles.grid}`}>
        <div className={styles.intro}>
          <p className="eyebrow">Features and specifications</p>
          <RevealText
            as="h2"
            className={`h-section ${styles.title}`}
            id="specs-heading"
          >
            What the house is made of.
          </RevealText>
          <p className="body muted measure">
            Brands named here are the specified standard. Equivalents are agreed
            in writing before substitution.
          </p>
        </div>

        <div className={styles.list} ref={listRef}>
          {specs.map((s, i) => (
            <details
              key={s.category}
              className={styles.group}
              open={i === 0}
              onToggle={() => ScrollTrigger.refresh()}
            >
              <summary className={styles.summary}>
                <span className={styles.icon}>
                  <SpecIcon category={s.category} />
                </span>
                <span className={styles.summaryTitle}>{s.category}</span>
                <span className={styles.marker} aria-hidden="true" />
              </summary>
              <ul className={styles.items}>
                {s.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
