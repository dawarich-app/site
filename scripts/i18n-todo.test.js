import { describe, it, expect } from 'vitest';
import { buildTodo, recordHashes, freshTodoKeys } from './i18n-todo.mjs';
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

describe('buildTodo for markdown pages', () => {
  it('should point page keys at the locale page file', () => {
    const todo = buildTodo({ english: { 'page:contact.md': '# Contact' }, status: { 'page:contact.md': 'missing' }, locale: 'fr' });
    expect(todo[0]).toMatchObject({ file: 'i18n/fr/docusaurus-plugin-content-pages/contact.md', path: '' });
  });
});

describe('recordHashes', () => {
  it('should keep stale keys stale unless they were handed to a translator', () => {
    const english = { a: 'New text', b: 'Other new text' };
    const localized = { a: 'Alter Text', b: 'Neuer anderer Text' };
    const previous = { a: hashMessage('Old text'), b: hashMessage('Old other') };
    expect(recordHashes({ english, localized, errors: [], previous, todoKeys: ['b'] })).toEqual({
      a: hashMessage('Old text'),
      b: hashMessage('Other new text'),
    });
  });

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

describe('freshTodoKeys', () => {
  it('should ignore todo items whose English changed after the list was written', () => {
    const todo = [{ key: 'a', english: 'Same' }, { key: 'b', english: 'Old' }];
    expect(freshTodoKeys(todo, { a: 'Same', b: 'New' })).toEqual(['a']);
  });
});
