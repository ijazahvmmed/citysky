"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/whatsapp";
import { site } from "@/lib/site";
import { track } from "@/lib/analytics";
import styles from "./Build.module.css";

export function BuildEnquiry() {
  const [location, setLocation] = useState("");
  const [idea, setIdea] = useState("");
  const message = `Hi Citysky, I have a plot and would like to discuss designing and building a home.${location.trim() ? `\nPlot location: ${location.trim()}` : ""}${idea.trim() ? `\nMy idea: ${idea.trim()}` : ""}`;
  return <section id="plot-enquiry" className={`section ${styles.enquiry}`} aria-labelledby="plot-heading">
    <div className={`container ${styles.enquiryGrid}`}>
      <div><p className="eyebrow">Start a conversation</p><h2 id="plot-heading" className="h-section">Have a plot?<br />Show us where.</h2><p className={styles.enquiryIntro}>A location, a few ideas, or simply a question. We can take it from there.</p></div>
      <div className={styles.enquiryFields}>
        <label htmlFor="plot-location">Where is your plot? <span>(optional)</span></label>
        <input id="plot-location" name="location" autoComplete="address-level2" placeholder="Location or neighbourhood" value={location} onChange={e => setLocation(e.target.value)} maxLength={200} />
        <label htmlFor="plot-idea">What do you have in mind? <span>(optional)</span></label>
        <textarea id="plot-idea" name="idea" rows={2} placeholder="Your plot size, an idea, a place to start…" value={idea} onChange={e => setIdea(e.target.value)} maxLength={1500} />
        <a className="btn btn--solid" href={whatsappLink({ message })} target="_blank" rel="noopener noreferrer" onClick={() => track({ name: "whatsapp_click", page: "/build-with-citysky", section: "plot-enquiry" })}>Continue on WhatsApp <span aria-hidden="true">↗</span></a>
        <p className={styles.studyNote}>Opens WhatsApp with your message ready to review and send.<br />Prefer to talk? <a href={site.phoneHref} onClick={() => track({ name: "phone_click", page: "/build-with-citysky", section: "plot-enquiry" })}>{site.phone}</a></p>
      </div>
    </div>
  </section>;
}
