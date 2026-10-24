import { describe, it, expect } from 'vitest';
import { mergeOverEnglish } from './merge.js';

describe('mergeOverEnglish', () => {
  it('should take translated leaves and keep English for missing keys', () => {
    const en = { h1: 'Converter', faq: [{ q: 'Why?', a: 'Because.' }, { q: 'How?', a: 'Like this.' }], meta: { title: 'T' } };
    const de = { h1: 'Konverter', faq: [{ q: 'Warum?' }], extra: 'ignored' };
    expect(mergeOverEnglish(en, de)).toEqual({
      h1: 'Konverter',
      faq: [{ q: 'Warum?', a: 'Because.' }, { q: 'How?', a: 'Like this.' }],
      meta: { title: 'T' },
    });
  });

  it('should keep English when the translation has the wrong type or is missing', () => {
    expect(mergeOverEnglish({ a: 'x', b: ['y'] }, { a: 5, b: 'z' })).toEqual({ a: 'x', b: ['y'] });
    expect(mergeOverEnglish({ a: 'x' }, undefined)).toEqual({ a: 'x' });
  });
});
