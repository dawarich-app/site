import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import content from '@locale-content/tools/index.json';

vi.mock('@docusaurus/useDocusaurusContext', async () => {
  const original = await vi.importActual('@docusaurus/useDocusaurusContext');
  return { default: () => {
    const context = original.default();
    return { ...context, i18n: { ...context.i18n, currentLocale: 'de' } };
  } };
});

import Subject from './index';

describe('tools index in a non-default locale', () => {
  it('sends the English-only Route Video Maker card to the root English page', () => {
    render(<Subject />);
    const card = screen.getByRole('link', { name: new RegExp(content.tools[12].title) });
    expect(card).toHaveAttribute('href', 'pathname:///tools/route-video-maker/');
  });

  it('keeps localized tool cards on the locale route', () => {
    render(<Subject />);
    const card = screen.getByRole('link', { name: new RegExp(content.tools[0].title) });
    expect(card).toHaveAttribute('href', '/tools/timeline-visualizer');
  });
});
