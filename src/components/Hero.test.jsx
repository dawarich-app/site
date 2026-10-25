import React from 'react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import content from '@locale-content/components/Hero.json';

vi.mock('@paddle/paddle-js', () => ({ initializePaddle: vi.fn() }));
beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  vi.stubGlobal('IntersectionObserver', class { observe() {} unobserve() {} disconnect() {} });
});
import Subject from './Hero';

describe('Hero locale content', () => {
  it('renders its heading or label from English content', () => {
    render(<Subject />);
    expect(screen.getByText(content.title.trim(), { exact: false })).toBeInTheDocument();
  });
});
