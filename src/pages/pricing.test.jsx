import React from 'react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import content from '@locale-content/pages/pricing.json';

vi.mock('@paddle/paddle-js', () => ({ initializePaddle: vi.fn() }));
beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  vi.stubGlobal('IntersectionObserver', class { observe() {} unobserve() {} disconnect() {} });
});
import Subject from './pricing';
import { COMMISSION_PERCENT } from '@site/src/data/affiliateProgram';

describe('pricing locale content', () => {
  it('renders its heading or label from English content', () => {
    render(<Subject />);
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute('content', `${content.meta.title.trim()} | Dawarich`);
  });

  it('links the affiliate program with the current commission', () => {
    render(<Subject />);
    const link = screen.getByRole('link', { name: `Earn ${COMMISSION_PERCENT}% of the first year` });
    expect(link).toHaveAttribute('href', '/affiliate');
    expect(link.closest('p')).toHaveTextContent('for every subscriber you refer.');
  });
});
