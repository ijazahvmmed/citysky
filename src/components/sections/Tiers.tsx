"use client";

import { usePathname } from "next/navigation";
import {
  tiers,
  tierPriceLabel,
  formatPrice,
  projectTierPrice,
  type Project,
  type TierKey,
} from "@/lib/data/projects";
import { whatsappLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/cx";
import { RevealText } from "@/components/motion/RevealText";
import { ArrowLink } from "@/components/ui/ArrowLink";
import styles from "./Tiers.module.css";

const finishSummary: Record<TierKey, string> = {
  unfurnished: "A finished home to furnish your way",
  semi: "Furniture and everyday essentials",
  fully: "Furniture, décor and finishing touches",
};

interface Props {
  /** Project-specific pricing and CTAs; omit on the home page. */
  project?: Project;
  compareHref?: string;
  id?: string;
  showCompare?: boolean;
}

export function Tiers({
  project,
  compareHref = "#compare",
  id = "tiers",
  showCompare = true,
}: Props) {
  const pathname = usePathname();
  const soldOut = project?.soldOut ?? false;
  // Sold-out pages keep this section as an explanation of how homes are
  // delivered, so no prices and no enquiry links for that project.
  const showPrices = Boolean(project) && !soldOut;
  const showEnquiry = Boolean(project) && !soldOut;

  return (
    <section
      id={id}
      className={`section ${styles.tiers}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="container">
        <div className={styles.head}>
          <p className="eyebrow">
            {project
              ? soldOut
                ? `How ${project.name} was delivered`
                : `Three ways to own at ${project.name}`
              : "Three ways to own"}
          </p>
          <RevealText
            as="h2"
            className={`h-section ${styles.title}`}
            id={`${id}-heading`}
          >
            Choose your level of finish.
          </RevealText>
          <p className={`body muted ${styles.lead}`}>
            {soldOut
              ? "Every home we build is offered at three levels of finish. The architecture is the same in each; what changes is how much is decided, sourced and installed before the owner arrives."
              : "The architecture is the same at every tier. What changes is how much is decided, sourced and installed before you arrive."}
          </p>
        </div>

        <div className={styles.columns}>
          {tiers.map((t) => {
            const featured = t.key === "fully";
            const price = project ? tierPriceLabel(project, t.key) : null;
            const currentPrice = project ? projectTierPrice(project, t.key) : null;
            const previousKey = t.key === "fully" ? "semi" : "unfurnished";
            const previousPrice = project && t.key !== "unfurnished"
              ? projectTierPrice(project, previousKey)
              : null;
            const upgradeMin = currentPrice && previousPrice
              ? currentPrice.min - previousPrice.min
              : null;
            const upgradeMax = currentPrice && previousPrice
              ? (currentPrice.max ?? currentPrice.min) - (previousPrice.max ?? previousPrice.min)
              : null;
            const upgrade = upgradeMin !== null && upgradeMax !== null
              ? formatPrice({
                  min: upgradeMin,
                  ...(upgradeMax !== upgradeMin ? { max: upgradeMax } : {}),
                })
              : null;
            return (
              <article
                key={t.key}
                className={cx(styles.col, featured && styles.featured)}
                data-enter
              >
                <div className={styles.cardHeading}>
                  <span className={styles.numeral} aria-hidden="true">
                    {t.numeral}
                  </span>
                  {featured && <span className={styles.valueBadge}>Most complete</span>}
                </div>
                <div className={styles.identity}>
                  <h3 className={styles.name}>{t.name}</h3>
                  <p className={styles.tagline}>{finishSummary[t.key]}</p>
                </div>

                {showPrices && price && (
                  <div className={styles.priceBlock}>
                    <p className={styles.price}>
                      <span className={styles.priceLabel}>
                        {currentPrice?.max === undefined ? "Starting from" : "Price range"}
                      </span>
                      <span className={styles.priceValue}>{price}</span>
                    </p>
                    {upgrade && (
                      <p className={styles.upgrade}>
                        +{upgrade}
                        {" "}over {t.key === "semi" ? "Unfurnished" : "Semi-Furnished"}
                      </p>
                    )}
                  </div>
                )}
                {soldOut && (
                  <p className={styles.price}>
                    <span className={styles.soldOut}>Sold out</span>
                  </p>
                )}

                {featured ? (
                  <div className={styles.valueNote}>
                    <p>Ready to live in, down to the details.</p>
                    <span>
                      Furniture, décor and finishing touches coordinated and
                      installed before handover.
                    </span>
                  </div>
                ) : (
                  <p className={`small muted ${styles.copy}`}>{t.copy}</p>
                )}

                <p className={styles.includesLabel}>
                  {t.key === "unfurnished"
                    ? "Included in every home"
                    : featured
                      ? "The complete finish includes"
                      : "What this adds"}
                </p>
                <ul className={styles.includes}>
                  {t.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                {showEnquiry && project && (
                  <ArrowLink
                    href={whatsappLink({
                      message: `Hi Citysky, I'm interested in ${project.name}, ${t.name}. I'd like to know more.`,
                    })}
                    className={styles.enquire}
                    onClick={() =>
                      track({
                        name: "whatsapp_click",
                        page: pathname,
                        section: `tiers:${t.key}`,
                        project: project.name,
                      })
                    }
                  >
                    Ask about this finish
                  </ArrowLink>
                )}
              </article>
            );
          })}
        </div>

        {showPrices && (
          <p className={`small muted ${styles.upliftNote}`}>
            Each option includes the previous level. Starting prices vary by
            project and home; the final furnishing schedule is shared at enquiry.
          </p>
        )}

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
