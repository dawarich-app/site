import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import styles from './Hero.module.css';
import EarlyAccessForm from './EarlyAccessForm';

export default function Hero() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Your Journey, <span className={styles.highlight}>Your Control</span>
        </h1>
        <p className={styles.subtitle}>
          Visualize your location history, track your movements, and analyze your travel patterns
          with complete privacy and control.
        </p>
        <div className={styles.buttons}>
          <Link
            className={styles.primaryButton}
            to="/docs/intro">
            Get Started <span className={styles.arrow}>→</span>
          </Link>
          <Link
            className={styles.secondaryButton}
            to="/docs/features/tracking-location-history">
            Explore Features
          </Link>
          <button
            className={styles.earlyAccessButton}
            onClick={openPopup}>
            Early Access
          </button>
        </div>
      </div>

      {/* Early Access Form Component */}
      <EarlyAccessForm isOpen={isPopupOpen} onClose={closePopup} />
    </section>
  );
}
