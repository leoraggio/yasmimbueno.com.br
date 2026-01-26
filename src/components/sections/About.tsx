import Image from "next/image";
import { AboutData } from "@/types/strapi";
import { getStrapiMediaUrl, isLocalhostUrl } from "@/lib/strapi-helpers";

// Fallback data
const defaultData = {
  title: "Olá, sou a Yasmim.",
  content: `Sou pós-graduada em Psicologia Clínica pela PUC-RS e especializada em Terapia de Aceitação e Compromisso (ACT). Mas antes de tudo, sou uma profissional que acredita profundamente na despatologização da vida.

A dor e o cansaço são parte da nossa experiência, e nem todo sofrimento precisa ser enquadrado em um diagnóstico. Meu objetivo é oferecer um espaço onde a sua história seja acolhida de forma humana e cuidadosa, entendendo você em sua totalidade, sem reduzir sua experiência a um rótulo simplista.

Com a ACT, unimos rigor científico e olhar humano para construir Flexibilidade Psicológica. Não lutamos contra sentimentos; aprendemos a lidar com eles para que você possa se conectar com seus Valores e agir na direção de uma vida que vale a pena.`,
  credentials: [
    { id: 1, label: "Formação", value: "Pós em Psicologia Clínica\nPUC-RS" },
    { id: 2, label: "Especialização", value: "Terapia ACT\nDespatologização" },
  ],
};

interface AboutProps {
  data?: AboutData;
}

export function About({ data }: AboutProps) {
  const title = data?.title || defaultData.title;
  const content = data?.content || defaultData.content;
  const credentials = data?.credentials || defaultData.credentials;
  const profileImageUrl = getStrapiMediaUrl(data?.profileImage) || "/about-img.webp";
  const signatureImageUrl = getStrapiMediaUrl(data?.signatureImage) || "/signature.svg";
  const isLocalProfileImage = isLocalhostUrl(profileImageUrl);
  const isLocalSignatureImage = isLocalhostUrl(signatureImageUrl);

  // Split content into paragraphs
  const paragraphs = content.split("\n\n").filter(Boolean);

  return (
    <section id="about" className="py-20 bg-brand-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 md:order-1">
            <Image
              src={profileImageUrl}
              alt="Yasmim Bueno"
              width={500}
              height={600}
              className="rounded-lg shadow-xl w-full max-w-md mx-auto relative z-10 grayscale hover:grayscale-0 transition-all duration-500 border border-brand-500"
              unoptimized={isLocalProfileImage}
            />
            {/* Decorative border */}
            <div className="absolute top-4 left-4 border-2 border-brand-400 w-full h-full rounded-lg z-0 transform -translate-x-4 -translate-y-4 hidden md:block opacity-60 max-w-md mx-auto" />
          </div>

          {/* Content */}
          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
              {title}
            </h2>

            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-lg text-brand-50 mb-4 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: paragraph
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/_(.*?)_/g, "<em>$1</em>"),
                }}
              />
            ))}

            {/* Credentials Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8 mt-8">
              {credentials.map((cred) => (
                <div key={cred.id}>
                  <h4 className="font-bold text-white mb-1">{cred.label}</h4>
                  <p className="text-sm text-brand-200 whitespace-pre-line">
                    {cred.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Signature */}
            {signatureImageUrl && (
              <div className="h-12 opacity-80">
                <Image
                  src={signatureImageUrl}
                  alt="Assinatura"
                  width={150}
                  height={48}
                  className="invert h-auto"
                  unoptimized={isLocalSignatureImage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
