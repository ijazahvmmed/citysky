import type { Project } from "@/lib/data/projects";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { RevealImage } from "@/components/motion/RevealImage";
import { Arrow } from "@/components/ui/Arrow";
import styles from "./NextProject.module.css";

export function NextProject({ project }: { project: Project }) {
  return (
    <section className={styles.next} aria-label="Next project">
      <TransitionLink
        href={`/projects/${project.slug}`}
        className={styles.link}
        data-cursor="View"
      >
        <div className={`container ${styles.grid}`}>
          <div className={styles.text}>
            <p className="eyebrow">Next project</p>
            <h2 className={`h-section ${styles.name}`}>{project.name}</h2>
            <p className={`small muted ${styles.meta}`}>
              {project.location} · {project.status}
            </p>
            <span className={`arrow-link ${styles.cta}`}>
              <span>View project</span>
              <Arrow />
            </span>
          </div>
          <RevealImage
            image={project.portrait}
            className={styles.image}
            sizes="(min-width: 900px) 36vw, 100vw"
            width={1200}
          />
        </div>
      </TransitionLink>
    </section>
  );
}
