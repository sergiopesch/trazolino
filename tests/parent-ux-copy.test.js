import test from 'node:test';
import assert from 'node:assert/strict';
import copy from '../docs/localization/parent-ux-copy.json' with {type:'json'};
import { translate } from '../src/ui-translations.js';
test('parent journey copy matches its reviewable source in every translated locale', () => {
  for (const {source, translations} of copy.messages) {
    for (const [locale, wording] of Object.entries(translations)) assert.equal(translate(locale,source),wording,`${locale}: ${source}`);
  }
});
