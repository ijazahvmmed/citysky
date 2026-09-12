"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { tiers, type Project, type TierKey } from "@/lib/data/projects";
import { imageBlur, imageSrc } from "@/lib/images";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/cx";
import { RevealText } from "@/components/motion/RevealText";
import styles from "./TierSwitcher.module.css";

const order: TierKey[] = ["unfurnished", "semi", "fully"];

/**
 * The same room in three states. Crossfade 400ms, default Fully Furnished,
 * all three images eager-loaded, swipeable on touch.
 */
export function TierSwitcher({ project }: { project: Project }) {
  const [tier, setTier] = useState<TierKey>("fully");
  const touchX = useRef<number | null>(null);

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
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 40) return;
    step(dx < 0 ? 1 : -1);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  const current = tiers.find((t) => t.key === tier)!;

  return (
    <section
      className={`section ${styles.switcher}`}
      aria-labelledby="switcher-heading"
    >
      <div className="container">
        <div className={styles.head}>
          <p className="eyebrow">See the difference</p>
          <RevealText
            as="h2"
            className={`h-section ${styles.title}`}
            id="switcher-heading"
          >
            The same room, three ways.
          </RevealText>
          <p className={`body muted ${styles.lead}`}>
            Select a tier to see how the living room at {project.name} arrives
            on handover day. Swipe on a phone.
          </p>
        </div>

        <div
          className={styles.stage}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          data-cursor="Drag"
        >
          {order.map((k) => {
            const image = project.tierImages[k];
            const on = k === tier;
            return (
              <div
                key={k}
                className={cx(styles.layer, on && styles.layerOn)}
                aria-hidden={!on}
              >
                <Image
                  src={imageSrc(image, 2000)}
                  alt={image.alt}
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
            <span className={styles.stagePrice}>{project.pricing[tier]}</span>
          </div>
        </div>

        <div
          className={styles.controls}
          role="group"
          aria-label="Select tier"
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
              <span className={styles.controlName}>{t.name}</span>
              <span className={styles.controlLine} aria-hidden="true" />
            </button>
          ))}
        </div>

        <p className={`small muted ${styles.note}`}>{current.tagline}</p>
      </div>
    </section>
  );
}
