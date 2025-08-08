import React from 'react';
import FeatureCard from './FeatureCard';
import styles from './Features.module.css';

const MapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 6H12.01M9 20L3 17V4L5 5M9 20L15 17M9 20V14M15 17L21 20V7L19 6M15 17V14M15 6.2C15 7.96731 13.5 9.4 12 11C10.5 9.4 9 7.96731 9 6.2C9 4.43269 10.3431 3 12 3C13.6569 3 15 4.43269 15 6.2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
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
            Dawarich offers a lifestyle tracking tool that helps you remember your life's journey.
          </p>

          <div className={styles.grid}>

            <FeatureCard
              icon={<TrackIcon />}
              title="Continuously Track Your Location"
              description="Set up automatic tracking that works reliably in the background with minimal battery impact."
            />

            <FeatureCard
              icon={<MapIcon />}
              title="Visualize Your Location History"
              description="See your movements over time with beautiful, interactive maps and timelines."
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
