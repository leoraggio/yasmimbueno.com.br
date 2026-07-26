import Image from "next/image";

import { Reveal } from "@/components/Reveal";
import { WHATSAPP_URL } from "@/lib/whatsapp";

export function ContactFooter() {
  return (
    <footer id="contato" className="mt-24 bg-navy-deep px-5 pt-10 md:px-8 md:pt-14 lg:px-14 lg:pt-19">
      <Reveal className="mx-auto max-w-295 text-center">
        <Image
          src="/brand/logo-horizontal-branco.png"
          alt="Yasmim Bueno"
          width={4437}
          height={1720}
          sizes="114px"
          className="mx-auto mb-6 h-11 w-auto"
        />
        <h2 className="mb-3.5 font-display text-[38px] leading-[1.12] font-medium text-cream">
          Entre em contato
        </h2>
        <p className="mx-auto mb-7.5 max-w-130 text-base leading-[1.65] text-mist-blue">
          Escolha o canal que for mais confortável para você, no seu tempo.
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="mb-13 inline-flex min-h-11 items-center rounded-full bg-cream px-8.5 py-4 text-[15px] leading-[normal] font-medium text-navy-deep hover:bg-ice-blue hover:text-navy-deep"
        >
          Agendar pelo WhatsApp
        </a>

        <div className="grid gap-6 border-t border-cream/12 py-8 lg:grid-cols-3 lg:pb-9">
          <div>
            <p className="mb-2.5 font-subtitle text-[11px] leading-[normal] font-semibold tracking-widest text-slate-blue uppercase">
              Consultório
            </p>
            <address className="text-sm leading-[1.6] text-frost-blue not-italic">
              <span className="block">Alameda Grajaú, 98, 18º andar</span>
              <span className="block">Alphaville · Barueri, SP</span>
            </address>
          </div>
          <div>
            <p className="mb-2.5 font-subtitle text-[11px] leading-[normal] font-semibold tracking-widest text-slate-blue uppercase">
              E-mail
            </p>
            <a
              href="mailto:contato@yasmimbueno.com.br"
              className="inline-flex min-h-11 items-center text-sm leading-[normal] text-frost-blue hover:text-white lg:min-h-0"
            >
              contato@yasmimbueno.com.br
            </a>
          </div>
          <div>
            <p className="mb-2.5 font-subtitle text-[11px] leading-[normal] font-semibold tracking-widest text-slate-blue uppercase">
              Telefone
            </p>
            <a
              href="tel:+5511943046621"
              className="inline-flex min-h-11 items-center text-sm leading-[normal] text-frost-blue hover:text-white lg:min-h-0"
            >
              (11) 94304-6621
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 border-t border-cream/12 py-5 text-center lg:flex-row lg:justify-between lg:gap-4 lg:pb-6.5 lg:text-left">
          <span className="text-[13px] leading-[normal] text-steel-blue">
            © 2026 Yasmim Bueno · Psicóloga Clínica · CRP 06/200958
          </span>
          <div className="flex gap-2 lg:gap-3">
            <a
              href="https://instagram.com/yasmimbueno.psi"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="group flex size-11 items-center justify-center text-cream hover:text-cream lg:size-10"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-cream/8 group-hover:bg-ocean-blue">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </span>
            </a>
            <a
              href="https://linkedin.com/in/yasmim-bueno-720720187"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="group flex size-11 items-center justify-center text-cream hover:text-cream lg:size-10"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-cream/8 group-hover:bg-ocean-blue">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
