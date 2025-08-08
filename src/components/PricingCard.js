import React from 'react';
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
  // Calculate monthly price if period is year
  const monthlyPrice = period === 'year' ? (price / 12).toFixed(2) : null;

  return (
    <div className={`${styles.pricingCard} ${className || ''} ${disabled ? styles.disabled : ''}`}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.priceContainer}>
        <div className={styles.mainPrice}>
          {originalPrice && (
            <span className={styles.originalPrice}>€{originalPrice}</span>
          )}
          <span className={styles.currentPrice}>€{price}</span>
          <span className={styles.period}>
            /{originalPrice && price > 0 && (
              <span>first </span>
            )}year
          </span>
        </div>
        {monthlyPrice && (
          <>

            <div className={styles.monthlyPrice}>
              €{monthlyPrice}/month, billed annually
            </div>
          </>
        )}
      </div>

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
        <p className={styles.trialText}>{trialText}</p>
      )}
    </div>
  );
}
