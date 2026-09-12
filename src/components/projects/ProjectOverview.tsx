import type { Project } from "@/lib/data/projects";
import { RevealText } from "@/components/motion/RevealText";
import styles from "./ProjectOverview.module.css";

export function ProjectOverview({ project }: { project: Project }) {
  const meta: [string, string][] = [
    ["Location", project.location],
    ["Status", project.status],
    ["Total units", `${project.units}`],
    ["Unit types", project.unitTypes],
    ["Plot area", project.plotArea],
    ["Built-up area", project.builtUp],
    ["Completion", project.completion],
  ];

  return (
    <section
      className={`section ${styles.overview}`}
      aria-labelledby="overview-heading"
    >
      <div className={`container ${styles.grid}`}>
        <div className={styles.meta}>
          <p className="eyebrow" id="overview-heading">
            Overview
          </p>
          <dl className={styles.dl}>
            {meta.map(([k, v]) => (
              <div key={k} className={styles.row}>
                <dt className="label muted">{k}</dt>
                <dd className={styles.dd}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={styles.text}>
          <RevealText as="p" className={`lede ${styles.lede}`}>
            {project.overview[0]}
          </RevealText>
          {project.overview.slice(1).map((p, i) => (
            <p key={i} className="body muted measure">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
