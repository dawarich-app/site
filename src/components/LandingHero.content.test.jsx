import React from 'react';
import { it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@locale-content/pages/cloud.json', async () => {
  const en = (await import('../i18n/content/en/pages/cloud.json')).default;
  return { default: { ...en, hero: { ...en.hero, title: 'Lokalisierter Cloud-Titel' }, cloudPage: { ...en.cloudPage, text: 'Jetzt starten' } } };
});

import content from '@locale-content/pages/cloud.json';
import LandingHero from './LandingHero';

it('LandingHero renders mocked page content with the external CTA behavior', () => {
  render(<LandingHero {...content.hero} primaryCta={{ href: 'https://my.dawarich.app/users/sign_up', text: content.cloudPage.text }} />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Lokalisierter Cloud-Titel');
  expect(screen.getByRole('link', { name: 'Jetzt starten' })).toHaveAttribute('target', '_blank');
});
