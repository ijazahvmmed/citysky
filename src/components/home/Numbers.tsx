import { stats } from "@/lib/data/projects";
import { Counter } from "@/components/motion/Counter";
import styles from "./Numbers.module.css";

export function Numbers() {
  return (
    <section
      className={`section ${styles.numbers}`}
      aria-label="Citysky in numbers"
    >
      <div className="container">
        <div className={styles.row}>
          {stats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <Counter value={s.value} className={styles.value} />
              <span className="label muted">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
