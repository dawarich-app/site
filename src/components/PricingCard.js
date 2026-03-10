import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import styles from './PricingCard.module.css';

export default function PricingCard({
  className,
  title = "Annual Subscription",
  annualPrice = 120,
  monthlyPrice = null,
  description = "Full access to all features.",
  features = [],
  includesLabel = null,
  buttonText = "Get Started",
  buttonLink = "/pricing",
  buttonVariant = "primary",
  trialText = null,
  badge = null,
  disabled = false
}) {
  const [isAnnual, setIsAnnual] = useState(true);
  const hasMonthly = monthlyPrice !== null;

  const displayPrice = isAnnual || !hasMonthly ? annualPrice : monthlyPrice;
  const displayPeriod = isAnnual || !hasMonthly ? 'year' : 'month';
  const monthlyEquivalent = (annualPrice / 12).toFixed(2);

  return (
    <div className={`${styles.pricingCard} ${className || ''} ${disabled ? styles.disabled : ''}`}>
      {badge && <div className={styles.planBadge}>{badge}</div>}
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.priceContainer}>
        <div className={styles.mainPrice}>
          <span className={styles.currency}>&euro;</span>
          <span className={styles.currentPrice}>{displayPrice}</span>
          <span className={styles.period}>/{displayPeriod}</span>
        </div>
        {(isAnnual || !hasMonthly) && (
          <div className={styles.equivalentPrice}>
            &euro;{monthlyEquivalent}/month
          </div>
        )}
      </div>

      {hasMonthly && (
        <div className={styles.toggleContainer}>
          <div className={styles.toggleTrack}>
            <button
              className={`${styles.toggleButton} ${!isAnnual ? styles.active : ''}`}
              onClick={() => setIsAnnual(false)}
              disabled={disabled}
            >
              Monthly
            </button>
            <button
              className={`${styles.toggleButton} ${isAnnual ? styles.active : ''}`}
              onClick={() => setIsAnnual(true)}
              disabled={disabled}
            >
              Annual
            </button>
          </div>
          {isAnnual && monthlyPrice && (
            <span className={styles.saveBadge}>
              Save {Math.round((1 - annualPrice / (monthlyPrice * 12)) * 100)}%
            </span>
          )}
        </div>
      )}

      <p className={styles.description}>{description}</p>

      <div className={styles.divider} />

      {includesLabel && (
        <div className={styles.includesLabel}>{includesLabel}</div>
      )}

      <ul className={styles.featuresList}>
        {features.map((feature, index) => (
          <li key={index} className={styles.featureItem}>
            <span className={styles.checkIcon}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M11.5 3.5L5.5 10L2.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className={styles.featureText}>{feature}</span>
          </li>
        ))}
      </ul>

      {buttonLink && (
        <Link
          to={buttonLink}
          className={`${styles.ctaButton} ${styles[buttonVariant]} ${disabled ? styles.disabledButton : ''}`}
          aria-disabled={disabled}
        >
          {buttonText}
        </Link>
      )}

      {trialText && (
        <p className={styles.trialText}>{trialText}</p>
      )}
    </div>
  );
}
