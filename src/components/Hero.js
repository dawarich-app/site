import React from 'react';
import Link from '@docusaurus/Link';
import styles from './Hero.module.css';

// SVG Icons as components
const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

export default function Hero() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.badge}>
          <MapPinIcon />
          <span>Self-Hosted Location Tracking</span>
        </div>

        <h1 className={styles.title}>
          Your Life, <span className={styles.highlight}>Mapped</span> Automatically
        </h1>

        <p className={styles.subtitle}>
          Do you remember where you've been last year? With Dawarich, you don't have to worry about forgetting.
          We help you remember the places you've been and the life you've lived — day by day, on a beautiful
          private timeline only you control.
        </p>

        <div className={styles.buttons}>
          <Link
            className={styles.primaryButton}
            href="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=hero&utm_campaign=hero">
            Try 7 Days for Free
            <span className={styles.arrow}>
              <ArrowRightIcon />
            </span>
          </Link>
          <button
            className={styles.secondaryButton}
            onClick={scrollToFeatures}>
            Explore Features
          </button>
        </div>

        <p className={styles.noCredit}>No credit card required</p>

        <div className={styles.heroImageWrapper}>
          <div className={styles.heroImageContainer}>
            <img
              src="/img/hero-map.jpg"
              alt="Dawarich map interface showing location tracking"
              className={styles.heroImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
