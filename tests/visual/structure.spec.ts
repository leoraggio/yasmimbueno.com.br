import { expect, test, type Locator, type Page } from "@playwright/test";
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

test("the phone about layout keeps the portrait aligned and capped and steps down the farol", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await openSettled(page, "/", testInfo);

  const about = page.getByRole("region", { name: "Olá, sou a Yasmim." });
  const portrait = about.getByRole("img", { name: "Yasmim Bueno" });
  const portraitFrame = portrait.locator(
    "xpath=../preceding-sibling::*[@aria-hidden='true']",
  );
  const heading = about.getByRole("heading", { level: 2 });
  const formation = about.getByText("Formação", { exact: true });
  const formationValue = about.getByText(
    "Pós Graduação em Psicologia Clínica · PUC-RS",
    { exact: true },
  );
  const farol = page.getByRole("separator", { name: "Farol" }).locator("img");

  const [
    portraitBox,
    portraitFrameBox,
    headingBox,
    formationBox,
    formationValueBox,
    farolBox,
  ] = await Promise.all([
    portrait.boundingBox(),
    portraitFrame.boundingBox(),
    heading.boundingBox(),
    formation.boundingBox(),
    formationValue.boundingBox(),
    farol.boundingBox(),
  ]);

  expect(portraitBox).not.toBeNull();
  expect(portraitFrameBox).not.toBeNull();
  expect(headingBox).not.toBeNull();
  expect(formationBox).not.toBeNull();
  expect(formationValueBox).not.toBeNull();
  expect(farolBox).not.toBeNull();
  expect(portraitBox!.y).toBeLessThan(headingBox!.y);
  expect(portraitBox!.height).toBeLessThanOrEqual(448);
  expect(portraitFrameBox).toEqual(portraitBox);
  expect(formationBox!.y).toBeLessThan(formationValueBox!.y);
  expect(formationBox!.x).toBe(formationValueBox!.x);
  expect(farolBox!.width).toBe(84);
});

test("the approach section presents ACT and DBT as complementary practices", async ({
  page,
}, testInfo) => {
  await openSettled(page, "/", testInfo);

  const approach = page.getByRole("region", {
    name: "Entre aceitar e mudar, existe um caminho",
  });

  await expect(
    approach.getByText("Minha metodologia", { exact: true }),
  ).toBeVisible();
  await expect(
    approach.getByText(
      "A vida não para enquanto você resolve seus problemas: ela acontece com eles. Por isso trabalho com duas abordagens que se complementam: uma ensina a acolher, a outra ensina a agir.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    approach.getByRole("heading", {
      level: 3,
      name: "ACT Terapia de Aceitação e Compromisso",
    }),
  ).toBeVisible();
  await expect(
    approach.getByText(
      "Aqui, o objetivo não é eliminar a dor, mas mudar a relação com ela. Você aprende a dar espaço ao que sente e a se guiar pelos seus valores, como um farol que orienta, mesmo em mar agitado.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    approach.getByRole("heading", {
      level: 3,
      name: "DBT Terapia Comportamental Dialética",
    }),
  ).toBeVisible();
  await expect(
    approach.getByText(
      "Para emoções que chegam como ondas grandes demais. A DBT oferece ferramentas práticas para atravessar crises, reduzir comportamentos impulsivos e construir relações mais estáveis.",
      { exact: true },
    ),
  ).toBeVisible();
  expect(await approach.getByRole("listitem").allTextContents()).toEqual([
    "Aceitação",
    "Valores",
    "Ação com compromisso",
    "Atenção plena",
    "Regulação emocional",
    "Tolerância ao mal-estar",
    "Efetividade interpessoal",
  ]);
});

