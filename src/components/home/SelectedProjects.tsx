"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, DESKTOP, MOTION_OK } from "@/lib/gsap";
import { featuredProjects, projectEra } from "@/lib/data/projects";
import { imageBlur, imageSrc } from "@/lib/images";
import { cx } from "@/lib/cx";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { RevealText } from "@/components/motion/RevealText";
import styles from "./SelectedProjects.module.css";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/**
 * Pinned section; project cards scroll horizontally with the page.
 * Below 1024px (or under reduced motion) it's a vertical stack.
 */
export function SelectedProjects() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const s = section.current;
    const t = track.current;
    if (!s || !t) return;
    const mm = gsap.matchMedia();
    mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
      const distance = () => t.scrollWidth - window.innerWidth;
      gsap.to(t, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: s,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          // Pin by translating rather than position:fixed. Fixed pinning
          // silently fails if any ancestor ever carries a transform (the page
          // wrapper does during route transitions).
          pinType: "transform",
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={section}
      className={styles.section}
      aria-labelledby="projects-heading"
    >
      <div className={`container ${styles.head}`}>
        <div>
          <p className="eyebrow">Selected projects</p>
          <RevealText
            as="h2"
            className={`h-section ${styles.title}`}
            id="projects-heading"
          >
            Ten years of building in Kochi.
          </RevealText>
        </div>
        <ArrowLink href="/projects">All projects</ArrowLink>
      </div>

      <div ref={track} className={styles.track} data-cursor="Scroll">
        {featuredProjects.map((p, i) => (
          <TransitionLink
            key={p.slug}
            href={`/projects/${p.slug}`}
            className={styles.card}
            data-cursor="View"
          >
            <div className={styles.media}>
              <Image
                src={imageSrc(p.cover, 1600)}
                alt={p.cover.alt}
                fill
                sizes="(min-width: 1024px) 65vw, 100vw"
                placeholder={imageBlur(p.cover) ? "blur" : "empty"}
                blurDataURL={imageBlur(p.cover)}
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className={styles.body}>
              <div className={styles.row}>
                <span className={styles.index}>0{i + 1}</span>
                <span
                  className={cx("badge", `badge--${p.status.toLowerCase()}`)}
                >
                  {p.status}
                </span>
              </div>
              <div className={styles.row}>
                <h3 className={styles.name}>{p.name}</h3>
                <p className={styles.meta}>
                  <span>{p.location}</span>
                  <span className={styles.sep} aria-hidden>
                    ·
                  </span>
                  <span>{projectEra(p)}</span>
                  <span className={styles.sep} aria-hidden>
                    ·
                  </span>
                  <span>{p.configuration}</span>
                </p>
              </div>
            </div>
          </TransitionLink>
        ))}

        <div className={styles.end}>
          <p className={`lede ${styles.endText}`}>
            Every project starts with a walk around the site. Come and see one.
          </p>
          <ArrowLink href="/contact" size="lg">
            Arrange a visit
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
