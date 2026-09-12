"use client";

import type { MouseEvent, ReactNode } from "react";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { Arrow } from "./Arrow";
import { cx } from "@/lib/cx";

interface Props {
  href: string;
  children: ReactNode;
  className?: string;
  size?: "md" | "lg";
  direction?: "right" | "down" | "up-right";
  external?: boolean;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  cursor?: string;
}

export function ArrowLink({
  href,
  children,
  className,
  size = "md",
  direction = "right",
  external,
  onClick,
  cursor,
}: Props) {
  const cls = cx("arrow-link", size === "lg" && "arrow-link--lg", className);
  const isExternal = external || /^(https?:|tel:|mailto:)/.test(href);

  if (isExternal || href.startsWith("#")) {
    return (
      <a
        href={href}
        className={cls}
        onClick={onClick}
        target={
          isExternal && !href.startsWith("tel:") && !href.startsWith("mailto:")
            ? "_blank"
            : undefined
        }
        rel={isExternal ? "noopener noreferrer" : undefined}
        data-cursor={cursor}
      >
        <span>{children}</span>
        <Arrow direction={direction} />
      </a>
    );
  }

  return (
    <TransitionLink
      href={href}
      className={cls}
      onClick={onClick}
      data-cursor={cursor}
    >
      <span>{children}</span>
      <Arrow direction={direction} />
    </TransitionLink>
  );
}
