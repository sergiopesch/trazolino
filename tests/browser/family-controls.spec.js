import { test, expect, enterLesson, audioSilent } from "./fixtures.js";

test("the music level falls beneath a Help hint and recovers without restarting", async ({ page }, testInfo) => {
  await enterLesson(page);
  const music = page.locator("audio").last();
  await expect.poll(() => page.locator("audio").evaluateAll(nodes => nodes.every(audio => !audio.paused && audio.currentTime > 2))).toBe(true);
  const teaching = await music.evaluate(audio => audio.volume);
  expect(teaching).toBeGreaterThan(0);
  // Help holds the demonstration and stops the instruction, while music
  // continues. Let it recover before checking the requested hint ducking.
  await page.getByRole("button", { name: "Help", exact: true }).click();
  await expect.poll(() => page.locator("audio").first().evaluate(audio => audio.paused), { timeout: 30000 }).toBe(true);
  await expect.poll(() => music.evaluate(audio => audio.volume)).toBeGreaterThan(teaching * 2);
  const quiet = await music.evaluate(audio => ({ volume: audio.volume, time: audio.currentTime, source: audio.src }));
  await page.getByRole("button", { name: "Hear the hint", exact: true }).click();
  await expect.poll(() => page.locator("audio").first().evaluate(audio => !audio.paused && audio.currentTime > 0.2)).toBe(true);
  await expect.poll(() => music.evaluate(audio => audio.volume)).toBeLessThan(quiet.volume * 0.8);
  const hint = await music.evaluate(audio => ({ volume: audio.volume, time: audio.currentTime, source: audio.src, paused: audio.paused }));
  expect(hint.paused).toBe(false);
  expect(hint.source).toBe(quiet.source);
  expect(hint.time).toBeGreaterThan(quiet.time);
  await page.getByRole("button", { name: "Stop hint", exact: true }).click();
  await expect.poll(() => music.evaluate(audio => audio.volume)).toBeGreaterThan(hint.volume * 1.5);
  await testInfo.attach("music-transition", { body: JSON.stringify({ teaching, quiet, hint }), contentType: "application/json" });
});

test("Help preserves music; pause, settings and finish preserve family control", async ({ page }, testInfo) => {
  await enterLesson(page);
  await expect.poll(() => page.locator("audio").evaluateAll(nodes => nodes.every(audio => !audio.paused && audio.currentTime > 0.2))).toBe(true);
  const music = page.locator("audio").last();
  const source = await music.getAttribute("src");
  const beforeHelp = await music.evaluate(audio => audio.currentTime);
  await page.getByRole("button", { name: "Help", exact: true }).click();
  await expect.poll(() => page.locator("audio").first().evaluate(audio => audio.paused)).toBe(true);
  await expect.poll(() => music.evaluate((audio, previous) => !audio.paused && audio.currentTime > previous, beforeHelp)).toBe(true);
  await page.getByRole("button", { name: "Hear the hint", exact: true }).click();
  await expect.poll(() => page.locator("audio").first().evaluate(audio => !audio.paused && audio.currentTime > 0.2)).toBe(true);
  await expect(music).toHaveAttribute("src", source);
  expect(await music.evaluate(audio => audio.paused)).toBe(false);
  await page.locator(".inline-help").press("Escape");
  await expect(page.getByRole("button", { name: "Help", exact: true })).toBeFocused();

  await expect(page.getByRole("button", { name: "Resume this step", exact: true })).toBeVisible();
  await expect(page.locator(".pause-modal")).toHaveCount(0);
  await expect(page.locator(".demonstration-board")).toBeVisible();
  await expect.poll(() => audioSilent(page)).toBe(true);
  const heldStep = await page.locator(".instruction-meta .eyebrow").innerText();
  const together = await page.locator(".cat-timeline-time").innerText();
  await expect.poll(() => page.locator(".cat-timeline-time").innerText()).not.toBe(together);
  await expect(page.locator(".instruction-meta .eyebrow")).toHaveText(heldStep);
  await page.getByRole("button", { name: "Resume this step", exact: true }).click();
  await expect.poll(() => music.evaluate(audio => !audio.paused)).toBe(true);
  await page.getByRole("button", { name: "Pause More time", exact: true }).click();
  await expect.poll(() => audioSilent(page)).toBe(true);
  await page.getByRole("button", { name: "Grown-ups: Parent settings", exact: true }).click();
  await expect.poll(() => audioSilent(page)).toBe(true);
  await page.getByRole("tab", { name: "Sound", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Drawing", exact: true })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("switch", { name: "Use still demonstrations", exact: true }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await page.getByRole("button", { name: "Replay this step", exact: true }).click();
  await expect(page.getByRole("button", { name: "Pause More time", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("lesson.png"), fullPage: true });
  await page.getByRole("button", { name: "Finish for now", exact: true }).click();
  await expect.poll(() => audioSilent(page)).toBe(true);
  await page.getByRole("button", { name: "Keep drawing", exact: true }).click();
  await expect(page.locator(".pause-modal")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Resume this step", exact: true })).toBeVisible();
  await expect.poll(() => audioSilent(page)).toBe(true);
});

test("hiding a Spanish lesson pauses immediately and requires the adult again", async ({ page }) => {
  await enterLesson(page, "Castellano Latinoamérica");
  await expect.poll(() => page.locator("audio").first().evaluate(audio => !audio.paused && audio.currentTime > 0.2)).toBe(true);
  const step = await page.locator(".instruction-meta .eyebrow").innerText();
  // Deterministic delivery of the browser lifecycle event; real device locking is a separate check.
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.locator(".pause-modal")).toBeVisible();
  await expect.poll(() => audioSilent(page)).toBe(true);
  await expect(page.locator(".pause-modal .primary")).toBeDisabled();
  await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event("visibilitychange")); });
  await expect(page.locator(".pause-modal .primary")).toBeDisabled();
  await page.locator(".pause-modal input").check();
  await page.locator(".pause-modal .primary").click();
  await expect(page.locator(".pause-modal")).toHaveCount(0);
  await expect(page.locator(".instruction-meta .eyebrow")).toHaveText(step);
});


test("parent pacing holds a completed demonstration until an explicit next step", async ({ page }) => {
  await enterLesson(page);
  await page.getByRole("button", { name: "Grown-ups: Parent settings", exact: true }).click();
  await page.getByRole("tab", { name: "Drawing", exact: true }).click();
  await page.getByRole("switch", { name: "At our pace", exact: true }).click();
  await page.getByRole("switch", { name: "Use still demonstrations", exact: true }).click();
  await page.getByRole("tab", { name: "Sound", exact: true }).click();
  await page.getByRole("switch", { name: "Read instructions aloud", exact: true }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  const step = await page.locator(".instruction-meta .eyebrow").innerText();
  await expect(page.locator(".board-status")).toContainText("Take your time.", { timeout: 25000 });
  const elapsed = () => page.locator('.cat-timeline-time > span').first().innerText().then(text => {
    const [minutes, seconds] = text.match(/\d+:\d+/)[0].split(':').map(Number);
    return minutes * 60 + seconds;
  });
  const practiceStarted = await elapsed();
  // This first observation has a one-second quiet window. Remain on it beyond
  // that window, proving parent pacing blocks the automatic advance.
  await expect.poll(elapsed).toBeGreaterThanOrEqual(practiceStarted + 3);
  await expect(page.locator(".instruction-meta .eyebrow")).toHaveText(step);
  await page.getByRole("button", { name: "Next step", exact: true }).click();
  await expect(page.locator(".instruction-meta .eyebrow")).not.toHaveText(step);
});
