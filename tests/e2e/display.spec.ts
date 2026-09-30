import { test, expect, presetDesign, type Design } from './fixtures';

const label = (d: Design) => (d === 'crt' ? 'Dark CRT' : 'Light tablet');
const other = (d: Design): Design => (d === 'crt' ? 'tablet' : 'crt');

test('with nothing stored: the CRT on Chromium, the tablet elsewhere', async ({ site, browserName }) => {
  await site.goto('/');
  const expected: Design = browserName === 'chromium' ? 'crt' : 'tablet';
  expect(await site.design()).toBe(expected);
  await expect(site.pref('Design', label(expected))).toHaveAttribute('aria-pressed', 'true');
  await expect(site.pref('Design', label(other(expected)))).toHaveAttribute('aria-pressed', 'false');
  // the curve is the one engine-gated part: Chromium only, CRT, >= 900px
  if (browserName === 'chromium') await expect(site.html).toHaveClass(/\bwarp\b/);
  else await expect(site.html).not.toHaveClass(/\bwarp\b/);
});

test('either design can be chosen in every engine, and the curve only runs on Chromium', async ({ page, site, browserName }) => {
  await site.goto('/');
  await site.pref('Design', 'Dark CRT').click();
  expect(await site.design()).toBe('crt');
  const filter = await page.evaluate(() => getComputedStyle(document.querySelector('.tube')!).filter);
  if (browserName === 'chromium') expect(filter).toContain('url(');
  else expect(filter).toBe('none');
  await site.pref('Design', 'Light tablet').click();
  expect(await site.design()).toBe('tablet');
  await expect(site.html).not.toHaveClass(/\bwarp\b/);
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the header power button switches the design, and the choice carries to the next page', async ({ site }) => {
    await site.goto('/');
    const start = await site.design();
    const next = other(start);
    await expect(site.headerPower).toBeVisible();
    await expect(site.chinPower).toBeHidden();
    await expect(site.headerPower).toHaveAttribute('aria-pressed', String(start === 'crt'));

    await site.headerPower.click();
    expect(await site.design()).toBe(next);
    await expect(site.headerPower).toHaveAttribute('aria-pressed', String(next === 'crt'));
    await expect(site.pref('Design', label(next))).toHaveAttribute('aria-pressed', 'true');

    await site.goto('/projects/');
    expect(await site.design()).toBe(next);

    // and back again with the footer's labelled buttons, still remembered
    await site.pref('Design', label(start)).click();
    expect(await site.design()).toBe(start);
    await site.goto('/about/');
    expect(await site.design()).toBe(start);
  });
});

test('the controls still work when storage throws', async ({ page, site }) => {
  await page.addInitScript(() => {
    for (const name of ['localStorage', 'sessionStorage']) {
      Object.defineProperty(window, name, {
        configurable: true,
        get() { throw new DOMException('storage blocked', 'SecurityError'); },
      });
    }
  });
  await site.goto('/projects/');
  const start = await site.design();
  await site.pref('Design', label(other(start))).click();
  expect(await site.design()).toBe(other(start));
  await site.pref('Design', 'Dark CRT').click();
  await site.pref('Effects', 'Off').click();
  await expect(site.html).toHaveClass(/\bcalm\b/);
  // scroll memory and page changes run into the same wall, quietly
  await site.scrollTube(300);
  await site.goto('/about/');
  expect(await site.tubeY()).toBe(0);
  // (the auto fixture fails the test on any uncaught page error)
});

test.describe('effects and reduced motion', () => {
  test('with no effects choice, the OS motion setting decides, and follows it live', async ({ page, site }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await presetDesign(page, 'crt');
    await site.goto('/');
    await expect(site.html).toHaveClass(/\bcalm\b/);
    await expect(site.pref('Effects', 'Off')).toHaveAttribute('aria-pressed', 'true');

    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(site.html).not.toHaveClass(/\bcalm\b/);
    await expect(site.pref('Effects', 'On')).toHaveAttribute('aria-pressed', 'true');
  });

  test('an explicit effects choice outlasts OS changes and reloads', async ({ page, site }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await presetDesign(page, 'crt');
    await site.goto('/');
    await site.pref('Effects', 'Off').click();
    await expect(site.html).toHaveClass(/\bcalm\b/);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(site.html).toHaveClass(/\bcalm\b/);
    await expect(site.pref('Effects', 'Off')).toHaveAttribute('aria-pressed', 'true');
    await site.goto('/about/');
    await expect(site.html).toHaveClass(/\bcalm\b/);
  });

  test('effects on: the sweep and flicker run; effects off: they stop', async ({ page, site }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await presetDesign(page, 'crt');
    await site.goto('/');
    const motion = () =>
      page.evaluate(() => ({
        sweep: getComputedStyle(document.querySelector('.crt-sweep')!).display,
        lines: getComputedStyle(document.querySelector('.crt-lines')!).display,
        flicker: getComputedStyle(document.querySelector('h1')!).animationName,
      }));
    await site.pref('Effects', 'On').click();
    expect(await motion()).toEqual({ sweep: 'block', lines: 'block', flicker: 'flicker' });
    await site.pref('Effects', 'Off').click();
    expect(await motion()).toEqual({ sweep: 'none', lines: 'none', flicker: 'none' });
  });

  test('reduced motion keeps the sweep and flicker off even with effects on, and the description says so', async ({ page, site, browserName }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await presetDesign(page, 'crt');
    await site.goto('/');
    await site.pref('Effects', 'On').click();
    const state = await page.evaluate(() => ({
      sweep: getComputedStyle(document.querySelector('.crt-sweep')!).display,
      lines: getComputedStyle(document.querySelector('.crt-lines')!).display,
      flicker: getComputedStyle(document.querySelector('h1')!).animationName,
    }));
    expect(state).toEqual({ sweep: 'none', lines: 'block', flicker: 'none' });

    // the Effects description names only what runs here
    await expect(site.effectsNote).toContainText('reduced motion');
    await expect(site.effectsNote).not.toContainText('refresh sweep');
    if (browserName === 'chromium') await expect(site.effectsNote).toContainText('screen curve');
    else await expect(site.effectsNote).not.toContainText('screen curve');
    // below 900px there is no curve in any engine
    await page.setViewportSize({ width: 800, height: 800 });
    await expect(site.effectsNote).not.toContainText('screen curve');
  });
});

test.describe('power button hand-off at 721px', () => {
  test('a clicked power button does not take focus back, or move the page, on a later resize', async ({ page, site }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await site.goto('/projects/');
    await site.chinPower.click();
    await page.locator('h1').click();
    await site.scrollTube(500);
    await page.setViewportSize({ width: 390, height: 800 });
    await expect(site.headerPower).toBeVisible();
    await site.settleScroll();
    await expect(site.headerPower).not.toBeFocused();
    // the header's power button sits at the very top; focusing it would jump there
    expect(await site.tubeY()).toBeGreaterThan(100);
  });

  test('a keyboard user on the chin power button is handed the header one, without a scroll', async ({ page, site }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await site.goto('/projects/');
    await site.scrollTube(500);
    await site.chinPower.focus();
    await page.keyboard.press('Shift');
    await page.setViewportSize({ width: 390, height: 800 });
    await expect(site.headerPower).toBeFocused();
    await site.settleScroll();
    expect(await site.tubeY()).toBeGreaterThan(100);
  });
});
