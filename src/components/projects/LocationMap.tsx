import type { Project } from "@/lib/data/projects";
import { RevealText } from "@/components/motion/RevealText";
import { ContactLink } from "@/components/contact/ContactLink";
import { whatsappLink } from "@/lib/whatsapp";
import { site } from "@/lib/site";
import styles from "./LocationMap.module.css";

export function LocationMap({ project }: { project: Project }) {
  const query = encodeURIComponent(project.mapQuery);
  const src = `https://maps.google.com/maps?q=${query}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
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
          <p className={styles.description}>
            Explore the neighbourhood, then ask us for the entrance pin and
            current driving routes before your visit.
          </p>
          <div className={styles.visit}>
            <h3>Plan your visit</h3>
            <p>
              For routes to LuLu Mall, Infopark or the airport, we can help you
              start from the right entrance.
            </p>
            <ContactLink
              channel="whatsapp"
              section="project_location"
              className={styles.pinLink}
              href={whatsappLink({
                message: `Hi Citysky, please share the exact entrance pin for ${project.name} and the current driving routes to LuLu Mall, Infopark and Cochin International Airport.`,
              })}
              target="_blank"
              rel="noopener noreferrer"
            >
              Request entrance pin <span aria-hidden="true">↗</span>
            </ContactLink>
            <a
              className={styles.mapLink}
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <figure className={styles.map}>
          <div className={styles.mapFrame}>
            <iframe
              src={src}
              title={`Neighbourhood map of ${project.location}; not the project entrance`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <figcaption>Area map · request the exact entrance pin before visiting.</figcaption>
        </figure>
      </div>
    </section>
  );
}
