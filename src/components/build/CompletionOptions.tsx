"use client";

import { useState } from "react";
import { BuildingViewport } from "./BuildingViewport";
import type { Completion } from "./scene-contract";
import styles from "./Build.module.css";

const options: { id: Completion; name: string; line: string; copy: string }[] = [
  { id: "canvas", name: "Canvas", line: "A foundation for your own ideas.", copy: "A structural, customisable starting point. Leave room to shape the finishes and interiors around the way you want to live." },
  { id: "essentials", name: "Essentials", line: "Ready for everyday life.", copy: "The same home, completed with considered finishes and the essentials in place. A space ready for you to make your own." },
  { id: "pinnacle", name: "Pinnacle", line: "Considered, down to the last detail.", copy: "A complete interior vision, with furniture, materials and lighting brought together. A home that feels resolved from the moment you arrive." },
];

export function CompletionOptions() {
  const [selected, setSelected] = useState<Completion>("canvas");
  const option = options.find(item => item.id === selected)!;
  return <section className={`section ${styles.completion}`} aria-labelledby="completion-heading">
    <div className={`container ${styles.completionGrid}`}>
      <div>
        <p className="eyebrow">The way you come home</p>
        <h2 id="completion-heading" className="h-section">One home.<br />Your finishing point.</h2>
        <div className={styles.options} role="group" aria-label="Choose a completion option">
          {options.map((item, index) => <button key={item.id} type="button" aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>
            <span className={styles.optionNumber}>0{index + 1}</span><span>{item.name}</span><span aria-hidden="true">{selected === item.id ? "−" : "+"}</span>
          </button>)}
        </div>
        <div className={styles.optionCopy} aria-live="polite" aria-atomic="true">
          <h3>{option.line}</h3><p>{option.copy}</p>
        </div>
        <p className={styles.studyNote}>Illustrative finish study. Your scope and specifications are agreed around your plot and brief.</p>
      </div>
      <div className={styles.completionVisual}><BuildingViewport completion={selected} /><span className={styles.finishCaption}>Same architecture / {option.name}</span></div>
    </div>
  </section>;
}
