import { ArrowLink } from "@/components/ui/ArrowLink";
import { RevealText } from "@/components/motion/RevealText";

export default function NotFound() {
  return (
    <section
      className="container"
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "2.5rem",
        paddingTop: "var(--nav-h)",
      }}
    >
      <p className="eyebrow">404</p>
      <RevealText as="h1" className="display" immediate delay={0.2}>
        Nothing built here yet.
      </RevealText>
      <p className="body muted measure">
        The page you were looking for has moved, or never existed. The projects
        and journal are still where they were.
      </p>
      <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>
        <ArrowLink href="/">Home</ArrowLink>
        <ArrowLink href="/projects">Projects</ArrowLink>
        <ArrowLink href="/contact">Contact</ArrowLink>
      </div>
    </section>
  );
}
