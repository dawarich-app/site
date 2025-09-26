import React from 'react';
import Link from '@docusaurus/Link';
import PricingCard from './PricingCard';
import styles from './PricingSection.module.css';

export default function PricingSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.badge}>Simple Pricing</div>

        <h2 className={styles.title}>Start Tracking Your Journey</h2>

        {/* <p className={styles.subtitle}>
          One straightforward annual subscription with everything you need.
        </p> */}

        <div className={styles.cardContainer}>
          <PricingCard
            className={styles.featuredCard}
            title="Dawarich Cloud"
            price="90"
            period="year"
            description="Let us handle the hosting for you."
            features={[
              "Interactive maps and visualizations",
              "10 millions points included",
              "Comprehensive travel statistics",
              "Official mobile app for iOS",
              "Automatic updates and maintenance",
              "Automatic backups"
            ]}
            highlightedFeatures={[
              "Automatic updates and maintenance",
              "Automatic backups"
            ]}
            buttonText="Try 7 Days for Free"
            buttonLink="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=pricing&utm_campaign=try7days"
            trialText="No credit card required"
          />
          <PricingCard
            title="Business"
            price={null}
            description="Custom solutions for large teams and organizations."
            features={[
              "Everything in Dawarich Cloud",
              "Custom data limits",
              "Custom integrations",
              "Custom deployment options",
              "Priority support",
              "SLA guarantees",
              "Custom features"
            ]}
            highlightedFeatures={[
              "Custom deployment options",
              "Priority support",
              "SLA guarantees",
              "Custom features"
            ]}
            buttonText="Drop us a line"
            buttonLink="mailto:hi@dawarich.app"
            trialText="Let's discuss your requirements"
          />
        </div>
      </div>

      <div className={styles.selfHostContainer}>
        <Link to="/docs/intro" className={styles.selfHostButton}>
          Or self-host it for free
        </Link>
      </div>
    </section>
  );
}
