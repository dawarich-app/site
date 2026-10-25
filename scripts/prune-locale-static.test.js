import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pruneLocaleStatic, ROOT_ONLY_STATIC_FILES } from './prune-locale-static.mjs';

function touch(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, 'x');
}

describe('pruneLocaleStatic', () => {
  let buildDir;

  beforeEach(() => {
    buildDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prune-'));
    for (const f of ROOT_ONLY_STATIC_FILES) {
      touch(path.join(buildDir, f));
      touch(path.join(buildDir, 'de', f));
    }
    touch(path.join(buildDir, 'de', 'img', 'logo.svg'));
    touch(path.join(buildDir, 'de', 'index.html'));
  });

  afterEach(() => {
    fs.rmSync(buildDir, { recursive: true, force: true });
  });

  it('should remove root-only static files from non-default locale dirs', () => {
    const removed = pruneLocaleStatic(buildDir, ['en', 'de']);
    for (const f of ROOT_ONLY_STATIC_FILES) {
      expect(fs.existsSync(path.join(buildDir, 'de', f))).toBe(false);
    }
    expect(removed).toHaveLength(ROOT_ONLY_STATIC_FILES.length);
  });

  it('should keep root copies, assets and pages', () => {
    pruneLocaleStatic(buildDir, ['en', 'de']);
    for (const f of ROOT_ONLY_STATIC_FILES) {
      expect(fs.existsSync(path.join(buildDir, f))).toBe(true);
    }
    expect(fs.existsSync(path.join(buildDir, 'de', 'img', 'logo.svg'))).toBe(true);
    expect(fs.existsSync(path.join(buildDir, 'de', 'index.html'))).toBe(true);
  });

  it('should skip locales whose build dir does not exist', () => {
    expect(() => pruneLocaleStatic(buildDir, ['en', 'de', 'fr'])).not.toThrow();
  });
});
