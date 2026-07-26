import Image from "next/image";
import { NavMenu } from "@/components/NavMenu";
import { WHATSAPP_URL } from "@/lib/whatsapp";

/**
 * The sticky bar at the top of the page.
 *
 * Desktop is the mock, to the pixel: a translucent cream bar over an 8px blur,
 * hairline underneath, the dark lockup on the left, and — as one group on the
 * right, 30px apart — the four section links and the booking pill.
 *
 * Below `lg` there is no mock, so the rule from the spec is what shapes it:
 * the link row collapses behind a menu control, and the logo and the booking
 * pill **stay in the bar**. The pill is the page's primary action — most of
 * Yasmim's traffic arrives on a phone from an Instagram bio link — and it is
 * never one tap further away than it has to be.
 *
 * Everything but the menu control is server-rendered; see `NavMenu`.
 *
 * `leading-[normal]` on the links and the pill is not decoration: the mock sets
 * their type with the `font:` shorthand, which resets line-height to `normal`,
 * and neither declares one. Tailwind's preflight would otherwise apply 1.5 and
 * make the pill — and with it the whole bar — 3px too tall.
 */

/**
 * The mock's order, which is not the page's — the page runs Sobre, Abordagem,
 * Serviços, and the bar runs Sobre, Serviços, Abordagem. Passed to `NavMenu`
 * rather than shared through a module so there is one list, in the component
 * the list belongs to.
 *
 * None of these anchors resolve yet; their sections land in later tickets.
 */
const SECTION_LINKS = [
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#abordagem", label: "Abordagem" },
  { href: "#duvidas", label: "Dúvidas" },
];

export function Nav() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-hairline bg-cream/92 backdrop-blur-[8px]">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-3 px-5 py-3 md:px-8 md:py-[18px] lg:px-10">
          {/*
           * Intrinsic dimensions are the master's, so the box reserves the
           * right shape while it loads; `sizes` is what keeps a 4437px-wide
           * print master from being served to render a 98px logo.
           *
           * The aspect ratio is stated rather than inherited because it is
           * what the mock's `height:38px` resolves its width against. Left to
           * itself the box would take the ratio of whichever downscaled asset
           * the browser chose, whose integer height rounds it — 97.3px wide
           * instead of the mock's 98.03, and every glyph inside it half a
           * percent off.
           */}
          <a href="#top" className="flex min-h-[44px] items-center lg:min-h-0">
            <Image
              src="/brand/logo-horizontal-azul-escuro.png"
              alt="Yasmim Bueno"
              width={4437}
              height={1720}
              sizes="98px"
              priority
              className="aspect-[4437/1720] h-[30px] w-auto md:h-[38px]"
            />
          </a>

          {/*
           * Links and pill are one group, as in the mock: the links sit beside
           * the pill at the right-hand end of the bar, not spread across the
           * middle. Below `lg` the group is the pill and the menu control, and
           * the 30px that separates the mock's items is too much between two
           * touch targets.
           */}
          <div className="flex items-center gap-1 md:gap-2 lg:gap-[30px]">
            <nav aria-label="Seções" className="hidden lg:block">
              <ul className="flex items-center gap-[30px]">
                {SECTION_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="font-subtitle text-[13px] leading-[normal] text-navy-deep hover:text-ocean-blue"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/*
             * `min-h` only below `lg`: 11px of padding around 14px type is the
             * mock's pill and comes to about 40px tall, which is a fine mouse
             * target and a poor thumb one. Touch widths get the 44px floor,
             * the desktop keeps the mock.
             */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-ocean-blue px-4 py-[11px] text-[14px] leading-[normal] font-medium whitespace-nowrap text-cream hover:bg-ocean-blue-hover md:px-[22px] lg:min-h-0"
            >
              Agendar Atendimento
            </a>

            <NavMenu links={SECTION_LINKS} />
          </div>
        </div>
      </header>

      {/*
       * The mock's own target for the lockup, and the reason the lockup can be
       * a link at all: the bar is sticky, so pointing it at the header would
       * scroll to an element that is already in view and go nowhere.
       */}
      <span id="top" />
    </>
  );
}
