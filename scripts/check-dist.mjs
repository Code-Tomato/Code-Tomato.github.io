#!/usr/bin/env node
/*
 * Checks the built site in dist/ the way it will be published: every page,
 * its head metadata, and every link that stays on the site. No network: links
 * to other sites (the DOI, GitHub, LinkedIn) are counted and left alone.
 *
 *   npm run build && npm run test:static        (or: node scripts/check-dist.mjs [dir])
 *
 * Pages are whatever the build produced (every index.html, plus 404.html), not
 * a hand-kept list. For each page:
 *   - lang, one <main id="main">, one h1, a <title> naming Nathan Lemma
 *   - description; canonical, og:url and twitter:url all equal to the page's
 *     own published URL; og/twitter title and description agree with the
 *     page's; the social image is an absolute site URL that exists in dist
 *   - no duplicate ids, and every aria-labelledby / aria-describedby /
 *     aria-controls / for reference points at an id on the page
 *   - every on-site href/src resolves to a built file the way GitHub Pages
 *     serves it (/projects -> /projects/index.html), every #fragment to an id
 *     on the target page, and any linked PDF starts with a PDF header. The
 *     one exception is OTHER_DEPLOYS below: other repositories' Pages sites
 *     that share this origin, treated as off-site.
 * The 404 page is checked for its content and links, and for being absent
 * from the sitemap, but not for its canonical or social URLs: it has no
 * published URL of its own (GitHub Pages serves it at whatever address was
 * missed). For the same reason its links must not be relative. Then the sitemap must list exactly the published pages, and
 * robots.txt must point at it.
 *
 * Inline script and style bodies are not scanned: the URLs in them are
 * selectors and CSS, not links. Stylesheet, font and script files referenced
 * by the pages are checked for existence like any other link.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';

const SITE = 'https://code-tomato.github.io';
const DIST = path.resolve(process.argv[2] ?? 'dist');

// Other repositories' GitHub Pages sites, published under this same origin
// (code-tomato.github.io/<repo>/) but not part of this build. Links into them
// are off-site links: counted, never fetched, never looked for in dist. Only
// these exact mounts; anything else on the origin must be in the build.
const OTHER_DEPLOYS = ['/CHT_Radix/', '/YASH/'];
const otherDeploy = (pathname) =>
  OTHER_DEPLOYS.find((mount) => pathname === mount.slice(0, -1) || pathname.startsWith(mount));

if (!existsSync(path.join(DIST, 'index.html'))) {
  console.error(`check-dist: no built site at ${DIST} (run npm run build first)`);
  process.exit(2);
}

const errors = [];
const fail = (where, message) => errors.push(`${where}: ${message}`);
const stats = { pages: 0, internal: 0, fragments: 0, external: 0, otherDeploys: 0, pdfs: 0 };

// inside dist, strictly: not dist itself's sibling "dist-other", not ../
const inDist = (full) => {
  const rel = path.relative(DIST, full);
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel);
};

// the allow-list must not shadow anything this build publishes
for (const mount of OTHER_DEPLOYS) {
  if (existsSync(path.join(DIST, mount))) fail('dist', `${mount} is built here, so it can't also be another repository's site`);
}

// ---- a small HTML reader, enough for Astro's generated markup ----

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENTITIES[e.toLowerCase()] ?? m;
  });

const TAG = /<([a-zA-Z][a-zA-Z0-9:-]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*\/?>/g;
const ATTR = /([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

function parse(html) {
  // comments out; inline script/style bodies emptied, their tags kept
  const body = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(<(script|style)\b[^>]*>)[\s\S]*?(<\/\2\s*>)/gi, '$1$3');
  const tags = [];
  for (const m of body.matchAll(TAG)) {
    const attrs = {};
    for (const a of (m[2] ?? '').matchAll(ATTR)) {
      attrs[a[1].toLowerCase()] = decode(a[2] ?? a[3] ?? a[4] ?? '');
    }
    tags.push({ name: m[1].toLowerCase(), attrs });
  }
  const title = /<title>([\s\S]*?)<\/title>/i.exec(body);
  return { tags, title: title ? decode(title[1]).trim() : null };
}

// ---- the pages ----

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const NOT_FOUND = path.join(DIST, '404.html');

// route for a built file: dist/index.html -> /, dist/projects/index.html -> /projects/
const routeOf = (file) => {
  const rel = path.relative(DIST, file).split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
};

const pages = new Map();
for (const file of htmlFiles) {
  const { tags, title } = parse(readFileSync(file, 'utf8'));
  const ids = new Map();
  for (const t of tags) if (t.attrs.id) ids.set(t.attrs.id, (ids.get(t.attrs.id) ?? 0) + 1);
  pages.set(file, { file, route: routeOf(file), tags, title, ids });
}

if (!pages.has(NOT_FOUND)) fail('404.html', 'missing: GitHub Pages serves it for every unknown address');

// where GitHub Pages finds a path: as-is for a file, or its index.html
function fileFor(pathname) {
  let p;
  try { p = decodeURIComponent(pathname); } catch { return null; }
  const rel = p.replace(/^\/+/, '');
  const candidates = p.endsWith('/') ? [`${rel}index.html`] : [rel, `${rel}/index.html`, `${rel}.html`];
  for (const c of candidates) {
    const full = path.join(DIST, c);
    if (!inDist(full)) continue;
    if (existsSync(full) && statSync(full).isFile()) return full;
  }
  return null;
}

const meta = (page, key, value) =>
  page.tags.filter((t) => t.name === 'meta' && t.attrs[key] === value).map((t) => t.attrs.content ?? '');
// Exactly one tag, with a non-blank value; reported and null otherwise, so a
// present-but-empty tag can't pass a check that only runs on a value.
const required = (where, label, values) => {
  if (values.length !== 1) { fail(where, `expected one ${label}, found ${values.length}`); return null; }
  const v = values[0].trim();
  if (!v) { fail(where, `${label} is empty`); return null; }
  return v;
};

const LINK_ATTRS = ['href', 'src', 'xlink:href'];
const SKIP_SCHEME = /^(mailto|tel|javascript|data|blob):/i;

function checkLinks(page) {
  const base = new URL(page.route, SITE);
  for (const t of page.tags) {
    // canonical is checked against the page's own URL in checkSocial
    if (t.name === 'link' && /\b(preconnect|dns-prefetch|canonical)\b/.test(t.attrs.rel ?? '')) continue;
    for (const attr of LINK_ATTRS) {
      const raw = t.attrs[attr];
      if (raw === undefined || raw === '' || SKIP_SCHEME.test(raw)) continue;
      const label = `<${t.name} ${attr}="${raw}">`;
      // GitHub Pages serves 404.html at whatever address was missed, so a
      // relative link on it resolves differently at /a/b/ than at /404.html.
      // Only absolute, root-relative (/x) or same-page (#x) links are safe.
      if (page.file === NOT_FOUND && !/^([a-z][a-z0-9+.-]*:|\/|#)/i.test(raw)) {
        fail(page.route, `${label} is relative; on the 404 page it breaks at deeper missing addresses`);
        continue;
      }
      let url;
      try { url = new URL(raw, base); } catch { fail(page.route, `${label} is not a valid URL`); continue; }
      if (url.origin !== SITE) {
        if (/^https?:$/.test(url.protocol)) stats.external++;
        else fail(page.route, `${label} uses an unexpected scheme`);
        continue;
      }
      if (otherDeploy(url.pathname)) { stats.otherDeploys++; continue; }
      stats.internal++;
      const target = fileFor(url.pathname);
      if (!target) { fail(page.route, `${label} -> ${url.pathname} is not in the build`); continue; }
      if (target.endsWith('.pdf')) {
        stats.pdfs++;
        const head = readFileSync(target).subarray(0, 5).toString('latin1');
        if (head !== '%PDF-') fail(page.route, `${label} -> ${url.pathname} is not a PDF`);
      }
      if (url.hash.length > 1) {
        stats.fragments++;
        const targetPage = pages.get(target);
        let id;
        try { id = decodeURIComponent(url.hash.slice(1)); } catch { id = url.hash.slice(1); }
        if (!targetPage) fail(page.route, `${label} has a #fragment but ${url.pathname} is not a page`);
        else if (!targetPage.ids.has(id)) fail(page.route, `${label} -> no id="${id}" on ${targetPage.route}`);
      }
    }
  }
}

function checkIds(page) {
  for (const [id, n] of page.ids) if (n > 1) fail(page.route, `id="${id}" appears ${n} times`);
  for (const t of page.tags) {
    for (const attr of ['aria-labelledby', 'aria-describedby', 'aria-controls', 'for']) {
      if (attr === 'for' && t.name !== 'label' && t.name !== 'output') continue;
      const refs = (t.attrs[attr] ?? '').split(/\s+/).filter(Boolean);
      for (const ref of refs) if (!page.ids.has(ref)) fail(page.route, `<${t.name} ${attr}="${ref}"> points at no id`);
    }
  }
}

function checkPage(page) {
  stats.pages++;
  const where = page.route;
  const html = page.tags.find((t) => t.name === 'html');
  if (!html?.attrs.lang) fail(where, '<html> has no lang');
  const mains = page.tags.filter((t) => t.name === 'main');
  if (mains.length !== 1 || mains[0].attrs.id !== 'main') fail(where, `expected one <main id="main">, found ${mains.length}`);
  const h1s = page.tags.filter((t) => t.name === 'h1').length;
  if (h1s !== 1) fail(where, `expected one h1, found ${h1s}`);
  if (!page.title) fail(where, 'empty or missing <title>');
  else if (!page.title.includes('Nathan Lemma')) fail(where, `<title> "${page.title}" doesn't name Nathan Lemma`);
  if (!page.tags.some((t) => t.name === 'meta' && t.attrs.name === 'viewport')) fail(where, 'no viewport meta');
  checkIds(page);
  checkLinks(page);
}

function checkSocial(page) {
  const where = page.route;
  const expected = new URL(page.route, SITE).href;
  const canonical = required(where, 'canonical link',
    page.tags.filter((t) => t.name === 'link' && (t.attrs.rel ?? '').split(/\s+/).includes('canonical')).map((t) => t.attrs.href ?? ''));
  if (canonical !== null && canonical !== expected) fail(where, `canonical ${canonical} is not the page's own URL ${expected}`);
  for (const [key, name] of [['property', 'og:url'], ['name', 'twitter:url']]) {
    const v = required(where, name, meta(page, key, name));
    if (v !== null && v !== expected) fail(where, `${name} ${v} is not ${expected}`);
  }

  const description = required(where, 'meta description', meta(page, 'name', 'description'));
  const ogTitle = required(where, 'og:title', meta(page, 'property', 'og:title'));
  const twTitle = required(where, 'twitter:title', meta(page, 'name', 'twitter:title'));
  if (ogTitle !== null && twTitle !== null && twTitle !== ogTitle) fail(where, `twitter:title "${twTitle}" differs from og:title "${ogTitle}"`);
  // the share title is the document title or its leading part, whichever the
  // layout uses; either way it can't drift from what the tab shows
  if (ogTitle !== null && page.title && !page.title.startsWith(ogTitle)) fail(where, `og:title "${ogTitle}" doesn't match <title> "${page.title}"`);
  for (const [key, name] of [['property', 'og:description'], ['name', 'twitter:description']]) {
    const v = required(where, name, meta(page, key, name));
    if (v !== null && description !== null && v !== description) fail(where, `${name} differs from the meta description`);
  }
  required(where, 'og:type', meta(page, 'property', 'og:type'));
  required(where, 'twitter:card', meta(page, 'name', 'twitter:card'));
  for (const [key, name] of [['property', 'og:image'], ['name', 'twitter:image']]) {
    const v = required(where, name, meta(page, key, name));
    if (v === null) continue;
    let url;
    try { url = new URL(v); } catch { fail(where, `${name} "${v}" is not an absolute URL`); continue; }
    if (url.origin !== SITE) fail(where, `${name} ${v} is not on ${SITE}`);
    else if (!fileFor(url.pathname)) fail(where, `${name} ${url.pathname} is not in the build`);
  }
}

const published = [];
for (const page of pages.values()) {
  checkPage(page);
  if (page.file === NOT_FOUND) continue;
  checkSocial(page);
  published.push(new URL(page.route, SITE).href);
}

// ---- sitemap and robots ----

const locs = (xml) => [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => decode(m[1]));
const siteFile = (href, where) => {
  let url;
  try { url = new URL(href); } catch { fail(where, `"${href}" is not a URL`); return null; }
  if (url.origin !== SITE) { fail(where, `${href} is not on ${SITE}`); return null; }
  const file = fileFor(url.pathname);
  if (!file) fail(where, `${href} is not in the build`);
  return file;
};

const indexFile = path.join(DIST, 'sitemap-index.xml');
const listed = [];
if (!existsSync(indexFile)) {
  fail('sitemap-index.xml', 'missing');
} else {
  const children = locs(readFileSync(indexFile, 'utf8'));
  if (!children.length) fail('sitemap-index.xml', 'lists no sitemaps');
  for (const child of children) {
    const file = siteFile(child, 'sitemap-index.xml');
    if (file) listed.push(...locs(readFileSync(file, 'utf8')).map((href) => ({ href, from: path.basename(file) })));
  }
}
for (const { href, from } of listed) {
  const file = siteFile(href, from);
  if (file === NOT_FOUND || /\/404(\/|\.html)?$/.test(href)) fail(from, `lists the 404 page (${href})`);
  if (file && file !== NOT_FOUND && !published.includes(href)) fail(from, `${href} is not a published page's canonical URL`);
}
const listedSet = new Set(listed.map((l) => l.href));
for (const href of published) if (!listedSet.has(href)) fail('sitemap', `${href} is built but not listed`);

const robotsFile = path.join(DIST, 'robots.txt');
if (!existsSync(robotsFile)) {
  fail('robots.txt', 'missing');
} else {
  const lines = readFileSync(robotsFile, 'utf8').split(/\r?\n/);
  const sitemaps = lines.filter((l) => /^sitemap\s*:/i.test(l)).map((l) => l.replace(/^sitemap\s*:\s*/i, '').trim());
  if (!sitemaps.includes(`${SITE}/sitemap-index.xml`)) fail('robots.txt', `doesn't advertise ${SITE}/sitemap-index.xml`);
  for (const s of sitemaps) siteFile(s, 'robots.txt');
}

// ---- report ----

console.log(
  `check-dist: ${stats.pages} pages (${published.length} published + 404), ` +
  `${stats.internal} on-site links (${stats.fragments} with #fragments, ${stats.pdfs} PDF), ` +
  `${stats.external} off-site links and ${stats.otherDeploys} into other repositories' sites ` +
  `(${OTHER_DEPLOYS.join(', ')}) not fetched, ${listed.length} sitemap URLs`
);
if (errors.length) {
  console.error(`\n${errors.length} problem${errors.length === 1 ? '' : 's'}:`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('check-dist: ok');
