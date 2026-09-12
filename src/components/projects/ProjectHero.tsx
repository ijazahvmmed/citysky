"use client";

import Image from "next/image";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { imageBlur, imageSrc } from "@/lib/images";
import { whatsappLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/cx";
import type { Project } from "@/lib/data/projects";
import { useNavInverse } from "@/components/layout/NavTheme";
import { RevealText } from "@/components/motion/RevealText";
import { ArrowLink } from "@/components/ui/ArrowLink";
import styles from "./ProjectHero.module.css";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

export function ProjectHero({ project }: { project: Project }) {
  useNavInverse(true);
  const pathname = usePathname();
  const section = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const s = section.current;
    const m = media.current;
    if (!s || !m) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        m,
        { scale: 1.08 },
        { scale: 1, duration: 2, ease: "power3.out" },
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
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={section}
      className={styles.hero}
      aria-label={`${project.name} overview`}
    >
      <div ref={media} className={styles.media}>
        <Image
          src={imageSrc(project.cover, 2400, 78)}
          alt={project.cover.alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={78}
          placeholder="blur"
          blurDataURL={imageBlur(project.cover)}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={styles.shade} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        <RevealText
          as="p"
          className={`eyebrow ${styles.eyebrow}`}
          immediate
          delay={0.4}
        >
          {project.location}
        </RevealText>
        <RevealText
          as="h1"
          className={`display ${styles.title}`}
          immediate
          delay={0.55}
        >
          {project.name}
        </RevealText>
        <div className={styles.row} data-enter>
          <span
            className={cx("badge", `badge--${project.status.toLowerCase()}`)}
          >
            {project.status}
          </span>
          {project.year && (
            <>
              <span className={styles.sep} aria-hidden="true" />
              <span className="label">{project.year}</span>
            </>
          )}
          <span className={styles.sep} aria-hidden="true" />
          <span className="label">{project.configuration}</span>
          {project.soldOut ? (
            <span className={`label ${styles.soldOut}`}>Sold out</span>
          ) : (
            <ArrowLink
              href={whatsappLink({ project: project.name })}
              className={styles.enquire}
              onClick={() =>
                track({
                  name: "whatsapp_click",
                  page: pathname,
                  section: "project-hero",
                  project: project.name,
                })
              }
            >
              Enquire
            </ArrowLink>
          )}
        </div>
      </div>
    </section>
  );
}
