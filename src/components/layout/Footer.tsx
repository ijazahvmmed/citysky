"use client";

import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { TransitionLink } from "./TransitionLink";
import styles from "./Footer.module.css";

export function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  return (
    <footer className={`dark ${styles.footer}`}>
      <div className="container">
        <p className={styles.wordmark} aria-hidden="true">
          Citysky
        </p>

        <div className={styles.grid}>
          <div className={styles.col}>
            <p className="label muted">Navigate</p>
            <ul className={styles.list}>
              {[{ label: "Home", href: "/" }, ...site.nav].map((l) => (
                <li key={l.href}>
                  <TransitionLink href={l.href} className="u-line">
                    {l.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <p className="label muted">Contact</p>
            <ul className={styles.list}>
              <li>
                <a href={site.phoneHref} className="u-line">
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="u-line"
                  onClick={() =>
                    track({
                      name: "whatsapp_click",
                      page: pathname,
                      section: "footer",
                    })
                  }
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="u-line">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={`https://${site.domain}`} className="u-line">
                  {site.domain}
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.col}>
            <p className="label muted">Studio</p>
            <address className={styles.address}>
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              {site.address.line3}
            </address>
            <p className={`small muted ${styles.hours}`}>{site.hours}</p>
          </div>

          <div className={styles.col}>
            <p className="label muted">Follow</p>
            <ul className={styles.list}>
              {site.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="u-line"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className="label muted">RERA {site.rera}</p>
          <p className="label muted">
            © {year} {site.name}. Kochi, Kerala.
          </p>
        </div>
      </div>
    </footer>
  );
}
