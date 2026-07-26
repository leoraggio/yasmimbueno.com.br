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
committed in this repo. It also runs the structural assertions below. It needs
no dev server running and no environment variables set.

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

## What else is checked

A screenshot freezes a layout without saying what is right about it, and it
photographs a page that scrolls sideways as happily as one that does not. So a
fourth project, `structure`, runs the assertions a picture cannot make
(`tests/visual/structure.spec.ts`):

| Assertion | Why it is here |
| --- | --- |
| The document does not scroll sideways at 1440, 1024, 768, 414, 390 and 360 | The most likely responsive regression, and the one a full-page screenshot hides. The hero's absolutely positioned circles are the known risk |
| The page requests nothing from off the machine | Determinism. A page that reaches the network is a page whose pixels someone else gets a vote on |
| The floating WhatsApp button carries the drafted wa.me URL and opens in a new tab | Every CTA is meant to lead to the same conversation; a screenshot cannot read an `href` |
| Every wa.me link on the page carries that same URL and target | The same, held to every CTA as the sections that carry one land |
| The hero exposes its headline, registration, availability, portrait, WhatsApp target and services target | The pixels cannot prove copy, accessible names or link destinations |
| At 390 the hero keeps copy before the portrait and stacks equal-width actions, primary first | The authored phone composition should stay intact as later sections lengthen the page |
| At 1024 the hero headline keeps its designed two lines | The narrowest desktop grid must not turn its two explicit lines into four |
| The Sobre section exposes its exact clinical introduction, emphasized therapy names, credentials and specialization chips | The pixels cannot prove exact copy, emphasis or the non-breaking spaces that bind chip names to their attributions |
| At 390 the Sobre portrait and frame stay aligned, the portrait leads without exceeding its cap, credentials stack label-over-value and the divider farol is 84px | Responsive order and hard dimensions are more precise as measurements than visual estimates |
| The Abordagem section exposes its exact framing and clinical copy, both expanded approach names and all seven skill chips | The pixels cannot prove the clinical language is verbatim or that the visual labels have useful heading and list semantics |
| The lockup points at `#top`, and `#top` exists | The one anchor the nav owns. The four section links deliberately dangle until their sections land |
| At 1024 the link row is in the bar; below it the row is hidden, the menu control is there, and the logo and booking pill are still visible | The collapse rule is prose in issue #1 rather than something the mock drew, so it is asserted rather than left to the phone baseline to ratify |
| The menu panel opens on the control, closes on a link and on Escape, and Escape returns focus to the control | Behaviour a picture cannot show at all |
| The page behind the open panel does not scroll, and scrolls again once it closes | Both halves matter: the second is what stops the first passing because nothing scrolled either way |
| Every visible link and button is at least 44×44 at 390 wide, panel open and closed | The touch-target floor, checked where it applies |

It is a project rather than another spec in the viewport projects because each
of its tests sets the width it cares about — without the split it would run
three times over for nothing. That is what the `testMatch` in
`playwright.config.ts` is doing.

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
  That list is now empty and the `structure` project asserts it stays that way,
  so anything appearing in the annotation is itself a regression.
- **Webfonts** — `document.fonts.ready` settles before anything is measured, so
  no shot catches the fallback face. The brand faces are self-hosted
  (`src/app/fonts.ts`), which is what makes this reliable rather than hopeful.
- **Images** — the page is scrolled top to bottom and back first, so
  `loading="lazy"` images commit to a size before the capture reaches them, and
  every `<img>` is awaited to `complete`.
- **The reveal animation** — `Reveal` publishes `data-revealed="true"` once its
  content has arrived at its final state, and every screenshot waits for every
  wrapper on the page to say so. Waiting on the animation rather than sleeping
  past it is why the suite has no arbitrary timeouts in it.
- **Motion** — the browser context forces `prefers-reduced-motion: reduce`, and
  the screenshot itself is taken with `animations: "disabled"`, which
  fast-forwards finite CSS animations and transitions to their end state (and
  resets infinite ones to their start). The reduced-motion setting is
  *asserted* on every run rather than assumed, because a config option that
  quietly stops applying would leave the suite shooting mid-animation. That is
  not a hypothetical: `use: { reducedMotion }` is silently ignored by this
  Playwright version, and only `contextOptions` takes effect.
- **Paint** — two animation frames after all of the above, so the layout the
  browser computed is the layout it has drawn.
- **The server** — a production build, never `next dev`, whose overlay and dev
  indicator would land in the screenshots. Port 3100 rather than 3000, and an
  already-running server is never reused, so a stray dev server cannot be
  mistaken for the build.

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

Right now the baselines cover the shell and the first rebuilt page sections:
the floating WhatsApp control (issue #4), nav (issue #5), Hero (issue #6),
Sobre with its farol divider (issue #7), and Abordagem (issue #8). As the
landing page is rebuilt section by section, each task updates these baselines as
part of its own change, and the picture fills in.

Issue #15 replaces the desktop baseline with one derived from the design mock,
at which point `desktop-1440` becomes the parity gate. The tablet and phone
baselines have no mock behind them; they are signed off by eye against the
responsive rules in issue #1 and are as binding as the desktop one once
committed.
