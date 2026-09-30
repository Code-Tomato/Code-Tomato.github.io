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

Built with Astro. `npm run dev` to work on it, `npm run build` to ship.

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
