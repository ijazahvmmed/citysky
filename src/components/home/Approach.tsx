"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, DESKTOP } from "@/lib/gsap";
import { img } from "@/lib/images";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import styles from "./Approach.module.css";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

const principles = [
  {
    title: "Place first",
    copy: "We begin with the character of a site: its light, its levels, the trees already on it and the way water moves across it in August. The plan follows from there.",
  },
  {
    title: "Built to endure",
    copy: "Materials and detailing chosen to age well in Kerala's climate. Deep overhangs, lime render, timber that is meant to silver. Nothing that looks best on handover day and worse each year after.",
  },
  {
    title: "Considered throughout",
    copy: "The same attention on a door handle as on an elevation. We draw the joinery, specify the fittings, and check the light switches sit where a hand expects them.",
  },
  {
    title: "Delivered whole",
    copy: "Architecture, interiors and handover managed as one, by one team. When the keys change hands the house is finished, not nearly finished.",
  },
];

const image = img(
  "1600573472592-401b489a3cdc",
  "Timber-clad villa elevation with courtyard pool, late afternoon",
);

export function Approach() {
  const list = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const l = list.current;
    if (!l) return;
    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => {
      const items = Array.from(
        l.querySelectorAll<HTMLElement>(`.${styles.item}`),
      );
      items.forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 55%",
          end: "bottom 45%",
          toggleClass: { targets: item, className: styles.active },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      className={`section ${styles.approach}`}
      aria-labelledby="approach-heading"
    >
      <div className="container">
        <div className={styles.head}>
          <p className="eyebrow" id="approach-heading">
            Our approach
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.sticky}>
            <RevealImage
              image={image}
              className={styles.image}
              parallax={40}
              sizes="(min-width: 1024px) 42vw, 100vw"
              width={1600}
            />
          </div>

          <div ref={list} className={styles.list}>
            {principles.map((p, i) => (
              <div key={p.title} className={styles.item}>
                <span className={styles.num} aria-hidden="true">
                  0{i + 1}
                </span>
                <RevealText as="h3" className={`h-section ${styles.itemTitle}`}>
                  {p.title}
                </RevealText>
                <p className={`body muted ${styles.copy}`}>{p.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
