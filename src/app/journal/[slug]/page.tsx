import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { journal, getEntry, formatDate } from "@/lib/data/journal";
import { imageSrc } from "@/lib/images";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ContactCTA } from "@/components/sections/ContactCTA";
import styles from "./Entry.module.css";

export function generateStaticParams() {
  return journal.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.excerpt,
    openGraph: {
      type: "article",
      publishedTime: entry.date,
      images: [{ url: imageSrc(entry.cover, 1600), alt: entry.cover.alt }],
    },
  };
}

export default async function EntryPage({
  params,
}: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  const index = journal.findIndex((e) => e.slug === entry.slug);
  const next = journal[(index + 1) % journal.length];

  return (
    <>
      <article className={styles.entry}>
        <header className={`container ${styles.head}`}>
          <p className={`label muted ${styles.meta}`} data-enter>
            {entry.category}
            <span aria-hidden="true"> · </span>
            <time dateTime={entry.date}>{formatDate(entry.date)}</time>
            <span aria-hidden="true"> · </span>
            {entry.readingTime}
          </p>
          <RevealText
            as="h1"
            className={`display ${styles.title}`}
            immediate
            delay={0.2}
          >
            {entry.title}
          </RevealText>
          <p className={`h-sub muted ${styles.excerpt}`} data-enter>
            {entry.excerpt}
          </p>
        </header>

        <div className={`container ${styles.cover}`}>
          <RevealImage
            image={entry.cover}
            className={styles.coverImage}
            sizes="100vw"
            priority
            parallax={60}
            width={2400}
          />
        </div>

        <div className={`container ${styles.body}`}>
          {entry.body.map((b, i) => {
            switch (b.type) {
              case "h2":
                return (
                  <h2 key={i} className={styles.h2}>
                    {b.text}
                  </h2>
                );
              case "quote":
                return (
                  <blockquote key={i} className={styles.quote}>
                    <RevealText as="p" className={styles.quoteText}>
                      {b.text}
                    </RevealText>
                    {b.cite && <cite className="label muted">{b.cite}</cite>}
                  </blockquote>
                );
              case "image":
                return (
                  <figure key={i} className={styles.figure}>
                    <RevealImage
                      image={b.image}
                      className={styles.figureImage}
                      sizes="(min-width: 1024px) 900px, 100vw"
                      width={1800}
                    />
                    {b.caption && (
                      <figcaption
                        className={`small muted ${styles.figcaption}`}
                      >
                        {b.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              default:
                return (
                  <p key={i} className={styles.p}>
                    {b.text}
                  </p>
                );
            }
          })}
        </div>

        <footer className={`container ${styles.foot}`}>
          <ArrowLink href="/journal" direction="right" className={styles.back}>
            All entries
          </ArrowLink>
          <div className={styles.next}>
            <p className="label muted">Next entry</p>
            <ArrowLink
              href={`/journal/${next.slug}`}
              size="lg"
              className={styles.nextLink}
            >
              {next.title}
            </ArrowLink>
          </div>
        </footer>
      </article>
      <ContactCTA />
    </>
  );
}
