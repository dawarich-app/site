import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { stripNulBytes } from './strip-nul-bytes.mjs';

describe('stripNulBytes', () => {
  let dir;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nul-'));
    fs.mkdirSync(path.join(dir, 'de/pricing'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'de/pricing/index.html'), Buffer.from('history \u0000— forever'));
    fs.writeFileSync(path.join(dir, 'index.html'), 'clean — text');
    fs.writeFileSync(path.join(dir, 'app.js'), Buffer.from('a\u0000b'));
  });

  afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

  it('should remove NUL bytes from HTML files and report them', () => {
    expect(stripNulBytes(dir)).toEqual([{ file: 'de/pricing/index.html', count: 1 }]);
    expect(fs.readFileSync(path.join(dir, 'de/pricing/index.html'), 'utf8')).toBe('history — forever');
  });

  it('should leave clean HTML and non-HTML files untouched', () => {
    stripNulBytes(dir);
    expect(fs.readFileSync(path.join(dir, 'index.html'), 'utf8')).toBe('clean — text');
    expect(fs.readFileSync(path.join(dir, 'app.js')).includes(0)).toBe(true);
  });
});
