import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { useHtmlLang } from './useHtmlLang';

describe('useHtmlLang', () => {
  it('should return the BCP 47 tag of the current locale', () => {
    let lang;
    function Probe() {
      lang = useHtmlLang();
      return null;
    }
    render(<Probe />);
    expect(lang).toBe('en');
  });
});
