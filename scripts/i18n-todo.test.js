import { describe, it, expect } from 'vitest';
import { buildTodo, recordHashes } from './i18n-todo.mjs';
import { hashMessage } from './i18n-lib.mjs';

describe('buildTodo', () => {
  it('should list blocking keys with the English source and where to write the translation', () => {
    const english = { 'code:shared.save': 'Save', 'content:tools/x.json:faq.0.q': 'Why?', 'code:shared.ok': 'OK' };
    const status = { 'code:shared.save': 'untranslated', 'content:tools/x.json:faq.0.q': 'missing', 'code:shared.ok': 'ok' };
    expect(buildTodo({ english, status, locale: 'de' })).toEqual([
      { key: 'code:shared.save', status: 'untranslated', english: 'Save', file: 'i18n/de/code.json', path: 'shared.save' },
      {
        key: 'content:tools/x.json:faq.0.q',
        status: 'missing',
        english: 'Why?',
        file: 'src/i18n/content/de/tools/x.json',
        path: 'faq.0.q',
      },
    ]);
  });
});

describe('recordHashes', () => {
  it('should not stamp strings left identical to English unless they are declared intentional', () => {
    const english = { a: 'Format', b: 'Upload' };
    const localized = { a: 'Format', b: 'Upload' };
    expect(recordHashes({ english, localized, errors: [], identicalOk: ['a'] })).toEqual({ a: hashMessage('Format') });
  });

  it('should stamp the English hash for translated keys without validation errors', () => {
    const english = { a: 'Save', b: 'Load', c: 'Quit' };
    const localized = { a: 'Speichern', b: 'Laden' };
    const errors = [{ key: 'b', rule: 'glossary' }];
    expect(recordHashes({ english, localized, errors, previous: { c: 'old' } })).toEqual({
      a: hashMessage('Save'),
      c: 'old',
    });
  });
});
