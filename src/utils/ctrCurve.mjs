export const CTR_BY_POSITION = {
  1: 0.28, 2: 0.155, 3: 0.11, 4: 0.08, 5: 0.06,
  6: 0.045, 7: 0.033, 8: 0.026, 9: 0.021, 10: 0.018,
};

const FLOOR = 0.005;
const TAIL_DECAY = 0.0012;

export function expectedCtr(position) {
  if (position <= 1) return CTR_BY_POSITION[1];
  if (position >= 10) return Math.max(FLOOR, CTR_BY_POSITION[10] - (position - 10) * TAIL_DECAY);
  const lower = Math.floor(position);
  const upper = lower + 1;
  const fraction = position - lower;
  return CTR_BY_POSITION[lower] * (1 - fraction) + CTR_BY_POSITION[upper] * fraction;
}
