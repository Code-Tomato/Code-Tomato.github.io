import { test, expect, publishedRoutes } from './fixtures';

const SECTIONS = ['Projects', 'Experience', 'About', 'Contact'];

test.describe('current section', () => {
  test('project pages mark Projects as their section, not as the current page', async ({ page, site }) => {
    const details = publishedRoutes().filter((r) => /^\/projects\/[^/]+\/$/.test(r));
    expect(details.length).toBeGreaterThan(0);
    for (const route of details) {
      await site.goto(route);
      await expect(site.tabs.getByRole('link', { name: 'Projects' }), route).toHaveAttribute('aria-current', 'location');
      await expect(page.locator('[aria-current="page"]'), route).toHaveCount(0);
    }
  });

  test('a section page is the current page, and only its own tab is marked', async ({ site }) => {
    for (const name of SECTIONS) {
      await site.goto(`/${name.toLowerCase()}/`);
      for (const other of SECTIONS) {
        const tab = site.tabs.getByRole('link', { name: other, exact: true });
        if (other === name) await expect(tab).toHaveAttribute('aria-current', 'page');
        else await expect(tab).not.toHaveAttribute('aria-current', /.+/);
      }
    }
  });

  test('a tab without the trailing slash lands on the section page', async ({ page, site }) => {
    await site.goto('/about/');
    await site.tabs.getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(/\/projects\/$/);
    await expect(site.tabs.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page');
  });
});

// GitHub Pages serves 404.html at whatever deep address was missed, so it has
// to work from any depth (root-relative assets and links).
test('an unknown address gets the 404 page, styled and with the site navigation', async ({ page, site }) => {
  const response = await page.goto('/projects/no-such-project/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Off the grid.');
  for (const name of SECTIONS) {
    await expect(site.tabs.getByRole('link', { name, exact: true })).toBeVisible();
  }
  // the stylesheet loaded: the tube is the fixed scroller, not a plain block
  expect(await page.evaluate(() => getComputedStyle(document.querySelector('.tube')!).position)).toBe('fixed');
});

test.describe('without JavaScript, at 320px', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 320, height: 700 } });

  test('every page shows the four section links by name, on screen', async ({ page, site }) => {
    for (const route of publishedRoutes()) {
      await page.goto(route);
      for (const name of SECTIONS) {
        const link = site.tabs.getByRole('link', { name, exact: true });
        await expect(link, `${route}: ${name}`).toBeVisible();
        const box = await link.boundingBox();
        expect(box && box.x >= 0 && box.x + box.width <= 320, `${route}: ${name} fits across 320px`).toBe(true);
      }
      // a menu button that can't open would only be a dead end
      await expect(site.menuButton, route).toBeHidden();
    }
  });
});

