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
            Citysky has been building in Kochi for ten years. Six projects
            across the city and Ernakulam, from a pair of houses on eleven cents
            to fourteen homes around a courtyard.
          </RevealText>
          <div className={styles.meta}>
            <p className="body muted measure">
              Every home is offered in three states of completion, so you can
              decide how much of the finishing you want to take on yourself. The
              interiors are drawn by the same people who drew the building,
              which is the only way we have found to make them agree.
            </p>
            <ArrowLink href="/about">About the studio</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
