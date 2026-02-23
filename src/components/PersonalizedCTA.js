import React from 'react';
import styles from './PersonalizedCTA.module.css';

const SIGNUP_BASE_URL = 'https://my.dawarich.app/users/sign_up';

function buildSignupUrl(toolName) {
  return `${SIGNUP_BASE_URL}?utm_source=tool&utm_medium=personalized-cta&utm_campaign=${toolName}`;
}

export default function PersonalizedCTA({ toolName, headline, stats }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {stats && stats.length > 0 && (
          <div className={styles.pills}>
            {stats.map((stat, idx) => (
              <span key={idx} className={styles.pill}>
                <span className={styles.pillValue}>{stat.value}</span>
                <span className={styles.pillLabel}>{stat.label}</span>
              </span>
            ))}
          </div>
        )}

        <h3
          className={styles.headline}
          dangerouslySetInnerHTML={{ __html: headline }}
        />

        <p className={styles.body}>
          Self-hosted or cloud. No credit card required.
        </p>

        <a
          href={buildSignupUrl(toolName)}
          className={styles.button}
          target="_blank"
          rel="noopener noreferrer"
        >
          Start Your Free Trial
        </a>
      </div>
    </div>
  );
}