test("the services section presents who Yasmim treats and how therapy unfolds", async ({
  page,
}, testInfo) => {
  await openSettled(page, "/", testInfo);

  const services = page.getByRole("region", {
    name: "Cada história tem seu nome, e seu ritmo",
  });

  await expect(
    services.getByText("Terapia individual", { exact: true }),
  ).toBeVisible();
  await expect(
    services.getByText(
      "Alguns nomes ajudam a orientar o caminho, mas aqui, você chega antes do diagnóstico.",
      { exact: true },
    ),
  ).toBeVisible();

  const disorders = services.getByRole("list", {
    name: "Transtornos que trato",
  });
  const needs = services.getByRole("list", {
    name: "Demandas específicas",
  });

  await expect(disorders.getByRole("listitem")).toHaveText([
    "01Depressão",
    "02Transtorno Bipolar",
    "03Transtorno da Personalidade Borderline",
    "04Neurodivergência",
  ]);
  await expect(needs.getByRole("listitem")).toHaveText([
    "01Desregulação emocional",
    "02Rigidez Cognitiva",
    "03Comportamentos impulsivos",
    "04Comportamento suicida e autolesivo",
  ]);

  await expect(
    services.getByText("E costuma acontecer assim:", { exact: true }),
  ).toBeVisible();
  await expect(
    services.getByRole("heading", { level: 4, name: "Chegar" }),
  ).toBeVisible();
  await expect(
    services.getByText(
      "Do jeito que der. Sem precisar organizar a história antes.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    services.getByRole("heading", { level: 4, name: "Olhar junto" }),
  ).toBeVisible();
  await expect(
    services.getByText(
      "Entender padrões, dar nome ao que pesa, sem julgamento.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    services.getByRole("heading", { level: 4, name: "Seguir" }),
  ).toBeVisible();
  await expect(
    services.getByText(
      "Passos pequenos e reais na direção do que importa para você.",
      { exact: true },
    ),
  ).toBeVisible();

  const invitation = services.getByText(
    "Espaço para sentir. Liberdade para ser.",
    { exact: true },
  );
  const cta = services.getByRole("link", { name: "Começar essa conversa" });

  await expect(invitation).toBeVisible();
  await expect(cta).toHaveAttribute("href", WHATSAPP_URL);
  await expect(cta).toHaveAttribute("target", "_blank");
  await expect(services.locator(":scope > [data-revealed]")).toHaveCount(3);
});

test("the phone services layout keeps the process after the lists and its invitation full-width", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 360, height: 844 });

  await openSettled(page, "/", testInfo);

  const services = page.getByRole("region", {
    name: "Cada história tem seu nome, e seu ritmo",
  });
  const disorders = services.getByRole("list", {
    name: "Transtornos que trato",
  });
  const needs = services.getByRole("list", { name: "Demandas específicas" });
  const firstRow = disorders.getByRole("listitem").first();
  const longRow = disorders.getByRole("listitem").nth(2);
  const firstNumber = firstRow.getByText("01", { exact: true });
  const firstLabel = firstRow.getByText("Depressão", { exact: true });
  const number = longRow.getByText("03", { exact: true });
  const label = longRow.getByText("Transtorno da Personalidade Borderline", {
    exact: true,
  });
  const process = services.getByText("E costuma acontecer assim:", {
    exact: true,
  });
  const invitation = services.getByText(
    "Espaço para sentir. Liberdade para ser.",
    { exact: true },
  );
  const band = invitation.locator("..");
  const cta = services.getByRole("link", { name: "Começar essa conversa" });

  const [
    needsBox,
    firstNumberBox,
    firstLabelBox,
    numberBox,
    labelBox,
    labelLines,
    processBox,
    bandBox,
    ctaBox,
  ] = await Promise.all([
    needs.boundingBox(),
    firstNumber.boundingBox(),
    firstLabel.boundingBox(),
    number.boundingBox(),
    label.boundingBox(),
    label.evaluate((element) => {
      const lineHeight = Number.parseFloat(getComputedStyle(element).lineHeight);
      return Math.round(element.getBoundingClientRect().height / lineHeight);
    }),
    process.boundingBox(),
    band.boundingBox(),
    cta.boundingBox(),
  ]);

  expect(needsBox).not.toBeNull();
  expect(firstNumberBox).not.toBeNull();
  expect(firstLabelBox).not.toBeNull();
  expect(numberBox).not.toBeNull();
  expect(labelBox).not.toBeNull();
  expect(processBox).not.toBeNull();
  expect(bandBox).not.toBeNull();
  expect(ctaBox).not.toBeNull();
  expect(processBox!.y).toBeGreaterThan(needsBox!.y + needsBox!.height);
  expect(numberBox!.x).toBe(firstNumberBox!.x);
  expect(labelBox!.x).toBe(firstLabelBox!.x);
  expect(numberBox!.y).toBeLessThan(labelBox!.y + labelBox!.height / 2);
  expect(labelLines).toBeGreaterThan(1);
  expect(ctaBox!.width).toBe(bandBox!.width - 48);
});

