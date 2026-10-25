import React from 'react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import content from '@locale-content/components/HowItWorks.json';

vi.mock('@paddle/paddle-js', () => ({ initializePaddle: vi.fn() }));
beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  vi.stubGlobal('IntersectionObserver', class { observe() {} unobserve() {} disconnect() {} });
});
import Subject from './HowItWorks';

describe('HowItWorks locale content', () => {
  it('renders its heading or label from English content', () => {
    render(<Subject title="Example steps" steps={[{ title: "Track" }]} variant="route" />);
    expect(screen.getByText(content.step.replace('{number}', '01'), { exact: true })).toBeInTheDocument();
  });
});
