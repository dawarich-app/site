import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import styles from './PricingCard.module.css';

export default function PricingCard({
  className,
  title = "Annual Subscription",
  price = "90",
  originalPrice,
  period = "year",
  description = "Full access to all features. Self-hostable.",
  features = [],
  highlightedFeatures = [], // Only this determines which features are highlighted
  buttonText = "Get Started",
  buttonLink = "/pricing",
  onButtonClick,
  trialText = "No credit card required to start your free 14-day trial",
  disabled = false
}) {
  const [isAnnual, setIsAnnual] = useState(true);

  // Only show toggle for non-Business plans
  const isBusinessPlan = title === "Business" || title === "Business Plan";

  // Calculate pricing based on toggle state
  // New prices starting Feb 1, 2026
  const newAnnualPrice = 120;
  const newMonthlyPrice = 17.99;

  // Current discounted prices
  const annualPrice = 90;
  const monthlyPrice = 14.99;
  const monthlyEquivalent = (annualPrice / 12).toFixed(1);

  const displayPrice = isBusinessPlan ? price : (isAnnual ? annualPrice : monthlyPrice);
  const displayOriginalPrice = isBusinessPlan ? null : (isAnnual ? newAnnualPrice : newMonthlyPrice);
  const displayPeriod = isBusinessPlan ? period : (isAnnual ? 'year' : 'month');

  return (
    <div className={`${styles.pricingCard} ${className || ''} ${disabled ? styles.disabled : ''}`}>
      <h2 className={styles.title}>{title}</h2>

      {/* Billing Period Toggle - only show for non-Business plans */}
      {!isBusinessPlan && (
        <div className={styles.toggleContainer}>
          <button
            className={`${styles.toggleButton} ${!isAnnual ? styles.active : ''}`}
            onClick={() => setIsAnnual(false)}
            disabled={disabled}
          >
            Monthly
          </button>
          <div className={styles.toggleButtonWrapper}>
            <button
              className={`${styles.toggleButton} ${isAnnual ? styles.active : ''}`}
              onClick={() => setIsAnnual(true)}
              disabled={disabled}
            >
              Annual
            </button>
            <sup className={styles.discountBadge}>Best deal!</sup>
          </div>
        </div>
      )}

      {price !== null && (
        <div className={styles.priceContainer}>
          {!isBusinessPlan && (
            <div className={styles.discountNotice}>
              <div>Limited time discount!</div>
              <div>Prices increase to €{displayOriginalPrice}/{displayPeriod} on Feb 1, 2026</div>
            </div>
          )}
          <div className={styles.mainPrice}>
            {!isBusinessPlan && displayOriginalPrice && (
              <span className={styles.originalPrice}>€{displayOriginalPrice}</span>
            )}
            <span className={styles.currentPrice}>€{displayPrice}</span>/{displayPeriod}
          </div>
          {!isBusinessPlan && isAnnual && (
            <div className={styles.equivalentPrice}>
              (€{monthlyEquivalent}/month)
            </div>
          )}
        </div>
      )}

      {price === null && (
        <div className={styles.priceContainer}>
          <div className={styles.mainPrice}>
            <span className={styles.currentPrice}>Custom</span>
          </div>
        </div>
      )}

      <p className={styles.description}>{description}</p>

      <ul className={styles.featuresList}>
        {features.map((feature, index) => (
          <li
            key={index}
            className={`${styles.featureItem} ${highlightedFeatures.includes(feature) ? styles.highlighted : ''}`}
          >
            <span className={styles.checkmark}>✓</span>
            {feature}
          </li>
        ))}
      </ul>

      {buttonLink && buttonLink !== null ? (
        <Link
          to={buttonLink}
          className={`${styles.ctaButton} ${disabled ? styles.disabledButton : ''}`}
          aria-disabled={disabled}
        >
          {buttonText}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onButtonClick}
          className={`${styles.ctaButton} ${disabled ? styles.disabledButton : ''}`}
          disabled={disabled}
        >
          {buttonText}
        </button>
      )}

      {trialText && (
        <p className={styles.trialText} style={{ marginTop: '1rem' }}>{trialText}</p>
      )}
    </div>
  );
}
