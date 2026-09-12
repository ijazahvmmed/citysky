"use client";

import { usePathname } from "next/navigation";
import {
  tiers,
  tierPriceLabel,
  TIER_UPLIFT,
  type Project,
} from "@/lib/data/projects";
import { whatsappLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/cx";
import { RevealText } from "@/components/motion/RevealText";
import { ArrowLink } from "@/components/ui/ArrowLink";
import styles from "./Tiers.module.css";

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
  const showEnquiry = showPrices;

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
            Every home, finished to the degree you choose.
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

                {showPrices && price && (
                  <p className={styles.price}>
                    <span className="label muted">
                      {project?.basePrice.max === undefined ? "From" : "Range"}
                    </span>
                    <span className={styles.priceValue}>{price}</span>
                  </p>
                )}
                {soldOut && (
                  <p className={styles.price}>
                    <span className={styles.soldOut}>Sold out</span>
                  </p>
                )}

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
                    Enquire, {t.name}
                  </ArrowLink>
                )}
              </article>
            );
          })}
        </div>

        {showPrices && (
          <p className={`small muted ${styles.upliftNote}`}>
            Semi-Furnished adds ₹{TIER_UPLIFT.semi} Lakhs to the unfurnished
            price; Fully Furnished adds ₹{TIER_UPLIFT.fully} Lakhs.
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
