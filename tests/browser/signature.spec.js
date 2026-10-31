import { test, expect, audioSilent } from './fixtures.js';
import { auditAccessibility } from './accessibility-helpers.js';

test('the optional signature respects reduced motion and returns focus without loading a lesson', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const response = await page.goto('/');
  const imagePolicy = response.headers()['content-security-policy'].split(';')
    .map(directive => directive.trim()).find(directive => directive.startsWith('img-src '));
  expect(imagePolicy).toBe("img-src 'self' data:");
  const opener = page.getByRole('button', { name: 'Watch our signature come to life', exact: true });
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'Trazolino', exact: true });
  await expect(dialog.locator('.tl-container')).toBeVisible();
  await expect.poll(() => dialog.locator('[data-shape-type="draw"]').count()).toBeGreaterThan(0);
  await expect(dialog.locator('.signature-controls')).toHaveCount(0);
  await expect(dialog.getByRole('link', { name: 'With thanks to tldraw', exact: true })).toHaveAttribute('href', 'https://tldraw.com');
  await expect(dialog.getByText('tldraw provided a hobby licence. Their drawing tools bring our signature and step-by-step demonstrations to life.', { exact: true })).toBeVisible();
  await expect(page.locator('.demonstration-board')).toHaveCount(0);
  await expect.poll(() => audioSilent(page)).toBe(true);
  await auditAccessibility(page, testInfo, 'signature-reduced-motion');
  await dialog.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
});
