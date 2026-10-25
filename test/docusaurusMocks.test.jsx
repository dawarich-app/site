import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Translate, { translate } from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Interpolate, { interpolate } from '@docusaurus/Interpolate';
import { usePluralForm } from '@docusaurus/theme-common';

describe('docusaurus client mocks', () => {
  it('translate returns the English message with placeholders filled', () => {
    expect(translate({ id: 'x', message: 'Hello {name}' }, { name: 'Eu' })).toBe('Hello Eu');
  });

  it('Translate renders its children', () => {
    render(<Translate id="y">Privacy First</Translate>);
    expect(screen.getByText('Privacy First')).toBeInTheDocument();
  });

  it('interpolate and Interpolate fill placeholders', () => {
    expect(interpolate('{a}-{b}', { a: 1, b: 2 })).toBe('1-2');
    render(<Interpolate values={{ n: 3 }}>{'n={n}'}</Interpolate>);
    expect(screen.getByText('n=3')).toBeInTheDocument();
  });

  it('Link renders an anchor with the target path', () => {
    render(<Link to="/tools/">Tools</Link>);
    expect(screen.getByRole('link', { name: 'Tools' })).toHaveAttribute('href', '/tools/');
  });

  it('useDocusaurusContext exposes an en i18n context', () => {
    let ctx;
    function Probe() {
      ctx = useDocusaurusContext();
      return null;
    }
    render(<Probe />);
    expect(ctx.i18n.currentLocale).toBe('en');
    expect(ctx.i18n.localeConfigs['pt-br'].htmlLang).toBe('pt-BR');
  });

  it('usePluralForm selects the English singular or plural form', () => {
    let select;
    function Probe() {
      select = usePluralForm().selectMessage;
      return null;
    }
    render(<Probe />);
    expect(select(1, 'One chunk|{count} chunks')).toBe('One chunk');
    expect(select(5, 'One chunk|{count} chunks')).toBe('{count} chunks');
  });
});
