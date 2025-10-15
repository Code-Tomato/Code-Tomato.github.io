// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://code-tomato.github.io',
  output: 'static',
  integrations: [tailwind()]
});
