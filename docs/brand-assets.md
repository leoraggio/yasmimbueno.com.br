# Brand assets

Where the binary files in `src/fonts/` and `public/brand/` come from, and why
they live in this repo rather than behind a CDN.

## Source of truth

| | |
| --- | --- |
| Landing mock | `Yasmim Bueno - Landing.dc.html` in Claude Design project `3fcc53e6-3912-467a-87dc-ec62cc0b16c0` |
| Design system | `Yasmim Bueno Design System`, project `a5fd8b71-1e47-44e1-a031-0202f7b8b9c9` |
| Access | the `claude_design` MCP (`https://api.anthropic.com/v1/design/mcp`), auth via `/design-login` |

The mock is normative. The other files in that project (`Landing Revamp`,
`Divider Options`, `Footer Options`, `Metodologia Options`, `Servicos Options`,
`Transtornos Options`) are exploration and implement nothing.

## Why everything is self-hosted

- **Recline is licensed and has no CDN.** Its licence has been confirmed to
  cover web use on this domain. If it fails to load, every display heading
  falls back to a generic serif and the page is wrong.
- **The visual regression suite diffs rendered pixels.** A font arriving over
  the network is a font that can arrive late, differently, or not at all. The
  page must make no external requests.

## Fonts — `src/fonts/`

Loaded through `next/font/local` in `src/app/fonts.ts`, which fingerprints them
into the build output and emits `font-display: swap` plus preload links.

| File | Weight | Origin |
| --- | --- | --- |
| `Recline-Regular.woff2` | 400 | design system `fonts/` |
| `Recline-Medium.woff2` | 500 | design system `fonts/` |
| `Recline-Bold.woff2` | 700 | design system `fonts/` |
| `Comfortaa-Regular.ttf` | 400 | design system `fonts/` |
| `Comfortaa-Medium.ttf` | 500 | design system `fonts/` |
| `Comfortaa-SemiBold.ttf` | 600 | design system `fonts/` |
| `SpaceGrotesk-Medium.ttf` | 500 | design system `fonts/` |
| `SpaceGrotesk-Regular.ttf` | 400 | Google Fonts — see below |

Two deliberate departures from a literal copy of the design system:

1. **Space Grotesk Regular does not exist in the design system.** Its
   `tokens/fonts.css` self-hosts only the Medium and `@import`s weights
   400/600/700 from Google Fonts at runtime — exactly what this site may not
   do. 400 is the most-used weight on the page, so the static instance is
   vendored here instead (SIL Open Font Licence, `SpaceGrotesk-OFL.txt`). 600
   and 700 are not vendored: the mock never uses them.
2. **Recline ships as `.woff2` only**, not the `.woff` twins that sit beside it
   in the design system. `next/font/local` emits one `@font-face` per `src`
   entry with no format fallback list, so declaring both would preload each
   weight twice. `woff2` covers every browser this app targets.

Recline has no italic file, in the design system or here. The Hayes blockquote
asks for italic Recline, so the browser synthesises an oblique — the mock does
the same, so parity holds.

## Images — `public/brand/`

Copied verbatim from the design project's `assets/`, keeping the mock's
filenames so a reference in the mock reads straight across.

| File | Intrinsic size | Used by |
| --- | --- | --- |
| `farol-azul.png` | 4354 × 4525 | hero badge |
| `farol-branco.png` | 4354 × 4525 | farol divider, Frase section |
| `logo-horizontal-azul-escuro.png` | 4437 × 1720 | nav |
| `logo-horizontal-branco.png` | 4437 × 1720 | footer |
| `yasmim-retrato-01.jpg` | 1365 × 2048 | Sobre |
| `yasmim-retrato-02.jpg` | 1365 × 2048 | hero |

These are print-resolution masters — the farol marks are 4354px wide to render
at 120px. That is fine as a *source*: `next/image` re-encodes and downscales at
build time, and the originals never reach the browser. It does put ~4.6 MB in
git. Committing the masters is the deliberate choice, so that a future layout
can ask for a larger render without a round trip to the design project.

## Design tokens

The palette lives in `src/app/globals.css` as a Tailwind `@theme` block, which
emits each colour as a `:root` custom property *and* generates the matching
utilities. Names follow the design system's `tokens/colors.css`; the handful of
literals the mock uses that the token file does not carry are named for the job
they do. Change a brand colour there and nowhere else.
