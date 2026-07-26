import Image from "next/image";
import { NavMenu } from "@/components/NavMenu";
import { WHATSAPP_URL } from "@/lib/whatsapp";

// These anchors resolve when their landing-page sections ship.
const SECTION_LINKS = [
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#abordagem", label: "Abordagem" },
  { href: "#duvidas", label: "Dúvidas" },
];

export function Nav() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-hairline bg-cream/92 backdrop-blur-sm">
        <div className="mx-auto flex max-w-295 items-center justify-between gap-3 px-5 py-3 md:px-8 md:py-4.5 lg:px-10">
          {/* Override the loaded candidate's rounded natural ratio so the 38px
              logo keeps the mock's 98.03px master width. */}
          <a href="#top" className="flex min-h-11 items-center lg:min-h-0">
            <Image
              src="/brand/logo-horizontal-azul-escuro.png"
              alt="Yasmim Bueno"
              width={4437}
              height={1720}
              sizes="98px"
              priority
              className="aspect-4437/1720 h-7.5 w-auto md:h-9.5"
            />
          </a>

          {/* The mock's font shorthand resets line-height to normal; Tailwind's
              default would make the bar 3px too tall. */}
          <div className="flex items-center gap-1 md:gap-2 lg:gap-7.5">
            <nav aria-label="Seções" className="hidden lg:block">
              <ul className="flex items-center gap-7.5">
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

            {/* Collapsed widths need a 44px touch target; desktop keeps the
                mock's shorter pill. */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-ocean-blue px-4 py-2.75 text-[14px] leading-[normal] font-medium whitespace-nowrap text-cream hover:bg-ocean-blue-hover md:px-5.5 lg:min-h-0"
            >
              Agendar Atendimento
            </a>

            <NavMenu links={SECTION_LINKS} />
          </div>
        </div>
      </header>

      {/* A target below the sticky header lets the lockup actually scroll. */}
      <span id="top" />
    </>
  );
}
