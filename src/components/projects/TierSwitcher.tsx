"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import {
  tiers,
  tierPriceLabel,
  tierImages,
  type Project,
  type TierKey,
} from "@/lib/data/projects";
import { imageBlur, imageSrc } from "@/lib/images";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/cx";
import { RevealText } from "@/components/motion/RevealText";
import styles from "./TierSwitcher.module.css";

const order: TierKey[] = ["unfurnished", "semi", "fully"];
const finishLabels: Record<TierKey, string> = {
  unfurnished: "Finished home",
  semi: "Furniture essentials",
  fully: "Furniture + décor",
};

/**
 * Illustrative rooms for three finish levels. Crossfade 400ms, default Fully Furnished,
 * all three images eager-loaded, swipeable on touch.
 */
export function TierSwitcher({ project }: { project: Project }) {
  const [tier, setTier] = useState<TierKey>("fully");
  const touch = useRef<{ x: number; y: number } | null>(null);
  const controls = useRef<HTMLDivElement>(null);

  const select = (next: TierKey) => {
    if (next === tier) return;
    setTier(next);
    track({ name: "tier_switch", tier: next, project: project.name });
  };

  const step = (dir: 1 | -1) => {
    const i = order.indexOf(tier);
    const next = order[(i + dir + order.length) % order.length];
    select(next);
  };

  const onTouchStart = (e: TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touch.current === null) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;
    step(dx < 0 ? 1 : -1);
  };

  const onKey = (e: KeyboardEvent) => {
    const index = order.indexOf(tier);
    let next: number;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (index + 1) % order.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (index + order.length - 1) % order.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = order.length - 1;
    else return;
    e.preventDefault();
    select(order[next]);
    controls.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  };

  const current = tiers.find((t) => t.key === tier)!;
  const price = tierPriceLabel(project, tier);

  return (
    <section
      className={`section ${styles.switcher}`}
      aria-labelledby="switcher-heading"
    >
      <div className="container">
        <div className={styles.head}>
          <p className="eyebrow">Finish visualisation</p>
          <RevealText
            as="h2"
            className={`h-section ${styles.title}`}
            id="switcher-heading"
          >
            See each level of finish.
          </RevealText>
          <p className={`body muted ${styles.lead}`}>
            Tap a finish to compare the furniture and styling. These illustrative
            rooms show the difference between the three options.
          </p>
        </div>

        <div className={styles.preview}>
          <div
            className={styles.stage}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onTouchCancel={() => { touch.current = null; }}
            data-cursor="Drag"
          >
            {order.map((k) => {
              const image = tierImages[k];
              const on = k === tier;
              return (
                <div
                  key={k}
                  className={cx(styles.layer, on && styles.layerOn)}
                  aria-hidden={!on}
                >
                  <Image
                    src={imageSrc(image, 2000)}
                    alt={`${tiers.find(t => t.key === k)?.name} living room finish visualisation`}
                    fill
                    loading="eager"
                    sizes="(min-width: 1440px) 1300px, 92vw"
                    placeholder={imageBlur(image) ? "blur" : "empty"}
                    blurDataURL={imageBlur(image)}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              );
            })}
            <div className={styles.stageCaption} aria-live="polite">
              <span className={styles.stageNumeral}>{current.numeral}</span>
              <span className={styles.stageName}>{current.name}</span>
              {price && <span className={styles.stagePrice}>From {price}</span>}
            </div>
          </div>

          <div
            ref={controls}
            className={styles.controls}
            role="group"
            aria-label="Choose a finish to preview"
            onKeyDown={onKey}
          >
            {tiers.map((t) => (
              <button
                key={t.key}
                type="button"
                className={cx(styles.control, tier === t.key && styles.controlOn)}
                aria-pressed={tier === t.key}
                onClick={() => select(t.key)}
              >
                <span className={styles.controlNumeral}>{t.numeral}</span>
                <span className={styles.controlText}>
                  <span className={styles.controlName}>{t.name}</span>
                  <span className={styles.controlDescription}>{finishLabels[t.key]}</span>
                </span>
                {!project.soldOut && (
                  <span className={styles.controlPrice}>
                    <span>From</span>
                    {tierPriceLabel(project, t.key)}
                  </span>
                )}
                <span className={styles.selectionMark} aria-hidden="true">
                  {tier === t.key ? "✓" : ""}
                </span>
                <span className={styles.controlLine} aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className={styles.selectionDetail} aria-live="polite" aria-atomic="true">
            <p className={styles.detailName}>{current.name}</p>
            <p className={`small muted ${styles.note}`}>{current.tagline}</p>
          </div>
        </div>
        <p className={styles.visualNote}>
          Illustrative interiors. Layout, materials and furnishing schedules vary by home.
        </p>
      </div>
    </section>
  );
}
