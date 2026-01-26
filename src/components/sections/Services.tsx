import { User, HeartHandshake, BookOpen, Check, LucideIcon } from "lucide-react";
import { ServiceData } from "@/types/strapi";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  user: User,
  "heart-handshake": HeartHandshake,
  "book-open": BookOpen,
};

// Fallback data
const defaultServices: ServiceData[] = [
  {
    id: 1,
    title: "Terapia Individual",
    description:
      "Sessões individuais focadas em ansiedade, depressão, autoconhecimento e crescimento pessoal. Um espaço seguro para sua jornada.",
    tag: "Para Pacientes",
    tagColor: "primary",
    icon: "user",
    features: [
      { id: 1, text: "Autoconhecimento" },
      { id: 2, text: "Gestão de Emoções" },
      { id: 3, text: "Saúde Mental" },
    ],
    isPopular: true,
    order: 1,
  },
  {
    id: 2,
    title: "Cuidando de quem cuida",
    description:
      "Projeto focado para profissionais de psicologia em começo de carreira que buscam acolhimento e segurança na prática clínica.",
    tag: "Para Psicólogos",
    tagColor: "secondary",
    icon: "heart-handshake",
    features: [
      { id: 1, text: "Mentoria Profissional" },
      { id: 2, text: "Suporte à Prática" },
      { id: 3, text: "Acolhimento" },
    ],
    isPopular: false,
    order: 2,
  },
  {
    id: 3,
    title: "Grupo de Estudos",
    description:
      "Grupo de Estudos em Habilidades Terapêuticas, focado na troca de experiências e aprofundamento técnico.",
    tag: "Para Psicólogos",
    tagColor: "secondary",
    icon: "book-open",
    features: [
      { id: 1, text: "Habilidades Terapêuticas" },
      { id: 2, text: "Estudo de Casos" },
      { id: 3, text: "Networking" },
    ],
    isPopular: false,
    order: 3,
  },
];

interface ServicesProps {
  data?: ServiceData[];
}

export function Services({ data }: ServicesProps) {
  const services = data && data.length > 0 ? data : defaultServices;

  return (
    <section id="services" className="py-20 bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
            Como Posso Ajudar
          </h2>
          <div className="w-16 h-1 bg-brand-500 mx-auto rounded-full" />
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Atendimento clínico especializado para pacientes e suporte dedicado
            ao desenvolvimento de carreira para psicólogos.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon || "user"] || User;
            const isPrimary = service.tagColor === "primary";

            return (
              <div
                key={service.id}
                className={`bg-white p-8 rounded-xl transition-all duration-300 group relative ${
                  service.isPopular
                    ? "shadow-lg hover:shadow-2xl border-t-4 border-brand-500"
                    : "shadow-sm hover:shadow-xl"
                }`}
              >
                {/* Popular Badge */}
                {service.isPopular && (
                  <div className="absolute top-0 right-0 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">
                    Mais Popular
                  </div>
                )}

                {/* Tag */}
                <span
                  className={`inline-block px-3 py-1 text-white text-xs font-bold rounded-full mb-4 shadow-sm ${
                    isPrimary ? "bg-brand-600" : "bg-secondary-600"
                  }`}
                >
                  {service.tag}
                </span>

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-colors ${
                    isPrimary
                      ? "bg-brand-100 group-hover:bg-brand-500"
                      : "bg-secondary-50 group-hover:bg-secondary-600"
                  }`}
                >
                  <IconComponent
                    className={`h-6 w-6 transition-colors ${
                      isPrimary
                        ? "text-brand-600 group-hover:text-white"
                        : "text-secondary-600 group-hover:text-white"
                    }`}
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="text-sm text-gray-500 space-y-2">
                  {service.features?.map((feature) => (
                    <li key={feature.id} className="flex items-center">
                      <Check
                        className={`h-4 w-4 mr-2 ${
                          isPrimary ? "text-brand-400" : "text-gray-400"
                        }`}
                      />
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
