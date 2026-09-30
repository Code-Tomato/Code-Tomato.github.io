# code-tomato.github.io

Nathan Lemma's portfolio. ECE at UT Austin — GPU inference serving in the
systems-for-ML group, firmware and data infrastructure at Caterpillar.
Third author on EnerTune (SOSP '26).

**Live:** [code-tomato.github.io](https://code-tomato.github.io)

## Design

The site is one screen in a physical set (a bezel, a chin, and a power button
in that chin) and the page scrolls inside it. Two designs, both available in
every browser: a CRT (blue-black tube, cream and amber phosphor, one tomato
accent) and an iPad (cool light canvas, white cards, dot grid, no glow). The
CRT has effects that can be turned off separately: scanlines, a refresh sweep,
heading flicker, and a live barrel warp on Chromium at ≥900px (the only part
tied to a browser engine). Behind both is a field of hand-drawn doodles tiled
from a single SVG. Type is IBM Plex Mono and Reddit Sans, self-hosted; nothing
loads at runtime.

Built with Astro. `npm run dev` to work on it, `npm run build` to ship. The
build also writes `sitemap-index.xml` (every page but the 404), which
`public/robots.txt` points to.

## Checks

Node 22.12 or newer, as in CI.

```bash
npm ci
npm run check          # astro check: TypeScript and templates
npm run build
npm run test:static    # the built site: metadata, links, fragments, sitemap, robots
npx playwright install chromium firefox webkit   # once per machine
npm run test:e2e       # browser regression tests against dist/: three engines + cached Chromium
npm test               # all of the above in order (after the browser install)
```

- `test:static` (`scripts/check-dist.mjs`) reads every page the build
  produced. Each needs a title naming Nathan Lemma, one h1, one
  `<main id="main">`, a canonical and `og:url`/`twitter:url` equal to its own
  published URL, matching share titles and descriptions, and a share image
  that exists. Ids must be unique and ARIA id references must resolve. Every
  on-site `href`/`src` has to resolve to a built file the way GitHub Pages
  serves it, every `#fragment` to an id on its page, and any linked PDF has to
  be a PDF. The 404 page's links must be absolute or root-relative, since it
  is served at whatever address was missed. The sitemap must list exactly the
  published pages, and not the 404 page. Off-site links are counted, never
  fetched, and so are links into the other repositories' Pages sites on this
  origin (`/CHT_Radix/`, `/YASH/`, the `OTHER_DEPLOYS` list); anything else on
  the origin must be in the build. Failures name the page and the link.
- `test:e2e` (`tests/e2e`, Playwright) serves `dist/` on port 4329 (set
  `E2E_PORT` to change it) with `tests/serve-dist.mjs`, which behaves like
  GitHub Pages (`/x` redirects to `/x/`, unknown paths get `404.html`). It
  always starts its own server, never reusing whatever is on the port. Nothing
  leaves 127.0.0.1. Build first. It covers:
  - scrolling inside `.tube`;
  - no sideways overflow at 320 and 390px in both designs: every published
    page at 100% text, and at 150% text the Experience page and every project
    page (the dates and periods that used to run off-screen);
  - print output;
  - the current-section marking and the no-JavaScript phone navigation;
  - the phone menu: Tab/Shift+Tab loop, Escape, inert background, the quick
    close-and-reopen race, and resizing past 720px;
  - per-engine default designs, the design and effects controls, persistence,
    storage that throws, reduced motion, and the power-button hand-off at 721px;
  - keyboard scrolling from a fresh page, the skip link, and scroll memory
    across `#hash` and cross-page back/forward.
  The two timing races (menu reopen, Back inside the scroll-save pause) record
  their timing in the browser and fail if a run was too slow to hit the race.
- Projects: `chromium`, `firefox` and `webkit` run everything except
  `bfcache.spec.ts`. Playwright starts Chromium with the back/forward cache
  off, so there these cover the reload path. `chromium-bfcache` runs only
  `bfcache.spec.ts`, in full Chromium (`channel: 'chromium'`) with the cache
  on, and asserts every return came from the cache (`pageshow.persisted`) with
  its place and the latest display choice.
- Pick projects with `--project`, e.g.
  `npx playwright test --project=webkit --project=chromium-bfcache`. CI runs
  all four on Ubuntu. If a browser won't launch locally, reinstall it with
  `npx playwright install <browser>` and use `--project` to run the others
  meanwhile; CI remains the full run.
- A failed CI run uploads the HTML report and traces as `playwright-report`.
  Open one locally with `npx playwright show-trace <trace.zip>`.

The `Validate` workflow (`.github/workflows/validate.yml`) runs all of this
on every push and pull request, read-only. Deployment is only
`deploy.yml`, on `main`.

## Display settings

The power button (on the chin at ≥721px, in the header on phones) switches the
design. The footer's *Design* and *Effects* rows set each choice directly.
Everything lives in `BaseLayout.astro`: the head script decides the state
before first paint, and the end-of-body script wires up the controls.

| `localStorage` key | Values | Nothing stored |
| --- | --- | --- |
| `display-design` | `crt`, `tablet` | `crt` on Chromium, `tablet` elsewhere (unchanged from before) |
| `display-effects` | `on`, `off` | `off` under `prefers-reduced-motion: reduce`, else `on`; follows the OS setting live until chosen |

- The old key `crt-warp` (`1` CRT, `0` tablet) is moved to `display-design`
  once and then removed.
- If storage is unavailable, a choice still applies to the current page and is
  forgotten on the next one.
- A page restored from the back/forward cache re-reads the stored choices, so
  it matches whatever was chosen on the pages visited since.
- Classes on `<html>`: `flat` (tablet), `calm` (CRT with effects off), `warp`
  (warp filter active: CRT, effects on, Chromium; the CSS adds ≥900px), `js`
  (the script ran). With no JavaScript the page is the CRT with effects, as
  before, and the phone header shows plain links instead of the menu button.
- Reduced motion also stops the sweep and flicker whatever is chosen; turning
  effects on there brings back only the static parts (scanlines, warp). The
  Effects group's screen-reader description is rewritten to list only what
  actually runs in the current browser, width and motion setting.

## Keyboard and scrolling

- The skip link is the first Tab stop and lands on `<main>` (`tabindex="-1"`).
- The page scrolls inside `.tube`, not the document. With nothing focused,
  PageUp/PageDown, Space/Shift+Space, the arrow keys, Home and End are
  forwarded to the tube, so they work on a fresh load without clicking first.
- The tube's scroll offset is kept per history entry (a key in `history.state`,
  the offset in `sessionStorage` under `tube-y:<key>`) and restored on
  back/forward and reload. New visits and `#hash` links scroll as normal; a
  back/forward cache hit keeps the live page.
- Phone menu: Tab and Shift+Tab stay inside the open drawer; Escape, the close
  button, the backdrop or a link close it and return focus to the menu button.
  Everything else, the skip link and display controls included, is inert while
  it is open. Resizing past 720px closes it and moves focus to the matching tab.
