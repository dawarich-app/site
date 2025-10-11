import React from 'react';
import styles from './TimelineInfo.module.css';

export default function TimelineInfo({ selectedPoint, isVisible, onClose }) {
  if (!isVisible || !selectedPoint) {
    return null;
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatCoordinate = (value) => {
    return value?.toFixed(7) || 'N/A';
  };

  const getPointTypeLabel = (type) => {
    const labels = {
      'place_visit': 'Place Visit',
      'location_record': 'Location Record',
      'activity_start': 'Activity Start',
      'activity_end': 'Activity End',
      'place_aggregate': 'Place Aggregate',
      'raw_signal': 'Raw Signal',
    };
    return labels[type] || type;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Point Details</h3>
        <button onClick={onClose} className={styles.closeButton} aria-label="Close">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.badge}>
            {getPointTypeLabel(selectedPoint.type)}
          </div>
        </div>

        {/* Location Name/Address */}
        {(selectedPoint.name || selectedPoint.address) && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Location</h4>
            {selectedPoint.name && (
              <p className={styles.locationName}>{selectedPoint.name}</p>
            )}
            {selectedPoint.address && (
              <p className={styles.address}>{selectedPoint.address}</p>
            )}
          </div>
        )}

        {/* Coordinates */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Coordinates</h4>
          <div className={styles.coordGrid}>
            <div>
              <span className={styles.label}>Latitude:</span>
              <span className={styles.value}>{formatCoordinate(selectedPoint.lat)}</span>
            </div>
            <div>
              <span className={styles.label}>Longitude:</span>
              <span className={styles.value}>{formatCoordinate(selectedPoint.lng)}</span>
            </div>
          </div>
        </div>

        {/* Timestamps */}
        {selectedPoint.timestamp && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Time</h4>
            <div className={styles.timeInfo}>
              {selectedPoint.arrived && (
                <div className={styles.timeRow}>
                  <span className={styles.label}>Arrived:</span>
                  <span className={styles.value}>{formatTimestamp(selectedPoint.arrived)}</span>
                </div>
              )}
              {selectedPoint.departed && (
                <div className={styles.timeRow}>
                  <span className={styles.label}>Departed:</span>
                  <span className={styles.value}>{formatTimestamp(selectedPoint.departed)}</span>
                </div>
              )}
              {!selectedPoint.arrived && (
                <div className={styles.timeRow}>
                  <span className={styles.label}>Timestamp:</span>
                  <span className={styles.value}>{formatTimestamp(selectedPoint.timestamp)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Duration */}
        {selectedPoint.duration && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Duration</h4>
            <p className={styles.duration}>{selectedPoint.duration}</p>
          </div>
        )}

        {/* Activity Information */}
        {selectedPoint.activityType && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Activity</h4>
            <p className={styles.value}>{selectedPoint.activityType.replace(/_/g, ' ')}</p>
            {selectedPoint.confidence && (
              <p className={styles.label}>Confidence: {selectedPoint.confidence}</p>
            )}
          </div>
        )}

        {/* Technical Details */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Technical Details</h4>
          <div className={styles.techGrid}>
            {selectedPoint.accuracy !== null && selectedPoint.accuracy !== undefined && (
              <div className={styles.techItem}>
                <span className={styles.label}>Accuracy:</span>
                <span className={styles.value}>{selectedPoint.accuracy}m</span>
              </div>
            )}
            {selectedPoint.altitude !== null && selectedPoint.altitude !== undefined && (
              <div className={styles.techItem}>
                <span className={styles.label}>Altitude:</span>
                <span className={styles.value}>{selectedPoint.altitude}m</span>
              </div>
            )}
            {selectedPoint.velocity !== null && selectedPoint.velocity !== undefined && (
              <div className={styles.techItem}>
                <span className={styles.label}>Velocity:</span>
                <span className={styles.value}>{selectedPoint.velocity} m/s</span>
              </div>
            )}
            {selectedPoint.speed !== null && selectedPoint.speed !== undefined && (
              <div className={styles.techItem}>
                <span className={styles.label}>Speed:</span>
                <span className={styles.value}>{selectedPoint.speed} m/s</span>
              </div>
            )}
            {selectedPoint.heading !== null && selectedPoint.heading !== undefined && (
              <div className={styles.techItem}>
                <span className={styles.label}>Heading:</span>
                <span className={styles.value}>{selectedPoint.heading}°</span>
              </div>
            )}
            {selectedPoint.source && (
              <div className={styles.techItem}>
                <span className={styles.label}>Source:</span>
                <span className={styles.value}>{selectedPoint.source}</span>
              </div>
            )}
            {selectedPoint.platformType && (
              <div className={styles.techItem}>
                <span className={styles.label}>Platform:</span>
                <span className={styles.value}>{selectedPoint.platformType}</span>
              </div>
            )}
            {selectedPoint.deviceTag && (
              <div className={styles.techItem}>
                <span className={styles.label}>Device Tag:</span>
                <span className={styles.value}>{selectedPoint.deviceTag}</span>
              </div>
            )}
            {selectedPoint.deviceId && (
              <div className={styles.techItem}>
                <span className={styles.label}>Device ID:</span>
                <span className={styles.value}>{selectedPoint.deviceId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Semantic Information */}
        {selectedPoint.semanticType && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Semantic Type</h4>
            <p className={styles.value}>{selectedPoint.semanticType.replace('TYPE_', '').replace(/_/g, ' ')}</p>
          </div>
        )}

        {/* Place ID */}
        {selectedPoint.placeId && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Place ID</h4>
            <p className={styles.placeId}>{selectedPoint.placeId}</p>
          </div>
        )}

        {/* Score (for aggregates) */}
        {selectedPoint.score !== null && selectedPoint.score !== undefined && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Score</h4>
            <p className={styles.value}>{selectedPoint.score}</p>
          </div>
        )}
      </div>
    </div>
  );
}
