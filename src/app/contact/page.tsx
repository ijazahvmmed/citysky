import type { Metadata } from "next";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import { RevealText } from "@/components/motion/RevealText";
import { ContactForm } from "@/components/contact/ContactForm";
import styles from "./Contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Citysky Builders about a home in Nettoor or Vaduthala, Kochi. WhatsApp, phone, email, or visit the studio.",
};

export default function ContactPage() {
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent("Vaduthala, Kochi, Kerala")}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <section className={styles.contact} aria-labelledby="contact-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.left}>
          <p className="eyebrow">Contact</p>
          <RevealText
            as="h1"
            className={`display ${styles.title}`}
            immediate
            delay={0.2}
            id="contact-title"
          >
            Come and talk to us.
          </RevealText>
          <p className={`body muted ${styles.lead}`} data-enter>
            The quickest route is WhatsApp. We reply the same working day and
            can usually arrange a site walk within the week.
          </p>

          <dl className={styles.details} data-enter>
            <div className={styles.detail}>
              <dt className="label muted">WhatsApp</dt>
              <dd>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`u-line ${styles.big}`}
                >
                  {site.phone}
                </a>
              </dd>
            </div>
            <div className={styles.detail}>
              <dt className="label muted">Call</dt>
              <dd>
                <a href={site.phoneHref} className={`u-line ${styles.big}`}>
                  {site.phone}
                </a>
              </dd>
            </div>
            <div className={styles.detail}>
              <dt className="label muted">Email</dt>
              <dd>
                <a href={`mailto:${site.email}`} className="u-line">
                  {site.email}
                </a>
              </dd>
            </div>
            <div className={styles.detail}>
              <dt className="label muted">Studio</dt>
              <dd>
                <address className={styles.address}>
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                  <br />
                  {site.address.line3}
                </address>
              </dd>
            </div>
            <div className={styles.detail}>
              <dt className="label muted">Hours</dt>
              <dd>{site.hours}</dd>
            </div>
          </dl>

          <div className={styles.map} data-enter>
            <iframe
              src={mapSrc}
              title="Map of the Citysky studio, Vaduthala"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className={styles.right}>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
