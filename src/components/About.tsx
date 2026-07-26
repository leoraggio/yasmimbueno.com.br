import Image from "next/image";
import { Reveal } from "@/components/Reveal";

const SPECIALIZATIONS = [
  {
    name: "Terapia de Aceitação e Compromisso",
    attribution: "· Dr. Steven C. Hayes (Artmed)",
  },
  {
    name: "Terapia Comportamental Dialética",
    attribution: "· Por dentro da DBT",
  },
  {
    name: "Psicoterapia da Depressão e do Transtorno Bipolar",
    attribution: "· Curt Hemanny",
  },
  {
    name: "Psicoterapias para Prevenção do Suicídio",
    attribution: "· Craig Bryan (USP)",
  },
] as const;

export function About() {
  return (
    <section
      id="sobre"
      aria-labelledby="about-heading"
      className="w-full bg-navy-deep"
    >
      <Reveal className="mx-auto grid max-w-295 items-center gap-12 px-5 pt-10 pb-18 md:px-8 md:pb-20 lg:grid-cols-[.82fr_1.18fr] lg:gap-15 lg:px-10 lg:pb-24">
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-3xl border border-slate-blue/50"
          />
          <div className="relative z-1 h-[min(112vw,28rem)] overflow-hidden rounded-3xl shadow-[0_16px_40px_rgba(13,42,74,.16)] lg:h-auto">
            <Image
              src="/brand/yasmim-retrato-01.jpg"
              alt="Yasmim Bueno"
              width={1365}
              height={2048}
              sizes="(min-width: 1024px) 426px, (min-width: 768px) 512px, calc(100vw - 40px)"
              className="block size-full object-cover object-[center_32%] lg:h-auto lg:object-contain"
            />
          </div>
        </div>

        <div>
          <p className="mb-4 font-subtitle text-xs leading-[normal] font-semibold tracking-[.12em] text-slate-blue uppercase">
            Sobre
          </p>
          <h2
            id="about-heading"
            className="mb-5.5 font-display text-[38px] leading-[1.08] font-medium text-cream md:text-[42px]"
          >
            Olá, sou a Yasmim.
          </h2>
          <p className="mb-4 text-[16.5px] leading-[1.72] text-ice-blue">
            Sou psicóloga, pós-graduada em Psicologia Clínica pela PUC-RS e
            especializada em Terapias Contextuais. Acredito que a terapia é um
            espaço de acolhimento e transformação. Atendo adultos que vivem
            emoções intensas, momentos de crise ou oscilações de humor, que têm
            desafios de atenção e foco ou dificuldade em gerenciar a rotina, e
            mulheres que enfrentam sobrecarga e autocobrança no dia a dia.
          </p>
          <p className="mb-6.5 text-[16.5px] leading-[1.72] text-ice-blue">
            Dedico meu aprimoramento contínuo à{" "}
            <em className="text-cream">
              Terapia de Aceitação e Compromisso (ACT)
            </em>{" "}
            e à{" "}
            <em className="text-cream">
              Terapia Comportamental Dialética (DBT)
            </em>
            . São abordagens que unem aceitação e mudança: em vez de lutar
            contra o que você sente, desenvolvemos habilidades para lidar com
            as emoções e agir na direção dos seus valores, construindo uma vida
            que vale a pena ser vivida.
          </p>

          <dl className="grid gap-x-5.5 gap-y-2 border-t border-slate-blue/28 pt-6 lg:grid-cols-[auto_1fr] lg:gap-y-5.5">
            <dt className="pt-0.5 font-subtitle text-[11px] leading-[normal] font-semibold tracking-widest text-cream uppercase">
              Formação
            </dt>
            <dd className="text-[13.5px] leading-normal text-slate-blue">
              <span className="block">
                Pós Graduação em Psicologia Clínica · PUC-RS
              </span>
              <span className="block">
                Pós Graduação em Terapias Contextuais · Wainer
              </span>
            </dd>

            <dt className="mt-3 pt-2 font-subtitle text-[11px] leading-[normal] font-semibold tracking-widest text-cream uppercase lg:mt-0">
              Especializações
            </dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {SPECIALIZATIONS.map(({ name, attribution }) => (
                  <li
                    key={name}
                    className="rounded-full border border-slate-blue/40 px-3.5 py-1.5 text-[12.5px] leading-[normal] text-ice-blue"
                  >
                    {name}{"\u00a0"}
                    <span className="text-[13.5px] text-slate-blue">
                      {attribution}
                    </span>
                  </li>
                ))}
              </ul>
            </dd>
          </dl>
        </div>
      </Reveal>
    </section>
  );
}
