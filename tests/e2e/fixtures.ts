import { readFileSync } from 'node:fs';
import { test as base, expect, type Locator, type Page } from '@playwright/test';

export { expect };

export type Design = 'crt' | 'tablet';

/** The published pages, from the built sitemap (so, never the 404 page). */
export function publishedRoutes(): string[] {
  const dist = new URL('../../dist/', import.meta.url);
  const read = (file: string) => readFileSync(new URL(file, dist), 'utf8');
  const locs = (xml: string) => [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  return locs(read('sitemap-index.xml'))
    .flatMap((child) => locs(read(new URL(child).pathname.slice(1))))
    .map((url) => new URL(url).pathname);
}

/**
 * Store a design before any page script runs, on every load in this page.
 * For tests about layout, where the design is a precondition rather than the
 * thing under test. Uses the documented storage key (README).
 */
export async function presetDesign(page: Page, design: Design) {
  await page.addInitScript((d) => {
    try { localStorage.setItem('display-design', d); } catch { /* storage blocked: default design */ }
  }, design);
}

/** The page as a visitor meets it: the scrolling .tube, the menu, the controls. */
export class Site {
  constructor(readonly page: Page) {}

  get html(): Locator { return this.page.locator('html'); }
  get tube(): Locator { return this.page.locator('.tube'); }
  get main(): Locator { return this.page.locator('main#main'); }
  get skipLink(): Locator { return this.page.getByRole('link', { name: 'Skip to main content' }); }
  get tabs(): Locator { return this.page.getByRole('navigation', { name: 'Main', exact: true }); }
  get menuButton(): Locator { return this.page.getByRole('button', { name: 'Open menu' }); }
  get closeButton(): Locator { return this.page.getByRole('button', { name: 'Close menu' }); }
  get drawer(): Locator { return this.page.locator('#site-menu'); }
  get scrim(): Locator { return this.page.locator('.menu-scrim'); }
  get chinPower(): Locator { return this.page.locator('.crt-power'); }
  get headerPower(): Locator { return this.page.locator('.hd-power'); }
  get effectsNote(): Locator { return this.page.locator('#pref-effects-note'); }

  /** A footer display button, by its group ("Design", "Effects") and label. */
  pref(group: 'Design' | 'Effects', label: string): Locator {
    return this.page
      .getByRole('group', { name: group, exact: true })
      .getByRole('button', { name: label, exact: true });
  }

  /** Load a page and wait until its fonts have settled the layout. */
  async goto(path: string) {
    await this.page.goto(path);
    await this.page.evaluate(() => document.fonts.ready.then(() => undefined));
  }

  async design(): Promise<Design> {
    return (await this.page.evaluate(() => document.documentElement.classList.contains('flat'))) ? 'tablet' : 'crt';
  }

  async tubeY(): Promise<number> {
    return this.page.evaluate(() => Math.round(document.querySelector<HTMLElement>('.tube')!.scrollTop));
  }

  /**
   * Put the tube at y instantly (whatever its CSS scroll-behavior) and return
   * once its scroll event has fired, as it would for a visitor's scroll.
   */
  async scrollTube(y: number) {
    const max = await this.page.evaluate(() => {
      const t = document.querySelector<HTMLElement>('.tube')!;
      return t.scrollHeight - t.clientHeight;
    });
    expect(max, `the page is too short to scroll to ${y}`).toBeGreaterThanOrEqual(y);
    await this.page.evaluate(
      (target) =>
        new Promise<void>((resolve) => {
          const t = document.querySelector<HTMLElement>('.tube')!;
          if (Math.round(t.scrollTop) === target) return resolve();
          t.addEventListener('scroll', () => resolve(), { once: true });
          t.style.scrollBehavior = 'auto';
          t.scrollTop = target;
          t.style.scrollBehavior = '';
        }),
      y,
    );
    expect(await this.tubeY()).toBe(y);
  }

  /**
   * After following #main: wait for the fragment scroll to bring main to the
   * top of the tube (within its 2rem scroll-padding), then for it to stop.
   * A settle alone could return before a smooth scroll has even started.
   */
  async mainReached() {
    // main's top between the tube's top and just past the 32px scroll-padding;
    // from further down the page it starts above (negative), from the top below
    await expect
      .poll(
        () =>
          this.page.evaluate(() => {
            const t = document.querySelector<HTMLElement>('.tube')!.getBoundingClientRect().top;
            const gap = document.querySelector<HTMLElement>('main')!.getBoundingClientRect().top - t;
            return gap >= 0 && gap <= 48;
          }),
        { message: 'the #main fragment should bring main to the top of the page' },
      )
      .toBe(true);
    await this.settleScroll();
  }

  /**
   * Press a scrolling key and wait for the move it causes to start and to
   * finish; returns the new offset. (Settling alone could return before a
   * smooth scroll starts.)
   */
  async pressAndScroll(key: string): Promise<number> {
    const before = await this.tubeY();
    await this.page.keyboard.press(key);
    await expect.poll(() => this.tubeY(), { message: `${key} should scroll the page` }).not.toBe(before);
    await this.settleScroll();
    return this.tubeY();
  }

  /** Wait until the tube has stopped moving (smooth scrolls, restores). */
  async settleScroll() {
    await this.page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          const t = document.querySelector<HTMLElement>('.tube')!;
          let last = -1;
          let still = 0;
          const tick = () => {
            const y = t.scrollTop;
            if (y === last) {
              if (++still >= 3) return resolve();
            } else {
              still = 0;
              last = y;
            }
            requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }),
    );
  }

  /**
   * Wait until the current history entry's offset is stored as y (the
   * README's scroll-memory contract: sessionStorage "tube-y:<key>", the key
   * in history.state). A condition to wait on, not a timer.
   */
  async offsetSaved(y: number) {
    await expect
      .poll(() =>
        this.page.evaluate(() => {
          try {
            const key = (history.state as { tubeKey?: string } | null)?.tubeKey;
            return key ? sessionStorage.getItem(`tube-y:${key}`) : null;
          } catch {
            return null;
          }
        }),
      )
      .toBe(String(y));
  }

  /**
   * Back and forward without waiting for a load event: a page restored from
   * the back/forward cache never fires one. Callers wait on the URL and state.
   */
  async back() {
    await this.page.goBack({ waitUntil: 'commit' });
    await this.page.waitForFunction(() => document.readyState === 'complete');
  }

  async forward() {
    await this.page.goForward({ waitUntil: 'commit' });
    await this.page.waitForFunction(() => document.readyState === 'complete');
  }

  /** Name and place of whatever has focus. */
  async focused(): Promise<{ name: string; inDrawer: boolean }> {
    return this.page.evaluate(() => {
      const a = document.activeElement as HTMLElement | null;
      if (!a || a === document.body) return { name: '(body)', inDrawer: false };
      return {
        name: a.getAttribute('aria-label') ?? a.textContent?.trim() ?? a.tagName,
        inDrawer: !!a.closest('#site-menu'),
      };
    });
  }

  /** Scale all rem-based text, as a browser's text-size setting does. */
  async textSize(size: string) {
    await this.page.evaluate((s) => { document.documentElement.style.fontSize = s; }, size);
  }

  /** Sideways overflow of the page, and a few of the elements causing it. */
  async overflow(): Promise<{ tube: number; doc: number; offenders: string[] }> {
    return this.page.evaluate(() => {
      const tube = document.querySelector<HTMLElement>('.tube')!;
      const right = tube.getBoundingClientRect().right;
      const offenders = Array.from(document.querySelectorAll<HTMLElement>('.tube *'))
        .filter((el) => !el.closest('#site-menu, .visually-hidden'))
        .filter((el) => el.getClientRects().length && el.getBoundingClientRect().right > right + 1)
        .slice(0, 4)
        .map((el) => `${el.tagName.toLowerCase()}${Array.from(el.classList).map((c) => `.${c}`).join('')}`);
      return {
        tube: tube.scrollWidth - tube.clientWidth,
        doc: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        offenders,
      };
    });
  }
}

type Fixtures = { site: Site; pageErrors: string[] };

export const test = base.extend<Fixtures>({
  // Every test also fails on an uncaught error in the page.
  pageErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await use(errors);
      expect(errors, 'uncaught errors in the page').toEqual([]);
    },
    { auto: true },
  ],
  site: async ({ page }, use) => {
    await use(new Site(page));
  },
});
