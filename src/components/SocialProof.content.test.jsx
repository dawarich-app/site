import React from 'react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@paddle/paddle-js', () => ({ initializePaddle: vi.fn() }));
beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  vi.stubGlobal('IntersectionObserver', class { observe() {} unobserve() {} disconnect() {} });
});

vi.mock('@locale-content/components/SocialProof.json', async () => {
  const en = structuredClone((await import('../i18n/content/en/components/SocialProof.json')).default);
  en.integrationsLabel = 'Lokalisierter SocialProof';
  return { default: en };
});
import Subject from './SocialProof';

describe('SocialProof content source', () => {
  it('renders whatever the locale content module provides', () => {
    render(<Subject />);
    expect(screen.getByText('Lokalisierter SocialProof', { exact: true })).toBeInTheDocument();
  });
});
