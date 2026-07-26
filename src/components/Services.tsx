import { Reveal } from "@/components/Reveal";
import { WHATSAPP_URL } from "@/lib/whatsapp";

const SERVICE_GROUPS = [
  {
    id: "services-disorders",
    title: "Transtornos que trato",
    items: [
      "Depressão",
      "Transtorno Bipolar",
      "Transtorno da Personalidade Borderline",
      "Neurodivergência",
    ],
  },
  {
    id: "services-needs",
    title: "Demandas específicas",
    items: [
      "Desregulação emocional",
      "Rigidez Cognitiva",
      "Comportamentos impulsivos",
      "Comportamento suicida e autolesivo",
    ],
  },
] as const;

const THERAPY_STEPS = [
  {
    title: "Chegar",
    description:
      "Do jeito que der. Sem precisar organizar a história antes.",
  },
  {
    title: "Olhar junto",
    description: "Entender padrões, dar nome ao que pesa, sem julgamento.",
  },
  {
    title: "Seguir",
    description:
      "Passos pequenos e reais na direção do que importa para você.",
  },
] as const;

export function Services() {
  return (
    <section
      id="servicos"
      aria-labelledby="services-heading"
      className="mx-auto max-w-295 px-5 py-10 md:px-8 md:py-14 lg:px-10 lg:pt-22 lg:pb-23"
    >
      <Reveal className="mb-10 md:mb-12">
        <p className="mb-3.5 font-subtitle text-xs leading-[normal] font-semibold tracking-[.12em] text-ocean-blue uppercase">
          Terapia individual
        </p>
        <h2
          id="services-heading"
          className="mb-4 font-display text-[38px] leading-[1.12] font-medium text-navy-deep"
        >
          Cada história tem seu nome, e seu ritmo
        </h2>
        <p className="text-[15.5px] leading-[1.65] text-ocean-blue">
          Alguns nomes ajudam a orientar o caminho, mas aqui, você chega antes
          do diagnóstico.
        </p>
      </Reveal>

      <Reveal className="mb-10 grid items-stretch gap-9 md:mb-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
        <div className="flex flex-col gap-9">
          {SERVICE_GROUPS.map(({ id, title, items }) => (
            <div key={id}>
              <h3
                id={id}
                className="mb-1.5 font-display text-[23px] leading-[normal] font-medium text-navy-deep"
              >
                {title}
              </h3>
              <ol aria-labelledby={id} className="flex flex-col">
                {items.map((item, index) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-3.5 border-b border-hairline py-3.25 last:border-b-0"
                  >
                    <span className="w-5.5 shrink-0 font-subtitle text-[11px] leading-[normal] font-semibold text-slate-blue">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 text-[15.5px] leading-normal text-navy-deep">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <aside className="flex flex-col rounded-3xl bg-navy-deep px-6 py-8 md:px-9 md:py-8.5">
          <p className="mb-6.5 text-[15px] leading-[1.65] text-slate-blue">
            E costuma acontecer assim:
          </p>
          <ol className="flex flex-col gap-6 border-l border-mist-blue/30 pl-6">
            {THERAPY_STEPS.map(({ title, description }) => (
              <li key={title} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute top-1.75 -left-7 size-2 rounded-full bg-slate-blue"
                />
                <h4 className="mb-1 font-display text-xl leading-[normal] font-medium text-cream">
                  {title}
                </h4>
                <p className="text-[13.5px] leading-[1.58] text-mist-blue">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </aside>
      </Reveal>

      <Reveal className="flex flex-col items-center gap-4.5 rounded-[28px] bg-ice-blue px-6 py-8 text-center md:px-11 md:py-10">
        <p className="font-display text-2xl/tight font-medium text-balance text-navy-deep">
          Espaço para sentir. Liberdade para ser.
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-navy-deep px-8 py-3.75 text-[14.5px] leading-[normal] font-medium text-cream hover:bg-navy-deep-hover md:w-auto"
        >
          Começar essa conversa
        </a>
      </Reveal>
    </section>
  );
}
