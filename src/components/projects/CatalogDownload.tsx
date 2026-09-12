"use client";

import type { Project } from "@/lib/data/projects";
import { catalogRequestLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { RevealText } from "@/components/motion/RevealText";
import { Arrow } from "@/components/ui/Arrow";
import styles from "./CatalogDownload.module.css";

export function CatalogDownload({ project }: { project: Project }) {
  // A sold-out project with no PDF would only offer a WhatsApp request, which
  // is an enquiry CTA for a home that is no longer available. Hide it instead.
  if (project.soldOut && !project.catalogUrl) return null;

  return (
    <section
      className={`section ${styles.catalog}`}
      aria-labelledby="catalog-heading"
    >
      <div className={`container ${styles.grid}`}>
        <div>
          <p className="eyebrow">Catalogue</p>
          <RevealText
            as="h2"
            className={`h-section ${styles.title}`}
            id="catalog-heading"
          >
            Take the details with you.
          </RevealText>
        </div>
        <div className={styles.action}>
          <p className="body muted measure">
            {project.soldOut
              ? `Plans, specifications and the furnishing schedule for ${project.name}, kept as a record of how it was built.`
              : `Plans, specifications, tier pricing and the furnishing schedule for ${project.name}, in one document.`}
          </p>
          {project.catalogUrl ? (
            <a
              href={project.catalogUrl}
              download
              className={`arrow-link arrow-link--lg ${styles.link}`}
              onClick={() =>
                track({ name: "catalog_download", project: project.name })
              }
            >
              <span>Download the catalogue</span>
              <Arrow direction="down" />
            </a>
          ) : (
            <a
              href={catalogRequestLink(project.name)}
              target="_blank"
              rel="noopener noreferrer"
              className={`arrow-link arrow-link--lg ${styles.link}`}
              onClick={() =>
                track({ name: "catalog_request", project: project.name })
              }
            >
              <span>Request the catalogue</span>
              <Arrow direction="up-right" />
            </a>
          )}
          <p className={`label muted ${styles.meta}`}>
            {project.catalogUrl
              ? "PDF · updated quarterly"
              : "Sent over WhatsApp, usually within the hour"}
          </p>
        </div>
      </div>
    </section>
  );
}
