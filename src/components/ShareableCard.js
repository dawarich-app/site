import React, { useRef, useCallback } from 'react';
import styles from './ShareableCard.module.css';

export default function ShareableCard({ stats }) {
  const cardRef = useRef(null);

  const handleDownload = useCallback(() => {
    if (!cardRef.current) return;

    // Create a canvas to render the card as an image
    const card = cardRef.current;
    const canvas = document.createElement('canvas');
    const scale = 2; // 2x for retina
    canvas.width = 600 * scale;
    canvas.height = 400 * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 600, 400);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.roundRect(0, 0, 600, 400, 16);
    ctx.fill();

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('My Location History Stats', 30, 50);

    // Subtitle
    ctx.fillStyle = '#a0a0b0';
    ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
    if (stats.dateRange) {
      ctx.fillText(
        `${stats.dateRange.start.toLocaleDateString()} - ${stats.dateRange.end.toLocaleDateString()}`,
        30, 75
      );
    }

    // Stats grid
    const statItems = [
      { label: 'Total Distance', value: `${stats.totalDistanceKm.toFixed(0)} km` },
      { label: 'Data Points', value: stats.totalPoints.toLocaleString() },
      { label: 'Places Visited', value: String(stats.uniquePlacesCount) },
      { label: 'Countries', value: String(stats.countries.length) },
    ];

    ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = '#ffffff';

    statItems.forEach((item, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 30 + col * 280;
      const y = 130 + row * 100;

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(item.value, x, y);

      ctx.fillStyle = '#a0a0b0';
      ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(item.label.toUpperCase(), x, y + 22);
    });

    // Branding
    ctx.fillStyle = '#a0a0b0';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Generated with dawarich.app/tools/timeline-statistics', 30, 380);

    // Download
    const link = document.createElement('a');
    link.download = 'my-location-stats.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [stats]);

  if (!stats) return null;

  return (
    <div className={styles.container}>
      <div ref={cardRef} className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>My Location History Stats</h3>
          {stats.dateRange && (
            <span className={styles.dateRange}>
              {stats.dateRange.start.toLocaleDateString()} - {stats.dateRange.end.toLocaleDateString()}
            </span>
          )}
        </div>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.totalDistanceKm.toFixed(0)} km</span>
            <span className={styles.statLabel}>Total Distance</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.totalPoints.toLocaleString()}</span>
            <span className={styles.statLabel}>Data Points</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.uniquePlacesCount}</span>
            <span className={styles.statLabel}>Places Visited</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.countries.length}</span>
            <span className={styles.statLabel}>Countries</span>
          </div>
        </div>
        <div className={styles.branding}>Generated with dawarich.app</div>
      </div>
      <button onClick={handleDownload} className={styles.downloadButton}>
        Download Stats Card as Image
      </button>
    </div>
  );
}
