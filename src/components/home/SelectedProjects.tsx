"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, DESKTOP, MOTION_OK } from "@/lib/gsap";
import { featuredProjects } from "@/lib/data/projects";
import { imageBlur, imageSrc } from "@/lib/images";
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
          // Keep the section anchored by the browser while only the track
          // animates. Transform pinning can lag behind compositor scrolling.
          pinType: "fixed",
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
        <div className={styles.titleGroup}>
          <p className="eyebrow">Selected projects</p>
          <RevealText
            as="h2"
            className={`h-section ${styles.title}`}
            id="projects-heading"
          >
            <span>Ten years of</span>
            <span className={styles.titleOffset}>building in Kochi.</span>
          </RevealText>
        </div>
        <div className={styles.allLink}>
          <ArrowLink href="/projects">All projects</ArrowLink>
        </div>
      </div>

      <div ref={track} className={styles.track} data-cursor="Scroll">
        {featuredProjects.map((p, index) => (
          <TransitionLink
            key={p.slug}
            href={`/projects/${p.slug}`}
            className={styles.card}
            data-cursor="View"
          >
            <div className={styles.media}>
              {p.soldOut && <span className={styles.soldOut}>Sold out</span>}
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
              <div className={styles.projectHeading}>
                <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.projectStatus}>{p.status}</span>
              </div>
              <h3 className={styles.name}>{p.name}</h3>
              <p className={styles.meta}>{p.area}, Kerala</p>
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
