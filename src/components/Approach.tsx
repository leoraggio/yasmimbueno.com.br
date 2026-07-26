import { Reveal } from "@/components/Reveal";

const APPROACHES = [
  {
    acronym: "ACT",
    name: "Terapia de Aceitação e Compromisso",
    description:
      "Aqui, o objetivo não é eliminar a dor, mas mudar a relação com ela. Você aprende a dar espaço ao que sente e a se guiar pelos seus valores, como um farol que orienta, mesmo em mar agitado.",
    skills: ["Aceitação", "Valores", "Ação com compromisso"],
  },
  {
    acronym: "DBT",
    name: "Terapia Comportamental Dialética",
    description:
      "Para emoções que chegam como ondas grandes demais. A DBT oferece ferramentas práticas para atravessar crises, reduzir comportamentos impulsivos e construir relações mais estáveis.",
    skills: [
      "Atenção plena",
      "Regulação emocional",
      "Tolerância ao mal-estar",
      "Efetividade interpessoal",
    ],
  },
] as const;

export function Approach() {
  return (
    <section
      id="abordagem"
      aria-labelledby="approach-heading"
      className="w-full bg-navy-deep"
    >
      <Reveal className="mx-auto grid max-w-295 items-start gap-12 px-5 py-16 md:px-8 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-16 lg:px-10 lg:pt-22 lg:pb-23">
        <div>
          <p className="mb-4 font-subtitle text-xs leading-[normal] font-semibold tracking-[.12em] text-slate-blue uppercase">
            Minha metodologia
          </p>
          <h2
            id="approach-heading"
            className="mb-4.5 font-display text-[38px] leading-[1.12] font-medium text-cream"
          >
            Entre aceitar e mudar, existe um caminho
          </h2>
          <p className="text-[15px] leading-[1.7] text-mist-blue">
            A vida não para enquanto você resolve seus problemas: ela acontece
            com eles. Por isso trabalho com duas abordagens que se complementam:
            uma ensina a acolher, a outra ensina a agir.
          </p>
        </div>

        <div>
          {APPROACHES.map(({ acronym, name, description, skills }) => (
            <article
              key={acronym}
              className="border-t border-slate-blue/28 pt-7.5 pb-8 last:pb-2"
            >
              <h3 className="mb-3 flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
                <span className="font-display text-[26px] leading-[normal] font-medium text-cream">
                  {acronym}
                </span>
                <span className="shrink-0 font-subtitle text-[11px] leading-[normal] font-semibold tracking-widest text-slate-blue uppercase">
                  {name}
                </span>
              </h3>
              <p className="mb-4.5 text-[15px] leading-[1.68] text-ice-blue">
                {description}
              </p>
              <ul className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-slate-blue/40 px-3.5 py-1.5 text-[12.5px] leading-[normal] text-ice-blue"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
