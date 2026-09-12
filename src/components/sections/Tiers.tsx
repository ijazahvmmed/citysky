"use client";

import { usePathname } from "next/navigation";
import { tiers, type TierKey } from "@/lib/data/projects";
import { whatsappLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/cx";
import { RevealText } from "@/components/motion/RevealText";
import { ArrowLink } from "@/components/ui/ArrowLink";
import styles from "./Tiers.module.css";

interface Props {
  /** project-specific pricing; omit on the home page */
  pricing?: Record<TierKey, string>;
  project?: string;
  compareHref?: string;
  id?: string;
  showCompare?: boolean;
}

export function Tiers({
  pricing,
  project,
  compareHref = "#compare",
  id = "tiers",
  showCompare = true,
}: Props) {
  const pathname = usePathname();

  return (
    <section
      id={id}
      className={`section ${styles.tiers}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="container">
        <div className={styles.head}>
          <p className="eyebrow">
            {project ? `Three ways to own at ${project}` : "Three ways to own"}
          </p>
          <RevealText
            as="h2"
            className={`h-section ${styles.title}`}
            id={`${id}-heading`}
          >
            Every home, finished to the degree you choose.
          </RevealText>
          <p className={`body muted ${styles.lead}`}>
            The architecture is the same at every tier. What changes is how much
            is decided, sourced and installed before you arrive.
          </p>
        </div>

        <div className={styles.columns}>
          {tiers.map((t) => {
            const featured = t.key === "fully";
            return (
              <article
                key={t.key}
                className={cx(styles.col, featured && styles.featured)}
                data-enter
              >
                {featured && <span className={styles.most}>Most chosen</span>}
                <span className={styles.numeral} aria-hidden="true">
                  {t.numeral}
                </span>
                <h3 className={styles.name}>{t.name}</h3>
                <p className={styles.tagline}>{t.tagline}</p>
                <p className={`small muted ${styles.copy}`}>{t.copy}</p>
                {pricing && (
                  <p className={styles.price}>
                    <span className="label muted">From</span>
                    <span className={styles.priceValue}>{pricing[t.key]}</span>
                  </p>
                )}
                <ul className={styles.includes}>
                  {t.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {project && (
                  <ArrowLink
                    href={whatsappLink({
                      message: `Hi Citysky, I'm interested in ${project}, ${t.name}. I'd like to know more.`,
                    })}
                    className={styles.enquire}
                    onClick={() =>
                      track({
                        name: "whatsapp_click",
                        page: pathname,
                        section: `tiers:${t.key}`,
                        project,
                      })
                    }
                  >
                    Enquire, {t.name}
                  </ArrowLink>
                )}
              </article>
            );
          })}
        </div>

        {showCompare && (
          <div className={styles.foot}>
            <ArrowLink href={compareHref} size="lg" direction="down">
              Compare in detail
            </ArrowLink>
          </div>
        )}
      </div>
    </section>
  );
}
