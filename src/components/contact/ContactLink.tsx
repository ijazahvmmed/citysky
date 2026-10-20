"use client";

import type { ComponentProps } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

type Props = ComponentProps<"a"> & {
  channel: "phone" | "email" | "whatsapp";
  section: string;
};

export function ContactLink({ channel, section, onClick, ...props }: Props) {
  const pathname = usePathname();
  return <a {...props} onClick={event => {
    onClick?.(event);
    if (!event.defaultPrevented) {
      track({ name: `${channel}_click`, page: pathname, section });
    }
  }} />;
}
