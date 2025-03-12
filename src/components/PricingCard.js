import React from 'react';
import Link from '@docusaurus/Link';
import styles from './PricingCard.module.css';

export default function PricingCard({
  title = "Annual Subscription",
  price = "49",
  period = "year",
  description = "Full access to all features. Self-hostable.",
  features = [
    "Unlimited location history tracking",
    "Interactive maps and visualizations",
    "Comprehensive travel statistics",
    "Self-hosted privacy and data control",
    "Mobile apps for iOS and Android",
    "Free updates for the subscription period"
  ],
  buttonText = "Get Started",
  buttonLink = "/pricing",
  trialText = "No credit card required to start your free 14-day trial"
}) {
  return (
    <div className={styles.pricingCard}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.priceContainer}>
        <span className={styles.euroSign}>€</span>
        <span className={styles.price}>{price}</span>
        <span className={styles.period}>/{period}</span>
      </div>

      <p className={styles.description}>{description}</p>

      <ul className={styles.featuresList}>
        {features.map((feature, index) => (
          <li key={index} className={styles.featureItem}>
            <span className={styles.checkmark}>✓</span>
            {feature}
          </li>
        ))}
      </ul>

      <Link
        to={buttonLink}
        className={styles.ctaButton}
      >
        {buttonText}
      </Link>

      {trialText && (
        <p className={styles.trialText}>{trialText}</p>
      )}
    </div>
  );
}
