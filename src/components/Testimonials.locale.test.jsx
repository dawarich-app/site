import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import content from '@locale-content/components/Testimonials.json';

const locale = vi.hoisted(() => ({ current: 'en' }));
vi.mock('@docusaurus/useDocusaurusContext', async () => {
  const original = await vi.importActual('@docusaurus/useDocusaurusContext');
  return { default: () => {
    const context = original.default();
    return { ...context, i18n: { ...context.i18n, currentLocale: locale.current } };
  } };
});

import Subject from './Testimonials';

describe('Testimonials quotes', () => {
  it('should render every quote and source from locale content without a translation note in English', () => {
    locale.current = 'en';
    render(<Subject />);
    for (const item of content.quotes) {
      expect(screen.getByText(item.quote)).toBeInTheDocument();
      expect(screen.getAllByText(item.source).length).toBeGreaterThan(0);
    }
    expect(screen.queryByText(content.translatedNote)).toBeNull();
  });

  it('should mark every quote as translated in other locales', () => {
    locale.current = 'de';
    render(<Subject />);
    expect(screen.getAllByText(content.translatedNote)).toHaveLength(content.quotes.length);
  });
});
