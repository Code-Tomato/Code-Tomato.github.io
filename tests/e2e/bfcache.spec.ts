import { test, expect, type Site } from './fixtures';
import type { Page } from '@playwright/test';

// Runs only in the chromium-bfcache project (playwright.config.ts): full
// Chromium with the back/forward cache switched back on. Every other project
// covers the reload-and-restore path; this one checks the cached path on
// purpose, and asserts each return really came from the cache.
//
// Traversal is done with the page's own history.back()/forward() and then
// waits on the URL and the document, not page.goBack()/goForward(): those wait
// on network events, which a cache restore doesn't produce, and Playwright
// documents back/forward-cache testing as unsupported through them.
test.use({ viewport: { width: 390, height: 844 } });

type Shows = { __shows: boolean[] };

/** Record every pageshow's persisted flag; a page restored from cache keeps its list. */
async function recordPageshow(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as Shows;
    w.__shows = [];
    addEventListener('pageshow', (e) => w.__shows.push(e.persisted));
  });
}
const lastShow = (page: Page) => page.evaluate(() => (window as unknown as Shows).__shows.at(-1));

/** history.back()/forward() from inside the page, then wait for the arrival. */
async function traverse(page: Page, direction: 'back' | 'forward', path: string, hash = '') {
  await page.evaluate((d) => (d === 'back' ? history.back() : history.forward()), direction);
  await page.waitForFunction(
    ([p, h]) => location.pathname === p && location.hash === h && document.readyState === 'complete',
    [path, hash] as const,
  );
}

/** The first block of text at the top of the tube, and how far below the top. */
const readingPlace = (site: Site) =>
  site.page.evaluate(() => {
    const top = document.querySelector<HTMLElement>('.tube')!.getBoundingClientRect().top;
    for (const el of Array.from(document.querySelectorAll<HTMLElement>('main h1, main h2, main h3, main p, main li'))) {
      const r = el.getBoundingClientRect();
      if (r.bottom > top) return { text: el.textContent!.trim().slice(0, 60), offset: Math.round(r.top - top) };
    }
    return null;
  });

test('pages restored from the cache keep their place and catch up with a display choice made since', async ({ page, site }) => {
  await recordPageshow(page);

  // /projects/: scrolled, then a #main entry scrolled further
  await site.goto('/projects/');
  await site.scrollTube(650);
  await site.offsetSaved(650);
  await site.skipLink.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/projects\/#main$/);
  await site.mainReached();
  const hashY = await site.pressAndScroll('PageDown');
  await site.offsetSaved(hashY);
  const start = await site.design();
  const place = await readingPlace(site);
  expect(place).not.toBeNull();

  // /about/: switch the design there, and scroll
  await site.goto('/about/');
  await site.headerPower.click();
  const changed = await site.design();
  expect(changed).not.toBe(start);
  await site.scrollTube(200);
  await site.offsetSaved(200);

  // Back to /projects/#main, from the cache: the new design, the same place
  await traverse(page, 'back', '/projects/', '#main');
  expect(await lastShow(page), 'restored from the back/forward cache').toBe(true);
  await expect.poll(() => site.design()).toBe(changed);
  await expect(site.headerPower).toHaveAttribute('aria-pressed', String(changed === 'crt'));
  await expect(site.pref('Design', changed === 'crt' ? 'Dark CRT' : 'Light tablet')).toHaveAttribute('aria-pressed', 'true');
  await site.settleScroll();
  const kept = await readingPlace(site);
  expect(kept?.text).toBe(place!.text);
  expect(Math.abs(kept!.offset - place!.offset)).toBeLessThanOrEqual(4);

  // Back within the page, to the entry before #main: its own offset
  await traverse(page, 'back', '/projects/');
  await expect.poll(() => site.tubeY()).toBe(650);

  // Forward twice, to /about/ from the cache: where it was left
  await traverse(page, 'forward', '/projects/', '#main');
  await traverse(page, 'forward', '/about/');
  expect(await lastShow(page), 'restored from the back/forward cache').toBe(true);
  expect(await site.design()).toBe(changed);
  await expect.poll(() => site.tubeY()).toBe(200);
});
