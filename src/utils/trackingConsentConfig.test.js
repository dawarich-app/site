import { describe, expect, it } from 'vitest';
import config from '@site/docusaurus.config.js';

const unconditionalScripts = [
  ...config.scripts.map((entry) => typeof entry === 'string' ? entry : entry.src),
  ...config.headTags.filter((tag) => tag.tagName === 'script').map((tag) => tag.attributes?.src || tag.innerHTML || ''),
];

describe('prerendered pages before tracking consent', () => {
  it('do not load third-party advertising, analytics, affiliate or billing scripts', () => {
    expect(unconditionalScripts.filter((script) =>
      /googletagmanager|gtag|rybbit|simpleanalytics|partnero|brevo|paddle/i.test(script)
    )).toEqual([]);
  });
});
