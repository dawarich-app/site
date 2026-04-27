import React from 'react';
import { seekToFraction } from '../../utils/trackReplay';
import styles from './entries.module.css';

const MODE_CONFIG = {
  walking: { emoji: '🚶', verb: 'walked' },
  running: { emoji: '🏃', verb: 'ran' },
  cycling: { emoji: '🚴', verb: 'cycled' },
  driving: { emoji: '🚗', verb: 'drove' },
  bus: { emoji: '🚌', verb: 'bus' },
  train: { emoji: '🚆', verb: 'train' },
  flying: { emoji: '✈️', verb: 'flew' },
  boat: { emoji: '⛵', verb: 'sailed' },
  motorcycle: { emoji: '🏍', verb: 'rode' },
  unknown: { emoji: null, verb: 'traveled' },
};

function formatHHMM(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatDurationShort(seconds) {
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return `${s}s`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return mm ? `${h}h ${mm}m` : `${h}h`;
}

function ChevronIcon({ expanded }) {
  return (
    <svg
      className={`${styles.journeyChevron} ${expanded ? styles.journeyChevronExpanded : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ReplayControls({ entry, replayState, onReplayChange }) {
  const total = entry.coordinates?.length || 0;
  const isThisTrack = replayState?.trackId === entry.trackId;
  const playing = isThisTrack && replayState.playing;
  const frameIndex = isThisTrack ? replayState.frameIndex : 0;
  const fraction = total > 1 ? frameIndex / (total - 1) : 0;

  const togglePlay = () => {
    if (!isThisTrack) {
      onReplayChange({ trackId: entry.trackId, frameIndex: 0, playing: true });
      return;
    }
    onReplayChange({ ...replayState, playing: !replayState.playing });
  };

  const restart = () => {
    onReplayChange({ trackId: entry.trackId, frameIndex: 0, playing: true });
  };

  const onScrub = (e) => {
    const f = Number(e.target.value) / 1000;
    const idx = seekToFraction(f, total);
    onReplayChange({ trackId: entry.trackId, frameIndex: idx, playing: false });
  };

  return (
    <div className={styles.replayControls}>
      <button type="button" className={styles.replayButton} onClick={togglePlay} aria-label={playing ? 'Pause replay' : 'Play replay'}>
        {playing ? '⏸' : '▶'}
      </button>
      <button type="button" className={styles.replayButton} onClick={restart} aria-label="Restart">
        ⟲
      </button>
      <input
        type="range"
        className={styles.replayProgress}
        min="0"
        max="1000"
        step="1"
        value={Math.round(fraction * 1000)}
        onChange={onScrub}
        aria-label="Replay progress"
        aria-valuetext={`${Math.round(fraction * 100)}% through track`}
      />
    </div>
  );
}

function TrackInfoCard({ entry, replayState, onReplayChange }) {
  return (
    <div className={styles.trackInfoCard}>
      <div className={styles.trackInfoId}>Track #{entry.trackId}</div>
      <div className={styles.trackInfoStats}>
        <span><span className={styles.trackInfoLabel}>Dist</span> <strong>{entry.distance} {entry.distanceUnit}</strong></span>
        <span><span className={styles.trackInfoLabel}>Avg</span> <strong>{entry.avgSpeed} {entry.speedUnit}</strong></span>
        <span><span className={styles.trackInfoLabel}>Time</span> <strong>{formatDurationShort(entry.duration)}</strong></span>
        <span className={styles.trackInfoMode}>{entry.dominantMode}</span>
      </div>
      <div className={styles.trackInfoActions}>
        <ReplayControls entry={entry} replayState={replayState} onReplayChange={onReplayChange} />
      </div>
    </div>
  );
}

export default function JourneyLeg({ entry, isExpanded, onToggleExpand, onHover, onUnhover, replayState, onReplayChange }) {
  const config = MODE_CONFIG[entry.dominantMode] || MODE_CONFIG.unknown;

  return (
    <li className={styles.journeyEntry}>
      <button
        type="button"
        className={styles.journeyLeg}
        data-testid="journey-leg"
        onClick={() => onToggleExpand(entry.trackId)}
        onMouseEnter={() => onHover(entry)}
        onMouseLeave={onUnhover}
      >
        <span className={styles.journeyTime}>{formatHHMM(entry.startedAt)}</span>
        <span className={styles.journeyRailCol}><span className={styles.journeyRail} /></span>
        <span className={styles.journeySummary}>
          {config.emoji && <span className={styles.journeyEmoji}>{config.emoji}</span>}
          <span className={styles.journeyVerb}>{config.verb}</span>
          {entry.distance > 0 && <>
            <span className={styles.journeySep}>·</span>
            <span>{entry.distance} {entry.distanceUnit}</span>
          </>}
          <span className={styles.journeySep}>·</span>
          <span>{formatDurationShort(entry.duration)}</span>
        </span>
        <ChevronIcon expanded={isExpanded} />
      </button>
      {isExpanded && (
        <TrackInfoCard entry={entry} replayState={replayState} onReplayChange={onReplayChange} />
      )}
    </li>
  );
}
