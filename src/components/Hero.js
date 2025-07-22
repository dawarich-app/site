import React from 'react';
import Link from '@docusaurus/Link';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Your Journey, <span className={styles.highlight}>Your Control</span>
        </h1>
        <p className={styles.subtitle}>
          Visualize your location history, track your movements, and analyze your travel patterns
          with complete privacy and control.
        </p>
        <div className={styles.buttons}>
          <Link
            className={styles.earlyAccessButton}
            href="https://my.dawarich.app">
            Sign up now!
          </Link>
          <Link
            className={styles.secondaryButton}
            to="/docs/features/tracking-location-history">
            Explore Features
          </Link>
        </div>
      </div>
    </section>
  );
}
