import type { Metadata } from "next";
import { BuildExperience } from "@/components/build/BuildExperience";
import { CompletionOptions } from "@/components/build/CompletionOptions";
import { BuildEnquiry } from "@/components/build/BuildEnquiry";
import { RevealText } from "@/components/motion/RevealText";
import { RevealImage } from "@/components/motion/RevealImage";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { projects } from "@/lib/data/projects";
import styles from "./BuildPage.module.css";

export const metadata: Metadata = {
  title: "Build With Citysky — Design & Build in Kochi",
  description: "Have a plot? Citysky brings architecture, engineering, construction and interiors together, from your first idea to a finished home in Kochi.",
  alternates: { canonical: "/build-with-citysky" },
};

const process = [
  ["Understand", "Begin with the place, and the people.", "We start with your plot, your priorities and the way you want to live. The site and your brief give the project its direction."],
  ["Imagine", "Make room for possibility.", "Plans, light and movement turn an idea into a home you can picture. We work through the design together before moving ahead."],
  ["Engineer", "Give the idea a sound foundation.", "Structure, services and construction details are coordinated with the architecture, so the decisions on paper work on site."],
  ["Build", "Bring the drawings to life.", "The structure takes shape through coordinated site work, with attention to materials, workmanship and the details that last."],
  ["Finish", "Connect the architecture to everyday life.", "Surfaces, fittings and interiors are considered together, shaped around your chosen scope and how you will use the home."],
  ["Hand Over", "A considered beginning.", "We walk through the finished home together, ready for the next chapter to be yours."],
];
const services = [
  ["Architecture", "The plan, the light, the way each space belongs."],
  ["Engineering", "The structure and systems behind every decision."],
  ["Construction", "The care that carries a drawing onto the site."],
  ["Interiors", "Materials and details that make a home feel yours."],
];
const proof = ["1008", "mirzad-road"].map(slug => projects.find(project => project.slug === slug)!);

export default function BuildWithCityskyPage() {
  return <>
    <section className={styles.hero} aria-labelledby="build-title">
      <div className="container">
        <p className="eyebrow" data-enter>Have a plot?</p>
        <RevealText as="h1" className={styles.title} immediate id="build-title">Let&apos;s imagine<br />what belongs there.</RevealText>
        <div className={styles.heroBottom} data-enter>
          <p>From an empty plot to a finished home, Citysky brings architecture, engineering, construction and interiors together under one team.</p>
          <ArrowLink href="#construction" direction="down">From the ground up</ArrowLink>
        </div>
      </div>
    </section>

    <BuildExperience expanded />

    <section className="section" aria-labelledby="process-title">
      <div className={`container ${styles.processGrid}`}>
        <header><p className="eyebrow">A shared process</p><RevealText id="process-title" className="h-section">Considered at<br />every step.</RevealText><p className={styles.sectionIntro}>One conversation, carried through from the first sketch to the keys.</p></header>
        <ol className={styles.processList}>{process.map(([title, lead, copy], index) => <li key={title}>
          <span className={styles.number}>0{index + 1}</span><div><h3>{title}</h3><h4>{lead}</h4><p>{copy}</p></div>
        </li>)}</ol>
      </div>
    </section>

    <section className={`section ${styles.team}`} aria-labelledby="team-title">
      <div className="container">
        <div className={styles.sectionHeading}><div><p className="eyebrow">Connected from the start</p><RevealText id="team-title" className="h-section">One home. One team.</RevealText></div><p>When the people who design, engineer, build and finish your home work together, each decision belongs to the same idea.</p></div>
        <ol className={styles.services}>{services.map(([title, copy], index) => <li key={title}><span className={styles.number}>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      </div>
    </section>

    <CompletionOptions />

    <section className="section" aria-labelledby="proof-title">
      <div className="container">
        <div className={styles.sectionHeading}><div><p className="eyebrow">Experience, built</p><RevealText id="proof-title" className="h-section">Grounded in homes<br />we already know.</RevealText></div><p>From completed homes at 1008 to the villas taking shape at Mirzad Road. Explore the work behind our approach.</p></div>
        <div className={styles.proofGrid}>{proof.map(project => <TransitionLink key={project.slug} href={`/projects/${project.slug}`} className={styles.proofLink}>
          <RevealImage image={project.cover} className={styles.proofImage} sizes="(max-width: 600px) 90vw, 45vw" quality={75} />
          <div className={styles.proofInfo}><h3>{project.name}</h3><span>{project.status}</span></div><p className={styles.proofLocation}>{project.location}</p>
        </TransitionLink>)}</div>
        <div className={styles.proofFinish}><RevealText className="h-section">Now, we can build yours.</RevealText><ArrowLink href="/projects">Explore our projects</ArrowLink></div>
      </div>
    </section>

    <BuildEnquiry />
  </>;
}
