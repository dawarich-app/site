// Vendored from dawarich app/javascript/maps_maplibre/utils/geometry.js:71-124 (trimOutlierCoords + axisInlierRange + OUTLIER_* constants) — edit there first, then re-sync. Intentional deltas: extracted into a standalone module (the site does not vendor the rest of maps_maplibre).
const OUTLIER_MIN_COORDS = 50
const OUTLIER_BUDGET_RATIO = 0.01
const OUTLIER_MIN_BUDGET = 5
const OUTLIER_GAP_RATIO = 0.2
const OUTLIER_MIN_GAP_DEGREES = 1

/**
 * Drop sparse extreme outliers (stray GPS points, lone far-away arcs) from a
 * coordinate set before fitting the map to it, so one bad point can't drag
 * the viewport into the ocean. Only coordinates in the outermost ~1% per
 * axis are eligible, and only when separated from the rest by a gap of at
 * least 20% of the axis span — real trips (a week in Norway, a US visit)
 * carry more mass than the budget and are kept.
 * @param {Array} coords - Array of [lng, lat]
 * @returns {Array} Inlier coordinates (original array if nothing qualifies)
 */
export function trimOutlierCoords(coords) {
  if (coords.length < OUTLIER_MIN_COORDS) return coords

  const [lonLo, lonHi] = axisInlierRange(coords.map((c) => c[0]))
  const [latLo, latHi] = axisInlierRange(coords.map((c) => c[1]))

  const inliers = coords.filter(
    ([lon, lat]) =>
      lon >= lonLo && lon <= lonHi && lat >= latLo && lat <= latHi,
  )
  return inliers.length ? inliers : coords
}

function axisInlierRange(values) {
  const sorted = [...values].sort((a, b) => a - b)
  const n = sorted.length
  const span = sorted[n - 1] - sorted[0]
  const gapThreshold = Math.max(
    span * OUTLIER_GAP_RATIO,
    OUTLIER_MIN_GAP_DEGREES,
  )
  const budget = Math.max(
    OUTLIER_MIN_BUDGET,
    Math.floor(n * OUTLIER_BUDGET_RATIO),
  )

  let lo = 0
  for (let i = 1; i <= budget; i++) {
    if (sorted[i] - sorted[i - 1] > gapThreshold) lo = i
  }

  let hi = n - 1
  for (let i = n - 2; i >= n - 1 - budget; i--) {
    if (sorted[i + 1] - sorted[i] > gapThreshold) hi = i
  }

  return [sorted[lo], sorted[hi]]
}
