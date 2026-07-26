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

test("the hero presents Yasmim and both ways forward", async ({
  page,
}, testInfo) => {
  await openSettled(page, "/", testInfo);

  const hero = page.getByRole("region", {
    name: "Espaço para sentir. Liberdade para ser.",
  });

  await expect(
    hero.getByRole("heading", {
      level: 1,
      name: "Espaço para sentir. Liberdade para ser.",
    }),
  ).toBeVisible();
  await expect(
    hero.getByText("Psicóloga clínica · CRP 06/200958"),
  ).toBeVisible();
  await expect(hero.getByText("Online e Presencial")).toBeVisible();
  await expect(hero.getByRole("img", { name: "Yasmim Bueno" })).toBeVisible();

  await expect(
    hero.getByRole("link", { name: "Agendar pelo WhatsApp" }),
  ).toHaveAttribute("href", WHATSAPP_URL);
  await expect(
    hero.getByRole("link", { name: "Conheça os serviços" }),
  ).toHaveAttribute("href", "#servicos");
});

test("the phone hero keeps copy before the portrait and stacks full-width actions", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await openSettled(page, "/", testInfo);

  const hero = page.getByRole("region", {
    name: "Espaço para sentir. Liberdade para ser.",
  });
  const heading = hero.getByRole("heading", { level: 1 });
  const portrait = hero.getByRole("img", { name: "Yasmim Bueno" });
  const primary = hero.getByRole("link", { name: "Agendar pelo WhatsApp" });
  const secondary = hero.getByRole("link", { name: "Conheça os serviços" });

  const [headingBox, portraitBox, primaryBox, secondaryBox] = await Promise.all([
    heading.boundingBox(),
    portrait.boundingBox(),
    primary.boundingBox(),
    secondary.boundingBox(),
  ]);

  expect(headingBox).not.toBeNull();
  expect(portraitBox).not.toBeNull();
  expect(primaryBox).not.toBeNull();
  expect(secondaryBox).not.toBeNull();
  expect(headingBox!.y).toBeLessThan(portraitBox!.y);
  expect(primaryBox!.y).toBeLessThan(secondaryBox!.y);
  expect(primaryBox!.width).toBe(secondaryBox!.width);
});

test("the desktop breakpoint keeps the hero headline on two lines", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1024, height: 768 });

  await openSettled(page, "/", testInfo);

  const lines = await page
    .getByRole("heading", { level: 1 })
    .evaluate((heading) => {
      const lineHeight = Number.parseFloat(getComputedStyle(heading).lineHeight);
      return Math.round(heading.getBoundingClientRect().height / lineHeight);
    });

  expect(lines).toBe(2);
});

