import React, { useState } from 'react';
import styles from './Features.module.css';

const features = [
  {
    id: 'trips',
    name: 'Trips',
    content: {
      title: 'Track Your Trips',
      description: 'Track your movements while on trip, and when you\'re back home, just create a trip, set dates of your travel, and Dawarich will automatically create a map of your trip, showing where you\'ve been, distance, duration and more.',
      image: 'img/features-trip-details.png'
    }
  },
  {
    id: 'map',
    name: 'Map',
    content: {
      title: 'Interactive Location Visualization',
      description: 'Explore your location history on an interactive map. Zoom in to see detailed paths or zoom out for a broader view of your travels. Our map provides a clear and engaging way to visualize your movements over time.',
      image: 'img/the_map.png'
    }
  },
  {
    id: 'stats',
    name: 'Stats',
    content: {
      title: 'Comprehensive Analytics',
      description: 'Gain insights into your travel patterns with detailed statistics. View metrics such as total distance traveled, most active days and months of the year, what cities and countries you have visited. You can also share your stats with friends and family using publicly shareable links.',
      image: 'img/features-stats.png'
    }
  },
  {
    id: 'scratch-map',
    name: 'Scratch Map',
    content: {
      title: 'Scratch Map',
      description: 'Visualize your travel history with our unique scratch map feature. As you visit new countries, they get revealed on your personal scratch map, allowing you to see at a glance where you\'ve been and where you\'ve yet to explore.',
      image: '/img/features-scratch-map.png'
    }
  },
  {
    id: 'tracking',
    name: 'Live Location Tracking',
    content: {
      title: 'Real-time Location Updates',
      description: 'Use our iOS app to track your location in real-time. Your location data is securely uploaded to your private Dawarich account, ensuring you have a continuous and accurate record of your movements without compromising your privacy. For android users, multiple third-party apps are supported to upload your location history to Dawarich.',
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
        <h2 className={styles.title}>Everything You Need</h2>
        <p className={styles.subtitle}>
          Dawarich offers a lifestyle tracking tool that helps you remember your life's journey.
        </p>

        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            {features.map((feature) => (
              <button
                key={feature.id}
                className={`${styles.tabButton} ${activeTab === feature.id ? styles.active : ''}`}
                onClick={() => setActiveTab(feature.id)}
              >
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
