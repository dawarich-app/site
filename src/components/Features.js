import React, { useState } from 'react';
import styles from './Features.module.css';

const RouteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="19" r="3" />
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
    <circle cx="18" cy="5" r="3" />
  </svg>
);

const TabMapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const CrosshairIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="22" y1="12" x2="18" y2="12" />
    <line x1="6" y1="12" x2="2" y2="12" />
    <line x1="12" y1="6" x2="12" y2="2" />
    <line x1="12" y1="22" x2="12" y2="18" />
  </svg>
);

const features = [
  {
    id: 'trips',
    name: 'Trips',
    icon: <RouteIcon />,
    content: {
      title: 'Trip Tracking',
      description: 'Create trips from your recorded data. Set the dates, and Dawarich builds a detailed map with distance, duration, and route — automatically.',
      image: 'img/features-trip-details.png'
    }
  },
  {
    id: 'map',
    name: 'Map',
    icon: <TabMapIcon />,
    content: {
      title: 'Interactive Map',
      description: 'Explore your entire location history on a full interactive map. Zoom into a single street or zoom out to see years of travel at a glance.',
      image: 'img/the_map.png'
    }
  },
  {
    id: 'stats',
    name: 'Stats',
    icon: <BarChartIcon />,
    content: {
      title: 'Travel Statistics',
      description: 'See total distance, most-visited cities and countries, active days, and monthly patterns. Share your stats publicly with a single link.',
      image: 'img/features-stats.png'
    }
  },
  {
    id: 'scratch-map',
    name: 'Scratch Map',
    icon: <GlobeIcon />,
    content: {
      title: 'Scratch Map',
      description: 'Watch countries light up as you visit them. See where you\'ve been and where you still want to go — all at a glance.',
      image: '/img/features-scratch-map.png'
    }
  },
  {
    id: 'tracking',
    name: 'Tracking',
    icon: <CrosshairIcon />,
    content: {
      title: 'Background Tracking',
      description: 'The Dawarich iOS app tracks your location silently in the background. Android users can use OwnTracks, GPSLogger, or other supported apps.',
      image: '/img/features-map-polylines.png'
    }
  }
];

export default function Features() {
  const [activeTab, setActiveTab] = useState('trips');
  const [modalImage, setModalImage] = useState(null);
  const activeFeature = features.find(feature => feature.id === activeTab);

  const openModal = (image, title) => {
    setModalImage({ src: image, alt: title });
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <section id="features" className={styles.featuresSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Powerful Features</h2>
        <p className={styles.subtitle}>
          Everything you need to record, visualize, and relive your location history.
        </p>

        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            {features.map((feature) => (
              <button
                key={feature.id}
                className={`${styles.tabButton} ${activeTab === feature.id ? styles.active : ''}`}
                onClick={() => setActiveTab(feature.id)}
              >
                <span className={styles.tabIcon}>{feature.icon}</span>
                {feature.name}
              </button>
            ))}
          </div>

          <div className={styles.tabContent}>
            <div className={styles.contentWrapper}>
              <div className={styles.textContent}>
                <h3 className={styles.featureTitle}>{activeFeature.content.title}</h3>
                <p className={styles.featureDescription}>{activeFeature.content.description}</p>
              </div>
              <div className={styles.imageContent}>
                <img
                  src={activeFeature.content.image}
                  alt={activeFeature.content.title}
                  className={styles.featureImage}
                  onClick={() => openModal(activeFeature.content.image, activeFeature.content.title)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalImage && (
        <div className={styles.imageModal} onClick={closeModal}>
          <button className={styles.closeButton} onClick={closeModal}>
            ×
          </button>
          <img
            src={modalImage.src}
            alt={modalImage.alt}
            className={styles.modalImage}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
