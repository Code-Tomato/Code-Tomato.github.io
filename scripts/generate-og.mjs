// Generates public/og-image.png (1200x630) in the PLAKAT design language.
// See DESIGN.md. Self-contained + idempotent: Reddit Sans static TTFs are
// downloaded into scripts/.fonts/ on first run (satori cannot read the installed
// variable woff2); Reddit Mono comes from the installed fontsource woff.
import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONT_DIR = path.join(__dirname, '.fonts');

// Design tokens (sRGB equivalents of DESIGN.md OKLCH primitives)
const PLATE = 'rgb(151,47,38)'; // --plate-bg muted tomato
const PAPER = 'rgb(250,244,242)'; // --paper warm
const PAPER_DIM = 'rgba(250,244,242,0.82)'; // secondary type on the plate

async function ensureRedditSansTTFs() {
  const wanted = [
    { file: 'reddit-sans-700.ttf', weight: 700 },
    { file: 'reddit-sans-800.ttf', weight: 800 },
  ];
  if (wanted.every((w) => fs.existsSync(path.join(FONT_DIR, w.file)))) {
    return wanted;
  }
  fs.mkdirSync(FONT_DIR, { recursive: true });
  // A curl-like User-Agent makes the css2 API serve truetype URLs.
  const css = await fetch(
    'https://fonts.googleapis.com/css2?family=Reddit+Sans:wght@700;800',
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

// 1200x630 poster: muted tomato field, heavy uppercase headline, thick paper
// rule, mono footer line, the square tomato in paper. No gradients, no curves.
const card = html`
<div style="display: flex; flex-direction: column; width: 1200px; height: 630px; background: ${PLATE}; padding: 64px 80px 56px 80px;">
  <!-- Kicker row: name + the square tomato -->
  <div style="display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; font-family: 'Reddit Mono'; font-size: 24px; letter-spacing: 0.09em; color: ${PAPER_DIM};">NATHAN LEMMA — ECE, UT AUSTIN</div>
    <svg width="44" height="44" viewBox="0 0 16 16">
      <path d="M8 6 V3" fill="none" stroke="${PAPER}" stroke-width="1.8" />
      <path d="M8 3.4 L5.2 4.9 M8 3.4 L10.8 4.9" fill="none" stroke="${PAPER}" stroke-width="1.6" />
      <rect x="3.25" y="6" width="9.5" height="9.5" fill="${PAPER}" />
    </svg>
  </div>

  <!-- Headline -->
  <div style="display: flex; margin-top: 56px; max-width: 1040px; font-family: 'Reddit Sans'; font-weight: 800; font-size: 92px; line-height: 0.98; letter-spacing: -0.02em; text-transform: uppercase; color: ${PAPER};">Systems for machine learning, built from the metal up.</div>

  <!-- Thick paper rule -->
  <div style="display: flex; margin-top: auto; height: 6px; background: ${PAPER};"></div>

  <!-- Mono footer -->
  <div style="display: flex; margin-top: 20px; justify-content: space-between; font-family: 'Reddit Mono'; font-size: 22px; letter-spacing: 0.06em; color: ${PAPER_DIM};">
    <div style="display: flex;">SOSP '26 CONTRIBUTOR</div>
    <div style="display: flex;">CODE-TOMATO.GITHUB.IO</div>
  </div>
</div>
`;

async function generateOGImage() {
  const redditSans = await ensureRedditSansTTFs();
  const fonts = [
    ...redditSans.map((w) => ({
      name: 'Reddit Sans',
      data: fs.readFileSync(path.join(FONT_DIR, w.file)),
      weight: w.weight,
      style: 'normal',
    })),
    {
      name: 'Reddit Mono',
      data: fs.readFileSync(
        path.join(
          __dirname,
          '../node_modules/@fontsource/reddit-mono/files/reddit-mono-latin-400-normal.woff'
        )
      ),
      weight: 400,
      style: 'normal',
    },
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
