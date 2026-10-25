import { describe, it, expect } from 'vitest';
import { extractComparable, comparePages } from './en-regression.mjs';

const page = ({ title = 'T', description = 'D', main = '<p>Hello <b>world</b></p>', jsonld = '{"url":"https://dawarich.app/tools"}' } = {}) =>
  `<html><head><title>${title}</title><meta name="description" content="${description}">` +
  `<script data-rh="true" type="application/ld+json">${jsonld}</script></head>` +
  `<body><nav>Deutsch English</nav><main>${main}</main></body></html>`;

describe('extractComparable', () => {
  it('should collect title, description, visible main text and JSON-LD', () => {
    expect(extractComparable(page())).toEqual({
      title: 'T',
      description: 'D',
      main: 'Hello world',
      jsonld: ['{"url":"https://dawarich.app/tools"}'],
    });
  });

  it('should ignore everything outside main, such as the navbar', () => {
    expect(extractComparable(page()).main).not.toContain('Deutsch');
  });
});

describe('comparePages', () => {
  it('should report no differences for identical pages', () => {
    expect(comparePages(page(), page())).toEqual([]);
  });

  it('should ignore whitespace and trailing slashes on dawarich.app URLs', () => {
    const branch = page({ main: '<p>Hello\n   <b>world</b></p>', jsonld: '{"url":"https://dawarich.app/tools/"}' });
    expect(comparePages(page(), branch)).toEqual([]);
  });

  it('should treat React text separators as invisible', () => {
    const baseline = page({ main: '<h3>Input (<!-- -->GPX<!-- -->)</h3>' });
    expect(comparePages(baseline, page({ main: '<h3>Input (GPX)</h3>' }))).toEqual([]);
  });

  it('should report changed visible text', () => {
    const diffs = comparePages(page(), page({ main: '<p>Hallo world</p>' }));
    expect(diffs.map((d) => d.field)).toEqual(['main']);
  });

  it('should report changed titles and JSON-LD', () => {
    const diffs = comparePages(page(), page({ title: 'X', jsonld: '{"url":"https://dawarich.app/de/tools/"}' }));
    expect(diffs.map((d) => d.field)).toEqual(['title', 'jsonld']);
  });
});

describe('comparePages structured data', () => {
  const wrap = (block) => `<html><head><title>T</title><script type="application/ld+json">${block}</script></head><body><main>x</main></body></html>`;

  it('should ignore inLanguage added after the build and differences in JSON serialization', () => {
    const before = wrap('{"@type": "WebApplication", "name": "A </b> B"}');
    const after = wrap('{"@type":"WebApplication","name":"A \\u003c/b> B","inLanguage":"en"}');
    expect(comparePages(before, after)).toEqual([]);
  });

  it('should still report changed structured data', () => {
    const before = wrap('{"@type":"WebApplication","name":"A"}');
    const after = wrap('{"@type":"WebApplication","name":"B","inLanguage":"en"}');
    expect(comparePages(before, after).map((d) => d.field)).toEqual(['jsonld']);
  });
});
