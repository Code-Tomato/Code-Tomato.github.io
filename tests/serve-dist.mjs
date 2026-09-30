#!/usr/bin/env node
/*
 * Serves dist/ the way GitHub Pages does, for the browser tests. No
 * dependencies, no network beyond 127.0.0.1.
 *   /projects    301 -> /projects/
 *   /projects/   dist/projects/index.html
 *   /x.css       dist/x.css
 *   /x           dist/x.html, if that's the only match
 *   anything else: dist/404.html with status 404
 * The same lookup order as scripts/check-dist.mjs: the file itself, then a
 * folder's index.html (by redirect), then x.html.
 * Caching is "revalidate every time" rather than no-store, so pages stay
 * eligible for the back/forward cache as they are on the live site.
 *
 *   PORT=4329 node tests/serve-dist.mjs
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(fileURLToPath(new URL('../dist', import.meta.url)));
const PORT = Number(process.env.PORT ?? 4329);
const HOST = '127.0.0.1';

if (!existsSync(path.join(DIST, 'index.html'))) {
  console.error(`serve-dist: no build at ${DIST}; run npm run build first`);
  process.exit(1);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
};

// strictly inside dist: a sibling like dist-other or a ../ path never counts
const inDist = (p) => {
  const rel = path.relative(DIST, p);
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel);
};
const isFile = (p) => inDist(p) && existsSync(p) && statSync(p).isFile();

function send(res, status, file, method) {
  res.writeHead(status, {
    'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream',
    'cache-control': 'no-cache',
  });
  if (method === 'HEAD') res.end();
  else createReadStream(file).pipe(res);
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://${HOST}:${PORT}`);
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { pathname = '/__bad__'; }
  const full = path.join(DIST, pathname);

  if (pathname.endsWith('/') && isFile(path.join(full, 'index.html'))) {
    return send(res, 200, path.join(full, 'index.html'), req.method);
  }
  if (!pathname.endsWith('/') && isFile(full)) return send(res, 200, full, req.method);
  if (!pathname.endsWith('/') && isFile(path.join(full, 'index.html'))) {
    res.writeHead(301, { location: `${url.pathname}/${url.search}` });
    return res.end();
  }
  if (!pathname.endsWith('/') && isFile(`${full}.html`)) return send(res, 200, `${full}.html`, req.method);
  return send(res, 404, path.join(DIST, '404.html'), req.method);
}).listen(PORT, HOST, () => {
  console.log(`serve-dist: http://${HOST}:${PORT}/ -> ${DIST}`);
});
