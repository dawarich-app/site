import React, { useEffect } from 'react';
import styles from './EarlyAccessForm.module.css';

export default function EarlyAccessForm({ isOpen, onClose }) {
  // Load Tally script when the form is opened
  useEffect(() => {
    if (isOpen) {
      const loadTallyScript = () => {
        if (typeof window !== 'undefined' && typeof window.Tally === 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://tally.so/widgets/embed.js';
          script.async = true;
          script.onload = () => {
            if (typeof window.Tally !== 'undefined') {
              window.Tally.loadEmbeds();
            }
          };
          document.body.appendChild(script);
        } else if (typeof window !== 'undefined' && typeof window.Tally !== 'undefined') {
          window.Tally.loadEmbeds();
        }
      };

      loadTallyScript();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2>Get Early Access</h2>
        <p>Join our waitlist to be among the first to try Dawarich.</p>
        <div className={styles.formContainer}>
          <iframe
            data-tally-src="https://tally.so/embed/wbvBLg?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
            loading="lazy"
            width="100%"
            height="177"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Dawarich Early Access">
          </iframe>
        </div>
      </div>
    </div>
  );
}
