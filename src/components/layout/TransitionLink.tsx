"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { usePageTransition } from "./Transition";

type Props = ComponentProps<typeof Link> & { href: string };

/** next/link that routes through the page-transition wipe. */
export function TransitionLink({ href, onClick, children, ...rest }: Props) {
  const { navigate } = usePageTransition();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
      return;
    if (rest.target === "_blank") return;
    if (!href.startsWith("/") || href.startsWith("/#")) return;
    e.preventDefault();
    navigate(href);
  };

  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
