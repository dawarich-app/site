const REPLAY_SPEED_MULTIPLIER = 60;
const MIN_CADENCE_MS = 16;
const DEFAULT_CADENCE_MS = 50;

export function replayCadenceMs(pointTimes, frameIndex = 0) {
  if (!Array.isArray(pointTimes) || pointTimes.length < 2) return DEFAULT_CADENCE_MS;
  const a = pointTimes[frameIndex];
  const b = pointTimes[frameIndex + 1];
  if (!a || !b) return DEFAULT_CADENCE_MS;
  const deltaMs = new Date(b).getTime() - new Date(a).getTime();
  if (!Number.isFinite(deltaMs) || deltaMs <= 0) return DEFAULT_CADENCE_MS;
  return Math.max(MIN_CADENCE_MS, deltaMs / REPLAY_SPEED_MULTIPLIER);
}

export function nextFrame(state, totalCoords) {
  if (state.frameIndex >= totalCoords - 1) {
    return { frameIndex: state.frameIndex, done: true };
  }
  return { frameIndex: state.frameIndex + 1, done: false };
}

export function seekToFraction(fraction, totalCoords) {
  if (totalCoords <= 0) return 0;
  const f = Math.max(0, Math.min(1, fraction));
  return Math.min(totalCoords - 1, Math.floor(f * totalCoords));
}
