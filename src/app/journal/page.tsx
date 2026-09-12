import type { Metadata } from "next";
import Image from "next/image";
import { journal, formatDate } from "@/lib/data/journal";
import { imageBlur, imageSrc } from "@/lib/images";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { RevealText } from "@/components/motion/RevealText";
import { Arrow } from "@/components/ui/Arrow";
import { ContactCTA } from "@/components/sections/ContactCTA";
import styles from "./Journal.module.css";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes from the Citysky studio: on place, climate, furnishing, and what happens on site.",
};

export default function JournalPage() {
  return (
    <>
      <section className={styles.index} aria-labelledby="journal-title">
        <div className="container">
          <header className={styles.head}>
            <p className="eyebrow">Journal</p>
            <RevealText
              as="h1"
              className={`display ${styles.title}`}
              immediate
              delay={0.2}
              id="journal-title"
            >
              Notes from the practice.
            </RevealText>
            <p className={`body muted ${styles.lead}`} data-enter>
              Occasional writing on the places we build, the climate we build
              for, and what we learn on site. No newsletter, no schedule.
            </p>
          </header>

          <ol className={styles.list}>
            {journal.map((e, i) => (
              <li key={e.slug} className={styles.row}>
                <TransitionLink
                  href={`/journal/${e.slug}`}
                  className={styles.link}
                  data-cursor="Read"
                >
                  <span className={`label muted ${styles.date}`}>
                    <time dateTime={e.date}>{formatDate(e.date)}</time>
                  </span>
                  <span className={styles.rowTitle}>{e.title}</span>
                  <span className={`label muted ${styles.cat}`}>
                    {e.category} · {e.readingTime}
                  </span>
                  <span className={styles.arrow} aria-hidden="true">
                    <Arrow className={styles.arrowIcon} />
                  </span>
                  <span className={styles.thumb} aria-hidden="true">
                    <Image
                      src={imageSrc(e.cover, 600)}
                      alt=""
                      fill
                      sizes="220px"
                      placeholder={imageBlur(e.cover) ? "blur" : "empty"}
                      blurDataURL={imageBlur(e.cover)}
                      style={{ objectFit: "cover" }}
                    />
                  </span>
                  <span className={styles.rowNum} aria-hidden="true">
                    {String(journal.length - i).padStart(2, "0")}
                  </span>
                </TransitionLink>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <ContactCTA
        headline="Have a question the journal did not answer?"
        copy="Send it over on WhatsApp. If it is a good one, it may become the next entry."
      />
    </>
  );
}
