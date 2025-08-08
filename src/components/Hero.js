import React, { useState, useMemo } from 'react';
import Link from '@docusaurus/Link';
import styles from './Hero.module.css';
import { randomDateFiveToThreeYearsAgo } from '../utils/date';

export default function Hero() {
  const [showVideo, setShowVideo] = useState(false);
  const formattedRandomPastDate = useMemo(() => {
    const d = randomDateFiveToThreeYearsAgo();
    const day = d.getDate();
    const suffix = (n) => {
      const j = n % 10, k = n % 100;
      if (j === 1 && k !== 11) return 'st';
      if (j === 2 && k !== 12) return 'nd';
      if (j === 3 && k !== 13) return 'rd';
      return 'th';
    };
    const month = d.toLocaleString('en-US', { month: 'long' });
    const year = d.getFullYear();
    return `${month} ${day}${suffix(day)}, ${year}`;
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Your Life, <span className={styles.highlight}>Mapped Automatically</span>
        </h1>
        <p className={styles.subtitle}>
          Do you remember where you've been on <span className={styles.dateHighlight}>{formattedRandomPastDate}</span>? We do. Dawarich helps you remember the places you’ve been and the life you’ve lived — day by day, on a beautiful private timeline only you control.
        </p>

        {/* Video Player Section */}
        <div className={styles.videoSection}>
          <div className={styles.videoContainer} onClick={() => setShowVideo(true)}>
            <div className={styles.videoThumbnail}>
              <img
                src="/img/dawarich-demo-preview.png"
                alt="Dawarich Demo Preview"
                className={styles.videoPreviewImage}
              />
              <div className={styles.videoOverlay}>
                <div className={styles.playButton}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5v14l11-7z" fill="currentColor"/>
                  </svg>
                </div>
                <div className={styles.videoText}>
                  <span>Watch Demo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.buttons}>
          <Link
            className={styles.earlyAccessButton}
            href="https://my.dawarich.app">
            Sign up now!
          </Link>
          <Link
            className={styles.secondaryButton}
            to="/docs/features/tracking-location-history">
            Explore Features
          </Link>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className={styles.videoModal} onClick={() => setShowVideo(false)}>
          <div className={styles.videoModalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.videoCloseButton}
              onClick={() => setShowVideo(false)}
            >
              ×
            </button>
            <video
              className={styles.videoPlayer}
              controls
              autoPlay
              src="/dawarich_demo.webm"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </section>
  );
}
