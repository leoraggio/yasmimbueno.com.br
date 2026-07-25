# Visual regression

The landing page is specified as a pixel-exact implementation of a design mock,
so "does it still look right" has to be a machine's answer rather than an
opinion. This is the harness that answers it.

## The command

```sh
npm run test:visual
```

That one command does everything: it runs `next build`, serves the build on
port 3100, opens the landing page in a pinned browser at three viewports,
captures a full-page screenshot of each, and diffs it against the baseline
committed in this repo. It needs no dev server running and no environment
variables set.

First run on a new machine, install the browser the pinned Playwright expects:

```sh
npx playwright install --with-deps chromium
```

## What is checked

One screenshot of the whole page per viewport:

| Project | Viewport | Baseline |
| --- | --- | --- |
| `desktop-1440` | 1440×900 | `tests/visual/__screenshots__/desktop-1440/landing.png` |
| `tablet-768` | 768×1024 | `tests/visual/__screenshots__/tablet-768/landing.png` |
| `phone-390` | 390×844 | `tests/visual/__screenshots__/phone-390/landing.png` |

Whole-page rather than per-section, deliberately: section-level baselines would
multiply the files a reviewer has to look at and would still miss the thing most
likely to break, which is the vertical rhythm *between* sections.

Baselines are committed, so a design change shows up as an image diff in the
pull request that causes it. That is the point of checking them in — the review
happens on the picture, not on the CSS.

The projects set a viewport width and nothing else. Device emulation
(`isMobile`, `hasTouch`) is off on purpose: the gate is what the layout does at
a width, and emulation would put a second variable into every diff.

## Reading a failure

```
1966 pixels (ratio 0.01 of all image pixels) are different.
Expected: tests/visual/__screenshots__/desktop-1440/landing.png
Received: test-results/.../landing-actual.png
Diff:     test-results/.../landing-diff.png
```

Open the three images, or `npx playwright show-report` for them side by side
with a slider. A trace is retained for every failure
(`npx playwright show-trace test-results/.../trace.zip`) if the question is
*when* the page looked wrong rather than *how*.

Then decide which of two things happened:

- **A regression.** Fix the page. The baseline was right.
- **An intended design change.** Update the baseline, in the same commit as the
  change that caused it, so the diff is reviewable against its reason.

```sh
npm run test:visual:update
```

Never run that to make a red suite go green. A baseline updated without being
looked at is worse than no baseline: it silently ratifies whatever the code
happened to render.

## Tolerance

`threshold: 0.02` is how far one pixel may drift in YIQ before it counts, and
`maxDiffPixels: 100` is how many may. Both are in `playwright.config.ts`.

Playwright's default threshold of `0.2` was tried first and rejected: it passes
the WhatsApp button being recoloured from `#25D366` to `#22C55E`, which is
precisely the class of regression this suite exists to catch. At `0.02` that
change fails all three viewports by ~1,970 pixels.

On the pinned browser the measured noise between runs is zero — a forced full
regeneration produces byte-identical PNGs — so the tolerance is a hedge against
a browser patch release nudging a glyph, not a working allowance.

## Why it does not flake

Every screenshot goes through `openSettled` in `tests/visual/settle.ts`, which
closes each known source of drift in one place:

- **Network** — every request to anything but the local server is aborted, so a
  CDN cannot decide what the page looks like today. Origins that were turned
  away are attached to the test as a `blocked-external-requests` annotation.
  Today that list is not empty: the pre-redesign page still pulls a stock photo
  from Unsplash behind the Frase section. Issue #4 removes it, after which
  anything appearing in that annotation is itself a regression.
- **Webfonts** — `document.fonts.ready` settles before anything is measured, so
  no shot catches the fallback face. The brand faces are self-hosted
  (`src/app/fonts.ts`), which is what makes this reliable rather than hopeful.
- **Images** — the page is scrolled top to bottom and back first, so
  `loading="lazy"` images commit to a size before the capture reaches them, and
  every `<img>` is awaited to `complete`.
- **Motion** — the browser context forces `prefers-reduced-motion: reduce`, and
  the screenshot itself is taken with `animations: "disabled"`, which
  fast-forwards finite CSS animations and transitions to their end state (and
  resets infinite ones to their start). The reduced-motion setting is
  *asserted* on every run rather than assumed, because a config option that
  quietly stops applying would leave the suite shooting mid-animation.
- **Paint** — two animation frames after all of the above, so the layout the
  browser computed is the layout it has drawn.
- **The server** — a production build, never `next dev`, whose overlay and dev
  indicator would land in the screenshots. Port 3100 rather than 3000, and an
  already-running server is never reused, so a stray dev server cannot be
  mistaken for the build.

The build logs a wall of `[Strapi] Error fetching …` while this runs. That is
expected: no CMS is running locally, every section falls back to its hardcoded
default, and the result is deterministic. Issue #4 removes the CMS layer and the
noise with it.

## Pinning

Baselines are only reproducible against one renderer, so it is pinned:

| | |
| --- | --- |
| `@playwright/test` | `1.62.0`, exact — no caret in `package.json` |
| Browser | bundled Chrome Headless Shell 151.0.7922.34 (Playwright build `chromium-1234`) |
| Platform baselines were taken on | Linux x64 |

The exact version in `package.json` is what pins the browser: Playwright ships a
specific Chromium build per release, so a caret range would let `npm install`
change the renderer underneath the baselines.

Bumping Playwright is therefore a visual change. Expect a diff, review it as
one, and regenerate the baselines in the same commit as the bump.

Running the suite on another OS will also produce diffs — antialiasing differs.
There is deliberately **one** baseline per viewport rather than one per
platform: a second set nobody gates on would rot, and it would leave two
pictures with equal claim to being right. The cost is that
`npm run test:visual:update` on macOS would overwrite the Linux baselines, so
don't commit baselines regenerated anywhere else, and CI — when it exists — has
to run Linux x64.

## Scope

Right now the baselines are of the **pre-redesign** page, and that is
deliberate: the harness (issue #3) had to be proven deterministic before the
redesign (issue #1) started moving underneath it. As the landing page is rebuilt
section by section, each task updates these baselines as part of its own change.

Issue #15 replaces the desktop baseline with one derived from the design mock,
at which point `desktop-1440` becomes the parity gate. The tablet and phone
baselines have no mock behind them; they are signed off by eye against the
responsive rules in issue #1 and are as binding as the desktop one once
committed.
