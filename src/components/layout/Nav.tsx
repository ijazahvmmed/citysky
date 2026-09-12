"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { useNavTheme } from "./NavTheme";
import { TransitionLink } from "./TransitionLink";
import styles from "./Nav.module.css";

const cx = (...c: Array<string | false | undefined>) =>
  c.filter(Boolean).join(" ");

export function Nav() {
  const { inverse } = useNavTheme();
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  // Menu is "open" only for the pathname it was opened on, so a route change closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (v: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof v === "function" ? v(open) : v;
    setOpenOn(next ? pathname : null);
  };

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setSolid(y > 24);
        setHidden(y > last && y > 160);
        last = y;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenOn(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cx(
        styles.nav,
        hidden && !open && styles.hidden,
        solid && !open && styles.solid,
        inverse && !solid && !open && styles.inverse,
        open && styles.open,
      )}
    >
      <div className={`container ${styles.inner}`}>
        <TransitionLink
          href="/"
          className={styles.logo}
          aria-label="Citysky Builders, home"
        >
          <span className={styles.wordmark}>Citysky</span>{" "}
          <span className={styles.wordmarkSub}>Builders</span>
        </TransitionLink>

        <nav className={styles.links} aria-label="Primary">
          {site.nav.map((l) => (
            <TransitionLink
              key={l.href}
              href={l.href}
              className={cx(styles.link, isActive(l.href) && styles.active)}
              aria-current={isActive(l.href) ? "page" : undefined}
            >
              {l.label}
            </TransitionLink>
          ))}
        </nav>

        <div className={styles.right}>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cta}
            onClick={() =>
              track({ name: "whatsapp_click", page: pathname, section: "nav" })
            }
          >
            Enquire
            <span className={styles.ctaDot} aria-hidden />
          </a>
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div id="site-menu" className={styles.menu} hidden={!open}>
        <nav className={styles.menuLinks} aria-label="Mobile">
          {[{ label: "Home", href: "/" }, ...site.nav].map((l, i) => (
            <TransitionLink
              key={l.href}
              href={l.href}
              className={styles.menuLink}
            >
              <span className={styles.menuIndex}>0{i + 1}</span>
              <span className={styles.menuLabel}>{l.label}</span>
            </TransitionLink>
          ))}
        </nav>
        <div className={styles.menuFoot}>
          <div>
            <p className="label muted">Call</p>
            <a href={site.phoneHref} className={styles.menuContact}>
              {site.phone}
            </a>
          </div>
          <div>
            <p className="label muted">WhatsApp</p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.menuContact}
              onClick={() =>
                track({
                  name: "whatsapp_click",
                  page: pathname,
                  section: "menu",
                })
              }
            >
              Start a conversation
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
