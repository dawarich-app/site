import React from 'react';
import Link from '@docusaurus/Link';
import PricingCard from './PricingCard';
import styles from './PricingSection.module.css';

export default function PricingSection() {
  return (
    <section id="pricing" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.badge}>Simple Pricing</div>

        <h2 className={styles.title}>Start Tracking Your Journey</h2>

        <p className={styles.subtitle}>
          Choose the plan that fits your tracking style. Your data is always
          yours — export everything, anytime, on any plan.
        </p>

        <div className={styles.cardContainer}>
          <div className={styles.cardWrapper}>
            <PricingCard
              title="Lite"
              annualPrice={49.99}
              description="A private, managed alternative to Google Timeline for casual trackers."
              features={[
                "iOS & Android native apps",
                "Background location tracking",
                "12 months of searchable history",
                "Unlimited imports & exports",
                "Interactive map with routes",
                "Speed-colored routes & daily replay",
                "Trips & places management",
                "Basic stats & monthly breakdowns",
                "200 req/hr API rate limit",
              ]}
              buttonText="Start Free Trial"
              buttonVariant="secondary"
              buttonLink="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=pricing&utm_campaign=try7dayslite&plan=lite"
              trialText="Annual only — no credit card required"
            />
          </div>

          <div className={styles.featuredCardWrapper}>
            <PricingCard
              className={styles.featuredCard}
              title="Pro"
              annualPrice={119.99}
              monthlyPrice={17.99}
              badge="Most Popular"
              description="Unlimited history, advanced visualizations, and full API access."
              includesLabel="Everything in Lite, plus:"
              features={[
                "Unlimited data history",
                "Heatmap & Fog of War layers",
                "Globe view (3D)",
                "Trip photo integration",
                "Immich / PhotoPrism integration",
                "Full year-in-review & public sharing",
                "Full Write API access",
                "1,000 req/hr API rate limit",
              ]}
              buttonText="Start Free Trial"
              buttonVariant="primary"
              buttonLink="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=pricing&utm_campaign=try7days"
              trialText="No credit card required"
            />
          </div>
        </div>
      </div>

      <div className={styles.selfHostContainer}>
        <Link to="/docs/intro" className={styles.selfHostButton}>
          Or self-host it for free with all features
        </Link>
      </div>
    </section>
  );
}
