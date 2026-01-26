import { Heart, Compass, Footprints, LucideIcon } from "lucide-react";
import { ApproachData } from "@/types/strapi";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  heart: Heart,
  compass: Compass,
  footprints: Footprints,
};

// Fallback data
const defaultData = {
  badge: "Minha Metodologia",
  title: "Terapia de Aceitação e Compromisso (ACT)",
  description:
    "A ACT é uma abordagem moderna baseada em evidências que foca na flexibilidade psicológica. Diferente das terapias tradicionais que tentam eliminar sintomas, nosso objetivo é ajudá-lo a viver uma vida rica e significativa, aceitando as dores que inevitavelmente surgem no caminho.",
  pillars: [
    {
      id: 1,
      icon: "heart",
      title: "Aceitação",
      description:
        "Aprender a dar espaço para emoções e pensamentos difíceis sem lutar contra eles, permitindo que venham e vão sem dominarem suas ações.",
    },
    {
      id: 2,
      icon: "compass",
      title: "Valores",
      description:
        "Reconectar-se com o que é verdadeiramente importante para você. Seus valores funcionam como uma bússola, guiando suas decisões.",
    },
    {
      id: 3,
      icon: "footprints",
      title: "Ação com Compromisso",
      description:
        "Agir de forma efetiva em direção aos seus valores, construindo hábitos saudáveis mesmo na presença de obstáculos ou desconforto.",
    },
  ],
};

interface ApproachProps {
  data?: ApproachData;
}

export function Approach({ data }: ApproachProps) {
  const badge = data?.badge || defaultData.badge;
  const title = data?.title || defaultData.title;
  const description = data?.description || defaultData.description;
  const pillars = data?.pillars || defaultData.pillars;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-brand-600 font-bold tracking-widest uppercase text-xs mb-3 block">
            {badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6">
            {title}
          </h2>
          <div className="w-16 h-1 bg-brand-500 mx-auto rounded-full mb-6" />
          <p
            className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: description
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/_(.*?)_/g, "<em>$1</em>"),
            }}
          />
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
          {pillars.map((pillar) => {
            const IconComponent = iconMap[pillar.icon || "heart"] || Heart;
            return (
              <div
                key={pillar.id}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-6 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">
                  {pillar.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