test("the quote gives Steven C. Hayes's words their own revealed field", async ({
  page,
}, testInfo) => {
  await openSettled(page, "/", testInfo);

  const quote = page.locator("blockquote");
  const quoteSection = quote.locator("xpath=../..");

  await expect(quote).toHaveText(
    "Quanto mais tentamos eliminar a dor, mais reduzimos nossa vida. A melhor forma de lidar com o sofrimento é ampliando a vida e fortalecendo o que é valoroso para nós.",
  );
  await expect(
    quoteSection.getByText("Steven C. Hayes", { exact: true }),
  ).toBeVisible();
  await expect(quoteSection.locator(":scope > [data-revealed]")).toHaveCount(1);
});

const FAQ_ITEMS = [
  {
    question: "Quanto tempo dura uma sessão?",
    answer:
      "As sessões individuais duram cerca de 50 minutos, semanalmente.",
  },
  {
    question: "A terapia é confidencial?",
    answer:
      "Sim. O sigilo é um pilar da prática psicológica e está no código de ética profissional. O que conversamos fica entre nós, com as poucas exceções legais que combinamos já no nosso primeiro encontro.",
  },
  {
    question: "Você atende por convênio?",
    answer:
      "Os atendimentos são particulares. Ofereço a nota fiscal e toda a documentação necessária para que você solicite o reembolso junto à sua operadora de saúde.",
  },
  {
    question: "Quanto tempo dura o tratamento",
    answer:
      "A duração varia de pessoa para pessoa, depende da sua demanda, dos seus objetivos terapêuticos e do seu ritmo. Avaliamos juntos, ao longo do caminho, o que faz sentido para você.",
  },
  {
    question: "Qual público você atende?",
    answer:
      "Atendo somente o público adulto. Se você busca atendimento para crianças ou adolescentes, posso indicar colegas de confiança.",
  },
] as const;

test("the FAQ answers all five objections with independent disclosures", async ({
  page,
}, testInfo) => {
  await openSettled(page, "/", testInfo);

  const faq = page.getByRole("region", { name: "Antes de começarmos" });
  const disclosures = faq.locator("details");

  await expect(
    faq.getByText("Dúvidas frequentes", { exact: true }),
  ).toBeVisible();
  await expect(disclosures).toHaveCount(FAQ_ITEMS.length);
  await expect(faq.locator(":scope > [data-revealed]")).toHaveCount(2);

  for (const [index, item] of FAQ_ITEMS.entries()) {
    const disclosure = disclosures.nth(index);

    await expect(
      disclosure.getByText(item.question, { exact: true }),
    ).toBeVisible();
    await expect(disclosure.getByText(item.answer, { exact: true })).toBeHidden();
  }

  await disclosures.nth(0).locator("summary").click();
  await disclosures.nth(1).locator("summary").click();

  await expect(disclosures.nth(0)).toHaveJSProperty("open", true);
  await expect(disclosures.nth(1)).toHaveJSProperty("open", true);

  await disclosures.nth(0).locator("summary").click();

  await expect(disclosures.nth(0)).toHaveJSProperty("open", false);
  await expect(disclosures.nth(1)).toHaveJSProperty("open", true);
});

test("the FAQ content is available without JavaScript", async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    baseURL: testInfo.project.use.baseURL as string,
    javaScriptEnabled: false,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();

  await page.goto("/", { waitUntil: "load" });

  const faq = page.getByRole("region", { name: "Antes de começarmos" });
  const revealTargets = faq.locator(":scope > [data-revealed]");
  const firstDisclosure = faq.locator("details").first();

  await expect(revealTargets).toHaveCount(2);
  for (const target of await revealTargets.all()) {
    await expect(target).toHaveCSS("opacity", "1");
  }
  await expect(firstDisclosure).toBeVisible();
  await firstDisclosure.locator("summary").click();
  await expect(
    firstDisclosure.getByText(FAQ_ITEMS[0].answer, { exact: true }),
  ).toBeVisible();

  await context.close();
});

