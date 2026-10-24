import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EnOnlyLink from './EnOnlyLink';

describe('EnOnlyLink', () => {
  it('should render a link to the English-only path with its other props', () => {
    render(<EnOnlyLink to="/docs/self-hosting/introduction" className="cta">Self-host</EnOnlyLink>);
    const link = screen.getByRole('link', { name: 'Self-host' });
    expect(link).toHaveAttribute('href', '/docs/self-hosting/introduction');
    expect(link).toHaveClass('cta');
  });
});
