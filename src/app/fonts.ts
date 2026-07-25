import localFont from "next/font/local";

/**
 * Brand typefaces, self-hosted from `src/fonts`.
 *
 * Nothing here may be fetched from Google Fonts or any other host at runtime:
 * Recline is a licensed face with no CDN to fall back to, and the visual
 * regression baselines have to render identically without a network.
 *
 * See `docs/brand-assets.md` for where each file comes from.
 */

/** Display face — headings, the acronyms, the Hayes blockquote. */
const recline = localFont({
  src: [
    { path: "../fonts/Recline-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Recline-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Recline-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-recline",
  display: "swap",
});

/** Subtitle face — eyebrows, nav links, field labels, the list numbers. */
const comfortaa = localFont({
  src: [
    { path: "../fonts/Comfortaa-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Comfortaa-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/Comfortaa-SemiBold.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-comfortaa",
  display: "swap",
});

/** Body face — everything the other two don't cover. */
const spaceGrotesk = localFont({
  src: [
    { path: "../fonts/SpaceGrotesk-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/SpaceGrotesk-Medium.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-space-grotesk",
  display: "swap",
});

/**
 * Every brand font variable, for the `<html>` class list — not `<body>`.
 * `globals.css` declares `--font-display`/`--font-subtitle`/`--font-body` at
 * `:root`, and a `var()` inside a custom property resolves where that property
 * is declared, so `:root` is where these have to be visible.
 */
export const brandFontVariables = [
  recline.variable,
  comfortaa.variable,
  spaceGrotesk.variable,
].join(" ");