test("a wrapped phone FAQ question keeps its plus on the first line", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 360, height: 844 });

  await openSettled(page, "/", testInfo);

  const summary = page
    .getByRole("region", { name: "Antes de começarmos" })
    .locator("details")
    .nth(3)
    .locator("summary");
  const question = summary.getByText(FAQ_ITEMS[3].question, { exact: true });
  const plus = summary.locator('[aria-hidden="true"]');

  const [questionBox, plusBox, questionLines] = await Promise.all([
    question.boundingBox(),
    plus.boundingBox(),
    question.evaluate((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return range.getClientRects().length;
    }),
  ]);

  expect(questionBox).not.toBeNull();
  expect(plusBox).not.toBeNull();
  expect(questionLines).toBeGreaterThan(1);
  expect(Math.abs(questionBox!.y - plusBox!.y)).toBeLessThanOrEqual(1);
});

test("the contact footer presents every direct way to reach Yasmim", async ({
  page,
}, testInfo) => {
  await openSettled(page, "/", testInfo);

  const footer = page.getByRole("contentinfo");

  await expect(
    footer.getByRole("heading", { level: 2, name: "Entre em contato" }),
  ).toBeVisible();
  await expect(
    footer.getByText(
      "Escolha o canal que for mais confortável para você, no seu tempo.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    footer.getByRole("link", { name: "Agendar pelo WhatsApp" }),
  ).toHaveAttribute("href", WHATSAPP_URL);
  await expect(
    footer.getByText("Alameda Grajaú, 98, 18º andar", { exact: true }),
  ).toBeVisible();
  await expect(
    footer.getByText("Alphaville · Barueri, SP", { exact: true }),
  ).toBeVisible();
  await expect(
    footer.getByRole("link", { name: "contato@yasmimbueno.com.br" }),
  ).toHaveAttribute("href", "mailto:contato@yasmimbueno.com.br");
  await expect(
    footer.getByRole("link", { name: "(11) 94304-6621" }),
  ).toHaveAttribute("href", "tel:+5511943046621");
  await expect(
    footer.getByText(
      "© 2026 Yasmim Bueno · Psicóloga Clínica · CRP 06/200958",
      { exact: true },
    ),
  ).toBeVisible();

  const instagram = footer.getByRole("link", { name: "Instagram" });
  const linkedin = footer.getByRole("link", { name: "LinkedIn" });

  await expect(instagram).toHaveAttribute(
    "href",
    "https://instagram.com/yasmimbueno",
  );
  await expect(instagram).toHaveAttribute("target", "_blank");
  await expect(linkedin).toHaveAttribute(
    "href",
    "https://linkedin.com/in/yasmimbueno",
  );
  await expect(linkedin).toHaveAttribute("target", "_blank");
  await expect(footer.locator(":scope > [data-revealed]")).toHaveCount(1);
});

test("the desktop contact footer keeps the mock geometry", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openSettled(page, "/", testInfo);

  const faq = page.getByRole("region", { name: "Antes de começarmos" });
  const footer = page.getByRole("contentinfo");
  const content = footer.locator(":scope > [data-revealed]");
  const logo = footer.getByRole("img", { name: "Yasmim Bueno" });
  const contactItems = footerContactItems(footer);
  const instagram = footer.getByRole("link", { name: "Instagram" });
  const instagramCircle = instagram.locator("span");

  const [
    faqBox,
    footerBox,
    contentBox,
    logoBox,
    instagramBox,
    instagramCircleBox,
    paddingTop,
  ] = await Promise.all([
      faq.boundingBox(),
      footer.boundingBox(),
      content.boundingBox(),
      logo.boundingBox(),
      instagram.boundingBox(),
      instagramCircle.boundingBox(),
      footer.evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).paddingTop),
      ),
    ]);
  const contactBoxes = await Promise.all(
    contactItems.map((item) => item.boundingBox()),
  );

  expect(faqBox).not.toBeNull();
  expect(footerBox).not.toBeNull();
  expect(contentBox).not.toBeNull();
  expect(logoBox).not.toBeNull();
  expect(instagramBox).not.toBeNull();
  expect(instagramCircleBox).not.toBeNull();
  expect(contactBoxes.every(Boolean)).toBe(true);
  expect(footerBox!.y - (faqBox!.y + faqBox!.height)).toBe(96);
  expect(paddingTop).toBe(76);
  expect(contentBox!.width).toBe(1180);
  expect(logoBox!.height).toBe(44);
  expect(new Set(contactBoxes.map((box) => box!.y)).size).toBe(1);
  expect(instagramBox!.width).toBe(40);
  expect(instagramBox!.height).toBe(40);
  expect(instagramCircleBox!.width).toBe(40);
  expect(instagramCircleBox!.height).toBe(40);
});