test("the about section presents Yasmim's clinical introduction and credentials", async ({
  page,
}, testInfo) => {
  await openSettled(page, "/", testInfo);

  const about = page.getByRole("region", { name: "Olá, sou a Yasmim." });

  await expect(
    about.getByRole("heading", { level: 2, name: "Olá, sou a Yasmim." }),
  ).toBeVisible();
  await expect(about.getByRole("img", { name: "Yasmim Bueno" })).toBeVisible();
  await expect(
    about.getByText(
      "Sou psicóloga, pós-graduada em Psicologia Clínica pela PUC-RS e especializada em Terapias Contextuais. Acredito que a terapia é um espaço de acolhimento e transformação. Atendo adultos que vivem emoções intensas, momentos de crise ou oscilações de humor, que têm desafios de atenção e foco ou dificuldade em gerenciar a rotina, e mulheres que enfrentam sobrecarga e autocobrança no dia a dia.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    about.getByText(
      "Dedico meu aprimoramento contínuo à Terapia de Aceitação e Compromisso (ACT) e à Terapia Comportamental Dialética (DBT). São abordagens que unem aceitação e mudança: em vez de lutar contra o que você sente, desenvolvemos habilidades para lidar com as emoções e agir na direção dos seus valores, construindo uma vida que vale a pena ser vivida.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(about.getByText("Formação", { exact: true })).toBeVisible();
  await expect(
    about.getByText("Especializações", { exact: true }),
  ).toBeVisible();
  await expect(
    about.getByText("Pós Graduação em Psicologia Clínica · PUC-RS", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    about.getByText("Pós Graduação em Terapias Contextuais · Wainer", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(about.locator("em")).toHaveText([
    "Terapia de Aceitação e Compromisso (ACT)",
    "Terapia Comportamental Dialética (DBT)",
  ]);
  expect(await about.getByRole("listitem").allTextContents()).toEqual([
    "Terapia de Aceitação e Compromisso\u00a0· Dr. Steven C. Hayes (Artmed)",
    "Terapia Comportamental Dialética\u00a0· Por dentro da DBT",
    "Psicoterapia da Depressão e do Transtorno Bipolar\u00a0· Curt Hemanny",
    "Psicoterapias para Prevenção do Suicídio\u00a0· Craig Bryan (USP)",
  ]);
});

test("the phone about layout leads with a capped portrait and steps down the farol", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await openSettled(page, "/", testInfo);

  const about = page.getByRole("region", { name: "Olá, sou a Yasmim." });
  const portrait = about.getByRole("img", { name: "Yasmim Bueno" });
  const heading = about.getByRole("heading", { level: 2 });
  const formation = about.getByText("Formação", { exact: true });
  const formationValue = about.getByText(
    "Pós Graduação em Psicologia Clínica · PUC-RS",
    { exact: true },
  );
  const farol = page.getByRole("separator", { name: "Farol" }).locator("img");

  const [portraitBox, headingBox, formationBox, formationValueBox, farolBox] =
    await Promise.all([
      portrait.boundingBox(),
      heading.boundingBox(),
      formation.boundingBox(),
      formationValue.boundingBox(),
      farol.boundingBox(),
    ]);

  expect(portraitBox).not.toBeNull();
  expect(headingBox).not.toBeNull();
  expect(formationBox).not.toBeNull();
  expect(formationValueBox).not.toBeNull();
  expect(farolBox).not.toBeNull();
  expect(portraitBox!.y).toBeLessThan(headingBox!.y);
  expect(portraitBox!.height).toBeLessThanOrEqual(448);
  expect(formationBox!.y).toBeLessThan(formationValueBox!.y);
  expect(formationBox!.x).toBe(formationValueBox!.x);
  expect(farolBox!.width).toBe(84);
});

test("the lockup leads to the top of the page", async ({ page }, testInfo) => {
  await openSettled(page, "/", testInfo);

  await expect(page.getByRole("link", { name: "Yasmim Bueno" })).toHaveAttribute(
    "href",
    "#top",
  );

  // Section anchors intentionally remain unresolved until those sections ship.
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
    await expect(
      page
        .getByRole("link", { name: "Yasmim Bueno" })
        .getByRole("img", { name: "Yasmim Bueno" }),
    ).toBeVisible();
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

    // Supply the scrollable height that later sections will provide.
    await page.addStyleTag({ content: "body { min-height: 300vh }" });

    const control = page.getByRole("button", { name: "Menu" });

    // `overflow: hidden` blocks wheel input but not programmatic scrolling.
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

    await page.getByRole("button", { name: "Menu" }).click();
    await expect(page.getByRole("link", { name: "Sobre" })).toBeVisible();

    expect(await undersizedTargets(page)).toEqual([]);
  });
});

async function undersizedTargets(page: Page) {
  return page.evaluate(() => {
    const MINIMUM_PX = 44;

    return Array.from(document.querySelectorAll("a, button"))
      .filter((element) => element.getClientRects().length > 0)
      .map((element) => ({ element, box: element.getBoundingClientRect() }))
      .filter(({ box }) => box.width < MINIMUM_PX || box.height < MINIMUM_PX)
      .map(({ element, box }) => ({
        // An icon-only control has empty textContent, so `??` is insufficient.
        target:
          element.getAttribute("aria-label") ||
          element.textContent?.trim() ||
          element.tagName,
        width: Math.round(box.width),
        height: Math.round(box.height),
      }));
  });
}
