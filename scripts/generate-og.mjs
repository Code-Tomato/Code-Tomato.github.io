// Render the shared website/repository card from its editable vector source.
// Text is stored as paths in the SVG, so rendering needs no font downloads.
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';

const source = new URL('../assets/repo-card.svg', import.meta.url);
const output = new URL('../public/og-image.png', import.meta.url);
const png = new Resvg(readFileSync(source)).render().asPng();
writeFileSync(output, png);
console.log(`Wrote public/og-image.png (1280 × 640, ${Math.round(png.length / 1024)} KB)`);
