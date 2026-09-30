import { test, expect, presetDesign, publishedRoutes, type Design } from './fixtures';

test('the page scrolls inside .tube, and the document itself never does', async ({ page, site }) => {
  await presetDesign(page, 'crt');
  await site.goto('/projects/');
  const box = await page.evaluate(() => {
    const t = document.querySelector<HTMLElement>('.tube')!;
    const doc = document.scrollingElement!;
    return {
      overflowY: getComputedStyle(t).overflowY,
      tubeRange: t.scrollHeight - t.clientHeight,
      docRange: doc.scrollHeight - doc.clientHeight,
    };
  });
  expect(box.overflowY).toBe('auto');
  expect(box.tubeRange).toBeGreaterThan(400);
  expect(box.docRange).toBe(0);

  // a wheel over the content moves the tube, natively
  await page.mouse.move(640, 400);
  await page.mouse.wheel(0, 300);
  await expect.poll(() => site.tubeY()).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.scrollingElement!.scrollTop)).toBe(0);
});

// Phone widths, both designs. The page must never scroll sideways. At the
// default text size that holds for every published page. At 150% (a
// browser's larger-text setting) it is checked where the regression was:
// the experience periods and the project-page dates, which used to be nowrap
// and ran off-screen.
const atLargeText = () =>
  publishedRoutes().filter((r) => r === '/experience/' || /^\/projects\/[^/]+\/$/.test(r));

for (const design of ['crt', 'tablet'] as Design[]) {
  for (const width of [320, 390]) {
    for (const size of ['100%', '150%']) {
      test(`no sideways overflow: ${design}, ${width}px, ${size} text`, async ({ page, site }) => {
        await page.setViewportSize({ width, height: 800 });
        await presetDesign(page, design);
        const problems: string[] = [];
        const routes = size === '100%' ? publishedRoutes() : atLargeText();
        expect(routes.length).toBeGreaterThan(1);
        for (const route of routes) {
          await site.goto(route);
          if (size !== '100%') await site.textSize(size);
          const o = await site.overflow();
          if (o.tube > 0 || o.doc > 0) {
            problems.push(`${route}: tube ${o.tube}px, document ${o.doc}px [${o.offenders.join(', ')}]`);
          }
        }
        expect(problems).toEqual([]);
      });
    }
  }
}

test.describe('print', () => {
  for (const design of ['crt', 'tablet'] as Design[]) {
    test(`${design}: the page returns to normal flow, dark on white, without the controls`, async ({ page, site }) => {
      await presetDesign(page, design);
      await site.goto('/projects/');
      await page.emulateMedia({ media: 'print' });
      const printed = await page.evaluate(() => {
        const style = (s: string) => {
          const el = document.querySelector(s);
          return el ? getComputedStyle(el) : null;
        };
        const shown = ['.skip-link', '.crt-power', '.hd-power', '.display-prefs', '.menu-btn', '.crt-sweep', '.crt-lines', '.crt-glass']
          .filter((s) => style(s) && style(s)!.display !== 'none');
        return {
          tubePosition: style('.tube')!.position,
          tubeOverflow: style('.tube')!.overflowY,
          htmlOverflow: style('html')!.overflowY,
          height: document.documentElement.scrollHeight,
          viewport: innerHeight,
          shown,
          ink: style('h1')!.color,
        };
      });
      expect(printed.tubePosition).toBe('static');
      expect(printed.tubeOverflow).toBe('visible');
      expect(printed.htmlOverflow).toBe('visible');
      // one clipped viewport was the old failure; the whole page is in flow now
      expect(printed.height).toBeGreaterThan(printed.viewport * 1.5);
      expect(printed.shown).toEqual([]);
      // the CRT's cream text would disappear on paper
      expect(printed.ink).toBe('rgb(17, 17, 17)');
    });
  }
});
