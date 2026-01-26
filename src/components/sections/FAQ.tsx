"use client";

import { ChevronDown } from "lucide-react";
import { FAQData } from "@/types/strapi";

// Fallback data
const defaultFAQ: FAQData[] = [
  {
    id: 1,
    question: "Você aceita convênio?",
    answer:
      "Atendo principalmente na modalidade particular. Para convênios, posso fornecer recibos para que você solicite o reembolso junto à sua operadora de saúde.",
    order: 1,
  },
  {
    id: 2,
    question: "Quanto tempo dura uma sessão típica?",
    answer:
      "As sessões individuais têm duração típica de 50 minutos. Sessões de casal podem ser estendidas para 75 ou 90 minutos, dependendo de suas necessidades específicas.",
    order: 2,
  },
  {
    id: 3,
    question: "A terapia é confidencial?",
    answer:
      "Absolutamente. O sigilo é um pilar da prática psicológica. O que discutimos fica entre nós, com poucas exceções legais envolvendo segurança, que discutiremos em nossa primeira sessão.",
    order: 3,
  },
];

interface FAQProps {
  data?: FAQData[];
}

export function FAQ({ data }: FAQProps) {
  const faqItems = data && data.length > 0 ? data : defaultFAQ;

  return (
    <section id="faq" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
            Perguntas Frequentes
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item) => (
            <details
              key={item.id}
              className="group p-4 bg-sand-50 rounded-lg cursor-pointer"
            >
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800">
                <span>{item.question}</span>
                <span className="transition group-open:rotate-180">
                  <ChevronDown className="h-5 w-5 text-brand-500" />
                </span>
              </summary>
              <p className="text-gray-600 mt-3">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
