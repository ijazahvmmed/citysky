"use client";

import Image from "next/image";
import { useNavInverse } from "@/components/layout/NavTheme";
import { TransitionLink } from "@/components/layout/TransitionLink";
import styles from "./Hero.module.css";

export function Hero() {
  useNavInverse(false);

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.visual}>
      <div className={styles.scene}>
        <Image
          src="/images/hero-home-clean-roof.webp"
          unoptimized
          alt="Completion visualization of the photographed white-and-turquoise home, with finished paving, landscaped gardens, and warm lighting"
          fill
          className={styles.image}
          fetchPriority="high"
          loading="eager"
        />
      </div>

      <div className={styles.notes}>
        <p>Dream big.<br />Live simply.</p>
        <p>Thoughtful architecture.<br />Lasting belonging.</p>
        <p>A place to slow down.<br />A home in Kochi.</p>
      </div>

      <h1 id="hero-title" className={styles.title}>Citysky</h1>
      <nav className={styles.heroActions} aria-label="Find your home">
        <TransitionLink href="/contact" className={styles.priceAction}>
          <span>Starting from</span><strong>₹55 lakhs</strong>
        </TransitionLink>
        <TransitionLink href="/projects" className={styles.exploreAction}>
          <span>Find your home</span><strong>Explore projects ↗</strong>
        </TransitionLink>
      </nav>

      <div className={`${styles.scene} ${styles.foreground}`} aria-hidden="true">
        <Image
          src="/images/hero-home-clean-roof.webp"
          unoptimized
          alt=""
          fill
          className={styles.image}
          loading="eager"
        />
      </div>

      <div className={styles.shade} aria-hidden="true" />
      </div>

      <div className={styles.footer}>
        <nav className={styles.pills} aria-label="Explore Citysky">
          <TransitionLink href="/projects" className={styles.primary}>Our homes</TransitionLink>
          <TransitionLink href="/about">Our story</TransitionLink>
          <TransitionLink href="/contact">Arrange a visit <span aria-hidden="true">↗</span></TransitionLink>
        </nav>
        <p className={styles.location}>Homes built to belong.<br /><span>Kochi, Kerala</span></p>
      </div>
    </section>
  );
}
