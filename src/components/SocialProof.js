import React, { useEffect, useRef, useState } from 'react';
import styles from './SocialProof.module.css';

const StarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const PeopleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function formatNumber(num) {
  if (num >= 1_000_000_000) {
    const val = num / 1_000_000_000;
    return val % 1 === 0 ? `${val}B` : `${val.toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    const val = num / 1_000_000;
    return val % 1 === 0 ? `${val}M` : `${val.toFixed(1)}M`;
  }
  return num.toLocaleString('en-US');
}

const metrics = [
  { target: 7900, suffix: '+', label: 'GitHub Stars', icon: <StarIcon /> },
  { target: 1_000_000, suffix: '+', label: 'Docker Pulls', icon: <DownloadIcon /> },
  { target: 2000, suffix: '+', label: 'Users', icon: <PeopleIcon /> },
  { target: 1_000_000_000, suffix: '+', label: 'Points Tracked', icon: <MapPinIcon /> },
];

const integrations = [
  'Google Takeout',
  'OwnTracks',
  'Immich',
  'PhotoPrism',
  'GPSLogger',
];

function useCountUp(target, duration, shouldStart) {
  const [display, setDisplay] = useState('0');
  const rafRef = useRef(null);

  useEffect(() => {
    if (!shouldStart) return;

    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentValue = Math.round(easedProgress * target);

      setDisplay(formatNumber(currentValue));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, duration, shouldStart]);

  return display;
}

function AnimatedMetric({ target, suffix, label, icon }) {
  const display = useCountUp(target, 2000, true);

  return (
    <div className={styles.metric}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.value}>
        {display}{suffix}
      </div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}

export default function SocialProof() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.socialProof}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {metrics.map((metric, index) => (
            isVisible ? (
              <AnimatedMetric
                key={index}
                target={metric.target}
                suffix={metric.suffix}
                label={metric.label}
                icon={metric.icon}
              />
            ) : (
              <div key={index} className={styles.metric}>
                <div className={styles.icon}>{metric.icon}</div>
                <div className={styles.value}>0{metric.suffix}</div>
                <div className={styles.label}>{metric.label}</div>
              </div>
            )
          ))}
        </div>

        <div className={styles.divider} />

        <div className={styles.integrations}>
          <span className={styles.integrationsLabel}>Works with</span>
          <div className={styles.integrationsList}>
            {integrations.map((name) => (
              <span key={name} className={styles.integrationPill}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
