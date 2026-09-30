import { test, expect } from './fixtures';

test.describe('keyboard', () => {
  test('PageDown, Space and Home work on a fresh page, with nothing focused', async ({ page, site }) => {
    await site.goto('/projects/');
    const bodyFocused = () => page.evaluate(() => document.activeElement === document.body);
    expect(await bodyFocused()).toBe(true);

    await page.keyboard.press('PageDown');
    await expect.poll(() => site.tubeY()).toBeGreaterThan(200);
    await site.settleScroll();
    const afterPage = await site.tubeY();
    await page.keyboard.press('Space');
    await expect.poll(() => site.tubeY()).toBeGreaterThan(afterPage);
    await page.keyboard.press('Home');
    await expect.poll(() => site.tubeY()).toBe(0);
    // the keys were passed to the page; nothing was focused on their behalf
    expect(await bodyFocused()).toBe(true);
  });

  test('the skip link comes first and lands focus on main, where keyboard scrolling then works', async ({ page, site, browserName }) => {
    await site.goto('/projects/');
    const first = await page.evaluate(() => {
      const focusable = document.querySelector<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])');
      return focusable?.textContent?.trim();
    });
    expect(first).toBe('Skip to main content');
    if (browserName === 'webkit') {
      // Safari's default keyboard setting keeps links out of the Tab order,
      // so WebKit may not reach it by Tab; focus it the way Option+Tab would.
      await site.skipLink.focus();
      await expect(site.skipLink).toBeFocused();
    } else {
      await page.keyboard.press('Tab');
      await expect(site.skipLink).toBeFocused();
      // it only shows on keyboard focus, and then it must be on screen
      await expect(site.skipLink).toBeInViewport();
    }

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
    await expect(site.main).toBeFocused();
    await site.mainReached();
    const before = await site.tubeY();
    expect(await site.pressAndScroll('PageDown')).toBeGreaterThan(before);
  });
});

test.describe('scroll memory', () => {
  test('Back from a #main entry restores where the page was, and Forward the #main entry', async ({ page, site }) => {
    await site.goto('/projects/');
    await site.scrollTube(400);
    await site.offsetSaved(400);

    await site.skipLink.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
    await site.mainReached();
    const hashY = await site.pressAndScroll('PageDown');
    expect(hashY).not.toBe(400);
    await site.offsetSaved(hashY);

    await site.back();
    await expect(page).toHaveURL(/\/projects\/$/);
    await expect.poll(() => site.tubeY()).toBe(400);
    await site.forward();
    await expect(page).toHaveURL(/#main$/);
    await expect.poll(() => site.tubeY()).toBe(hashY);
  });

  test('Back within the save delay still keeps the offset of the #hash entry being left', async ({ page, site }) => {
    await site.goto('/projects/');
    await site.skipLink.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
    await site.mainReached();
    // Scroll, and on that scroll's own event go Back, all in one browser turn.
    // The browser reports how long after the scroll the popstate arrived, and
    // it has to be inside the 150ms save pause, or this didn't test the race.
    const evidence = await page.evaluate(
      () =>
        new Promise<{ key: string | null; gap: number }>((resolve) => {
          const t = document.querySelector<HTMLElement>('.tube')!;
          const key = (history.state as { tubeKey?: string } | null)?.tubeKey ?? null;
          t.addEventListener(
            'scroll',
            () => {
              const scrolled = performance.now();
              addEventListener('popstate', () => resolve({ key, gap: Math.round(performance.now() - scrolled) }), { once: true });
              history.back();
            },
            { once: true },
          );
          t.style.scrollBehavior = 'auto';
          t.scrollTop = 900;
          t.style.scrollBehavior = '';
        }),
    );
    expect(evidence.key, 'the #main entry had its own key').not.toBeNull();
    expect(evidence.gap, 'Back landed inside the 150ms save pause').toBeLessThan(150);
    await expect(page).toHaveURL(/\/projects\/$/);
    await expect.poll(() => site.tubeY()).toBe(0);

    await page.evaluate(() => history.forward());
    await expect(page).toHaveURL(/#main$/);
    expect(await page.evaluate(() => (history.state as { tubeKey?: string } | null)?.tubeKey)).toBe(evidence.key);
    await expect.poll(() => site.tubeY()).toBe(900);
  });

  test.describe('across pages', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    // The WebKit overwrite: the page being left saved its own offset over the
    // entry being returned to. Each entry must keep its own.
    test('Back and Forward restore each page its own offset; a new visit starts at the top', async ({ page, site }) => {
      await site.goto('/projects/');
      await site.scrollTube(650);
      await site.offsetSaved(650);

      await site.goto('/projects/cht-radix/');
      expect(await site.tubeY()).toBe(0);
      await site.scrollTube(350);
      await site.offsetSaved(350);

      await site.back();
      await expect(page).toHaveURL(/\/projects\/$/);
      await expect.poll(() => site.tubeY()).toBe(650);
      await site.offsetSaved(650);

      await site.forward();
      await expect(page).toHaveURL(/\/projects\/cht-radix\/$/);
      await expect.poll(() => site.tubeY()).toBe(350);

      await site.goto('/projects/');
      expect(await site.tubeY()).toBe(0);
    });

    // Whichever way the engine brings the page back. In these projects that is
    // usually a reload (Chromium's cache is off here); the cached path, with
    // its pageshow re-read, is bfcache.spec.ts in the chromium-bfcache project.
    test('a display change on another page shows on the page Back returns to', async ({ page, site }) => {
      await site.goto('/projects/');
      const start = await site.design();
      await site.goto('/about/');
      await site.headerPower.click();
      const changed = await site.design();
      expect(changed).not.toBe(start);
      await site.back();
      await expect(page).toHaveURL(/\/projects\/$/);
      await expect.poll(() => site.design()).toBe(changed);
      await expect(site.headerPower).toHaveAttribute('aria-pressed', String(changed === 'crt'));
    });
  });
});
