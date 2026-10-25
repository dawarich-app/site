import { describe, it, expect } from 'vitest';
import { validateTranslations } from './i18n-validate.mjs';

const glossary = { doNotTranslate: ['Dawarich', 'GPX'] };
const run = (english, localized, locale = 'de') =>
  validateTranslations({ english, localized, locale, glossary }).map((e) => `${e.key}: ${e.rule}`);

describe('validateTranslations', () => {
  it('should accept a faithful translation', () => {
    expect(run({ a: 'Save {count} **GPX** files to [Dawarich](/pricing/)' }, { a: 'Speichere {count} **GPX**-Dateien in [Dawarich](/pricing/)' })).toEqual([]);
  });

  it('should flag lost or renamed placeholders', () => {
    expect(run({ a: 'Hello {name}' }, { a: 'Hallo {Name}' })).toEqual(['a: placeholders']);
  });

  it('should flag changed link targets and lost bold text', () => {
    expect(run({ a: 'See [docs](/docs/x/)' }, { a: 'Siehe [Doku](/de/docs/x/)' })).toEqual(['a: links']);
    expect(run({ a: '**Fast** tool' }, { a: 'Schnelles Tool' })).toEqual(['a: bold']);
  });

  it('should flag changed inline code', () => {
    expect(run({ a: 'Set `API_KEY` in .env' }, { a: 'Setze `API_SCHLUESSEL` in .env' })).toEqual(['a: code']);
    expect(run({ a: 'Set `API_KEY` in .env' }, { a: 'Setze `API_KEY` in .env' })).toEqual([]);
  });

  it('should flag dropped HTML tags', () => {
    expect(run({ a: 'Your <strong>3</strong> points' }, { a: 'Deine 3 Punkte' })).toEqual(['a: tags']);
  });

  it('should flag translated do-not-translate terms', () => {
    expect(run({ a: 'Import into Dawarich' }, { a: 'In Davarich importieren' })).toEqual(['a: glossary']);
  });

  it('should accept glossary terms inside hyphenated compounds', () => {
    expect(run({ a: 'Your GPX files from Dawarich' }, { a: 'Deine GPX-Dateien aus Dawarich-Exporten' })).toEqual([]);
    expect(
      validateTranslations({
        english: { a: 'Google Timeline data' },
        localized: { a: 'Google-Timeline-Daten' },
        locale: 'de',
        glossary: { doNotTranslate: ['Google Timeline'] },
      }),
    ).toEqual([]);
  });

  it('should flag empty translations', () => {
    expect(run({ a: 'Save' }, { a: '  ' })).toEqual(['a: empty']);
  });

  it('should allow a meta title as long as the English one but flag longer ones over the limit', () => {
    const english = { 'content:tools/x.json:meta.title': 'A'.repeat(70) };
    expect(run(english, { 'content:tools/x.json:meta.title': 'B'.repeat(70) })).toEqual([]);
    expect(run(english, { 'content:tools/x.json:meta.title': 'B'.repeat(71) })).toEqual(['content:tools/x.json:meta.title: length']);
    expect(run({ 'content:p.json:meta.description': 'short' }, { 'content:p.json:meta.description': 'C'.repeat(161) })).toEqual([
      'content:p.json:meta.description: length',
    ]);
  });

  it('should require the locale plural forms for plural messages', () => {
    const english = { a: '{count} file loaded|{count} files loaded' };
    expect(run(english, { a: '{count} plik|{count} pliki|{count} plików' }, 'pl')).toEqual([]);
    expect(run(english, { a: '{count} plik|{count} plików' }, 'pl')).toEqual(['a: plural']);
    expect(run(english, { a: '{count} 个文件' }, 'zh')).toEqual([]);
  });

  it('should compare bold markup per plural form', () => {
    const english = { a: '**{count}** file loaded|**{count}** files loaded' };
    expect(run(english, { a: 'Wczytano **{count}** plik|Wczytano **{count}** pliki|Wczytano **{count}** plików' }, 'pl')).toEqual([]);
    expect(run(english, { a: 'Wczytano **{count}** plik|Wczytano **{count}** pliki|Wczytano {count} plików' }, 'pl')).toEqual(['a: bold']);
  });

  it('should skip keys that are not translated yet', () => {
    expect(run({ a: 'Save', b: 'Load' }, { a: 'Speichern' })).toEqual([]);
  });
});
