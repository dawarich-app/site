import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
vi.mock('@paddle/paddle-js', () => ({ initializePaddle: vi.fn() }));
vi.mock('@site/src/components/PricingSection', () => ({ default: () => null }));
vi.mock('@site/src/components/Testimonials', () => ({ default: () => null }));
vi.mock('@site/src/components/FAQ', () => ({ default: () => null }));
beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} });
  window.matchMedia = vi.fn(() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
vi.mock('@locale-content/pages/interactive-map.json', async () => {
  const en = (await import('../i18n/content/en/pages/interactive-map.json')).default;
  return { default: { ...en, hero: { ...en.hero, title: "Localized interactive-map heading" } } };
});
vi.mock('@locale-content/pages/trips.json', async () => {
  const en = (await import('../i18n/content/en/pages/trips.json')).default;
  return { default: { ...en, hero: { ...en.hero, title: "Localized trips heading" } } };
});
vi.mock('@locale-content/pages/statistics.json', async () => {
  const en = (await import('../i18n/content/en/pages/statistics.json')).default;
  return { default: { ...en, hero: { ...en.hero, title: "Localized statistics heading" } } };
});
vi.mock('@locale-content/pages/location-tracking.json', async () => {
  const en = (await import('../i18n/content/en/pages/location-tracking.json')).default;
  return { default: { ...en, hero: { ...en.hero, title: "Localized location-tracking heading" } } };
});
vi.mock('@locale-content/pages/import-export.json', async () => {
  const en = (await import('../i18n/content/en/pages/import-export.json')).default;
  return { default: { ...en, hero: { ...en.hero, title: "Localized import-export heading" } } };
});
vi.mock('@locale-content/pages/integrations.json', async () => {
  const en = (await import('../i18n/content/en/pages/integrations.json')).default;
  return { default: { ...en, hero: { ...en.hero, title: "Localized integrations heading" } } };
});
vi.mock('@locale-content/pages/location-sharing.json', async () => {
  const en = (await import('../i18n/content/en/pages/location-sharing.json')).default;
  return { default: { ...en, locationSharingPage: { ...en.locationSharingPage, text: "Localized location-sharing heading" } } };
});
vi.mock('@locale-content/pages/family.json', async () => {
  const en = (await import('../i18n/content/en/pages/family.json')).default;
  return { default: { ...en, familyPage: { ...en.familyPage, text: "Localized family heading" } } };
});
vi.mock('@locale-content/pages/tax-residency.json', async () => {
  const en = (await import('../i18n/content/en/pages/tax-residency.json')).default;
  return { default: { ...en, taxResidencyPage: { ...en.taxResidencyPage, text: "Localized tax-residency heading" } } };
});
vi.mock('@locale-content/pages/poster-studio.json', async () => {
  const en = (await import('../i18n/content/en/pages/poster-studio.json')).default;
  return { default: { ...en, posterStudioPage: { ...en.posterStudioPage, text: "Localized poster-studio heading" } } };
});
vi.mock('@locale-content/pages/cloud.json', async () => {
  const en = (await import('../i18n/content/en/pages/cloud.json')).default;
  return { default: { ...en, hero: { ...en.hero, title: "Localized cloud heading" } } };
});
vi.mock('@locale-content/pages/about.json', async () => {
  const en = (await import('../i18n/content/en/pages/about.json')).default;
  return { default: { ...en, aboutPage: { ...en.aboutPage, heading: "Localized about heading" } } };
});
vi.mock('@locale-content/pages/google-timeline-alternative.json', async () => {
  const en = (await import('../i18n/content/en/pages/google-timeline-alternative.json')).default;
  return { default: { ...en, hero: { ...en.hero, title: "Localized google-timeline-alternative heading" }, migrationFAQTitle: 'Fragen zur Migration' } };
});
import Page0 from './interactive-map/index';
import content0 from '@locale-content/pages/interactive-map.json';
import Page1 from './trips/index';
import content1 from '@locale-content/pages/trips.json';
import Page2 from './statistics/index';
import content2 from '@locale-content/pages/statistics.json';
import Page3 from './location-tracking/index';
import content3 from '@locale-content/pages/location-tracking.json';
import Page4 from './import-export/index';
import content4 from '@locale-content/pages/import-export.json';
import Page5 from './integrations/index';
import content5 from '@locale-content/pages/integrations.json';
import Page6 from './location-sharing/index';
import content6 from '@locale-content/pages/location-sharing.json';
import Page7 from './family/index';
import content7 from '@locale-content/pages/family.json';
import Page8 from './tax-residency/index';
import content8 from '@locale-content/pages/tax-residency.json';
import Page9 from './poster-studio/index';
import content9 from '@locale-content/pages/poster-studio.json';
import Page10 from './cloud';
import content10 from '@locale-content/pages/cloud.json';
import Page11 from './about';
import content11 from '@locale-content/pages/about.json';
import Page12 from './google-timeline-alternative';
import content12 from '@locale-content/pages/google-timeline-alternative.json';

describe('Feature landing content sources', () => {
  it('interactive-map renders its heading from mocked locale content', () => {
    render(<Page0 />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(content0.hero.title);
  });
  it('trips renders its heading from mocked locale content', () => {
    render(<Page1 />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(content1.hero.title);
  });
  it('statistics renders its heading from mocked locale content', () => {
    render(<Page2 />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(content2.hero.title);
  });
  it('location-tracking renders its heading from mocked locale content', () => {
    render(<Page3 />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(content3.hero.title);
  });
  it('import-export renders its heading from mocked locale content', () => {
    render(<Page4 />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(content4.hero.title);
  });
  it('integrations renders its heading from mocked locale content', () => {
    render(<Page5 />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(content5.hero.title);
  });
  it('location-sharing renders its heading from mocked locale content', () => {
    render(<Page6 />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(content6.locationSharingPage.text);
  });
  it('family renders its heading from mocked locale content', () => {
    render(<Page7 />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(content7.familyPage.text);
  });
  it('tax-residency renders its heading from mocked locale content', () => {
    render(<Page8 />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(content8.taxResidencyPage.text);
  });
  it('poster-studio renders its heading from mocked locale content', () => {
    render(<Page9 />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(content9.posterStudioPage.text);
  });
  it('cloud renders its heading from mocked locale content', () => {
    render(<Page10 />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(content10.hero.title);
  });
  it('about renders its heading from mocked locale content', () => {
    render(<Page11 />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(content11.aboutPage.heading);
  });
  it('google-timeline-alternative renders its heading from mocked locale content', () => {
    render(<Page12 />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(content12.hero.title);
  });
});

it('google-timeline-alternative renders its migration FAQ heading from content', () => {
  render(<Page12 />);
  expect(screen.getByRole('heading', { level: 2, name: content12.migrationFAQTitle })).toBeInTheDocument();
});
