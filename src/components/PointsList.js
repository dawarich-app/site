import React, { useMemo, useState } from 'react';
import styles from './PointsList.module.css';

export default function PointsList({ points, onPointSelect, selectedPointId }) {
  const [sortBy, setSortBy] = useState('time-desc'); // time-desc, time-asc

  // Filter to only show meaningful visits/places, not raw GPS location records
  const meaningfulPoints = useMemo(() => {
    return points.filter(point => {
      // Keep these types as they represent actual visits/places:
      // - place_visit: Actual place visits from Semantic.json or Location History
      // - activity_start/activity_end: Activity segment endpoints
      // - place_aggregate: Aggregated place data from TimelineEdits
      // - raw_signal: Raw signals from TimelineEdits

      // Filter OUT location_record which are just raw GPS points
      return point.type !== 'location_record';
    });
  }, [points]);

  // Group points by day
  const groupedByDay = useMemo(() => {
    const pointsCopy = [...meaningfulPoints];

    // Sort points first
    const sorted = pointsCopy.sort((a, b) => {
      if (!a.timestamp || !b.timestamp) return 0;
      if (sortBy === 'time-asc') {
        return new Date(a.timestamp) - new Date(b.timestamp);
      } else {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });

    // Group by day
    const groups = new Map();
    sorted.forEach(point => {
      if (!point.timestamp) {
        // Points without timestamp go in "Unknown Date" group
        if (!groups.has('unknown')) {
          groups.set('unknown', []);
        }
        groups.get('unknown').push(point);
      } else {
        const date = new Date(point.timestamp);
        const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        if (!groups.has(dayKey)) {
          groups.set(dayKey, []);
        }
        groups.get(dayKey).push(point);
      }
    });

    return groups;
  }, [meaningfulPoints, sortBy]);

  const formatDayHeader = (dayKey) => {
    if (dayKey === 'unknown') return 'Unknown Date';
    const [year, month, day] = dayKey.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPointTypeLabel = (type) => {
    const labels = {
      'place_visit': 'Visit',
      'location_record': 'Location',
      'activity_start': 'Activity Start',
      'activity_end': 'Activity End',
      'place_aggregate': 'Aggregate',
      'raw_signal': 'Signal',
    };
    return labels[type] || type;
  };

  const getPointColor = (type) => {
    const colors = {
      'place_visit': '#10b981',
      'location_record': '#3b82f6',
      'activity_start': '#f59e0b',
      'activity_end': '#ef4444',
      'place_aggregate': '#8b5cf6',
      'raw_signal': '#6b7280',
    };
    return colors[type] || '#3b82f6';
  };

  const handlePointClick = (point) => {
    onPointSelect(point);
  };

  if (meaningfulPoints.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Visits & Places</h3>
          <span className={styles.count}>0 visits</span>
        </div>
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {points.length > 0 ? (
            <>
              <p>No place visits in this dataset</p>
              <p className={styles.emptyHint}>
                This file contains {points.length.toLocaleString()} raw GPS location points shown on the map,
                but no identified place visits or activities.
              </p>
            </>
          ) : (
            <>
              <p>No data to display</p>
              <p className={styles.emptyHint}>Upload files to see visits</p>
            </>
          )}
        </div>
      </div>
    );
  }

  const totalPoints = Array.from(groupedByDay.values()).reduce((sum, group) => sum + group.length, 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Visits & Places</h3>
          <span className={styles.count}>{totalPoints} visit{totalPoints !== 1 ? 's' : ''}</span>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={styles.sortSelect}
          aria-label="Sort points"
        >
          <option value="time-desc">Newest first</option>
          <option value="time-asc">Oldest first</option>
        </select>
      </div>

      <div className={styles.list}>
        {Array.from(groupedByDay.entries()).map(([dayKey, dayPoints]) => (
          <div key={dayKey} className={styles.dayGroup}>
            <div className={styles.dayHeader}>
              <h4 className={styles.dayTitle}>{formatDayHeader(dayKey)}</h4>
              <span className={styles.dayCount}>{dayPoints.length} point{dayPoints.length !== 1 ? 's' : ''}</span>
            </div>

            {dayPoints.map((point) => (
              <div
                key={point.id}
                className={`${styles.item} ${selectedPointId === point.id ? styles.selected : ''}`}
                onClick={() => handlePointClick(point)}
              >
                <div className={styles.itemHeader}>
                  <div
                    className={styles.colorDot}
                    style={{ backgroundColor: getPointColor(point.type) }}
                  ></div>
                  <span className={styles.itemType}>{getPointTypeLabel(point.type)}</span>
                  <span className={styles.itemTime}>{formatTime(point.timestamp || point.arrived)}</span>
                </div>

                {point.name && (
                  <div className={styles.itemName}>{point.name}</div>
                )}

                {point.address && (
                  <div className={styles.itemAddress}>{point.address}</div>
                )}

                {point.activityType && (
                  <div className={styles.itemActivity}>
                    {point.activityType.replace(/_/g, ' ')}
                  </div>
                )}

                {point.duration && (
                  <div className={styles.itemDuration}>
                    Duration: {point.duration}
                  </div>
                )}

                <div className={styles.itemCoords}>
                  {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
