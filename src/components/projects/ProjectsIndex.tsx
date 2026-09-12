"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, Flip, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import {
  projects,
  statusFilters,
  areaFilters,
  type Area,
  type ProjectStatus,
} from "@/lib/data/projects";
import { cx } from "@/lib/cx";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { Arrow } from "@/components/ui/Arrow";
import styles from "./ProjectsIndex.module.css";

type StatusFilter = "All" | ProjectStatus;
type AreaFilter = "All" | Area;

const statusOptions = statusFilters as readonly StatusFilter[];
const areaOptions = areaFilters as readonly AreaFilter[];

export function ProjectsIndex() {
  const [status, setStatus] = useState<StatusFilter>("All");
  const [area, setArea] = useState<AreaFilter>("All");
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const visible = projects.filter(
    (p) =>
      (status === "All" || p.status === status) &&
      (area === "All" || p.area === area),
  );
  const visibleSlugs = new Set(visible.map((p) => p.slug));

  const capture = () => {
    if (!grid.current || prefersReducedMotion()) return;
    flipState.current = Flip.getState(
      grid.current.querySelectorAll("[data-tile]"),
    );
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    Flip.from(state, {
      duration: 0.8,
      ease: "power3.inOut",
      absolute: true,
      nested: true,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, delay: 0.2 },
        ),
      onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.3 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [status, area]);

  const reset = () => {
    capture();
    setStatus("All");
    setArea("All");
  };

  return (
    <section className={styles.index} aria-labelledby="projects-title">
      <div className="container">
        <header className={styles.head}>
          <p className="eyebrow">Projects</p>
          <RevealText
            as="h1"
            className={`display ${styles.title}`}
            immediate
            delay={0.2}
            id="projects-title"
          >
            Built in Kochi and Ernakulam.
          </RevealText>
          <p className={`body muted ${styles.lead}`} data-enter>
            Six projects over ten years, from a pair of houses on eleven cents
            to fourteen homes around a courtyard. Filter by status or by place.
          </p>
        </header>

        <div className={styles.filters} data-enter>
          <div
            className={styles.filterGroup}
            role="group"
            aria-label="Filter by status"
          >
            <span className={`label muted ${styles.filterLabel}`}>Status</span>
            {statusOptions.map((o) => (
              <button
                key={o}
                type="button"
                className={cx(styles.filter, status === o && styles.filterOn)}
                aria-pressed={status === o}
                onClick={() => {
                  capture();
                  setStatus(o);
                }}
              >
                {o}
              </button>
            ))}
          </div>
          <div
            className={styles.filterGroup}
            role="group"
            aria-label="Filter by location"
          >
            <span className={`label muted ${styles.filterLabel}`}>Place</span>
            {areaOptions.map((o) => (
              <button
                key={o}
                type="button"
                className={cx(styles.filter, area === o && styles.filterOn)}
                aria-pressed={area === o}
                onClick={() => {
                  capture();
                  setArea(o);
                }}
              >
                {o}
              </button>
            ))}
          </div>
          <p className={`label muted ${styles.count}`} aria-live="polite">
            {visible.length} of {projects.length}
          </p>
        </div>

        <div ref={grid} className={styles.grid}>
          {projects.map((p) => {
            const isVisible = visibleSlugs.has(p.slug);
            const index = visible.findIndex((v) => v.slug === p.slug);
            const full = index % 3 === 0;
            const offset = index % 3 === 2;
            return (
              <TransitionLink
                key={p.slug}
                href={`/projects/${p.slug}`}
                className={cx(
                  styles.tile,
                  full ? styles.tileFull : styles.tileHalf,
                  offset && styles.tileOffset,
                )}
                data-tile
                data-flip-id={p.slug}
                data-cursor="View"
                hidden={!isVisible}
              >
                <div className={styles.media}>
                  <RevealImage
                    image={p.cover}
                    className={cx(
                      styles.image,
                      full ? styles.imageFull : styles.imageHalf,
                    )}
                    sizes={full ? "100vw" : "(min-width: 900px) 50vw, 100vw"}
                    parallax={full ? 50 : 0}
                    width={full ? 2400 : 1400}
                  />
                  <span className={styles.view}>
                    View project <Arrow className={styles.viewArrow} />
                  </span>
                </div>
                <div className={styles.body}>
                  <div>
                    <h2 className={styles.name}>{p.name}</h2>
                    <p className={`small muted`}>{p.summary}</p>
                  </div>
                  <div className={styles.meta}>
                    <span
                      className={cx(
                        "badge",
                        `badge--${p.status.toLowerCase()}`,
                      )}
                    >
                      {p.status}
                    </span>
                    {p.year && (
                      <span className="small muted">{p.year}</span>
                    )}
                    <span className="small muted">{p.location}</span>
                    <span className="small muted">{p.configuration}</span>
                    {p.soldOut && <span className="small muted">Sold out</span>}
                  </div>
                </div>
              </TransitionLink>
            );
          })}

          {visible.length === 0 && (
            <div className={styles.empty}>
              <p className="lede">Nothing matches that combination yet.</p>
              <button type="button" className="arrow-link" onClick={reset}>
                Show all projects <Arrow />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
