import { Reveal } from "@/components/Reveal";

const FAQ_ITEMS = [
  {
    question: "Quanto tempo dura uma sessão?",
    answer:
      "As sessões individuais duram cerca de 50 minutos, semanalmente.",
  },
  {
    question: "A terapia é confidencial?",
    answer:
      "Sim. O sigilo é um pilar da prática psicológica e está no código de ética profissional. O que conversamos fica entre nós, com as poucas exceções legais que combinamos já no nosso primeiro encontro.",
  },
  {
    question: "Você atende por convênio?",
    answer:
      "Os atendimentos são particulares. Ofereço a nota fiscal e toda a documentação necessária para que você solicite o reembolso junto à sua operadora de saúde.",
  },
  {
    question: "Quanto tempo dura o tratamento",
    answer:
      "A duração varia de pessoa para pessoa, depende da sua demanda, dos seus objetivos terapêuticos e do seu ritmo. Avaliamos juntos, ao longo do caminho, o que faz sentido para você.",
  },
  {
    question: "Qual público você atende?",
    answer:
      "Atendo somente o público adulto. Se você busca atendimento para crianças ou adolescentes, posso indicar colegas de confiança.",
  },
] as const;

export function Faq() {
  return (
    <section
      id="duvidas"
      aria-labelledby="faq-heading"
      className="mx-auto max-w-190 px-5 py-10 md:px-8 md:py-14 lg:px-10 lg:py-23"
    >
      <Reveal className="mb-8 text-center md:mb-10 lg:mb-11">
        <p className="mb-3.5 font-subtitle text-xs leading-[normal] font-semibold tracking-[.12em] text-ocean-blue uppercase">
          Dúvidas frequentes
        </p>
        <h2
          id="faq-heading"
          className="font-display text-[34px] leading-[1.1] font-medium text-navy-deep md:text-[38px] lg:text-[40px]"
        >
          Antes de começarmos
        </h2>
      </Reveal>

      <Reveal className="flex flex-col gap-3.5">
        {FAQ_ITEMS.map(({ question, answer }) => (
          <details
            key={question}
            className="rounded-2xl bg-navy-deep px-5 py-4.5 md:px-6 md:py-5 lg:px-6.5 lg:py-5.5"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-body text-[17px] leading-[normal] font-medium text-cream">
              <span className="min-w-0">{question}</span>
              <span
                aria-hidden="true"
                className="shrink-0 text-xl leading-none text-slate-blue"
              >
                +
              </span>
            </summary>
            <p className="mt-4 text-[15px] leading-[1.68] text-mist-blue">
              {answer}
            </p>
          </details>
        ))}
      </Reveal>
    </section>
  );
}
