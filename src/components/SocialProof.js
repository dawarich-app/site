import React from 'react';
import styles from './SocialProof.module.css';

const StarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const PeopleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const metrics = [
  { value: '9,000+', label: 'GitHub Stars', icon: <StarIcon /> },
  { value: '1M+', label: 'Docker Pulls', icon: <DownloadIcon /> },
  { value: '2,000+', label: 'Users', icon: <PeopleIcon /> },
  { value: '1B+', label: 'Points Tracked', icon: <MapPinIcon /> },
];

export default function SocialProof() {
  return (
    <section className={styles.socialProof}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {metrics.map((metric, index) => (
            <div key={index} className={styles.metric}>
              <div className={styles.icon}>{metric.icon}</div>
              <div className={styles.value}>{metric.value}</div>
              <div className={styles.label}>{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
