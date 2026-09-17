"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import styles from "./FloatingContact.module.css";

function ContactIcon({ phone = false }: { phone?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {phone ? <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a15 15 0 0 1-7-7l2-2-2-5Z" /> : <><path d="M21 11.5a9 9 0 0 1-13.5 7.8L3 21l1.7-4.5A9 9 0 1 1 21 11.5Z" /><path d="M8 7.5c0 4.7 3.8 8.5 8.5 8.5l.5-2-2.5-1-1 1a8 8 0 0 1-3.5-3.5l1-1-1-2.5-2 .5Z" /></>}
  </svg>;
}

export function FloatingContact() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const panel = dialog.current;
    const previous = document.body.style.overflow;
    panel?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      panel?.close();
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => { dialog.current?.close(); }, [pathname]);

  return <>
    <button ref={trigger} className={styles.trigger} type="button" aria-label="Contact Citysky by WhatsApp or phone" aria-haspopup="dialog" aria-expanded={open} aria-controls="quick-contact" onClick={() => setOpen(true)}>
      <ContactIcon /><span className={styles.divider} /><ContactIcon phone />
    </button>
    <dialog ref={dialog} id="quick-contact" className={styles.panel} aria-labelledby="quick-contact-title" onClose={() => { setOpen(false); trigger.current?.focus(); }} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.currentTarget.close();
    }}>
      <button className={styles.close} type="button" aria-label="Close contact panel" onClick={() => dialog.current?.close()}>×</button>
      <p className={styles.eyebrow}>CITYSKY BUILDERS</p>
      <h2 id="quick-contact-title">Let’s talk about home.</h2>
      <p className={styles.intro}>A question, a detail, or a visit. We’re here.</p>
      <a className={styles.action} href={whatsappLink()} target="_blank" rel="noopener noreferrer" onClick={() => { track({ name: "whatsapp_click", page: pathname, section: "floating-contact" }); dialog.current?.close(); }}>
        <ContactIcon /><span>WhatsApp<small>Start a conversation</small></span><span aria-hidden="true">↗</span>
      </a>
      <a className={styles.action} href={site.phoneHref} onClick={() => { track({ name: "phone_click", page: pathname, section: "floating-contact" }); dialog.current?.close(); }}>
        <ContactIcon phone /><span>Call us<small>{site.phone}</small></span><span aria-hidden="true">↗</span>
      </a>
      <p className={styles.hours}>{site.hours}</p>
    </dialog>
  </>;
}
