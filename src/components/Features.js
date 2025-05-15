import React from 'react';
import FeatureCard from './FeatureCard';
import StatsSection from './StatsSection';
import styles from './Features.module.css';

// Import icons from a library like react-icons, or use custom SVGs
// For this example, I'll create simple SVG components to match the image

const MapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 20L3 17V4L9 7M9 20L15 17M9 20V7M15 17L21 20V7L15 4M15 17V4M9 7L15 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 10L12 4L19 10M5 10V20M5 10H3M19 10V20M19 10H21M5 20H19M5 20H3M19 20H21M9 20V14H15V20M9 20H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StatsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 14L12 9L16 13L21 8M7 14L3 10M7 14V18M21 8V18M21 18H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RouteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Features() {
  return (
    <>
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.title}>Everything You Need</h2>
          <p className={styles.subtitle}>
            Dawarich offers a comprehensive suite of tools to help you track, visualize, and understand your movements.
          </p>

          <div className={styles.grid}>
            <FeatureCard
              icon={<MapIcon />}
              title="Visualize Your Location History"
              description="See your movements over time with beautiful, interactive maps and timelines."
            />

            <FeatureCard
              icon={<TrackIcon />}
              title="Continuously Track Your Location"
              description="Set up automatic tracking that works reliably in the background with minimal battery impact."
            />

            <FeatureCard
              icon={<StatsIcon />}
              title="Comprehensive Travel Statistics"
              description="Gain insights into your travel patterns, distances, frequently visited places, and more."
            />

            <FeatureCard
              icon={<RouteIcon />}
              title="Remember Your Journeys"
              description="Get back in time and relive your journeys with detailed route visualizations and point-to-point analysis."
            />
          </div>
        </div>
      </section>
    </>
  );
}
