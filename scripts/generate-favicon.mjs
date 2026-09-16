// Rasterises public/favicon.svg into the PNG fallbacks the layout links:
// favicon-32.png for browsers that won't take an SVG tab icon (Safari), and
// apple-touch-icon.png (180px, opaque) for iOS home screens. Re-run after
// editing the SVG: `npm run generate:favicon`. Same renderer as the OG card.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const here = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(here, '../public');
const svg = fs.readFileSync(path.join(pub, 'favicon.svg'), 'utf8');

// The touch icon needs a solid ground: iOS paints black behind transparency.
const opaque = svg.replace(/(<svg[^>]*>)/, '$1<rect width="48" height="48" fill="#161513" />');

const render = (source, size) => new Resvg(source, { fitTo: { mode: 'width', value: size } }).render().asPng();

for (const [name, source, size] of [
  ['favicon-32.png', svg, 32],
  ['apple-touch-icon.png', opaque, 180],
]) {
  const png = render(source, size);
  fs.writeFileSync(path.join(pub, name), png);
  console.log('Wrote', name, Math.round(png.length / 1024), 'KB');
}
