"use client";

import { useEffect, useId, useRef, useState } from "react";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/gsap";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { BuildingViewport, type BuildingHandle } from "./BuildingViewport";
import { constructionStages } from "./scene-contract";
import styles from "./Build.module.css";

const DESKTOP_CONSTRUCTION_END = 0.8;

export function BuildExperience({ expanded = false }: { expanded?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const viewport = useRef<BuildingHandle>(null);
  const meter = useRef<HTMLSpanElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const constructionEnd = useRef(1);
  const stageIndex = useRef(0);
  const [stage, setStage] = useState(0);
  const id = useId();

  useEffect(() => {
    const element = root.current;
    const pinned = panel.current;
    if (!element || !pinned) return;
    function update(value: number) {
      const progress = Math.min(1, Math.max(0, value));
      viewport.current?.setProgress(progress);
      if (meter.current) meter.current.style.transform = `scaleX(${progress})`;
      const next = Math.min(5, Math.floor(progress * 6));
      if (stageIndex.current !== next) {
        stageIndex.current = next;
        setStage(next);
      }
    }
    const mm = gsap.matchMedia();
    mm.add({ motion: MOTION_OK, desktop: "(min-width: 1024px)", roomy: "(min-height: 651px)" }, context => {
      if (!context.conditions?.motion) {
        update(1);
        return;
      }
      const desktop = context.conditions.desktop;
      const roomy = context.conditions.roomy;
      const shouldPin = desktop || roomy;
      const buildEnd = desktop ? DESKTOP_CONSTRUCTION_END : 1;
      constructionEnd.current = buildEnd;
      const playhead = { value: 0 };
      const tween = gsap.to(playhead, {
        // Preserve construction speed, then hold the finished home on desktop
        // before releasing the pinned panel into the next section.
        value: 1 / buildEnd, ease: "none",
        onUpdate: () => update(playhead.value),
        scrollTrigger: {
          trigger: element, start: shouldPin ? "top top" : "top 65%",
          end: shouldPin ? () => `+=${desktop ? (expanded ? 3600 : 2800) / buildEnd : 1700}` : "bottom 35%",
          pin: shouldPin ? pinned : false, pinType: "fixed", scrub: desktop ? 0.5 : 0.25,
          anticipatePin: 1, invalidateOnRefresh: true,
        },
      });
      trigger.current = tween.scrollTrigger ?? null;
      return () => { trigger.current = null; };
    }, element);
    return () => mm.revert();
  }, [expanded]);

  function select(index: number) {
    // Select the completed state of each stage; Live must reach the lighting pass.
    const value = index === 5 ? 0.98 : (index + 0.9) / 6;
    if (trigger.current?.vars.pin) {
      const buildEnd = constructionEnd.current;
      const scrollProgress = index === 5 && buildEnd < 1
        ? buildEnd + (1 - buildEnd) * 0.25
        : value * buildEnd;
      window.scrollTo({ top: trigger.current.start + (trigger.current.end - trigger.current.start) * scrollProgress, behavior: "instant" });
    } else {
      // In a short, unpinned viewport, jumping to the end of the scroll range
      // would move the home offscreen. Keep explicit stage choices in place.
      trigger.current?.disable(false);
      viewport.current?.setProgress(value);
      if (meter.current) meter.current.style.transform = `scaleX(${value})`;
      stageIndex.current = index;
      setStage(index);
    }
  }

  return (
    <section ref={root} id={expanded ? "construction" : "build-with-citysky"} className={styles.experience} aria-labelledby={id}>
      <div ref={panel} className={styles.experiencePanel}>
        <div className={`container ${styles.experienceInner}`}>
          <header className={styles.experienceCopy}>
            <p className="eyebrow">Design + Build</p>
            <h2 id={id}>Your plot.<br />Imagined from<br className={styles.desktopBreak} /> the ground up.</h2>
            <p className={styles.support}>Architecture, construction and interiors — brought together by one team.</p>
            <button type="button" className={styles.skip} onClick={() => select(stage === 5 ? 0 : 5)}>{stage === 5 ? "Replay construction" : "See the completed home"} <span aria-hidden="true">{stage === 5 ? "↺" : "↗"}</span></button>
          </header>
          <div className={styles.sceneArea}>
            <BuildingViewport ref={viewport} />
          </div>
          <div className={styles.sequenceFoot}>
            <div className={styles.stageRow} role="group" aria-label="Construction stages">
              {constructionStages.map((item, index) => <button key={item.title} type="button" aria-pressed={stage === index} onClick={() => select(index)} className={stage === index ? styles.activeStage : ""}>
                <span>{String(index + 1).padStart(2, "0")}</span> {item.title}
              </button>)}
            </div>
            <div className={styles.mobileStage}>
              <p><span className={styles.stageCount}>{String(stage + 1).padStart(2, "0")} / 06</span> <span key={stage} className={styles.phaseLabel}>{constructionStages[stage].title}</span></p>
              <div className={styles.mobileControls}>
                <button type="button" aria-label="Previous construction stage" disabled={stage === 0} onClick={() => select(stage - 1)}>←</button>
                <button type="button" aria-label="Next construction stage" disabled={stage === 5} onClick={() => select(stage + 1)}>→</button>
              </div>
            </div>
            <div className={styles.progress} aria-hidden="true"><span ref={meter} /></div>
            <div className={styles.sequenceBottom}>
              <p key={stage} className={`${styles.phaseLabel} ${stage === 5 ? styles.finalLine : ""}`}>{constructionStages[stage].copy}</p>
              <ArrowLink href={expanded ? "#plot-enquiry" : "/build-with-citysky"}>{expanded ? "Tell us about your plot" : "Build With Citysky"}</ArrowLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
