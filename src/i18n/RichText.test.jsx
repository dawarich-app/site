import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RichText, { parseRichText, toPlainText } from './RichText';

describe('parseRichText', () => {
  it('should split text, bold and links into tokens', () => {
    expect(parseRichText('A **b** [c](/d) e')).toEqual([
      { type: 'text', value: 'A ' },
      { type: 'bold', value: 'b' },
      { type: 'text', value: ' ' },
      { type: 'link', value: 'c', href: '/d' },
      { type: 'text', value: ' e' },
    ]);
  });

  it('should return a single text token for plain strings', () => {
    expect(parseRichText('plain')).toEqual([{ type: 'text', value: 'plain' }]);
  });
});

describe('toPlainText', () => {
  it('should strip markup but keep the visible words', () => {
    expect(toPlainText('Use **GPX** or read [the guide](/blog/x).')).toBe('Use GPX or read the guide.');
  });
});

describe('RichText', () => {
  it('should render bold text and localized internal links', () => {
    render(<RichText text="**Fast** and [private](/tools/x/)" />);
    expect(screen.getByText('Fast').tagName).toBe('STRONG');
    expect(screen.getByRole('link', { name: 'private' })).toHaveAttribute('href', '/tools/x/');
  });

  it('should open external links in a new tab', () => {
    render(<RichText text="[Takeout](https://takeout.google.com/)" />);
    const link = screen.getByRole('link', { name: 'Takeout' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should route English-only paths through the English link helper', () => {
    render(<RichText text="[guide](/blog/migrating/)" />);
    expect(screen.getByRole('link', { name: 'guide' })).toHaveAttribute('href', '/blog/migrating/');
  });

  it('should treat absolute dawarich.app links as internal paths', () => {
    render(<RichText text="[blog](https://dawarich.app/blog/x)" />);
    expect(screen.getByRole('link', { name: 'blog' })).toHaveAttribute('href', '/blog/x');
  });

  it('should render links with unsafe schemes as plain text', () => {
    render(<RichText text="[click](javascript:alert(1)) and [data](data:text/html,x)" />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(document.body.textContent).toContain('click');
  });

  it('should keep mailto links', () => {
    render(<RichText text="[mail](mailto:hi@example.com)" />);
    expect(screen.getByRole('link', { name: 'mail' })).toHaveAttribute('href', 'mailto:hi@example.com');
  });
});
