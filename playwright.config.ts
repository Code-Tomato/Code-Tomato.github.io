import { defineConfig } from '@playwright/test';

// Browser regression tests against the built site (npm run build first),
// served locally the way GitHub Pages serves it. No external network.
// Its own port, never shared: 4321 is Astro's dev/preview port, and reusing
// a server there would test the dev server instead of dist/.
const PORT = Number(process.env.E2E_PORT ?? 4329);
const CI = !!process.env.CI;
const CACHE_SPEC = /bfcache\.spec\.ts$/;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: CI,
  // No retries: a flaky pass would hide exactly the timing bugs these guard.
  retries: 0,
  workers: CI ? 2 : undefined,
  reporter: CI ? [['list'], ['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    // Plain engines, no device user agents: overriding the UA can change
    // what navigator.userAgentData reports, and the site's default design
    // is chosen from it.
    viewport: { width: 1280, height: 800 },
    trace: 'retain-on-failure',
  },
  projects: [
    // The three engines as Playwright ships them. Chromium here runs with
    // Playwright's default --disable-back-forward-cache, so these cover the
    // reload-and-restore path.
    { name: 'chromium', testIgnore: CACHE_SPEC, use: { browserName: 'chromium' } },
    { name: 'firefox', testIgnore: CACHE_SPEC, use: { browserName: 'firefox' } },
    { name: 'webkit', testIgnore: CACHE_SPEC, use: { browserName: 'webkit' } },
    // The cached path, on purpose: full Chromium (channel 'chromium'; the
    // default headless shell refuses the cache as "masked") with the cache
    // switched back on. Only bfcache.spec.ts runs here, and it asserts every
    // return really came from the cache.
    {
      name: 'chromium-bfcache',
      testMatch: CACHE_SPEC,
      use: {
        browserName: 'chromium',
        channel: 'chromium',
        launchOptions: { ignoreDefaultArgs: ['--disable-back-forward-cache'] },
      },
    },
  ],
  webServer: {
    command: 'node tests/serve-dist.mjs',
    url: `http://127.0.0.1:${PORT}/`,
    env: { PORT: String(PORT) },
    reuseExistingServer: false,
    timeout: 20_000,
  },
});
