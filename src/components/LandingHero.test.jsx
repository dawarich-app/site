import React from 'react';
import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import content from '@locale-content/pages/cloud.json';
import LandingHero from './LandingHero';

it('LandingHero renders page content and opens its external CTA in a new tab', () => {
  render(<LandingHero {...content.hero} primaryCta={{ href: 'https://my.dawarich.app/users/sign_up', text: content.cloudPage.text }} />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(content.hero.title);
  expect(screen.getByRole('link', { name: content.cloudPage.text })).toHaveAttribute('target', '_blank');
});
