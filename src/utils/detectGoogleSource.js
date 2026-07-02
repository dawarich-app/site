/**
 * Map the converter's internal format names to Dawarich Import.source enum values.
 * Returns null when no specific source can be inferred (server-side detector will run).
 */
const FORMAT_TO_SOURCE = {
  records: 'google_records',
  semantic: 'google_semantic_history',
  semanticSegments: 'google_phone_takeout',
  locationHistory: 'google_phone_takeout',
};

export function detectGoogleSource(parsedResults) {
  if (!parsedResults || parsedResults.length === 0) return null;

  const formats = new Set(parsedResults.map((r) => r.format).filter(Boolean));
  if (formats.size === 0) return null;

  for (const format of formats) {
    if (FORMAT_TO_SOURCE[format]) return FORMAT_TO_SOURCE[format];
  }
  return null;
}
