import type { Metadata } from "next";
import { img } from "@/lib/images";
import { team } from "@/lib/data/team";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { ContactCTA } from "@/components/sections/ContactCTA";
import styles from "./About.module.css";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Citysky Builders is a small design-and-build practice in Kochi. The story, the way of working, and the people behind the homes.",
};

const portrait = img("1600585154526-990dced4db0d", "Charred-timber villa elevation at dusk, Vaduthala");
const band = img("1602216056096-3b40cc0c9944", "Kerala backwater under monsoon cloud, coconut palms along the bank");
const studio = img("1600607687939-ce8a6c25118c", "Living room with timber ceiling opening onto a garden");

const values = [
  {
    title: "Restraint",
    copy: "Few materials, used honestly. A house should be easy to read from the street and easy to live in from the inside. Decoration is what is left when the plan is right.",
  },
  {
    title: "Climate",
    copy: "Kochi has four months of rain and eight of heat. Deep overhangs, cross-ventilation and shade on the west come before glass and gloss.",
  },
  {
    title: "Continuity",
    copy: "The team that draws the house furnishes it and hands it over. There is no moment where responsibility passes to someone who was not in the room.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="about-title">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroText}>
            <p className="eyebrow">The studio</p>
            <RevealText as="h1" className={`display ${styles.title}`} immediate delay={0.2} id="about-title">
              A small practice, building slowly.
            </RevealText>
            <p className={`h-sub muted ${styles.heroLead}`} data-enter>
              Citysky was started in Kochi in 2014 by an architect and a
              contractor who kept finding themselves on the same sites. Twelve
              years on, it is still a practice of a dozen people that designs,
              builds and furnishes a handful of homes at a time.
            </p>
          </div>
          <RevealImage
            image={portrait}
            className={styles.heroImage}
            sizes="(min-width: 900px) 40vw, 100vw"
            priority
            width={1600}
            parallax={40}
          />
        </div>
      </section>

      <section className={`section ${styles.story}`} aria-labelledby="story-heading">
        <div className={`container ${styles.storyGrid}`}>
          <div className={styles.storyLabel}>
            <p className="eyebrow" id="story-heading">
              Since 2014
            </p>
          </div>
          <div className={styles.storyText}>
            <RevealText as="p" className={`lede ${styles.storyLede}`}>
              We began with a single house for a family in Kadavanthra, drawn
              on the kitchen table and built by the people who drew it.
            </RevealText>
            <p className="body muted measure">
              That house taught us most of what we still believe: that the site
              knows more than the brief, that Kerala&rsquo;s climate is a collaborator
              rather than a problem, and that the gap between a good drawing and
              a good home is closed on site, one decision at a time.
            </p>
            <p className="body muted measure">
              Since then we have completed two larger projects, at Nettoor and
              Vaduthala, and started a third. We have never had a sales team.
              Most of our buyers were introduced by people who already live in
              one of our houses, which is the only kind of growth we are
              interested in.
            </p>
            <p className="body muted measure">
              In 2023 we brought interiors in-house, so that the person who
              draws a room can also decide what goes in it. Three quarters of
              our homes are now handed over fully furnished. The rooms make a
              better argument than we can.
            </p>
          </div>
        </div>
      </section>

      <blockquote className={`container ${styles.quote}`}>
        <RevealText as="p" className={styles.quoteText}>
          We would rather build ten houses well than a hundred quickly.
        </RevealText>
        <cite className={`label muted ${styles.cite}`}>Arjun Menon, founder</cite>
      </blockquote>

      <section className={styles.band} aria-hidden="true">
        <RevealImage image={band} className={styles.bandImage} sizes="100vw" parallax={70} width={2400} />
      </section>

      <section className={`section ${styles.values}`} aria-labelledby="values-heading">
        <div className="container">
          <div className={styles.valuesHead}>
            <p className="eyebrow">What we hold to</p>
            <RevealText as="h2" className={`h-section ${styles.valuesTitle}`} id="values-heading">
              Three things we do not negotiate.
            </RevealText>
          </div>
          <div className={styles.valuesGrid}>
            {values.map((v, i) => (
              <div key={v.title} className={styles.value}>
                <span className={styles.valueNum} aria-hidden="true">
                  0{i + 1}
                </span>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className="body muted">{v.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`container ${styles.studioRow}`} aria-label="The studio at work">
        <RevealImage
          image={studio}
          className={styles.studioImage}
          sizes="(min-width: 900px) 55vw, 100vw"
          width={1800}
        />
        <blockquote className={styles.studioQuote}>
          <RevealText as="p" className={styles.quoteTextSmall}>
            A house is finished when someone forgets to notice it, and simply
            lives there.
          </RevealText>
          <cite className={`label muted ${styles.cite}`}>Lakshmi Nair, interiors</cite>
        </blockquote>
      </section>

      <section className={`section ${styles.team}`} aria-labelledby="team-heading">
        <div className="container">
          <div className={styles.teamHead}>
            <p className="eyebrow">The people</p>
            <RevealText as="h2" className={`h-section ${styles.teamTitle}`} id="team-heading">
              Twelve of us, on site most days.
            </RevealText>
          </div>
          <ul className={styles.teamGrid}>
            {team.map((p) => (
              <li key={p.name} className={styles.person}>
                <RevealImage
                  image={p.portrait}
                  className={styles.portrait}
                  sizes="(min-width: 900px) 30vw, 50vw"
                  width={900}
                  position="50% 22%"
                />
                <p className={styles.personName}>{p.name}</p>
                <p className="label muted">{p.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactCTA
        headline="Come and see how we work."
        copy="The studio is in Vaduthala, a short walk from Project One. Visitors are welcome by appointment, most weekdays."
      />
    </>
  );
}
