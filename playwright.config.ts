import { defineConfig, devices } from "@playwright/test";

/**
 * Visual regression harness.
 *
 * The seam is the rendered page in a real browser, served from a production
 * build — never `next dev`, whose overlay and dev indicator would land in the
 * screenshots. `npm run test:visual` builds, serves, shoots and diffs.
 *
 * See `docs/visual-regression.md` for how to read a failure and how baselines
 * are regenerated.
 */

/** Not 3000: a dev server left running must never be mistaken for the build. */
const PORT = 3100;
const BASE_URL = `http://127.0.0.1:${PORT}`;

/** The spec every viewport project runs; `structure` runs the other one. */
const SCREENSHOTS = /landing\.spec\.ts$/;

export default defineConfig({
  testDir: "./tests/visual",

  /* One directory per viewport, so a PR diff reads as "the phone changed". */
  snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{arg}{ext}",

  /* Baselines are pixels, not timing — a retry can only hide a real flake. */
  retries: 0,
  workers: 1,

  forbidOnly: !!process.env.CI,
  reporter: [["list"], ["html", { open: "never" }]],

  expect: {
    toHaveScreenshot: {
      /*
       * How far one pixel may drift in YIQ, and how many may. Playwright's
       * default threshold of 0.2 was tried and rejected as far too lax for a
       * parity gate — `docs/visual-regression.md` has the measurement.
       */
      threshold: 0.02,
      maxDiffPixels: 100,

      /*
       * These three are Playwright's current defaults, restated so that a
       * future release changing one cannot quietly change the baselines:
       * animations fast-forwarded to their end (infinite ones reset to their
       * start), no text caret, and CSS pixels rather than device pixels.
       */
      animations: "disabled",
      caret: "hide",
      scale: "css",
    },
  },

  use: {
    baseURL: BASE_URL,
    /* Renders every reveal target in its settled state. See docs. */
    contextOptions: { reducedMotion: "reduce" },
    colorScheme: "light",
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
    deviceScaleFactor: 1,
    trace: "retain-on-failure",
  },

  /*
   * Width is the whole point of each screenshot project, so it is the whole
   * name. Device emulation (`isMobile`, `hasTouch`) is deliberately off: the
   * gate is what the layout does at a width, and emulation would add a second
   * variable to every diff.
   *
   * `structure` is not a viewport — it holds the assertions a picture cannot
   * make, each setting the width it cares about. Splitting it out by
   * `testMatch` is what keeps it from running once per viewport for nothing.
   */
  projects: [
    {
      name: "structure",
      testMatch: /structure\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "desktop-1440",
      testMatch: SCREENSHOTS,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "tablet-768",
      testMatch: SCREENSHOTS,
      use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } },
    },
    {
      name: "phone-390",
      testMatch: SCREENSHOTS,
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } },
    },
  ],

  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    url: BASE_URL,
    /* Never reuse: an already-running server is not necessarily this build. */
    reuseExistingServer: false,
    timeout: 240_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
