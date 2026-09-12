import { RevealText } from "@/components/motion/RevealText";
import styles from "./Specs.module.css";

export function Specs({
  specs,
}: {
  specs: { category: string; items: string[] }[];
}) {
  return (
    <section
      className={`section ${styles.specs}`}
      aria-labelledby="specs-heading"
    >
      <div className={`container ${styles.grid}`}>
        <div className={styles.intro}>
          <p className="eyebrow">Features and specifications</p>
          <RevealText
            as="h2"
            className={`h-section ${styles.title}`}
            id="specs-heading"
          >
            What the house is made of.
          </RevealText>
          <p className="body muted measure">
            Brands named here are the specified standard. Equivalents are agreed
            in writing before substitution.
          </p>
        </div>

        <div className={styles.list}>
          {specs.map((s, i) => (
            <details key={s.category} className={styles.group} open={i === 0}>
              <summary className={styles.summary}>
                <span className={styles.summaryIndex}>0{i + 1}</span>
                <span className={styles.summaryTitle}>{s.category}</span>
                <span className={styles.marker} aria-hidden="true" />
              </summary>
              <ul className={styles.items}>
                {s.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
