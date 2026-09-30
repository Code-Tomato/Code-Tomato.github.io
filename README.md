# code-tomato.github.io

Nathan Lemma's portfolio. ECE at UT Austin — GPU inference serving in the
systems-for-ML group, firmware and data infrastructure at Caterpillar.
Third author on EnerTune (SOSP '26).

**Live:** [code-tomato.github.io](https://code-tomato.github.io)

## Design

The site is one screen in a physical set (a bezel, a chin, and a power button
in that chin) and the page scrolls inside it. The button switches two states,
remembered per visitor: a CRT (blue-black tube, cream and amber phosphor, one
tomato accent, scanlines and a refresh sweep, plus a live barrel warp on
Chromium at ≥900px) and an iPad (cool light canvas, white cards, dot grid, no
glow). Behind both is a field of hand-drawn doodles tiled from a single SVG.
Type is IBM Plex Mono and Reddit Sans, self-hosted; nothing loads at runtime.

Built with Astro. `npm run dev` to work on it, `npm run build` to ship.

## Résumé

`public/NathanLemmaPublicResume.pdf` is the public variant of the one-page
résumé (no phone or email), built in the private résumé repo by
`./build.sh public`. To update it, rebuild there, check the PDF (one page, no
contact details), and copy only `NathanLemmaPublicResume.pdf` into `public/`.
Never copy the private PDFs or any `.typ` sources here.
