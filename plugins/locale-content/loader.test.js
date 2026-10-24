import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import loader from './loader.js';

describe('locale-content loader', () => {
  let dir;
  const run = (locale, file) => {
    const deps = [];
    const missing = [];
    const source = fs.readFileSync(path.join(dir, 'en', file), 'utf8');
    const out = loader.call(
      {
        resourcePath: path.join(dir, 'en', file),
        getOptions: () => ({ locale, contentDir: dir, defaultLocale: 'en' }),
        addDependency: (d) => deps.push(d),
        addMissingDependency: (d) => missing.push(d),
      },
      source,
    );
    return { data: JSON.parse(out), deps, missing };
  };

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lc-'));
    fs.mkdirSync(path.join(dir, 'en/tools'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'de/tools'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'en/tools/x.json'), JSON.stringify({ h1: 'Converter', intro: 'Hello' }));
    fs.writeFileSync(path.join(dir, 'de/tools/x.json'), JSON.stringify({ h1: 'Konverter' }));
  });

  afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

  it('should overlay the locale file key by key and watch it', () => {
    const { data, deps } = run('de', 'tools/x.json');
    expect(data).toEqual({ h1: 'Konverter', intro: 'Hello' });
    expect(deps).toEqual([path.join(dir, 'de/tools/x.json')]);
  });

  it('should watch for a locale file that does not exist yet', () => {
    const { missing, deps } = run('fr', 'tools/x.json');
    expect(missing).toEqual([path.join(dir, 'fr/tools/x.json')]);
    expect(deps).toEqual([]);
  });

  it('should return English for the default locale or a locale without the file', () => {
    expect(run('en', 'tools/x.json').data).toEqual({ h1: 'Converter', intro: 'Hello' });
    expect(run('fr', 'tools/x.json').data).toEqual({ h1: 'Converter', intro: 'Hello' });
  });
});
