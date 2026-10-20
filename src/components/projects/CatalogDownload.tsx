"use client";

import type { Project } from "@/lib/data/projects";
import { catalogRequestLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { RevealText } from "@/components/motion/RevealText";
import { Arrow } from "@/components/ui/Arrow";
import catalogueData from "@/lib/data/catalogues.json";
import styles from "./CatalogDownload.module.css";

export function CatalogDownload({ project }: { project: Project }) {
  // A sold-out project with no PDF would only offer a WhatsApp request, which
  // is an enquiry CTA for a home that is no longer available. Hide it instead.
  if (project.soldOut && !project.catalogUrl) return null;
  const catalogue = catalogueData[project.slug as keyof typeof catalogueData];

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
              ? `Explore ${project.name} through the project overview, image collection and key details, kept together as a project record.`
              : `Explore ${project.name}, compare the three finish options and starting prices, and take the image collection and key details with you.`}
          </p>
          {project.catalogUrl ? (
            <div className={styles.links}>
              <a
                href={project.catalogUrl}
                download
                className={`arrow-link arrow-link--lg ${styles.link}`}
                onClick={() =>
                  track({ name: "catalog_download", project: project.name })
                }
              >
                <span>Download catalogue</span>
                <Arrow direction="down" />
              </a>
              <a
                href={project.catalogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.preview}
                aria-label={`View ${project.name} catalogue PDF in a new tab`}
              >
                View PDF <span aria-hidden="true">↗</span>
              </a>
            </div>
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
              ? catalogue
                ? `PDF · ${catalogue.pages} pages · ${(catalogue.bytes / 1_000_000).toFixed(1)} MB`
                : "PDF · Project catalogue"
              : "Request the latest details over WhatsApp"}
          </p>
        </div>
      </div>
    </section>
  );
}
