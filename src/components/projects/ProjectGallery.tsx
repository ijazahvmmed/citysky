import type { GalleryItem } from "@/lib/data/projects";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import styles from "./ProjectGallery.module.css";

type Group =
  | { kind: "full"; item: GalleryItem }
  | { kind: "pinned"; item: GalleryItem }
  | { kind: "pair"; items: GalleryItem[] };

function group(items: GalleryItem[]): Group[] {
  const out: Group[] = [];
  let pending: GalleryItem[] = [];
  const flush = () => {
    if (pending.length) out.push({ kind: "pair", items: pending });
    pending = [];
  };
  for (const item of items) {
    if (item.layout === "half") {
      pending.push(item);
      if (pending.length === 2) flush();
    } else {
      flush();
      out.push({ kind: item.layout, item });
    }
  }
  flush();
  return out;
}

export function ProjectGallery({ items }: { items: GalleryItem[] }) {
  const groups = group(items);
  return (
    <section className={styles.gallery} aria-label="Gallery">
      {groups.map((g, i) => {
        if (g.kind === "full") {
          return (
            <figure key={i} className={styles.full}>
              <RevealImage
                image={g.item.image}
                className={styles.fullImage}
                sizes="100vw"
                parallax={60}
                width={2400}
              />
              {g.item.caption && (
                <figcaption
                  className={`container small muted ${styles.caption}`}
                >
                  {g.item.caption}
                </figcaption>
              )}
            </figure>
          );
        }
        if (g.kind === "pinned") {
          return (
            <div key={i} className={`container ${styles.pinned}`}>
              <div className={styles.pinnedImage}>
                <RevealImage
                  image={g.item.image}
                  className={styles.pinnedMedia}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  width={1800}
                />
              </div>
              <div className={styles.pinnedText}>
                <p className="eyebrow">Detail</p>
                <RevealText as="p" className={`lede ${styles.pinnedCaption}`}>
                  {g.item.caption}
                </RevealText>
              </div>
            </div>
          );
        }
        return (
          <div key={i} className={`container ${styles.pair}`}>
            {g.items.map((item, j) => (
              <figure key={j} className={j === 0 ? styles.pairA : styles.pairB}>
                <RevealImage
                  image={item.image}
                  className={styles.pairImage}
                  sizes="(min-width: 900px) 45vw, 100vw"
                  parallax={j === 1 ? 30 : 0}
                  width={1400}
                  position="50% 62%"
                />
                {item.caption && (
                  <figcaption className={`small muted ${styles.pairCaption}`}>
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        );
      })}
    </section>
  );
}
