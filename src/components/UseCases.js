import React, { useState, useEffect } from 'react';
import styles from './UseCases.module.css';

// Dynamic import for DOMPurify to avoid SSR issues
let DOMPurify;
if (typeof window !== 'undefined') {
  DOMPurify = require('dompurify');
}

const useCases = [
  {
    id: 'life-logging',
    title: 'Life Logging',
    description: '<p>Track your daily life with Dawarich. Import your location history and photos to create a comprehensive life journal.</p>',
    icon: '🍃',
    features: [
      'Auto-record movement & visits',
      'Search by place or date',
      'Daily timeline & stats'
    ]
  },
  {
    id: 'photo-geotagging',
    title: 'Photo Geotagging',
    description: '<p>Use your location history to geotag your photos. See your photos on the map and relive your memories with precise location data.</p>',
    icon: '📸',
    features: [
      'Immich integration',
      'Photoprism support'
    ]
  },
  {
    id: 'travel-journal',
    title: 'Travel Journal',
    description: '<p>Create a <strong>comprehensive travel journal</strong> by combining location history with photos and notes. Visualize your trips on an interactive map with detailed statistics.</p>',
    icon: '✈️',
    features: [
      'Record your data with mobile apps',
      'Photo integration',
      'Visit history'
    ]
  },
  {
    id: 'business-professional',
    title: 'Business Professional',
    description: 'Get full picture of your business trips for reimbursements or tax purposes. See how much you traveled, how many days you visted office and make your tax declaration based on the facts.',
    icon: '💼',
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
          Discover how Dawarich can fit into your lifestyle with these common use cases.
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
