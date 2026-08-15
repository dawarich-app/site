import { describe, expect, it } from 'vitest';
import { compareModules, normalizeModule } from './posterDrift.mjs';

describe('normalizeModule', () => {
  it('strips single-line imports', () => {
    const source = 'import { a } from "./a.js"\nconst x = 1\n';
    expect(normalizeModule(source)).toEqual(['const x = 1']);
  });

  it('strips multi-line import blocks', () => {
    const source = [
      'import {',
      '  detectMaxRenderDimension,',
      '  PAPER_SIZES,',
      '} from "./paper_sizes.js"',
      '',
      'const x = 1',
    ].join('\n');
    expect(normalizeModule(source)).toEqual(['const x = 1']);
  });

  it('strips the provenance header line', () => {
    const source = '// Vendored from dawarich app/javascript/poster_studio/data/fonts.js — edit there first. Intentional deltas: none.\nconst x = 1\n';
    expect(normalizeModule(source)).toEqual(['const x = 1']);
  });

  it('drops lines matching delta patterns', () => {
    const source = 'const keep = 1\nconst ERROR_MESSAGES = {\nconst alsoKeep = 2\n';
    expect(normalizeModule(source, ['ERROR_MESSAGES'])).toEqual([
      'const keep = 1',
      'const alsoKeep = 2',
    ]);
  });

  it('ignores trailing whitespace and blank lines', () => {
    const source = 'const x = 1   \n\n\nconst y = 2\n';
    expect(normalizeModule(source)).toEqual(['const x = 1', 'const y = 2']);
  });
});

describe('compareModules', () => {
  it('reports clean when files agree modulo imports and declared deltas', () => {
    const vendored = [
      '// Vendored from dawarich app/javascript/poster_studio/ui/x.js — deltas listed.',
      'import { a } from "../data/a.js"',
      'const localized = "english"',
      'export function shared() {',
      '  return 1',
      '}',
    ].join('\n');
    const source = [
      'import { a } from "poster_studio/data/a"',
      'const key = "i18n.key"',
      'export function shared() {',
      '  return 1',
      '}',
    ].join('\n');
    const result = compareModules(vendored, source, ['^const localized', '^const key']);
    expect(result.clean).toBe(true);
  });

  it('reports the first drifted line when bodies differ', () => {
    const vendored = 'export function f() {\n  return 1\n}\n';
    const source = 'export function f() {\n  return 2\n}\n';
    const result = compareModules(vendored, source);
    expect(result.clean).toBe(false);
    expect(result.firstDiff).toMatchObject({
      vendored: 'return 1',
      source: 'return 2',
    });
  });

  it('reports drift when one side has extra lines', () => {
    const vendored = 'const a = 1\nconst extra = 9\n';
    const source = 'const a = 1\n';
    expect(compareModules(vendored, source).clean).toBe(false);
  });
});
