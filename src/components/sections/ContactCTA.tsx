"use client";

import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { RevealText } from "@/components/motion/RevealText";
import { Arrow } from "@/components/ui/Arrow";
import styles from "./ContactCTA.module.css";

interface Props {
  project?: string;
  headline?: string;
  copy?: string;
  section?: string;
}

export function ContactCTA({
  project,
  headline,
  copy,
  section = "cta",
}: Props) {
  const pathname = usePathname();
  const heading =
    headline ??
    (project
      ? `Ask us about ${project}.`
      : "Tell us about the home you have in mind.");
  const body =
    copy ??
    (project
      ? "A message on WhatsApp reaches the team directly. We reply the same working day, and can arrange a site walk within the week."
      : "A message on WhatsApp reaches the team directly. We reply the same working day, and can arrange a site walk within the week.");

  return (
    <section
      className={`dark section ${styles.cta}`}
      aria-labelledby="cta-heading"
    >
      <div className="container">
        <p className="eyebrow">{project ? "Enquire" : "Get in touch"}</p>
        <RevealText
          as="h2"
          className={`display ${styles.headline}`}
          id="cta-heading"
        >
          {heading}
        </RevealText>

        <div className={styles.row}>
          <p className={`body ${styles.copy}`}>{body}</p>
          <div className={styles.actions}>
            <a
              href={whatsappLink({ project })}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--solid"
              onClick={() =>
                track({
                  name: "whatsapp_click",
                  page: pathname,
                  section,
                  project,
                })
              }
            >
              WhatsApp
              <Arrow direction="up-right" />
            </a>
            <a
              href={site.phoneHref}
              className={styles.phone}
              onClick={() =>
                track({ name: "phone_click", page: pathname, section, project })
              }
            >
              <span className="label muted">Or call</span>
              <span className={styles.phoneNumber}>{site.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
