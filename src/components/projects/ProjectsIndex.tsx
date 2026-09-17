"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, Flip, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import {
  projects,
  statusFilters,
  type ProjectStatus,
} from "@/lib/data/projects";
import { cx } from "@/lib/cx";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { Arrow } from "@/components/ui/Arrow";
import styles from "./ProjectsIndex.module.css";

type StatusFilter = "All" | ProjectStatus;

const statusOptions = statusFilters as readonly StatusFilter[];

export function ProjectsIndex() {
  const [status, setStatus] = useState<StatusFilter>("All");
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const visible = projects.filter(
    (p) => status === "All" || p.status === status,
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
  }, [status]);

  const reset = () => {
    capture();
    setStatus("All");
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
            to fourteen homes around a courtyard. Filter by build status.
          </p>
        </header>

        <div className={styles.filters} data-enter>
          <div
            className={styles.filterGroup}
            role="group"
            aria-label="Filter by status"
          >
            <span className={`label muted ${styles.filterLabel}`}>Build status</span>
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
          <p className={`label muted ${styles.count}`} aria-live="polite">
            {visible.length} of {projects.length}
          </p>
        </div>

        <div ref={grid} className={styles.grid}>
          {projects.map((p) => {
            const isVisible = visibleSlugs.has(p.slug);
            return (
              <TransitionLink
                key={p.slug}
                href={`/projects/${p.slug}`}
                className={styles.tile}
                data-tile
                data-flip-id={p.slug}
                data-cursor="View"
                hidden={!isVisible}
              >
                <div className={styles.media}>
                  <RevealImage
                    image={p.cover}
                    className={cx(styles.image, styles.cardImage)}
                    sizes="(min-width: 1024px) 33vw, (min-width: 601px) 50vw, 100vw"
                    parallax={0}
                    width={1000}
                  />
                  <span className={styles.view}>
                    View project <Arrow className={styles.viewArrow} />
                  </span>
                </div>
                <div className={styles.body}>
                  <div className={styles.cardStatus}>
                    <span className={cx(styles.statusChip, styles[p.status.toLowerCase()])}><span aria-hidden="true">●</span> {p.status}</span>
                    {p.soldOut && <span className={styles.soldChip}>Sold out</span>}
                    {!p.soldOut && <span className={styles.availableChip}>Enquiries open</span>}
                  </div>
                  <div className={styles.cardHeading}>
                    <h2 className={styles.name}>{p.name}</h2>
                    <span className={styles.cardArrow} aria-hidden="true"><Arrow /></span>
                  </div>
                  <p className={styles.cardLocation}>{p.location}</p>
                  <p className={styles.cardSummary}>{p.summary}</p>
                  <dl className={styles.facts}>
                    <div><dt>Homes</dt><dd>{p.unitTypes}</dd></div>
                    <div><dt>Built-up area</dt><dd>{p.builtUp}</dd></div>
                  </dl>
                  <div className={styles.cardFoot}>
                    {p.soldOut ? <span className={styles.soldNote}>All homes sold</span> : <span className={styles.cardPrice}>From <strong>₹{p.basePrice.min} lakhs</strong></span>}
                    <span className={styles.detailsLink}>View project <span aria-hidden="true">↗</span></span>
                  </div>
                </div>
              </TransitionLink>
            );
          })}

          {visible.length === 0 && (
            <div className={styles.empty}>
              <p className="lede">No projects with that build status yet.</p>
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
