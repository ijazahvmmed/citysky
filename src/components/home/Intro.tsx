import { RevealText } from "@/components/motion/RevealText";
import { ArrowLink } from "@/components/ui/ArrowLink";
import styles from "./Intro.module.css";

export function Intro() {
  return (
    <section className={styles.intro} aria-labelledby="intro-heading">
      <div className={`container ${styles.grid}`}>
        <div className={styles.label}>
          <p className="eyebrow" id="intro-heading">
            The practice
          </p>
        </div>
        <div className={styles.text}>
          <RevealText as="p" className={`lede ${styles.lede}`}>
            Citysky is a small practice in Kochi that designs and builds its own
            homes. We take on a few projects at a time, in neighbourhoods we
            know well, and stay with each one from the first site walk to the
            day the furniture arrives.
          </RevealText>
          <div className={styles.meta}>
            <p className="body muted measure">
              Two completed projects in Nettoor and Vaduthala, one under
              construction, one on the drawing board. Every home is offered
              unfurnished, semi-furnished, or complete, with interiors drawn by
              the same hands that drew the house.
            </p>
            <ArrowLink href="/about">About the studio</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
