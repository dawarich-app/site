import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@site/src/components/FormatConverter', () => ({ default: () => <div /> }));
vi.mock('@site/src/components/RelatedTools', () => ({ default: () => null }));
vi.mock('@locale-content/tools/gpx-to-kml.json', async () => {
  const en = (await import('../../i18n/content/en/tools/gpx-to-kml.json')).default;
  return { default: { ...en, h1: 'Lokalisierter GPX-Titel' } };
});

import GPXToKML from './gpx-to-kml';

describe('GPXToKML page content source', () => {
  it('renders whatever the locale content file provides', () => {
    render(<GPXToKML />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Lokalisierter GPX-Titel');
  });
});
