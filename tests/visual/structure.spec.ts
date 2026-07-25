import { expect, test } from "@playwright/test";
import { isExternalUrl, openSettled, settle } from "./settle";

/*
 * The things a screenshot cannot see, asserted on the same seam it uses — the
 * rendered page. These run once, in their own project, rather than three times
 * over the viewport projects: each test sets the width it cares about.
 */

/**
 * Every width the responsive rules name: the three screenshot viewports, plus
 * iPad landscape, a large phone, and 360 — the narrowest width that must not
 * break.
 */
const WIDTHS = [1440, 1024, 768, 414, 390, 360];

/*
 * The most valuable non-visual assertion in the suite. The hero's absolutely
 * positioned circles make sideways drift the most likely responsive
 * regression, and a full-page screenshot happily photographs a page that
 * scrolls sideways.
 */
for (const width of WIDTHS) {
  test(`the document does not scroll sideways at ${width}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });

    await openSettled(page, "/", testInfo);

    /*
     * `clientWidth` rather than the viewport width: it is the viewport minus
     * whatever a vertical scrollbar took, which is exactly the space the
     * document has to fit into.
     */
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
  });
}

/*
 * Determinism depends on it — a page that reaches the network is a page whose
 * pixels someone else gets a vote on. `openSettled` blocks external requests
 * so the screenshots cannot be held hostage; this test is the one that lets
 * them through, to prove there are none to block.
 */
test("the page requests nothing from off the machine", async ({ page }) => {
  const external: string[] = [];

  page.on("request", (request) => {
    if (isExternalUrl(request.url())) external.push(request.url());
  });

  await page.goto("/", { waitUntil: "load" });
  await settle(page);

  expect(external).toEqual([]);
});

/*
 * One number and one greeting, built in one place, so no call site can drift.
 * The URL is spelled out here rather than imported from the app: the test's
 * job is to hold the page to the mock, not to agree with the code.
 */
const WHATSAPP_URL =
  "https://wa.me/5511943046621?text=Ol%C3%A1%2C%20Yasmim!%20Gostaria%20de%20agendar%20uma%20sess%C3%A3o.";

test("the floating WhatsApp button opens the drafted conversation in a new tab", async ({
  page,
}, testInfo) => {
  await openSettled(page, "/", testInfo);

  const button = page.getByRole("link", { name: "Fale no WhatsApp" });

  await expect(button).toHaveAttribute("href", WHATSAPP_URL);
  await expect(button).toHaveAttribute("target", "_blank");
});
