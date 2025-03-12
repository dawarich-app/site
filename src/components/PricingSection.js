import React from 'react';
import PricingCard from './PricingCard';
import styles from './PricingSection.module.css';

export default function PricingSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.badge}>Simple Pricing</div>

        <h2 className={styles.title}>Start Tracking Your Journey</h2>

        <p className={styles.subtitle}>
          One straightforward annual subscription with everything you need.
        </p>

        <div className={styles.cardContainer}>
          <PricingCard
            title="Self-hosted"
            price="0"
            period="year"
            description="Full access to all features. Self-hostable."
            features={[
              "Unlimited location history tracking",
              "Interactive maps and visualizations",
              "Comprehensive travel statistics",
              "Self-hosted privacy and data control",
              "Mobile apps for iOS"
            ]}
            buttonText="Get Started"
            buttonLink="/docs/intro"
            trialText="No credit card required because you self-host it :)"
          />
        </div>
      </div>
    </section>
  );
}
