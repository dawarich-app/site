import React from 'react';
import Link from '@docusaurus/Link';
import styles from './PrivacySection.module.css';

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22S4 18 4 12V6L12 2L20 6V12C20 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="11" width="18" height="10" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
    <path d="M7 11V7A5 5 0 0 1 17 7V11" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const ServerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="20" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
    <rect x="2" y="9" width="20" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
    <rect x="2" y="15" width="20" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
    <line x1="6" y1="5" x2="6.01" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="6" y1="11" x2="6.01" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="6" y1="17" x2="6.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const GDPRIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function PrivacySection() {
  return (
    <section className={styles.privacySection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Your Data, Your Privacy</h2>
        <p className={styles.subtitle}>
          We take your privacy seriously. Your location data is protected with enterprise-grade security and stored according to the highest privacy standards.
        </p>

        <div className={styles.grid}>
          <div className={styles.privacyCard}>
            <div className={styles.iconWrapper}>
              <LockIcon />
            </div>
            <h3 className={styles.cardTitle}>Encrypted in Transit</h3>
            <p className={styles.cardDescription}>
              All data transmission uses SSL/TLS encryption to protect your information from interception during transfer.
            </p>
          </div>

          <div className={styles.privacyCard}>
            <div className={styles.iconWrapper}>
              <ShieldIcon />
            </div>
            <h3 className={styles.cardTitle}>Encrypted at Rest</h3>
            <p className={styles.cardDescription}>
              Your data is stored with LUKS encryption, ensuring it remains secure even at the storage level.
            </p>
          </div>

          <div className={styles.privacyCard}>
            <div className={styles.iconWrapper}>
              <ServerIcon />
            </div>
            <h3 className={styles.cardTitle}>Based in Europe</h3>
            <p className={styles.cardDescription}>
              All servers are located in Europe, providing additional privacy protection under strict European data laws.
            </p>
          </div>

          <div className={styles.privacyCard}>
            <div className={styles.iconWrapper}>
              <GDPRIcon />
            </div>
            <h3 className={styles.cardTitle}>GDPR Compliant</h3>
            <p className={styles.cardDescription}>
              Fully compliant with GDPR regulations, giving you complete control over your personal data and privacy rights.
            </p>
          </div>
        </div>

        <div className={styles.policyLinkContainer}>
          <Link to="/privacy-policy" className={styles.policyLink}>
            Read our full Privacy Policy →
          </Link>
        </div>
      </div>
    </section>
  );
}
