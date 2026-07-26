import { expect, type Page, type TestInfo } from "@playwright/test";

/**
 * Getting a page to the point where it is worth photographing.
 *
 * A baseline is only worth committing if the same commit renders the same
 * pixels every time, so every known source of drift is closed here rather than
 * per test. Motion is the exception, closed in `playwright.config.ts`:
 * `reducedMotion: "reduce"` on the context and `animations: "disabled"` on the
 * screenshot.
 */

/** `new URL(...).hostname` brackets IPv6, so `[::1]` is the form seen here. */
const LOCAL_HOSTNAMES = new Set(["127.0.0.1", "localhost", "[::1]"]);

/**
 * Whether a request left the machine. `data:` and `blob:` URLs never did, so
 * only http(s) to a non-local host counts.
 *
 * Shared with `structure.spec.ts`, which asserts the page makes no such
 * request at all — one definition of "external", so the screenshots and the
 * assertion cannot disagree about what they are looking at.
 */
export function isExternalUrl(requestUrl: string) {
  const url = new URL(requestUrl);

  if (url.protocol !== "http:" && url.protocol !== "https:") return false;

  return !LOCAL_HOSTNAMES.has(url.hostname);
}

/**
 * Navigates to `path` and resolves once the page has stopped changing.
 */
export async function openSettled(page: Page, path: string, testInfo: TestInfo) {
  const blockedOrigins = await blockExternalRequests(page);

  await page.goto(path, { waitUntil: "load" });

  await settle(page);

  /*
   * Blocking is silent to the test, so surface it in the report instead: with
   * the CMS and the stock photography gone this list is empty, and anything
   * that appears in it later is a regression worth a look.
   */
  if (blockedOrigins.size > 0) {
    testInfo.annotations.push({
      type: "blocked-external-requests",
      description: [...blockedOrigins].sort().join(", "),
    });
  }
}

/**
 * Everything after navigation: waits until the loaded page has stopped
 * changing.
 *
 * The order is load-bearing: fonts settle before the page is walked, because
 * the walk is measured in page height and fallback metrics give the wrong
 * height; images are awaited after the walk, because the walk is what asks for
 * them.
 *
 * Separate from `openSettled` for the one test that must watch the network
 * rather than block it, and so needs the settling without the blocking.
 */
export async function settle(page: Page) {
  /*
   * Asserted rather than assumed: reduced motion is set in the config, where a
   * typo or an API move would silently stop forcing it and leave the suite
   * shooting mid-animation for weeks before anyone noticed.
   */
  expect(
    await page.evaluate(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    "the run must force reduced motion",
  ).toBe(true);

  /* No shot may catch the fallback face, and nothing may be measured before. */
  await page.evaluate(() => document.fonts.ready.then(() => undefined));

  await loadLazyContent(page);

  /*
   * `complete` rather than `naturalWidth`, deliberately: it also goes true for
   * an image that failed, so a blocked external request ends the wait instead
   * of hanging the suite until the test times out. Covers `<img>` only — the
   * page has no CSS background images to wait on.
   */
  await page.waitForFunction(() =>
    Array.from(document.images).every((image) => image.complete),
  );

  /*
   * Reveal wrappers publish their settled state (`src/components/Reveal.tsx`),
   * so the suite waits on the animation rather than sleeping past it. Under
   * the forced reduced motion of this run they settle on hydration; the wait
   * is what makes "on hydration" a fact rather than a hope.
   */
  await page.waitForFunction(() =>
    Array.from(document.querySelectorAll("[data-revealed]")).every(
      (target) => target.getAttribute("data-revealed") === "true",
    ),
  );

  await nextPaint(page);
}

/**
 * Aborts anything not served by the local build, and reports which origins
 * were turned away.
 */
async function blockExternalRequests(page: Page) {
  const blockedOrigins = new Set<string>();

  await page.route("**/*", (route) => {
    const requestUrl = route.request().url();

    if (!isExternalUrl(requestUrl)) {
      return route.continue();
    }

    blockedOrigins.add(new URL(requestUrl).origin);
    return route.abort();
  });

  return blockedOrigins;
}

/**
 * Walks the page top to bottom and back, so `loading="lazy"` images commit to
 * a size before the capture rather than during it.
 */
async function loadLazyContent(page: Page) {
  await page.evaluate(async () => {
    const pause = () => new Promise((resolve) => setTimeout(resolve, 60));

    /*
     * `scrollHeight` is re-read each pass, so a lazy image that grows the page
     * extends the walk. `instant` because the document sets
     * `scroll-behavior: smooth`.
     */
    for (
      let y = 0;
      y < document.documentElement.scrollHeight;
      y += window.innerHeight
    ) {
      window.scrollTo({ top: y, behavior: "instant" });
      await pause();
    }

    window.scrollTo({ top: 0, behavior: "instant" });
    await pause();
  });
}

/** Waits two animation frames so computed layout has been painted. */
export function nextPaint(page: Page) {
  return page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
}