test.describe('phone menu', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  const ORDER = ['Close menu', ...SECTIONS];

  test('Tab and Shift+Tab go round the open menu, every item, and nowhere else', async ({ page, site }) => {
    await site.goto('/about/');
    await site.menuButton.click();
    await expect(site.closeButton).toBeFocused();

    // twice round forwards, then twice round backwards, item by item
    let at = 0;
    for (let i = 0; i < ORDER.length * 2; i++) {
      await page.keyboard.press('Tab');
      at = (at + 1) % ORDER.length;
      expect(await site.focused()).toEqual({ name: ORDER[at], inDrawer: true });
    }
    for (let i = 0; i < ORDER.length * 2; i++) {
      await page.keyboard.press('Shift+Tab');
      at = (at - 1 + ORDER.length) % ORDER.length;
      expect(await site.focused()).toEqual({ name: ORDER[at], inDrawer: true });
    }
  });

  test('Escape closes it and gives focus back to the menu button', async ({ page, site }) => {
    await site.goto('/about/');
    await site.menuButton.click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Escape');
    await expect(site.menuButton).toBeFocused();
    await expect(site.menuButton).toHaveAttribute('aria-expanded', 'false');
    await expect(site.drawer).toBeHidden();
    await expect(site.main).not.toHaveAttribute('inert', /.*/);
  });

  test('everything behind the open menu is inert, the skip link and display controls included', async ({ page, site }) => {
    await site.goto('/projects/');
    await site.menuButton.click();
    for (const selector of ['.skip-link', '.crt-power', '.hd-row', 'main', '.site-footer']) {
      await expect(page.locator(selector), selector).toHaveAttribute('inert', '');
    }
    // and nothing there can actually take focus
    const escaped = await page.evaluate(() =>
      ['.skip-link', '.hd-power', '.brand', 'main', '.display-prefs button'].filter((s) => {
        const el = document.querySelector<HTMLElement>(s);
        el?.focus();
        return !!el && document.activeElement === el;
      }),
    );
    expect(escaped).toEqual([]);
    await expect(site.closeButton).toBeFocused();
  });

  // The measured race: open, close, 50ms, Space on the (now focused) menu
  // button, 400ms. A hide left over from the close used to fire during the
  // reopen and take the backdrop off an open menu. The waits are the
  // reproduction's own timing, not settling time. The browser itself logs
  // when the menu closed and reopened, and each round must show the reopen
  // landing inside the close's 260ms fade; a slow run that missed the race
  // fails here instead of passing without testing it.
  test('closing and quickly reopening from the keyboard keeps the backdrop', async ({ page, site }) => {
    await site.goto('/about/');
    await page.evaluate(() => {
      const html = document.documentElement;
      const log: { open: boolean; t: number }[] = [];
      (window as unknown as { __menuLog: typeof log }).__menuLog = log;
      let open = html.classList.contains('menu-open');
      new MutationObserver(() => {
        const now = html.classList.contains('menu-open');
        if (now !== open) log.push({ open: (open = now), t: performance.now() });
      }).observe(html, { attributes: true, attributeFilter: ['class'] });
    });
    const reopenGap = () =>
      page.evaluate(() => {
        const log = (window as unknown as { __menuLog: { open: boolean; t: number }[] }).__menuLog;
        const [closed, reopened] = log.slice(-2);
        return closed && reopened && !closed.open && reopened.open ? Math.round(reopened.t - closed.t) : null;
      });

    await site.menuButton.focus();
    for (let round = 1; round <= 3; round++) {
      await page.keyboard.press('Space');
      await expect(site.closeButton).toBeFocused();
      await page.keyboard.press('Escape');
      await page.waitForTimeout(50);
      // Space goes to whatever has focus: the menu button, if Escape returned it
      await page.keyboard.press('Space');
      await page.waitForTimeout(400);
      const gap = await reopenGap();
      expect(gap, `round ${round}: close then reopen, in the browser's own timing`).not.toBeNull();
      expect(gap!, `round ${round}: reopened within the close's fade`).toBeLessThan(260);
      const state = await page.evaluate(() => {
        const scrim = document.querySelector<HTMLElement>('.menu-scrim')!;
        return {
          open: document.documentElement.classList.contains('menu-open'),
          scrimHidden: scrim.hidden,
          scrimOpacity: getComputedStyle(scrim).opacity,
        };
      });
      expect(state, `round ${round}`).toEqual({ open: true, scrimHidden: false, scrimOpacity: '1' });
      await expect(site.drawer).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(site.scrim).toBeHidden();
    }
  });

  test('widening past 720px closes it and focuses the tab for the link that had focus', async ({ page, site }) => {
    await site.goto('/experience/');
    await site.menuButton.click();
    for (let i = 0; i < 3; i++) await page.keyboard.press('Tab');
    expect(await site.focused()).toEqual({ name: 'About', inDrawer: true });
    await page.setViewportSize({ width: 1024, height: 800 });
    await expect(site.html).not.toHaveClass(/\bmenu-open\b/);
    await expect(site.tabs.getByRole('link', { name: 'About', exact: true })).toBeFocused();
    await expect(site.main).not.toHaveAttribute('inert', /.*/);
  });
});
