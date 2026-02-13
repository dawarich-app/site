import React from 'react';
import Link from '@docusaurus/Link';
import styles from './CTABanner.module.css';

export default function CTABanner() {
  return (
    <section className={styles.banner}>
      <div className={styles.content}>
        <h2 className={styles.headline}>Start mapping your life today</h2>
        <div className={styles.buttons}>
          <Link
            className={styles.primaryButton}
            href="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=cta_banner&utm_campaign=try7days"
          >
            Try 7 Days Free
          </Link>
          <Link
            className={styles.ghostButton}
            to="/docs/intro"
          >
            View Documentation
          </Link>
        </div>
      </div>
    </section>
  );
}
