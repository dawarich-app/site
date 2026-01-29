import React, { useState, useEffect } from 'react';
import styles from './UseCases.module.css';

// Dynamic import for DOMPurify to avoid SSR issues
let DOMPurify;
if (typeof window !== 'undefined') {
  DOMPurify = require('dompurify');
}

const LeafIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 1c1 2 2 4.5 2 8 0 5.5-4.78 11-10 11Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const CameraIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

const PlaneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const useCases = [
  {
    id: 'personal-memory',
    title: 'Personal Memory',
    description: '<p>Automatically build a timeline of your daily life. Search any date or place and instantly see where you were.</p>',
    icon: <LeafIcon />,
    features: [
      'Auto-record movement & visits',
      'Search by place or date',
      'Daily timeline & stats'
    ]
  },
  {
    id: 'photo-integration',
    title: 'Photo Integration',
    description: '<p>Pull photos from Immich or PhotoPrism to display them on the map and import geodata from them into your location history.</p>',
    icon: <CameraIcon />,
    features: [
      'Immich integration',
      'PhotoPrism support',
      'Import geodata from photos'
    ]
  },
  {
    id: 'travel-journal',
    title: 'Travel Journal',
    description: '<p>Turn every trip into a visual story. Combine your location data with photos and notes on an interactive map.</p>',
    icon: <PlaneIcon />,
    features: [
      'Record your data with mobile apps',
      'Photo integration',
      'Visit history'
    ]
  },
  {
    id: 'business-professional',
    title: 'Business Professional',
    description: 'Track business travel for expense reports and tax filings. See trip mileage, office days, and travel summaries.',
    icon: <BriefcaseIcon />,
    features: [
      'Record your data with mobile apps',
      'Get trips mileage'
    ]
  }
];

export default function UseCases() {
  const [activeTab, setActiveTab] = useState(useCases[0].id);
  const activeUseCase = useCases.find(useCase => useCase.id === activeTab);

  return (
    <section className={styles.useCasesSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Use Cases</h2>
        <p className={styles.subtitle}>
          See how Dawarich fits your life.
        </p>

        <div className={styles.tabs}>
          {useCases.map((useCase) => (
            <button
              key={useCase.id}
              className={`${styles.tab} ${activeTab === useCase.id ? styles.active : ''}`}
              onClick={() => setActiveTab(useCase.id)}
            >
              <span className={styles.tabIcon}>{useCase.icon}</span>
              {useCase.title}
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          <div className={styles.tabPanel}>
            <h3 className={styles.useCaseTitle}>{activeUseCase.title}</h3>
            <div
              className={styles.useCaseDescription}
              dangerouslySetInnerHTML={{
                __html: typeof window !== 'undefined'
                  ? DOMPurify.sanitize(activeUseCase.description || '')
                  : activeUseCase.description.replace(/<[^>]*>?/gm, '')
              }}
            />
            <ul className={styles.featuresList}>
              {activeUseCase.features.map((feature, index) => (
                <li key={index} className={styles.featureItem}>
                  <span className={styles.checkIcon}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
