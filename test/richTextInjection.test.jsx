import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { interpolate } from '@docusaurus/Interpolate';

describe('interpolate with element values', () => {
  it('should keep user-provided file names as plain text inside elements', () => {
    const name = 'a*[x](javascript:alert(1)).json';
    const { container } = render(<span>{interpolate('{fileA} and {fileB}', { fileA: <strong>{name}</strong>, fileB: <strong>b.json</strong> })}</span>);
    expect(container.querySelector('a')).toBeNull();
    expect(container.querySelectorAll('strong')[0].textContent).toBe(name);
    expect(container.textContent).toBe(`${name} and b.json`);
  });
});
