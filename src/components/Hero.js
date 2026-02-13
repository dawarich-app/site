import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from '@docusaurus/Link';
import styles from './Hero.module.css';

// SVG Icons as components
const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const PlayIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="white" stroke="none">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

export default function Hero() {
  const [modalOpen, setModalOpen] = useState(false);
  const modalVideoRef = useRef(null);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openModal = useCallback(() => {
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    document.body.style.overflow = '';
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
  }, []);

  return (
    <section className={styles.hero}>
      {/* Mesh gradient blobs */}
      <div className={styles.meshBlob1} />
      <div className={styles.meshBlob2} />
      <div className={styles.meshBlob3} />

      <div className={styles.container}>
        <div className={styles.textColumn}>
          <div className={styles.badge} style={{ animationDelay: '0s' }}>
            <MapPinIcon />
            <span>Open-Source Location History Platform</span>
          </div>

          <h1 className={styles.title} style={{ animationDelay: '0.1s' }}>
            Your Life, <span className={styles.highlight}>Mapped</span> Automatically
          </h1>

          <p className={styles.subtitle} style={{ animationDelay: '0.2s' }}>
            Dawarich automatically records where you go and turns your location history into beautiful maps, trips, and stats — all on your own terms, with no data shared with anyone.
          </p>

          <div className={styles.buttons} style={{ animationDelay: '0.3s' }}>
            <Link
              className={styles.primaryButton}
              href="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=hero&utm_campaign=hero">
              Try 7 Days for Free
              <span className={styles.arrow}>
                <ArrowRightIcon />
              </span>
            </Link>
            <button
              className={styles.secondaryButton}
              onClick={scrollToFeatures}>
              Explore Features
            </button>
          </div>

          <p className={styles.noCredit} style={{ animationDelay: '0.4s' }}>No credit card required</p>
        </div>

        <div className={styles.imageColumn}>
          <div className={styles.heroImageContainer} onClick={openModal} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openModal()}>
            <video
              autoPlay
              loop
              muted
              playsInline
              className={styles.heroVideo}
              poster="/img/the_map.png"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
            <div className={styles.imageFadeOverlay} />
            <div className={styles.playButton}>
              <PlayIcon />
            </div>
          </div>
        </div>
      </div>

      {modalOpen && typeof document !== 'undefined' && createPortal(
        <div className={styles.videoModal} onClick={closeModal}>
          <button className={styles.modalClose} onClick={closeModal} aria-label="Close video">
            &times;
          </button>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <video
              ref={modalVideoRef}
              autoPlay
              controls
              playsInline
              className={styles.modalVideo}
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
