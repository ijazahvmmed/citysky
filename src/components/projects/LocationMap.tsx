import type { Project } from "@/lib/data/projects";
import { RevealText } from "@/components/motion/RevealText";
import styles from "./LocationMap.module.css";

export function LocationMap({ project }: { project: Project }) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(project.mapQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  return (
    <section
      className={`section ${styles.location}`}
      aria-labelledby="location-heading"
    >
      <div className={`container ${styles.grid}`}>
        <div className={styles.text}>
          <p className="eyebrow">Location</p>
          <RevealText
            as="h2"
            className={`h-section ${styles.title}`}
            id="location-heading"
          >
            {project.location}
          </RevealText>
          <ul className={styles.distances}>
            {project.distances.map((d) => (
              <li key={d.place} className={styles.distance}>
                <span>{d.place}</span>
                <span className={styles.km}>{d.distance}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.map}>
          <iframe
            src={src}
            title={`Map of ${project.location}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
