"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import { projects } from "@/lib/data/projects";

const available = projects.filter((p) => !p.soldOut);
import { whatsappLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { Arrow } from "@/components/ui/Arrow";
import styles from "./ContactForm.module.css";

interface Fields {
  name: string;
  phone: string;
  email: string;
  project: string;
  message: string;
}

const empty: Fields = {
  name: "",
  phone: "",
  email: "",
  project: "General enquiry",
  message: "",
};

function compose(f: Fields) {
  const lines = [
    `Hi Citysky, I'm ${f.name.trim()}.`,
    f.project === "General enquiry"
      ? "I'd like to know more about your homes in Kochi."
      : `I'm interested in ${f.project}. I'd like to know more.`,
    f.message.trim() ? `\n${f.message.trim()}` : "",
    `\nPhone: ${f.phone.trim()}${f.email.trim() ? `\nEmail: ${f.email.trim()}` : ""}`,
  ];
  return lines.filter(Boolean).join("\n");
}

/**
 * Enquiry form. Primary path opens WhatsApp with the composed message;
 * email (mailto) is the fallback shown alongside.
 */
export function ContactForm() {
  const [fields, setFields] = useState<Fields>(empty);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (k: keyof Fields) => (e: { target: { value: string } }) =>
    setFields((f) => ({ ...f, [k]: e.target.value }));

  const message = compose(fields);
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
    `Enquiry: ${fields.project}`,
  )}&body=${encodeURIComponent(message)}`;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!fields.name.trim() || !fields.phone.trim()) {
      setError("A name and a phone number are all we need to reply.");
      return;
    }
    setError(null);
    track({
      name: "enquiry_submit",
      project: fields.project,
      channel: "whatsapp",
    });
    window.open(whatsappLink({ message }), "_blank", "noopener");
    setSent(true);
  };

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <p className="eyebrow">Enquiry</p>

      <div className={styles.field}>
        <label htmlFor="f-name" className={styles.label}>
          Name
        </label>
        <input
          id="f-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className={styles.input}
          value={fields.name}
          onChange={update("name")}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="f-phone" className={styles.label}>
            Phone
          </label>
          <input
            id="f-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            className={styles.input}
            value={fields.phone}
            onChange={update("phone")}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="f-email" className={styles.label}>
            Email <span className={styles.optional}>optional</span>
          </label>
          <input
            id="f-email"
            name="email"
            type="email"
            autoComplete="email"
            className={styles.input}
            value={fields.email}
            onChange={update("email")}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="f-project" className={styles.label}>
          Project of interest
        </label>
        <div className={styles.selectWrap}>
          <select
            id="f-project"
            name="project"
            className={styles.select}
            value={fields.project}
            onChange={update("project")}
          >
            <option>General enquiry</option>
            {available.map((p) => (
              <option key={p.slug} value={p.name}>
                {p.name} — {p.status}
              </option>
            ))}
          </select>
          <Arrow className={styles.selectArrow} direction="down" />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="f-message" className={styles.label}>
          Message <span className={styles.optional}>optional</span>
        </label>
        <textarea
          id="f-message"
          name="message"
          rows={4}
          className={styles.textarea}
          value={fields.message}
          onChange={update("message")}
          placeholder="Tell us what you are looking for, and when."
        />
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <div className={styles.actions}>
        <button type="submit" className="btn btn--solid">
          Send on WhatsApp
          <Arrow direction="up-right" />
        </button>
        <a
          href={mailto}
          className={`arrow-link ${styles.alt}`}
          onClick={() =>
            track({
              name: "enquiry_submit",
              project: fields.project,
              channel: "email",
            })
          }
        >
          <span>Or send by email</span>
          <Arrow />
        </a>
      </div>

      {sent && (
        <p className={`small ${styles.sent}`} role="status">
          WhatsApp should have opened with your message. If it did not,{" "}
          <a
            href={whatsappLink({ message })}
            target="_blank"
            rel="noopener noreferrer"
            className="u-line u-line--on"
          >
            open it here
          </a>{" "}
          or{" "}
          <a href={mailto} className="u-line u-line--on">
            send it by email
          </a>
          .
        </p>
      )}

      <p className={`label muted ${styles.privacy}`}>
        Your details go straight to the studio and nowhere else.
      </p>
    </form>
  );
}
