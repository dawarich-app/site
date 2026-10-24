import React from 'react';
import { interpolate } from '@docusaurus/Interpolate';
import content from '@locale-content/components/JourneyLeg.json';
import { seekToFraction } from '../../utils/trackReplay';
import styles from './entries.module.css';
import { useHtmlLang } from '@site/src/i18n/useHtmlLang';

const MODE_CONFIG = {
  walking: { emoji: '🚶', verb: content.verbs.walking },
  running: { emoji: '🏃', verb: content.verbs.running },
  cycling: { emoji: '🚴', verb: content.verbs.cycling },
  driving: { emoji: '🚗', verb: content.verbs.driving },
  bus: { emoji: '🚌', verb: content.verbs.bus },
  train: { emoji: '🚆', verb: content.verbs.train },
  flying: { emoji: '✈️', verb: content.verbs.flying },
  boat: { emoji: '⛵', verb: content.verbs.boat },
  motorcycle: { emoji: '🏍', verb: content.verbs.motorcycle },
  unknown: { emoji: null, verb: content.verbs.unknown },
};

function formatHHMM(iso, htmlLang) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString(htmlLang, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
}

function formatDurationShort(seconds, htmlLang) {
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return interpolate(content.duration.seconds, { seconds: s.toLocaleString(htmlLang) });
  const m = Math.round(s / 60);
  if (m < 60) return interpolate(content.duration.minutes, { minutes: m.toLocaleString(htmlLang) });
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return mm
    ? interpolate(content.duration.hoursMinutes, { hours: h.toLocaleString(htmlLang), minutes: mm.toLocaleString(htmlLang) })
    : interpolate(content.duration.hours, { hours: h.toLocaleString(htmlLang) });
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
  const htmlLang = useHtmlLang();
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
      <button type="button" className={styles.replayButton} onClick={togglePlay} aria-label={playing ? content.pauseReplay : content.playReplay}>
        {playing ? '⏸' : '▶'}
      </button>
      <button type="button" className={styles.replayButton} onClick={restart} aria-label={content.restart}>
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
        aria-label={content.replayProgress}
        aria-valuetext={interpolate(content.throughTrack, { percent: Math.round(fraction * 100).toLocaleString(htmlLang) })}
      />
    </div>
  );
}

function TrackInfoCard({ entry, replayState, onReplayChange }) {
  const htmlLang = useHtmlLang();
  return (
    <div className={styles.trackInfoCard}>
      <div className={styles.trackInfoId}>{interpolate(content.trackLabel, { trackId: entry.trackId })}</div>
      <div className={styles.trackInfoStats}>
        <span><span className={styles.trackInfoLabel}>{content.distanceLabel}</span> <strong>{entry.distance.toLocaleString(htmlLang)} {entry.distanceUnit}</strong></span>
        <span><span className={styles.trackInfoLabel}>{content.averageLabel}</span> <strong>{entry.avgSpeed.toLocaleString(htmlLang)} {entry.speedUnit}</strong></span>
        <span><span className={styles.trackInfoLabel}>{content.timeLabel}</span> <strong>{formatDurationShort(entry.duration, htmlLang)}</strong></span>
        <span className={styles.trackInfoMode}>{content.modeLabels[entry.dominantMode] || content.modeLabels.unknown}</span>
      </div>
      <div className={styles.trackInfoActions}>
        <ReplayControls entry={entry} replayState={replayState} onReplayChange={onReplayChange} />
      </div>
    </div>
  );
}

export default function JourneyLeg({ entry, isExpanded, onToggleExpand, onHover, onUnhover, replayState, onReplayChange }) {
  const htmlLang = useHtmlLang();
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
        <span className={styles.journeyTime}>{formatHHMM(entry.startedAt, htmlLang)}</span>
        <span className={styles.journeyRailCol}><span className={styles.journeyRail} /></span>
        <span className={styles.journeySummary}>
          {config.emoji && <span className={styles.journeyEmoji}>{config.emoji}</span>}
          <span className={styles.journeyVerb}>{config.verb}</span>
          {entry.distance > 0 && <>
            <span className={styles.journeySep}>·</span>
            <span>{entry.distance.toLocaleString(htmlLang)} {entry.distanceUnit}</span>
          </>}
          <span className={styles.journeySep}>·</span>
          <span>{formatDurationShort(entry.duration, htmlLang)}</span>
        </span>
        <ChevronIcon expanded={isExpanded} />
      </button>
      {isExpanded && (
        <TrackInfoCard entry={entry} replayState={replayState} onReplayChange={onReplayChange} />
      )}
    </li>
  );
}
