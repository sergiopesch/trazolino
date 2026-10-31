import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import copy from '../src/about-copy.json' with { type: 'json' };
import review from '../docs/localization/about-copy-review.json' with { type: 'json' };
import { LOCALES } from '../src/locale-registry.js';

test('About covers every written locale with review evidence tied to the exact copy', () => {
  assert.deepEqual(Object.keys(copy).sort(), [...new Set(LOCALES.map(locale => locale.textLocale))].sort());
  for (const [locale, words] of Object.entries(copy)) {
    assert.deepEqual(Object.keys(words), Object.keys(copy['en-GB']), locale);
    for (const [key, value] of Object.entries(words)) assert.ok(typeof value === 'string' && value.trim(), `${locale}: ${key}`);
  }
  const fallback = readFileSync(new URL('../about/index.html', import.meta.url), 'utf8');
  for (const value of Object.values(copy['en-GB'])) assert.ok(fallback.includes(value), 'English static fallback matches its source');
  assert.equal(review.sha256, createHash('sha256').update(readFileSync(new URL('../src/about-copy.json', import.meta.url))).digest('hex'));
  assert.equal(review.status, 'assistant-authored-awaiting-native-human-review');
});