test("the contact columns and bottom bar stack below the desktop breakpoint", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await openSettled(page, "/", testInfo);

  const footer = page.getByRole("contentinfo");
  const contactItems = footerContactItems(footer);
  const copyright = footer.getByText(
    "© 2026 Yasmim Bueno · Psicóloga Clínica · CRP 06/200958",
    { exact: true },
  );
  const socialLinks = footer.getByRole("link", {
    name: /^(Instagram|LinkedIn)$/,
  });
  const socialCircles = socialLinks.locator("span");

  const contactBoxes = await Promise.all(
    contactItems.map((item) => item.boundingBox()),
  );
  const [
    copyrightBox,
    firstSocialBox,
    lastSocialBox,
    firstCircleBox,
    lastCircleBox,
  ] = await Promise.all([
    copyright.boundingBox(),
    socialLinks.first().boundingBox(),
    socialLinks.last().boundingBox(),
    socialCircles.first().boundingBox(),
    socialCircles.last().boundingBox(),
  ]);

  expect(contactBoxes.every(Boolean)).toBe(true);
  expect(copyrightBox).not.toBeNull();
  expect(firstSocialBox).not.toBeNull();
  expect(lastSocialBox).not.toBeNull();
  expect(firstCircleBox).not.toBeNull();
  expect(lastCircleBox).not.toBeNull();
  expect(contactBoxes[0]!.x).toBe(contactBoxes[1]!.x);
  expect(contactBoxes[1]!.x).toBe(contactBoxes[2]!.x);
  expect(contactBoxes[0]!.y).toBeLessThan(contactBoxes[1]!.y);
  expect(contactBoxes[1]!.y).toBeLessThan(contactBoxes[2]!.y);
  expect(copyrightBox!.y).toBeLessThan(firstSocialBox!.y);
  expect(
    Math.round((firstSocialBox!.x + lastSocialBox!.x + lastSocialBox!.width) / 2),
  ).toBe(384);
  expect(firstCircleBox!.width).toBe(40);
  expect(lastCircleBox!.width).toBe(40);
});

test("the phone WhatsApp control clears the safe area and the footer CTA", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openSettled(page, "/", testInfo);
  await page.addStyleTag({
    content: ":root { --safe-area-bottom: 18px !important; }",
  });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await nextPaint(page);

  const floating = page.getByRole("link", { name: "Fale no WhatsApp" });
  const footerCta = page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Agendar pelo WhatsApp" });
  const [floatingBox, footerCtaBox] = await Promise.all([
    floating.boundingBox(),
    footerCta.boundingBox(),
  ]);

  expect(floatingBox).not.toBeNull();
  expect(footerCtaBox).not.toBeNull();
  expect(
    Math.round(844 - (floatingBox!.y + floatingBox!.height)),
  ).toBe(44);
  expect(rectanglesOverlap(floatingBox!, footerCtaBox!)).toBe(false);
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

function rectanglesOverlap(
  first: { x: number; y: number; width: number; height: number },
  second: { x: number; y: number; width: number; height: number },
) {
  return !(
    first.x + first.width <= second.x ||
    second.x + second.width <= first.x ||
    first.y + first.height <= second.y ||
    second.y + second.height <= first.y
  );
}

function footerContactItems(footer: Locator) {
  return ["Consultório", "E-mail", "Telefone"].map((label) =>
    footer.getByText(label, { exact: true }).locator(".."),
  );
}
