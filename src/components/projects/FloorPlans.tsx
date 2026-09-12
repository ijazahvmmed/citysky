"use client";

import { useState } from "react";
import type { FloorPlan } from "@/lib/data/projects";
import { cx } from "@/lib/cx";
import { RevealText } from "@/components/motion/RevealText";
import styles from "./FloorPlans.module.css";

type Level = "ground" | "first";

export function FloorPlans({ plans }: { plans: Record<Level, FloorPlan> }) {
  const [level, setLevel] = useState<Level>("ground");
  const [hover, setHover] = useState<number | null>(null);
  const plan = plans[level];

  return (
    <section
      className={`section ${styles.plans}`}
      aria-labelledby="plans-heading"
    >
      <div className="container">
        <div className={styles.head}>
          <div>
            <p className="eyebrow">Floor plans</p>
            <RevealText
              as="h2"
              className={`h-section ${styles.title}`}
              id="plans-heading"
            >
              Drawn to be lived in.
            </RevealText>
          </div>
          <div className={styles.tabs} role="tablist" aria-label="Floor">
            {(["ground", "first"] as Level[]).map((l) => (
              <button
                key={l}
                type="button"
                role="tab"
                id={`plan-tab-${l}`}
                aria-selected={level === l}
                aria-controls="plan-panel"
                className={cx(styles.tab, level === l && styles.tabOn)}
                onClick={() => {
                  setLevel(l);
                  setHover(null);
                }}
              >
                {plans[l].label}
              </button>
            ))}
          </div>
        </div>

        <div
          id="plan-panel"
          role="tabpanel"
          aria-labelledby={`plan-tab-${level}`}
          className={styles.grid}
        >
          <figure className={styles.figure}>
            <svg
              key={level}
              viewBox="-3 -3 106 106"
              className={styles.svg}
              role="img"
              aria-label={`${plan.label} plan with ${plan.rooms.length} rooms`}
            >
              <rect
                x="0"
                y="0"
                width="100"
                height="100"
                className={styles.outer}
              />
              {plan.rooms.map((r, i) => (
                <g
                  key={r.name + i}
                  className={cx(styles.room, hover === i && styles.roomOn)}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  <rect x={r.x} y={r.y} width={r.w} height={r.h} />
                  <text x={r.x + 1.6} y={r.y + 4} className={styles.roomName}>
                    {r.name}
                  </text>
                  {r.h >= 12 && r.w >= 14 && (
                    <text
                      x={r.x + 1.6}
                      y={r.y + 7.2}
                      className={styles.roomDims}
                    >
                      {r.dims}
                    </text>
                  )}
                </g>
              ))}
              <g className={styles.north} transform="translate(95 -0.5)">
                <line x1="0" y1="2" x2="0" y2="-2" />
                <path d="M -1 -0.5 L 0 -2 L 1 -0.5" />
              </g>
            </svg>
            <figcaption className={`label muted ${styles.figcap}`}>
              {plan.label} · {plan.area} · Not to scale
            </figcaption>
          </figure>

          <ol className={styles.list}>
            {plan.rooms.map((r, i) => (
              <li
                key={r.name + i}
                className={cx(styles.item, hover === i && styles.itemOn)}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <span className={styles.itemName}>{r.name}</span>
                <span className={styles.itemDims}>{r.dims}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
