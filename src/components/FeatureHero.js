import { SmartLink } from '@site/src/i18n/RichText';
import content from '@locale-content/components/FeatureHero.json';
import React from 'react';
import EnOnlyLink from '@site/src/i18n/EnOnlyLink';
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
  ctaText = content.ctaText,
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
          <SmartLink
            className={styles.primaryButton}
            href={ctaLink}>
            {ctaText}
            <span className={styles.arrow}>
              <ArrowRightIcon />
            </span>
          </SmartLink>
          {showSecondary && (
            <EnOnlyLink
              className={styles.secondaryButton}
              to="/docs/self-hosting/installation/docker">{content.selfHost}</EnOnlyLink>
          )}
        </div>

        <p className={styles.noCredit}>{content.trialDisclaimer}</p>

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
