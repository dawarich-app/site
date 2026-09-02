import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import config from '@site/docusaurus.config.js';

const scriptSrcs = config.scripts.map((s) => (typeof s === 'string' ? s : s.src));
const headScripts = config.headTags
  .filter((t) => t.tagName === 'script')
  .map((t) => t.innerHTML || t.attributes?.src || '');

/**
 * Regression guard for cef12e7 (2026-04-27), which re-added an unconditional
 * Google Ads loader to `scripts` four months after e9f3291 removed it. The
 * commit was titled "Update timeline visualizer", so nothing in review
 * signalled that a consent gate had been reopened.
 */
describe('no advertising tag may load outside the consent bootstrap', () => {
  it('does not load Google Tag Manager from the unconditional scripts array', () => {
    expect(scriptSrcs.filter((s) => s.includes('googletagmanager.com'))).toHaveLength(0);
  });

  it('does not configure a Google tag from the scripts array', () => {
    expect(scriptSrcs.filter((s) => s.includes('gtag'))).toHaveLength(0);
  });

  it('loads the Google tag exactly once, from headTags', () => {
    const loaders = headScripts.filter((s) => s.includes('googletagmanager.com/gtag/js'));

    expect(loaders).toHaveLength(1);
  });

  it('establishes denied-by-default consent before the tag is configured', () => {
    const bootstrap = headScripts.find((s) => s.includes("gtag('consent', 'default'"));

    expect(bootstrap).toBeDefined();
    expect(bootstrap.indexOf("'default'")).toBeLessThan(bootstrap.indexOf("gtag('config'"));

    // Normalised so the assertion survives a change of quoting or spacing in
    // how the defaults are serialised; the runtime meaning is asserted by
    // executing the script in consent.test.js.
    const normalised = bootstrap.replace(/["'\s]/g, '');
    ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage'].forEach((key) => {
      expect(normalised).toContain(`${key}:denied`);
    });
  });

  it('emits the consent bootstrap before the tag loader in document order', () => {
    const order = config.headTags
      .filter((t) => t.tagName === 'script')
      .map((t) =>
        (t.innerHTML || '').includes("gtag('consent', 'default'")
          ? 'bootstrap'
          : (t.attributes?.src || '').includes('googletagmanager.com')
            ? 'loader'
            : 'other',
      );

    expect(order.indexOf('bootstrap')).toBeGreaterThanOrEqual(0);
    expect(order.indexOf('bootstrap')).toBeLessThan(order.indexOf('loader'));
  });

  it('still loads the analytics that are not gated behind the banner', () => {
    expect(scriptSrcs.some((s) => s.includes('simpleanalyticscdn.com'))).toBe(true);
    expect(scriptSrcs.some((s) => s.includes('rybbit'))).toBe(true);
  });
});

// The Google tag loads on every page and is held back by Consent Mode, not by
// the banner. Three separate pages used to say it only fires once you accept;
// two of them were fixed in this change and the third was found by review.
describe('no page claims the ad tag is withheld until consent', () => {
  const STALE_CLAIMS = [
    'only fire if you accept',
    'fires only if you accept',
    'only load if you click',
    'only loads if you accept',
  ];

  function sourceFiles(dir) {
    return readdirSync(dir).flatMap((entry) => {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) return sourceFiles(path);
      return /\.(js|jsx|md|mdx)$/.test(entry) && !/\.test\./.test(entry) ? [path] : [];
    });
  }

  // Matched against whitespace-collapsed source, because JSX wraps prose across
  // lines and tabs — the same sentence would otherwise slip past on a reflow.
  it('says nowhere in src/ that the tag waits for the banner', () => {
    const offenders = sourceFiles('src').filter((path) => {
      const text = readFileSync(path, 'utf8').replace(/\s+/g, ' ');
      return STALE_CLAIMS.some((claim) => text.includes(claim));
    });

    expect(offenders).toEqual([]);
  });
});
