// Generates public/og-image.png (1200x630) in the site's CRT design language.
// Self-contained + idempotent: static TTFs are downloaded into scripts/.fonts/
// on first run, because satori cannot read the installed variable woff2.
import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONT_DIR = path.join(__dirname, '.fonts');

// sRGB equivalents of the CRT tokens in src/styles/global.css
const TUBE = 'rgb(18,21,30)'; //  --bg     deep tube
const PANEL = 'rgb(29,33,45)'; // --panel  rack unit
const PHOSPHOR = 'rgb(240,235,220)'; // --ink
const PHOSPHOR_DIM = 'rgba(240,235,220,0.72)'; // --ink-2
const HOT = 'rgb(240,96,62)'; //   --hot    tomato
const AMBER = 'rgb(232,175,74)'; // --amber

async function ensureTTFs(family, wanted) {
  if (wanted.every((w) => fs.existsSync(path.join(FONT_DIR, w.file)))) {
    return wanted;
  }
  fs.mkdirSync(FONT_DIR, { recursive: true });
  // A curl-like User-Agent makes the css2 API serve truetype URLs.
  const weights = wanted.map((w) => w.weight).join(';');
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weights}`,
    { headers: { 'User-Agent': 'curl/7.64.1' } }
  ).then((r) => r.text());
  for (const w of wanted) {
    const dest = path.join(FONT_DIR, w.file);
    if (fs.existsSync(dest)) continue;
    const re = new RegExp(
      `font-weight: ${w.weight};\\s*src: url\\((https://[^)]+\\.ttf)\\)`
    );
    const m = css.match(re);
    if (!m) throw new Error(`No TTF URL found for weight ${w.weight}`);
    const buf = Buffer.from(await fetch(m[1]).then((r) => r.arrayBuffer()));
    fs.writeFileSync(dest, buf);
  }
  return wanted;
}

// 1200x630: the display. Dark tube, phosphor type, one amber rule, the
// tomato mark glowing hot. Mirrors the homepage — name, role, paper.
const card = html`
<div style="display: flex; flex-direction: column; width: 1200px; height: 630px; background: ${TUBE}; padding: 72px 80px 60px 80px;">
  <div style="display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; font-family: 'IBM Plex Mono'; font-size: 24px; letter-spacing: 0.08em; color: ${PHOSPHOR_DIM};">CODE-TOMATO.GITHUB.IO</div>
    <svg width="48" height="48" viewBox="0 0 48 48">
      <rect x="10" y="16" width="28" height="24" rx="2" fill="${HOT}" />
      <path d="M20 16 Q24 8 28 16" stroke="${PHOSPHOR}" stroke-width="2.4" fill="none" />
      <path d="M17 14 Q24 6 31 14" stroke="${PHOSPHOR}" stroke-width="2" fill="none" />
    </svg>
  </div>

  <div style="display: flex; margin-top: 64px; font-family: 'IBM Plex Mono'; font-weight: 700; font-size: 104px; line-height: 1.05; letter-spacing: -0.01em; color: ${PHOSPHOR};">Nathan Lemma</div>

  <div style="display: flex; margin-top: 28px; max-width: 900px; font-family: 'Reddit Sans'; font-weight: 400; font-size: 32px; line-height: 1.4; color: ${PHOSPHOR_DIM};">ECE at UT Austin. GPU inference serving in the systems-for-ML group; firmware and data infrastructure at Caterpillar.</div>

  <div style="display: flex; margin-top: auto; height: 3px; background: ${AMBER};"></div>

  <div style="display: flex; margin-top: 22px; font-family: 'IBM Plex Mono'; font-size: 22px; letter-spacing: 0.06em; color: ${AMBER};">SOSP '26 · 3RD AUTHOR · ENERTUNE</div>
</div>
`;

async function generateOGImage() {
  const sans = await ensureTTFs('Reddit Sans', [{ file: 'reddit-sans-400.ttf', weight: 400 }]);
  const mono = await ensureTTFs('IBM Plex Mono', [{ file: 'plex-mono-700.ttf', weight: 700 }]);
  const fonts = [
    ...sans.map((w) => ({
      name: 'Reddit Sans',
      data: fs.readFileSync(path.join(FONT_DIR, w.file)),
      weight: w.weight,
      style: 'normal',
    })),
    ...mono.map((w) => ({
      name: 'IBM Plex Mono',
      data: fs.readFileSync(path.join(FONT_DIR, w.file)),
      weight: w.weight,
      style: 'normal',
    })),
  ];

  const svg = await satori(card, {
    width: 1200,
    height: 630,
    fonts,
    embedFont: true,
  });

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const pngBuffer = resvg.render().asPng();

  const outputPath = path.join(__dirname, '../public/og-image.png');
  fs.writeFileSync(outputPath, pngBuffer);
  console.log('Wrote', outputPath, Math.round(pngBuffer.length / 1024), 'KB');
}

generateOGImage().catch((err) => {
  console.error('Error generating OG image:', err);
  process.exit(1);
});
