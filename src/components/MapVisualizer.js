import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import StaticMap from './StaticMap';
import styles from './MapVisualizer.module.css';

// Feature item component for the right side
function FeatureItem({ icon, title, description }) {
  return (
    <div className={styles.featureItem}>
      <div className={styles.featureIcon}>
        {icon}
      </div>
      <div className={styles.featureContent}>
        <h4 className={styles.featureTitle}>{title}</h4>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </div>
  );
}

// Icons as SVG components
const EyeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 12C22 12 18.5 16 12 16C5.5 16 2 12 2 12C2 12 5.5 8 12 8C18.5 8 22 12 22 12Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"/>
    <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"/>
    <path d="M5 8L2 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 8L22 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 16L2 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 16L22 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MapStylesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 4V20M6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LandmarkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C14.2091 2 16 3.79086 16 6C16 8.20914 14.2091 10 12 10C9.79086 10 8 8.20914 8 6C8 3.79086 9.79086 2 12 2ZM12 2V10M9 22V16C9 14.8954 8.10457 14 7 14H5M15 22V16C15 14.8954 15.8954 14 17 14H19M5 22H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function MapVisualizer() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left side - Map visualization */}
          <div className={styles.mapColumn}>
            <div className={styles.mapWrapper}>
              <StaticMap />
            </div>
          </div>

          {/* Right side - Features description */}
          <div className={styles.contentColumn}>
            <h2 className={styles.title}>Your Life's Journey, Visualized</h2>

            <p className={styles.description}>
              Dawarich transforms your location data into beautiful, interactive visualizations
              that help you understand your movement patterns over time.
            </p>

            <div className={styles.features}>
              <FeatureItem
                icon={<EyeIcon />}
                title="Precise Route Tracking"
                description="Automatically detect starts and stops, with precise route visualization between points."
              />

              <FeatureItem
                icon={<MapStylesIcon />}
                title="Customizable Map Styles"
                description="Choose from various map styles to match your preferences."
              />

              <FeatureItem
                icon={<LandmarkIcon />}
                title="Landmark Detection*"
                description="Automatically identify and label important locations based on your visit patterns."
              />
            </div>
          </div>
        </div>

        {/* Centered muted text below both columns */}
        <div className={styles.mutedNote}>
          * To be released soon!
        </div>
      </div>
    </section>
  );
}
