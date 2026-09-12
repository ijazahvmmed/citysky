import { journal, formatDate } from "@/lib/data/journal";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { ArrowLink } from "@/components/ui/ArrowLink";
import styles from "./JournalPreview.module.css";

export function JournalPreview() {
  const entries = journal.slice(0, 3);
  return (
    <section
      className={`section ${styles.journal}`}
      aria-labelledby="journal-heading"
    >
      <div className="container">
        <div className={styles.head}>
          <div>
            <p className="eyebrow">Journal</p>
            <RevealText
              as="h2"
              className={`h-section ${styles.title}`}
              id="journal-heading"
            >
              Notes from the practice
            </RevealText>
          </div>
          <ArrowLink href="/journal">All entries</ArrowLink>
        </div>

        <div className={styles.row}>
          {entries.map((e) => (
            <TransitionLink
              key={e.slug}
              href={`/journal/${e.slug}`}
              className={styles.entry}
              data-cursor="Read"
            >
              <RevealImage
                image={e.cover}
                className={styles.image}
                sizes="(min-width: 900px) 30vw, 100vw"
                width={1200}
              />
              <p className={`label muted ${styles.date}`}>
                <time dateTime={e.date}>{formatDate(e.date)}</time>
                <span aria-hidden="true"> · </span>
                {e.category}
              </p>
              <h3 className={styles.entryTitle}>{e.title}</h3>
              <p className={`small muted ${styles.excerpt}`}>{e.excerpt}</p>
            </TransitionLink>
          ))}
        </div>
      </div>
    </section>
  );
}
