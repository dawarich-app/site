import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PersonalizedCTA from './PersonalizedCTA';

describe('PersonalizedCTA', () => {
  it('should render a string headline as text, never as HTML', () => {
    render(<PersonalizedCTA toolName="t" headline={'Your <img src=x onerror=alert(1)> file'} />);
    expect(document.querySelector('img')).toBeNull();
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Your <img src=x onerror=alert(1)> file');
  });

  it('should render an element headline as given', () => {
    render(<PersonalizedCTA toolName="t" headline={<strong>42</strong>} />);
    expect(screen.getByRole('heading', { level: 3 }).querySelector('strong')).toHaveTextContent('42');
  });
});
