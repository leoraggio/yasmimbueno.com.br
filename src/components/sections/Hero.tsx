import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { HomepageData } from "@/types/strapi";
import { getStrapiMediaUrl, isLocalhostUrl } from "@/lib/strapi-helpers";

// Fallback data
const defaultData = {
  badge: "Psicóloga Clínica Licenciada",
  heroTitle: "Encontrando equilíbrio,",
  heroTitleHighlight: "restaurando a paz.",
  heroSubtitle:
    "Navegar pelos desafios da vida não precisa ser uma jornada solitária. Ofereço um espaço seguro e compassivo para ajudá-lo a se compreender e seguir em frente com confiança.",
  trustBadges: [
    { id: 1, text: "CRP Ativo" },
    { id: 2, text: "Confidencial" },
    { id: 3, text: "Online e Presencial" },
  ],
  primaryCTA: { text: "Inicie Sua Jornada", link: "#agendamento" },
  secondaryCTA: { text: "Conheça os Serviços", link: "#services" },
};

interface HeroProps {
  data?: HomepageData;
}

export function Hero({ data }: HeroProps) {
  const badge = data?.badge || defaultData.badge;
  const heroTitle = data?.heroTitle || defaultData.heroTitle;
  const heroTitleHighlight = data?.heroTitleHighlight || defaultData.heroTitleHighlight;
  const heroSubtitle = data?.heroSubtitle || defaultData.heroSubtitle;
  const trustBadges = data?.trustBadges || defaultData.trustBadges;
  const primaryCTA = data?.primaryCTA || defaultData.primaryCTA;
  const secondaryCTA = data?.secondaryCTA || defaultData.secondaryCTA;
  const heroImageUrl = getStrapiMediaUrl(data?.heroImage) || "/hero-img.webp";
  const isLocalImage = isLocalhostUrl(heroImageUrl);

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Content */}
          <div className="text-center lg:text-left fade-in-up">
            <span className="text-brand-600 font-bold tracking-widest uppercase text-xs mb-3 block">
              {badge}
            </span>
            <h1 className="text-4xl lg:text-6xl font-serif text-gray-900 leading-tight mb-6">
              {heroTitle}{" "}
              <br />
              <span className="text-brand-500 italic">{heroTitleHighlight}</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              {heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href={primaryCTA.link}
                className="px-8 py-3.5 bg-brand-600 text-white rounded-full font-medium shadow-lg hover:bg-brand-700 hover:shadow-xl transition-all transform hover:-translate-y-1 text-center"
              >
                {primaryCTA.text}
              </Link>
              <Link
                href={secondaryCTA.link}
                className="px-8 py-3.5 bg-white text-brand-700 border border-brand-200 rounded-full font-medium hover:bg-brand-50 transition-all text-center"
              >
                {secondaryCTA.text}
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-gray-400 flex-wrap">
              {trustBadges.map((badge) => (
                <div key={badge.id} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-brand-400" />
                  <span className="text-sm">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative lg:h-auto fade-in-up delay-200">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={heroImageUrl}
                alt="Dra. Yasmim Bueno"
                width={600}
                height={700}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                priority
                unoptimized={isLocalImage}
              />
              <div className="absolute inset-0 bg-brand-900/10" />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-100 rounded-full -z-10 blur-xl" />
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-sand-200 rounded-full -z-10 blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
