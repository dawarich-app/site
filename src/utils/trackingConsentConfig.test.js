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

  it('still loads the cookieless analytics that need no consent', () => {
    expect(scriptSrcs.some((s) => s.includes('simpleanalyticscdn.com'))).toBe(true);
    expect(scriptSrcs.some((s) => s.includes('rybbit'))).toBe(true);
  });
});
