import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { WHATSAPP_URL } from "@/lib/whatsapp";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="overflow-x-clip">
      <div className="mx-auto grid max-w-295 items-center gap-12 px-5 py-10 md:gap-14 md:px-8 md:py-14 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:pt-19 lg:pb-23">
        <Reveal className="min-w-0">
          <p className="mb-5 font-subtitle text-xs leading-[normal] font-semibold tracking-[.12em] text-ocean-blue uppercase md:mb-6">
            Psicóloga clínica · CRP 06/200958
          </p>

          <h1
            id="hero-heading"
            className="mb-5.5 text-balance font-display text-[36px] leading-[1.03] font-medium text-navy-deep md:mb-6 md:text-[44px] lg:mb-6.5 lg:text-[56px] min-[73.75rem]:text-[64px]"
          >
            Espaço para sentir.
            <br />
            <span className="text-ocean-blue">Liberdade para ser.</span>
          </h1>

          <p className="mb-7 max-w-none text-[18px] leading-[1.65] text-ocean-blue md:mb-8 lg:mb-8.5 lg:max-w-117.5">
            Um espaço seguro para acolher suas vulnerabilidades e reencontrar
            seus valores e, no seu tempo, seguir na direção do que realmente
            importa.
          </p>

          <div className="mb-7.5 flex flex-col gap-3.5 md:flex-row md:flex-wrap">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-ocean-blue px-7.5 py-3.75 text-[15px] leading-[normal] font-medium text-cream hover:bg-ocean-blue-hover md:w-auto"
            >
              Agendar pelo WhatsApp
            </a>
            <a
              href="#servicos"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-ocean-blue bg-transparent px-7.5 py-3.75 text-[15px] leading-[normal] font-medium text-ocean-blue hover:bg-ice-blue hover:text-ocean-blue md:w-auto"
            >
              Conheça os serviços
            </a>
          </div>

          <div className="flex items-center gap-2.25 text-[14px] text-muted-blue">
            <span
              aria-hidden="true"
              className="size-1.75 rounded-full bg-ocean-blue"
            />
            Online e Presencial
          </div>
        </Reveal>

        <Reveal className="relative mx-auto w-full max-w-125 lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute -top-[3.76%] -right-[3.63%] z-0 aspect-square w-[40.33%] rounded-full bg-ice-blue blur-[6px]"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-[3.5%] -left-[5.24%] z-0 aspect-square w-[24.2%] rounded-full bg-warm-sand"
          />

          <div className="relative z-1 overflow-hidden rounded-3xl shadow-[0_20px_48px_rgba(13,42,74,.18)]">
            <Image
              src="/brand/yasmim-retrato-02.jpg"
              alt="Yasmim Bueno"
              width={1365}
              height={2048}
              sizes="(min-width: 1024px) 496px, (min-width: 768px) 500px, calc(100vw - 40px)"
              priority
              className="block h-auto w-full object-contain"
            />
          </div>

          <div className="absolute bottom-[4.84%] -left-[4.04%] z-2 flex aspect-square w-[19.35%] items-center justify-center rounded-full bg-cream shadow-[0_12px_28px_rgba(13,42,74,.16)]">
            <Image
              src="/brand/farol-azul.png"
              alt=""
              width={4354}
              height={4525}
              sizes="(min-width: 1024px) 56px, 12vw"
              className="h-[60.42%] w-auto"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
