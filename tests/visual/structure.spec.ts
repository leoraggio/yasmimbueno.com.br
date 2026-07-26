import { expect, test, type Page } from "@playwright/test";
import { isExternalUrl, nextPaint, openSettled, settle } from "./settle";

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

/*
 * The same conversation from every button on the page, so a visitor who has
 * decided to write never wonders whether they picked the wrong one. Today that
 * is the bar's pill and the floating button; the hero, the Serviços band and
 * the footer add theirs as those sections land, and each is held to this
 * without the test having to learn about it.
 */
test("every WhatsApp CTA leads to the same drafted conversation", async ({
  page,
}, testInfo) => {
  await openSettled(page, "/", testInfo);

  const ctas = await page.locator('a[href*="wa.me"]').all();

  expect(ctas.length).toBeGreaterThan(0);

  for (const cta of ctas) {
    await expect(cta).toHaveAttribute("href", WHATSAPP_URL);
    await expect(cta).toHaveAttribute("target", "_blank");
  }
});

/*
 * The nav is the one part of the page whose shape is a rule from the spec
 * rather than something the mock drew, so the rule is asserted rather than
 * left to the phone baseline to ratify.
 */

test("the lockup leads to the top of the page", async ({ page }, testInfo) => {
  await openSettled(page, "/", testInfo);

  await expect(page.getByRole("link", { name: "Yasmim Bueno" })).toHaveAttribute(
    "href",
    "#top",
  );

  /* The one anchor on the page the nav owns, and the only one that has to
     resolve while the sections it links to are still to land. */
  await expect(page.locator("#top")).toHaveCount(1);
});

test("the link row is in the bar at 1024", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1024, height: 900 });

  await openSettled(page, "/", testInfo);

  await expect(page.getByRole("link", { name: "Sobre" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Menu" })).toBeHidden();
});

test.describe("below 1024", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the link row collapses behind a menu, and the logo and the booking pill stay in the bar", async ({
    page,
  }, testInfo) => {
    await openSettled(page, "/", testInfo);

    await expect(page.getByRole("link", { name: "Sobre" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Menu" })).toBeVisible();
    await expect(page.getByRole("img", { name: "Yasmim Bueno" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Agendar Atendimento" }),
    ).toBeVisible();
  });

  test("the menu panel opens on the control and closes on a link", async ({
    page,
  }, testInfo) => {
    await openSettled(page, "/", testInfo);

    const control = page.getByRole("button", { name: "Menu" });
    const sobre = page.getByRole("link", { name: "Sobre" });

    await control.click();

    await expect(sobre).toBeVisible();
    await expect(control).toHaveAttribute("aria-expanded", "true");

    await sobre.click();

    await expect(sobre).toBeHidden();
    await expect(control).toHaveAttribute("aria-expanded", "false");
  });

  test("the menu panel closes on Escape and hands focus back to the control", async ({
    page,
  }, testInfo) => {
    await openSettled(page, "/", testInfo);

    const control = page.getByRole("button", { name: "Menu" });
    const sobre = page.getByRole("link", { name: "Sobre" });

    await control.click();
    await expect(sobre).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(sobre).toBeHidden();
    await expect(control).toBeFocused();
  });

  test("the page behind the open menu panel does not scroll, and scrolls again once it closes", async ({
    page,
  }, testInfo) => {
    await openSettled(page, "/", testInfo);

    /*
     * The page is still mostly shell and has nothing to scroll yet, which
     * would make this pass without proving anything. The height stands in for
     * the sections that will supply it, and becomes a no-op once they do.
     */
    await page.addStyleTag({ content: "body { min-height: 300vh }" });

    const control = page.getByRole("button", { name: "Menu" });

    /*
     * A wheel over the page below the panel, rather than `window.scrollTo`:
     * `overflow: hidden` stops a visitor scrolling but not a script, so a
     * programmatic scroll would report the lock broken while it holds.
     */
    const wheelDown = async () => {
      await page.mouse.move(195, 600);
      await page.mouse.wheel(0, 400);
    };

    await control.click();
    await expect(control).toHaveAttribute("aria-expanded", "true");

    await wheelDown();
    await nextPaint(page);

    expect(await page.evaluate(() => window.scrollY)).toBe(0);

    await page.keyboard.press("Escape");
    await expect(control).toHaveAttribute("aria-expanded", "false");

    /* The other half of the assertion: a wheel that moves nothing either way
       would have made the first half pass for the wrong reason. */
    await wheelDown();
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(0);
  });

  test("every link and button is at least a fingertip across", async ({
    page,
  }, testInfo) => {
    await openSettled(page, "/", testInfo);

    expect(await undersizedTargets(page)).toEqual([]);

    /* The panel's own links are targets too, and only exist while it is open. */
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(page.getByRole("link", { name: "Sobre" })).toBeVisible();

    expect(await undersizedTargets(page)).toEqual([]);
  });
});

/**
 * Every link and button the visitor can see that is smaller than a fingertip
 * in either direction, named the way a person would name it so that a failure
 * reads as "Sobre is 30px tall" rather than as a list of boxes.
 */
async function undersizedTargets(page: Page) {
  return page.evaluate(() => {
    const MINIMUM_PX = 44;

    return Array.from(document.querySelectorAll("a, button"))
      .filter((element) => element.getClientRects().length > 0)
      .map((element) => ({ element, box: element.getBoundingClientRect() }))
      .filter(({ box }) => box.width < MINIMUM_PX || box.height < MINIMUM_PX)
      .map(({ element, box }) => ({
        /* `||`, not `??`: an icon-only control has an empty `textContent`,
           and "" would name the failure no better than nothing at all. */
        target:
          element.getAttribute("aria-label") ||
          element.textContent?.trim() ||
          element.tagName,
        width: Math.round(box.width),
        height: Math.round(box.height),
      }));
  });
}
