import React, { useState, useEffect } from 'react';
import { ColumnChart } from 'react-chartkick';
import 'chartkick/chart.js';
import styles from './StatsSection.module.css';

// Icons for the stats section
const ChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 13V17M12 9V17M16 5V17M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CompassIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Feature item component for the stats section
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

// Stats section component with interactive chart
export default function StatsSection() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Sample data for the chart based on the image
  const chartData = {
    "January": 4800,
    "February": 1200,
    "March": 1000,
    "April": 1600,
    "May": 1500,
    "June": 0,
    "July": 0,
    "August": 0,
    "September": 0,
    "October": 0,
    "November": 0,
    "December": 0
  };

  // Check for dark mode and setup an observer for theme changes
  useEffect(() => {
    // Initial theme check
    const checkTheme = () => {
      const darkModeEnabled = document.documentElement.getAttribute('data-theme') === 'dark';
      setIsDarkTheme(darkModeEnabled);
    };

    // Initial check
    checkTheme();

    // Watch for theme changes using a mutation observer
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, []);

  // Define chart options based on theme
  const chartColors = ["#3b54c8"];
  const chartOptions = {
    scales: {
      y: {
        title: {
          display: true,
          text: 'Distance',
          color: isDarkTheme ? '#9ca3af' : '#4b5563'
        },
        grid: {
          color: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDarkTheme ? '#9ca3af' : '#4b5563',
          callback: function(value) {
            return value + ' km';
          }
        }
      },
      x: {
        title: {
          display: true,
          color: isDarkTheme ? '#9ca3af' : '#4b5563'
        },
        grid: {
          color: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDarkTheme ? '#9ca3af' : '#4b5563'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <section className={styles.statsSection}>
      <div className={styles.containerSplit}>
        {/* Left side - Text content */}
        <div className={styles.textContent}>
          <h2 className={styles.title}>Journey Statistics</h2>
          <p className={styles.description}>
            Dawarich transforms your travel data into meaningful insights that help you understand your movement patterns.
          </p>

          <div className={styles.features}>
            <FeatureItem
              icon={<ChartIcon />}
              title="Track Your Adventures"
              description="Get detailed travel insights that show you exactly how far you've traveled, when, and where."
            />

            <FeatureItem
              icon={<CompassIcon />}
              title="Discover Patterns"
              description="Gain insights into your travel habits across countries, cities, and different time periods."
            />
          </div>
        </div>

        {/* Right side - Chart content */}
        <div className={styles.chartContent}>
          <div className={styles.statsCard}>
            <div className={styles.statsHeader}>
              <div className={styles.statsTitle}>
                <h3 className={styles.year}>2025 <a href="https://demo.dawarich.app" className={styles.mapLink}>[Map]</a></h3>
                <p className={styles.totalDistance}>9,607km</p>
              </div>
              <div className={styles.statsSummary}>
                <p className={styles.statsSummaryText}>5 countries, 49 cities</p>
              </div>
            </div>
            <div className={styles.chartContainer}>
              <ColumnChart
                data={chartData}
                height="300px"
                suffix=" km"
                colors={chartColors}
                ytitle="Distance"
                library={chartOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
