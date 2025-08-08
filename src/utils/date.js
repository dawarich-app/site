/**
 * Returns a random Date between 5 years ago and 3 years ago from the given 'now'.
 * Uses calendar-aware year shifting to account for leap years.
 * @param {Date} [now=new Date()] - Reference point in time.
 * @returns {Date}
 */
export function randomDateFiveToThreeYearsAgo(now = new Date()) {
  const start = new Date(now);
  start.setFullYear(start.getFullYear() - 5);

  const end = new Date(now);
  end.setFullYear(end.getFullYear() - 3);

  const ts = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(ts);
}

/**
 * Returns a random Date between `minYearsAgo` and `maxYearsAgo` from 'now'.
 * Example: randomDateBetweenYearsAgo(5, 3) is equivalent to randomDateFiveToThreeYearsAgo().
 * @param {number} minYearsAgo - Older bound in years (e.g., 5)
 * @param {number} maxYearsAgo - Newer bound in years (e.g., 3)
 * @param {Date} [now=new Date()] - Reference point in time.
 * @returns {Date}
 */
export function randomDateBetweenYearsAgo(minYearsAgo, maxYearsAgo, now = new Date()) {
  if (typeof minYearsAgo !== 'number' || typeof maxYearsAgo !== 'number') {
    throw new TypeError('minYearsAgo and maxYearsAgo must be numbers');
  }

  // Ensure minYearsAgo >= maxYearsAgo (older to newer)
  let older = Math.max(minYearsAgo, maxYearsAgo);
  let newer = Math.min(minYearsAgo, maxYearsAgo);

  const start = new Date(now);
  start.setFullYear(start.getFullYear() - older);

  const end = new Date(now);
  end.setFullYear(end.getFullYear() - newer);

  const ts = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(ts);
}
