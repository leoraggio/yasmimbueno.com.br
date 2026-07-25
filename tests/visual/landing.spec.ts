import { expect, test } from "@playwright/test";
import { openSettled } from "./settle";

/*
 * One shot of the whole page per viewport, rather than one per section.
 * Section-level baselines would multiply the files to review and still miss
 * the thing most likely to break, which is the vertical rhythm between
 * sections.
 */
test("the landing page matches its baseline", async ({ page }, testInfo) => {
  await openSettled(page, "/", testInfo);

  await expect(page).toHaveScreenshot("landing.png", { fullPage: true });
});
