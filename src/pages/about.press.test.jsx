import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import content from '@locale-content/pages/about.json';
import Subject from './about';

describe('about page', () => {
  it('should list the key facts from the press kit', () => {
    render(<Subject />);
    for (const fact of content.aboutPage.facts) expect(screen.getByText(fact.label)).toBeInTheDocument();
  });

  it('should link to the press coverage and the press kit', () => {
    render(<Subject />);
    expect(document.querySelector('a[href*="heise.de"]')).not.toBeNull();
    expect(document.querySelector('a[href*="xda-developers.com"]')).not.toBeNull();
    expect(document.querySelector('a[href="/press-kit/"], a[href="/press-kit"]')).not.toBeNull();
  });
});
