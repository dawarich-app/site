import React, { useState } from 'react';
import PricingCard from './PricingCard';
import EarlyAccessForm from './EarlyAccessForm';
import styles from './PricingSection.module.css';

export default function PricingSection() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

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
            title="Self-hosted"
            price="0"
            period="year"
            description="Full access to all features. Self-hostable."
            features={[
              "Interactive maps and visualizations",
              "10 millions points included",
              "Comprehensive travel statistics",
              "Official mobile app for iOS",
              "Self-hosted privacy and data control"
            ]}
            buttonText="Get Started"
            buttonLink="/docs/intro"
            trialText="No credit card required because you self-host it :)"
          />
          <PricingCard
            className={styles.featuredCard}
            title="Cloud Hosted"
            price="60"
            originalPrice="90"
            period="year"
            description="Let us handle the hosting for you. Early adopter pricing!"
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
            buttonText="Early Access"
            buttonLink={null}
            onButtonClick={openPopup}
            trialText="Limited time offer for early adopters"
          />
        </div>
      </div>

      <div className={styles.note}>
        <a href="/privacy-policy">We don't sell your data.</a>
      </div>

      <EarlyAccessForm isOpen={isPopupOpen} onClose={closePopup} />
    </section>
  );
}
