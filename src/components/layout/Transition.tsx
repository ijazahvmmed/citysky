"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import styles from "./Transition.module.css";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

interface TransitionCtx {
  navigate: (href: string) => void;
}

const Ctx = createContext<TransitionCtx>({ navigate: () => {} });

/**
 * Remove every inline transform-ish property GSAP leaves on the page wrapper.
 * A transform on this element makes it the containing block for fixed-position
 * descendants, which breaks ScrollTrigger pinning inside the page.
 */
function clearWrapper(el: HTMLElement | null) {
  if (!el) return;
  gsap.set(el, {
    clearProps: "transform,translate,rotate,scale,opacity,willChange",
  });
}

export const usePageTransition = () => useContext(Ctx);

/**
 * Route transitions: a solid panel wipes up over the page while content
 * fades, the router pushes, then the panel wipes away and the new page
 * staggers in. ~0.8s total. Under reduced motion it's a plain push.
 *
 * `chrome` renders inside the provider (so it can call navigate) but outside
 * the animated wrapper, so the fixed nav does not fade with the page.
 */
export function TransitionProvider({
  children,
  chrome,
}: {
  children: ReactNode;
  chrome?: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);
  const busy = useRef(false);

  const navigate = useCallback(
    (href: string) => {
      if (busy.current) return;
      if (href === pathname) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (prefersReducedMotion() || !panel.current || !page.current) {
        router.push(href);
        return;
      }
      busy.current = true;
      pending.current = href;
      const tl = gsap.timeline({ onComplete: () => router.push(href) });
      tl.to(
        page.current,
        { opacity: 0, duration: 0.35, ease: "power2.in" },
        0,
      );
      tl.fromTo(
        panel.current,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.45, ease: "power3.inOut" },
        0.05,
      );
      // safety: never leave the page covered
      gsap.delayedCall(4, () => {
        if (busy.current && pending.current === href) {
          busy.current = false;
          pending.current = null;
          gsap.set(panel.current, { yPercent: 100 });
          clearWrapper(page.current);
        }
      });
    },
    [pathname, router],
  );

  useIsomorphicLayoutEffect(() => {
    const p = panel.current;
    const m = page.current;
    if (!pending.current || !p || !m) {
      busy.current = false;
      return;
    }
    pending.current = null;
    window.scrollTo({ top: 0, behavior: "instant" });

    const tl = gsap.timeline({
      onComplete: () => {
        busy.current = false;
        gsap.set(p, { yPercent: 100 });
        // Drop the wrapper's inline transform BEFORE refreshing: any transform
        // here is a containing block, which silently breaks ScrollTrigger's
        // position:fixed pinning (the pinned section scrolls away and leaves
        // the pin-spacer as blank space).
        clearWrapper(m);
        ScrollTrigger.refresh();
      },
    });
    // A transformed page wrapper becomes the containing block for fixed
    // descendants, so keep the wrapper fade-only throughout the transition.
    tl.set(m, { opacity: 1 });
    tl.to(p, { yPercent: -100, duration: 0.4, ease: "power3.inOut" }, 0.05);
    const items = m.querySelectorAll<HTMLElement>("[data-enter]");
    if (items.length) {
      tl.from(
        items,
        { y: 28, opacity: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" },
        0.15,
      );
    }
  }, [pathname]);

  return (
    <Ctx.Provider value={{ navigate }}>
      {chrome}
      <div ref={page} className={styles.page}>
        {children}
      </div>
      <div ref={panel} className={styles.panel} aria-hidden="true" />
    </Ctx.Provider>
  );
}
