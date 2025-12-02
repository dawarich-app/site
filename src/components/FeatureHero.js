import React from 'react';
import Link from '@docusaurus/Link';
import styles from './FeatureHero.module.css';

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

export default function FeatureHero({
  badge,
  title,
  titleHighlight,
  subtitle,
  ctaText = "Try 7 Days for Free",
  ctaLink = "https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature&utm_campaign=feature",
  showSecondary = false,
  image,
  imageAlt
}) {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        {badge && (
          <div className={styles.badge}>
            <span>{badge}</span>
          </div>
        )}

        <h1 className={styles.title}>
          {title} {titleHighlight && <span className={styles.highlight}>{titleHighlight}</span>}
        </h1>

        {subtitle && (
          <p className={styles.subtitle}>
            {subtitle}
          </p>
        )}

        <div className={styles.buttons}>
          <Link
            className={styles.primaryButton}
            href={ctaLink}>
            {ctaText}
            <span className={styles.arrow}>
              <ArrowRightIcon />
            </span>
          </Link>
          {showSecondary && (
            <Link
              className={styles.secondaryButton}
              to="/docs/tutorials/installation">
              Self-Host for Free
            </Link>
          )}
        </div>

        <p className={styles.noCredit}>No credit card required</p>

        {image && (
          <div className={styles.heroImageWrapper}>
            <div className={styles.heroImageContainer}>
              <img
                src={image}
                alt={imageAlt || title}
                className={styles.heroImage}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
