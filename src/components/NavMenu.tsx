"use client";

import { useEffect, useRef, useState } from "react";

// Nav is rendered once per page, so a fixed panel id is safe.
const PANEL_ID = "nav-menu-panel";

// Match Tailwind's rem-based `lg` query so CSS and JavaScript cannot drift when
// the visitor changes their default text size.
const DESKTOP = "(min-width: 64rem)";

// This disclosure is not modal; the visible bar remains usable without a
// focus trap.
export function NavMenu({
  links,
}: {
  links: readonly { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const control = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const restore = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };

    body.style.overflow = "hidden";
    // Compensate for the removed scrollbar so the document does not shift.
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      body.style.overflow = restore.overflow;
      body.style.paddingRight = restore.paddingRight;
    };
  }, [open]);

  // CSS hides the panel at `lg`; also clear its state to release the scroll
  // lock.
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
      {/* Keep the name stable across icon swaps; aria-expanded communicates
          state. The negative margin aligns the icon without shrinking its
          44px target. aria-controls is omitted while its target is unmounted. */}
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

      {/* `mt-px` keeps the panel from covering the header's bottom border. */}
      {open && (
        <div
          id={PANEL_ID}
          className="absolute inset-x-0 top-full mt-px border-b border-hairline bg-cream/92 backdrop-blur-sm lg:hidden"
        >
          <nav aria-label="Seções">
            <ul className="mx-auto flex max-w-295 flex-col px-5 py-2 md:px-8">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center font-subtitle text-[15px] text-navy-deep hover:text-ocean-blue"
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
