import crypto from 'node:crypto';

export const STATUSES = ['ok', 'missing', 'untranslated', 'stale', 'orphan'];
const BLOCKING = new Set(['missing', 'untranslated', 'stale']);

export function flattenContent(value, prefix = '', out = {}) {
  if (typeof value === 'string') {
    out[prefix] = value;
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => flattenContent(item, prefix ? `${prefix}.${index}` : String(index), out));
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) flattenContent(item, prefix ? `${prefix}.${key}` : key, out);
  }
  return out;
}

export function hashMessage(message) {
  return crypto.createHash('sha1').update(message).digest('hex').slice(0, 12);
}

export function computeStatus({ english, localized, hashes, allowIdentical = () => false, ignorePrefixes = [] }) {
  const ignored = (key) => ignorePrefixes.some((prefix) => key.startsWith(prefix));
  const status = {};
  for (const [key, source] of Object.entries(english)) {
    if (ignored(key)) continue;
    const translation = localized[key];
    const accepted = hashes[key] === hashMessage(source);
    if (translation === undefined) status[key] = 'missing';
    else if (translation === source && !allowIdentical(source) && !accepted) status[key] = 'untranslated';
    else if (hashes[key] && !accepted) status[key] = 'stale';
    else status[key] = 'ok';
  }
  for (const key of Object.keys(localized)) {
    if (!(key in english) && !ignored(key)) status[key] = 'orphan';
  }
  return status;
}

export function summarize(status) {
  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  const blocking = [];
  for (const [key, value] of Object.entries(status)) {
    counts[value] += 1;
    if (BLOCKING.has(value)) blocking.push(key);
  }
  return { counts, blocking };
}
