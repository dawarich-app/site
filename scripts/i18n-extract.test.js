import { describe, it, expect } from 'vitest';
import { warningFiles, unexpectedWarnings, stripCopyright, sortKeys } from './i18n-extract.mjs';

const output = [
  '[INFO] 88 translations will be written',
  '[WARNING] Translation extraction warnings for file "src/theme/ApiExplorer/Response/index.js": ',
  '- translate() id is not static',
  '[WARNING] Translation extraction warnings for file "src/pages/tools/x.js": ',
].join('\n');

describe('warningFiles', () => {
  it('should list the files that produced extraction warnings', () => {
    expect(warningFiles(output)).toEqual(['src/theme/ApiExplorer/Response/index.js', 'src/pages/tools/x.js']);
  });
});

describe('unexpectedWarnings', () => {
  it('should ignore the English-only OpenAPI explorer and keep everything else', () => {
    expect(unexpectedWarnings(warningFiles(output))).toEqual(['src/pages/tools/x.js']);
  });
});

describe('stripCopyright', () => {
  it('should drop the copyright entry so the config value with the current year is used', () => {
    expect(stripCopyright({ copyright: { message: '© 2026' }, 'link.item.label.Blog': { message: 'Blog' } })).toEqual({
      'link.item.label.Blog': { message: 'Blog' },
    });
  });
});

describe('sortKeys', () => {
  it('should order top-level keys so snapshots are stable between runs', () => {
    expect(Object.keys(sortKeys({ b: { message: 'B' }, a: { message: 'A' } }))).toEqual(['a', 'b']);
  });
});
