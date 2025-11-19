import React, { useState, useEffect } from 'react';
import styles from './PromoBanner.module.css';

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const isDismissed = localStorage.getItem('dawarichPromoBannerDismissed');
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('dawarichPromoBannerDismissed', 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <span className={styles.emoji}>🎉</span>
        <span className={styles.text}>
          Use promo code <strong className={styles.promoCode}>BLACKFRIDAY</strong> at checkout for <strong>15% off</strong> your first month or year!
        </span>
        <button
          onClick={handleClose}
          className={styles.closeButton}
          aria-label="Close promotional banner"
        >
          ×
        </button>
      </div>
    </div>
  );
}
