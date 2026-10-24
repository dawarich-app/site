import React, { useMemo, useState } from 'react';
import { interpolate } from '@docusaurus/Interpolate';
import { usePluralForm } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import content from '@locale-content/components/PhotoList.json';
import styles from './PointsList.module.css';

export default function PhotoList({ photos, onPhotoSelect, selectedPhotoId }) {
  const { i18n } = useDocusaurusContext();
  const htmlLang = i18n.localeConfigs[i18n.currentLocale].htmlLang;
  const { selectMessage } = usePluralForm();
  const formatCoordinate = (value) => value.toLocaleString(htmlLang, { useGrouping: false, minimumFractionDigits: 6, maximumFractionDigits: 6 });
  const photoCount = (count) => interpolate(selectMessage(count, content.photoCount), { count: count.toLocaleString(htmlLang) });
  const [sortBy, setSortBy] = useState('time-desc'); // time-desc, time-asc, name

  // Sort photos
  const sortedPhotos = useMemo(() => {
    const photosCopy = [...photos];

    return photosCopy.sort((a, b) => {
      if (sortBy === 'name') {
        return a.filename.localeCompare(b.filename);
      } else if (sortBy === 'time-asc') {
        if (!a.timestamp) return 1;
        if (!b.timestamp) return -1;
        return new Date(a.timestamp) - new Date(b.timestamp);
      } else {
        if (!a.timestamp) return 1;
        if (!b.timestamp) return -1;
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });
  }, [photos, sortBy]);

  // Group photos by day
  const groupedByDay = useMemo(() => {
    if (sortBy === 'name') {
      // Don't group by day when sorting by name
      return new Map([['all', sortedPhotos]]);
    }

    const groups = new Map();
    sortedPhotos.forEach(photo => {
      if (!photo.timestamp) {
        if (!groups.has('unknown')) {
          groups.set('unknown', []);
        }
        groups.get('unknown').push(photo);
      } else {
        const date = new Date(photo.timestamp);
        const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        if (!groups.has(dayKey)) {
          groups.set(dayKey, []);
        }
        groups.get(dayKey).push(photo);
      }
    });

    return groups;
  }, [sortedPhotos, sortBy]);

  const formatDayHeader = (dayKey) => {
    if (dayKey === 'all') return null;
    if (dayKey === 'unknown') return content.unknownDate;
    const [year, month, day] = dayKey.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString(htmlLang, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return content.unknownTime;
    const date = new Date(timestamp);
    return date.toLocaleTimeString(htmlLang, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handlePhotoClick = (photo) => {
    onPhotoSelect(photo);
  };

  if (photos.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>{content.title}</h3>
          <span className={styles.count}>{photoCount(0)}</span>
        </div>
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>{content.emptyTitle}</p>
          <p className={styles.emptyHint}>{content.emptyHint}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{content.title}</h3>
          <span className={styles.count}>{photoCount(photos.length)}</span>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={styles.sortSelect}
          aria-label={content.sortLabel}
        >
          <option value="time-desc">{content.newestFirst}</option>
          <option value="time-asc">{content.oldestFirst}</option>
          <option value="name">{content.byName}</option>
        </select>
      </div>

      <div className={styles.list}>
        {Array.from(groupedByDay.entries()).map(([dayKey, dayPhotos]) => (
          <div key={dayKey} className={styles.dayGroup}>
            {dayKey !== 'all' && (
              <div className={styles.dayHeader}>
                <h4 className={styles.dayTitle}>{formatDayHeader(dayKey)}</h4>
                <span className={styles.dayCount}>{photoCount(dayPhotos.length)}</span>
              </div>
            )}

            {dayPhotos.map((photo) => (
              <div
                key={photo.id}
                className={`${styles.item} ${selectedPhotoId === photo.id ? styles.selected : ''}`}
                onClick={() => handlePhotoClick(photo)}
              >
                <div className={styles.itemHeader}>
                  <div
                    className={styles.colorDot}
                    style={{ backgroundColor: '#ef4444' }}
                  ></div>
                  <span className={styles.itemType}>{content.photoLabel}</span>
                  {photo.timestamp && (
                    <span className={styles.itemTime}>{formatTime(photo.timestamp)}</span>
                  )}
                </div>

                <div className={styles.itemName}>{photo.filename}</div>

                <div className={styles.itemCoords}>
                  {formatCoordinate(photo.lat)}, {formatCoordinate(photo.lng)}
                </div>

                {photo.altitude && (
                  <div className={styles.itemDuration}>
                    {interpolate(content.altitude, { altitude: photo.altitude.toLocaleString(htmlLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) })}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
