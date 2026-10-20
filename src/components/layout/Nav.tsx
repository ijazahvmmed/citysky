"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import Image from "next/image";
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
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [menuState, setMenuState] = useState({ pathname, open: false });
  // Reset the stored state as well as the visible state, so browser Back
  // cannot reopen a menu that belonged to a previous route.
  if (menuState.pathname !== pathname) {
    setMenuState({ pathname, open: false });
  }
  const open = menuState.pathname === pathname && menuState.open;
  const closeMenu = (restoreFocus = true) => {
    setMenuState({ pathname, open: false });
    if (restoreFocus) toggle.current?.focus({ preventScroll: true });
  };
  const onMenuNavigate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!open) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    // Close before the page-transition animation, including current-page links.
    closeMenu(new URL(event.currentTarget.href).pathname === pathname);
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
    if (!open) return;
    const previousOverflow = document.documentElement.style.overflow;
    const background = Array.from(document.body.children)
      .filter((el): el is HTMLElement => el instanceof HTMLElement && !el.contains(header.current))
      .map(el => ({ el, inert: el.inert }));
    background.forEach(({ el }) => { el.inert = true; });
    document.documentElement.style.overflow = "hidden";
    menu.current?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      background.forEach(({ el, inert }) => { el.inert = inert; });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMenuState({ pathname, open: false });
        toggle.current?.focus({ preventScroll: true });
      }
      if (e.key !== "Tab") return;
      const focusable = Array.from(
        header.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
      ).filter(el => el.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 900px)");
    const onResize = () => {
      if (desktop.matches) setMenuState({ pathname, open: false });
    };
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open, pathname]);

  useIsomorphicLayoutEffect(() => {
    if (!open || !menu.current) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        menu.current!.querySelectorAll("[data-menu-text]"),
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.045, ease: "power3.out", clearProps: "transform,opacity" },
      );
    });
    return () => mm.revert();
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      ref={header}
      role={open ? "dialog" : undefined}
      aria-modal={open ? true : undefined}
      aria-label={open ? "Main menu" : undefined}
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
          onClick={onMenuNavigate}
        >
          <Image
            src="/images/logo.png"
            alt="Citysky Builders"
            width={154}
            height={32}
            className={styles.logoImg}
            priority
          />
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
            ref={toggle}
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => open ? closeMenu() : setMenuState({ pathname, open: true })}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div ref={menu} id="site-menu" className={styles.menu} hidden={!open}>
        <nav className={styles.menuLinks} aria-label="Mobile">
          {[{ label: "Home", href: "/" }, ...site.nav].map((l, i) => (
            <TransitionLink
              key={l.href}
              href={l.href}
              className={styles.menuLink}
              aria-current={isActive(l.href) ? "page" : undefined}
              onClick={onMenuNavigate}
            >
              <span className={styles.menuIndex}>0{i + 1}</span>
              <span className={styles.menuLabel} data-menu-text>{l.label}</span>
            </TransitionLink>
          ))}
        </nav>
        <div className={styles.menuFoot} data-menu-text>
          <div>
            <p className="label muted">Call</p>
            <a
              href={site.phoneHref}
              className={styles.menuContact}
              onClick={() => track({ name: "phone_click", page: pathname, section: "menu" })}
            >
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
