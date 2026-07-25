"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

/**
 * The mock's observer. A target counts as arrived when 12% of it is in view,
 * measured against a viewport shortened by 8% at the bottom, so nothing
 * reveals while it is still a sliver at the fold.
 */
const OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0.12,
  rootMargin: "0px 0px -8% 0px",
};

/**
 * Blanket fallback, counted from hydration. Whatever becomes of the observer —
 * unsupported, blocked, or never firing for a target the layout left where it
 * cannot see it — no content waits longer than this. Its one gap is the mock's
 * too: nothing reveals if the JavaScript never arrives at all.
 */
const FALLBACK_MS = 1400;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * The visitor's motion preference, read the way React wants an external store
 * read: the server and the hydrating client both assume motion is fine, and
 * the first commit corrects it. Assuming it in the other direction would flash
 * revealed content at everyone else.
 */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCED_MOTION);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

/**
 * Fades its children up as they scroll into view, once.
 *
 * Wrap a reveal target from the mock in this and give it the target's own
 * layout classes — `Reveal` renders the element itself rather than an extra
 * wrapper, so it can be the grid or the flex container without adding a box to
 * the layout.
 *
 * The motion is the mock's, to the parameter: the offset, the timing function
 * and the transition live in `globals.css` beside the rest of the mock's
 * global rules, keyed off the `data-revealed` attribute this component sets.
 *
 * Two things the mock does not have, both required:
 *
 * 1. Under `prefers-reduced-motion: reduce` the content is revealed from the
 *    first paint and never transitions. The stylesheet is what guarantees
 *    that — it holds even if this component never hydrates.
 * 2. `data-revealed` publishes whether the content has arrived at its final
 *    state, so the visual suite waits on the animation instead of sleeping
 *    past it.
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const target = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [inView, setInView] = useState(false);

  /* Reduced motion is already revealed in CSS; say so, so a waiter can tell. */
  const revealed = inView || prefersReducedMotion;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const node = target.current;
    if (!node) return;

    const fallback = window.setTimeout(() => setInView(true), FALLBACK_MS);

    if (!("IntersectionObserver" in window)) {
      return () => window.clearTimeout(fallback);
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        /* Revealed once and left alone: scrolling back up re-animates nothing. */
        observer.unobserve(entry.target);
        window.clearTimeout(fallback);
        setInView(true);
      }
    }, OBSERVER_OPTIONS);

    observer.observe(node);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

  return (
    <div ref={target} data-revealed={revealed} className={className}>
      {children}
    </div>
  );
}
