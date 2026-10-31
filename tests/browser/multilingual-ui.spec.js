import { test, expect, audioSilent } from './fixtures.js';
import { LANGUAGES } from '../../src/languages.js';
import { translate } from '../../src/ui-translations.js';
import { getLocale } from '../../src/locale-registry.js';
import { languageHref } from "../../src/locale-url.ts";
import { documentTitle } from '../../src/locale-navigation.ts';
import aboutCopy from '../../src/about-copy.json' with { type: 'json' };
import { auditAccessibility, expectReflow, expectReachableControls } from './accessibility-helpers.js';

for (const language of LANGUAGES) {
  test(`${language.id}: complete localized information and return journey`, async ({ page }, testInfo) => {
    test.setTimeout(150000);
    const t = text => translate(language.id, text);
    const about = aboutCopy[getLocale(language.id).textLocale];
    const capture = async (state, scope = page.locator('main')) => {
      for (const width of [1280, 390, 320]) {
        await page.setViewportSize({ width, height: width === 1280 ? 900 : 844 });
        await page.evaluate(() => document.fonts.ready);
        await expectReflow(page);
        await expectReachableControls(page, scope);
        // Start at the top after checking scrollable controls, to keep evidence comparable.
        await page.evaluate(() => { scrollTo(0, 0); document.querySelector('dialog[open]')?.scrollTo(0, 0); });
        if (width !== 320) await page.screenshot({ path: testInfo.outputPath(`${state}-${width}.png`), fullPage: !await page.locator('dialog[open]').count() });
      }
    };
    await page.goto('/');
    await page.getByRole('button', { name: /Choose your language$/ }).click();
    await page.getByRole('button', { name: `${language.name} ${language.region}`, exact: true }).click();
    await expect(page).toHaveTitle(documentTitle(language.id));
    await expect(page.locator('html')).toHaveAttribute('lang', language.id);
    await capture('home');
    for (const width of [1280, 768]) {
      await page.setViewportSize({ width, height: 900 });
      const rows = await page.locator('.level-link').evaluateAll(nodes => nodes.map(node => {
        const { top, bottom } = node.getBoundingClientRect(); return { top, bottom };
      }));
      expect(Math.max(...rows.map(row => row.top)) - Math.min(...rows.map(row => row.top))).toBeLessThan(1);
      expect(Math.max(...rows.map(row => row.bottom)) - Math.min(...rows.map(row => row.bottom))).toBeLessThan(1);
      await expectReachableControls(page, page.locator('.level-choices'));
    }
    for (const [key, source] of [['how', 'How it works'], ['parents', 'For grown-ups'], ['privacy', 'Privacy & supervision']]) {
      await page.getByRole('button', { name: t(source), exact: true }).filter({ visible: true }).click();
      await capture(key, page.getByRole('dialog'));
      await page.keyboard.press('Escape');
    }
    await page.getByRole('button', { name: t('Choose your language'), exact: false }).click();
    await capture('language-picker', page.getByRole('dialog'));
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: t('Watch our signature come to life'), exact: true }).click();
    await expect(page.locator('.signature-modal .tl-container')).toBeVisible();
    if (await page.locator('.signature-controls').count())
      await page.getByRole('button', { name: t('View signature'), exact: true }).click();
    await expect.poll(() => page.locator('.signature-modal [data-shape-type="draw"]').count()).toBeGreaterThan(0);
    await expect(page.getByRole('link', { name: t('With thanks to tldraw'), exact: true })).toHaveAttribute('href', 'https://tldraw.com');
    await capture('signature', page.getByRole('dialog'));
    await page.keyboard.press('Escape');
    await page.getByRole('link', { name: t('About'), exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/about/${language.id === 'en-GB' ? '$' : '\\?lang=' + language.id + '$'}`));
    await expect(page).toHaveTitle(about.title);
    await expect(page.locator('html')).toHaveAttribute('lang', language.id);
    await expect(page.locator('h1')).toHaveText(about.greeting + 'Sergio.');
    await expect(page.getByText(about.purpose, { exact: true })).toBeVisible();
    await capture('about', page.locator('body'));
    await auditAccessibility(page, testInfo, 'localized-about');
    await page.reload();
    await expect(page).toHaveTitle(about.title);
    await page.getByRole('link', { name: about.back, exact: true }).click();
    await expect(page).toHaveTitle(documentTitle(language.id));
    await expect(page.locator('html')).toHaveAttribute('lang', language.id);
    await expect(page.locator('.about-link')).toHaveAttribute('href', languageHref('/about/', language.id));
    await page.locator('.level-choice').first().click();
    await expect(page.locator('.catalogue-page')).toBeVisible();
    await capture('catalogue');
    await page.locator('.drawing-choice').first().click();
    await expect(page.locator('.entry-confirmation-actions .primary')).toBeDisabled();
    await page.locator('.entry-sound summary').click();
    await capture('setup');
    await page.locator('.entry-sound-choice input').first().uncheck();
    await page.locator('.entry-sound-choice input').last().uncheck();
    await page.locator('.entry-supervision input').check();
    await page.locator('.entry-confirmation-actions .primary').click();
    await expect(page.locator('.demonstration-board')).toBeVisible();
    await page.getByRole('button', { name: `${t('Pause')} ${t('More time')}`, exact: true }).click();
    await capture('lesson');
    await page.getByRole('button', { name: t('Help'), exact: true }).click();
    await page.locator('.inline-help summary').first().click();
    await page.locator('.inline-help summary').last().click();
    await capture('help');
    await page.getByRole('button', { name: t('Back to this step'), exact: true }).click();
    await page.getByRole('button', { name: `${t('Grown-ups')}: ${t('Parent settings')}`, exact: true }).click();
    await capture('settings-sound', page.getByRole('dialog'));
    await page.getByRole('tab', { name: t('Drawing'), exact: true }).click();
    await capture('settings-drawing', page.getByRole('dialog'));
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: t('Finish for now'), exact: true }).click();
    await expect(page.getByRole('dialog', { name: t('A drawing that’s yours.'), exact: true })).toBeVisible();
    await capture('completion', page.getByRole('dialog'));
    await page.getByRole('button', { name: t('Finish session'), exact: true }).click();
    await expect(page.locator('#home-title')).toHaveText(t('Every drawing starts') + ' ' + t('with a little line.'));
    await expect(page.locator('html')).toHaveAttribute('lang', language.id);
    await expect.poll(() => audioSilent(page)).toBe(true);
  });
}

test('unknown language URLs fall back to English without loading a lesson', async ({ page }) => {
  await page.goto('/?lang=unknown');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB');
  await expect(page.locator('.demonstration-board, audio')).toHaveCount(0);
  await page.goto('/about/?lang=unknown');
  await expect(page).toHaveTitle('About — Trazolino');
  await expect(page.getByRole('link', { name: 'Back to drawing', exact: true })).toHaveAttribute('href', '/');
});
