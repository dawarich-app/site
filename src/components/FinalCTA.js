import React from 'react';
import Link from '@docusaurus/Link';
import styles from './FinalCTA.module.css';

export default function FinalCTA() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Column: CTA */}
          <div className={styles.ctaColumn}>
            <h2 className={styles.title}>Ready to map your journey?</h2>
            <p className={styles.subtitle}>
              Start your free trial today or self-host for complete control.
            </p>
            <Link
              to="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=final_cta&utm_campaign=try7days"
              className={styles.primaryButton}
            >
              Try 7 Days Free
            </Link>
          </div>

          {/* Right Column: Newsletter */}
          <div className={styles.newsletterColumn}>
            <h3 className={styles.newsletterTitle}>Stay Updated</h3>
            <p className={styles.newsletterSubtitle}>
              Get the latest news, features, and tips delivered to your inbox.
            </p>
            <iframe
              width="540"
              height="500"
              src="https://475728ae.sibforms.com/serve/MUIFAJLZJwZyy-W4PJAFc573ygtVeBn5fgINSOiVsmxzDKkjxeC96kVh_EVbvVN-hW4wCbGvIAPzrujZeSPpPbwUAXLZJfmGXHdmWG0208oNcTG4B20KmYDGdFhxs9Bos4UdurRT8dkzD_NjdRoMqg4A1_yAtpB5mHDbP_lT5mHAQIiamOmMomRSCEWWnFyk24LKJ6DqyhJze0By"
              frameBorder="0"
              scrolling="no"
              allowFullScreen
              className={styles.newsletterIframe}
              title="Newsletter signup"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
