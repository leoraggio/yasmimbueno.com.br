"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The collapsed nav's menu control and the panel it opens.
 *
 * Only this much of the nav is a client component. The bar itself — logo,
 * links, booking pill — is server-rendered by `Nav`; what needs JavaScript is
 * the open/closed state and the three things that have to happen around it:
 * Escape, the scroll lock, and a viewport that widens past the breakpoint
 * while the panel is open.
 *
 * The panel deliberately traps nothing. It is four links under a bar the
 * visitor can still see, not a modal, and a trap would be a worse experience
 * than the one it protects against.
 */

/**
 * One nav per page, so the panel can carry a fixed id rather than a generated
 * one. The control points at it only while it is open: `aria-controls` naming
 * an element that is not in the document is a broken reference, and the panel
 * does not exist until it is opened.
 */
const PANEL_ID = "nav-menu-panel";

/**
 * Tailwind's `lg`, in the same unit Tailwind uses. Expressed in rem rather
 * than the equivalent 1024px so that a visitor who has enlarged their default
 * text size cannot land between this query and the `lg:` utilities — the panel
 * would then be hidden by CSS while its state, and its scroll lock, stayed on.
 */
const DESKTOP = "(min-width: 64rem)";

export function NavMenu({
  links,
}: {
  links: readonly { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const control = useRef<HTMLButtonElement>(null);

  /*
   * Escape closes the panel and hands focus back to the control that opened
   * it — otherwise focus is left on an element that no longer exists and a
   * keyboard visitor restarts from the top of the document.
   */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      setOpen(false);
      control.current?.focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  /*
   * The page behind the panel holds still. `overflow` on the body is what the
   * viewport picks up while the root element's own overflow is visible, and
   * the padding compensates for the scrollbar that hiding it removes — without
   * that, opening the menu shifts the whole page sideways by a scrollbar's
   * width on any pointer device narrow enough to see the panel at all.
   *
   * The padding holds the document still, not the viewport, so a `fixed`
   * element — the floating WhatsApp button — still moves with the edge it is
   * anchored to. Holding the text someone is reading still is worth more than
   * holding one button still, and the alternatives cost more than the defect:
   * `scrollbar-gutter: stable` would reserve a gutter the mock does not have.
   */
  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const restore = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };

    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      body.style.overflow = restore.overflow;
      body.style.paddingRight = restore.paddingRight;
    };
  }, [open]);

  /*
   * Widening past the breakpoint hides the panel in CSS but would leave the
   * state — and the scroll lock above — behind, so the page would stop
   * scrolling for no visible reason. Closing on the media query keeps the two
   * in step.
   */
  useEffect(() => {
    if (!open) return;

    const desktop = window.matchMedia(DESKTOP);

    const onChange = () => {
      if (desktop.matches) setOpen(false);
    };

    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, [open]);

  return (
    <>
      {/*
       * The accessible name stays "Menu" in both states; `aria-expanded` is
       * what says which one it is in. A name that changes with state is read
       * as a different control each time it is pressed.
       *
       * The negative margin pulls the 44px target's edge into the gutter so
       * that the glyph inside it, not the padding around it, lines up with
       * the container.
       */}
      <button
        ref={control}
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        aria-controls={open ? PANEL_ID : undefined}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        className="-mr-3 flex h-11 w-11 items-center justify-center text-navy-deep hover:text-ocean-blue lg:hidden"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <>
              <path d="M5 5l10 10" />
              <path d="M15 5l-10 10" />
            </>
          ) : (
            <>
              <path d="M3 6h14" />
              <path d="M3 10h14" />
              <path d="M3 14h14" />
            </>
          )}
        </svg>
      </button>

      {/*
       * Rendered only while open, rather than hidden in place: a second copy
       * of every section link sitting permanently in the document would be
       * one more thing for a screen reader to walk past, and it would make
       * "the links are hidden below 1024" ambiguous.
       *
       * Absolute rather than in flow, against the sticky header as its
       * containing block, so opening the menu overlays the page instead of
       * pushing it down. Same translucent cream and blur as the bar, so the
       * panel reads as a drawer of the same surface.
       *
       * `mt-px` is what keeps the bar's hairline: `top: 100%` resolves against
       * the containing block's *padding* box, so `top-full` alone would lay
       * the panel over the header's bottom border and wash it out to almost
       * nothing.
       */}
      {open && (
        <div
          id={PANEL_ID}
          className="absolute inset-x-0 top-full mt-px border-b border-hairline bg-cream/92 backdrop-blur-[8px] lg:hidden"
        >
          <nav aria-label="Seções">
            <ul className="mx-auto flex max-w-[1180px] flex-col px-5 py-2 md:px-8">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[48px] items-center font-subtitle text-[15px] text-navy-deep hover:text-ocean-blue"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
