// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://code-tomato.github.io',
  output: 'static',
  integrations: [
    // sitemap-index.xml + sitemap-0.xml, advertised by public/robots.txt. The
    // integration already leaves out status pages; the filter says so here
    // too, so the 404 page can't slip in if that default ever changes.
    sitemap({ filter: (page) => !/^\/404(\/|\.html)?$/.test(new URL(page).pathname) }),
  ],
});
