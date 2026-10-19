"use client";

import { useRef } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { comparisonRows, tiers } from "@/lib/data/projects";
import { cx } from "@/lib/cx";
import { RevealText } from "@/components/motion/RevealText";
import styles from "./ComparisonTable.module.css";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

export function ComparisonTable({ id = "compare" }: { id?: string }) {
  const table = useRef<HTMLTableElement>(null);

  useIsomorphicLayoutEffect(() => {
    const t = table.current;
    if (!t) return;
    const mm = gsap.matchMedia();
    mm.add(`${MOTION_OK} and (min-width: 900px)`, () => {
      gsap.fromTo(
        t.querySelectorAll("tbody tr"),
        { autoAlpha: 0, y: 10 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: { trigger: t, start: "top 82%", once: true },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      id={id}
      className={`section--bottom ${styles.compare}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="container">
        <div className={styles.head}>
          <p className="eyebrow">In detail</p>
          <RevealText as="h2" className="h-sub" id={`${id}-heading`}>
            What is included at each tier
          </RevealText>
        </div>

        <div className={styles.mobileComparison}>
          <p className={styles.mobileIntro}>
            Each tier builds on the last. Here’s what is included, and what you gain.
          </p>
          <ol className={styles.tierCards}>
            {tiers.map((tier, index) => (
              <li
                key={tier.key}
                className={cx(styles.tierCard, tier.key === "fully" && styles.fully)}
              >
                <div className={styles.cardHeading}>
                  <span className={styles.cardNumber} aria-hidden="true">{tier.numeral}</span>
                  <h3>{tier.name}</h3>
                </div>
                <p className={styles.cardSummary}>
                  {index === 0
                    ? "The essentials, included in all three tiers."
                    : <>Everything in {tiers[index - 1].name}, plus:</>}
                </p>
                <ul className={styles.cardFeatures}>
                  {comparisonRows
                    .filter(row => row.tiers[index] && (index === 0 || !row.tiers[index - 1]))
                    .map(row => (
                      <li key={row.feature}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="m3 8 3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>{row.feature}</span>
                      </li>
                    ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.wrap}>
          <div className={styles.scroller}>
            <table ref={table} className={styles.table}>
              <thead>
                <tr>
                  <th scope="col" className={styles.feature}>
                    <span className="sr-only">Feature</span>
                  </th>
                  {tiers.map((t) => (
                    <th
                      key={t.key}
                      scope="col"
                      className={cx(
                        styles.tier,
                        t.key === "fully" && styles.fully,
                      )}
                    >
                      <span className={styles.tierNum}>{t.numeral}</span>
                      <span className={styles.tierName}>{t.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.feature}>
                    <th scope="row" className={styles.feature}>
                      {row.feature}
                    </th>
                    {row.tiers.map((included, i) => (
                      <td
                        key={i}
                        className={cx(styles.cell, i === 2 && styles.fully)}
                      >
                        <span
                          className={included ? styles.dot : styles.dash}
                          aria-hidden="true"
                        />
                        <span className="sr-only">
                          {included ? "Included" : "Not included"}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className={`small muted ${styles.note}`}>
          Specifications for each project are listed on its page. Furnishing
          schedules are shared at enquiry.
        </p>
      </div>
    </section>
  );
}
