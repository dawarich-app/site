import React, { useState } from 'react';
import Link from '@docusaurus/Link';
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
            title="Early bird"
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
            buttonText="Sold out"
            buttonLink={null}
            trialText="Limited time offer for early adopters"
            disabled={true}
          />
          <PricingCard
            className={styles.featuredCard}
            title="Cloud Hosted"
            price="90"
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
            buttonText="Join the waitlist"
            buttonLink={null}
            onButtonClick={openPopup}
            trialText=""
          />
        </div>
      </div>

      <div className={styles.selfHostContainer}>
        <Link to="/docs/intro" className={styles.selfHostButton}>
          Or self-host it for free
        </Link>
      </div>

      <div className={styles.note}>
        <a href="/privacy-policy">We don't sell your data.</a>
      </div>

      <EarlyAccessForm isOpen={isPopupOpen} onClose={closePopup} />
    </section>
  );
}
