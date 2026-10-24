import { describe, it, expect } from 'vitest';
import { flattenContent, hashMessage, computeStatus, summarize } from './i18n-lib.mjs';

describe('flattenContent', () => {
  it('should flatten nested objects and arrays into dotted leaf paths', () => {
    expect(flattenContent({ h1: 'A', faq: [{ q: 'Q', a: 'B' }], meta: { tags: ['x'] } })).toEqual({
      h1: 'A',
      'faq.0.q': 'Q',
      'faq.0.a': 'B',
      'meta.tags.0': 'x',
    });
  });
});

describe('hashMessage', () => {
  it('should be stable and differ for different text', () => {
    expect(hashMessage('Hello')).toBe(hashMessage('Hello'));
    expect(hashMessage('Hello')).not.toBe(hashMessage('Hello!'));
    expect(hashMessage('Hello')).toHaveLength(12);
  });
});

describe('computeStatus', () => {
  const english = { a: 'Save', b: 'GPX', c: 'Upload', d: 'Changed text' };

  it('should classify every key against the English source', () => {
    const localized = { a: 'Speichern', b: 'GPX', c: 'Upload', d: 'Alter Text', z: 'Weg' };
    const hashes = { a: hashMessage('Save'), d: hashMessage('Old text') };
    const status = computeStatus({ english, localized, hashes, allowIdentical: (text) => text === 'GPX' });
    expect(status).toEqual({ a: 'ok', b: 'ok', c: 'untranslated', d: 'stale', z: 'orphan' });
  });

  it('should accept an identical translation once its hash was recorded', () => {
    const status = computeStatus({ english: { a: 'Format' }, localized: { a: 'Format' }, hashes: { a: hashMessage('Format') } });
    expect(status).toEqual({ a: 'ok' });
  });

  it('should report keys missing from the locale', () => {
    expect(computeStatus({ english: { a: 'Save' }, localized: {}, hashes: {} })).toEqual({ a: 'missing' });
  });

  it('should treat a translated key without a recorded hash as ok', () => {
    expect(computeStatus({ english: { a: 'Save' }, localized: { a: 'Speichern' }, hashes: {} })).toEqual({ a: 'ok' });
  });

  it('should skip keys under ignored prefixes', () => {
    const status = computeStatus({
      english: { 'theme.docs.x': 'Docs', a: 'Save' },
      localized: { a: 'Speichern' },
      hashes: {},
      ignorePrefixes: ['theme.docs.'],
    });
    expect(status).toEqual({ a: 'ok' });
  });
});

describe('summarize', () => {
  it('should count statuses and flag blocking ones', () => {
    expect(summarize({ a: 'ok', b: 'missing', c: 'stale', d: 'orphan', e: 'ok' })).toEqual({
      counts: { ok: 2, missing: 1, untranslated: 0, stale: 1, orphan: 1 },
      blocking: ['b', 'c'],
    });
  });
});
