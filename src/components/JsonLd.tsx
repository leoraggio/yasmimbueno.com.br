export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://yasmimbueno.com.br",
    name: "Yasmim Bueno - Psicóloga Clínica",
    description:
      "Psicóloga Clínica especializada em Terapia de Aceitação e Compromisso (ACT). Atendimento online e presencial.",
    url: "https://yasmimbueno.com.br",
    telephone: "+55-11-99999-0123",
    email: "ola@yasmimbueno.com.br",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Bem-Estar, 123, Sala 400",
      addressLocality: "São Paulo",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -23.5505,
      longitude: -46.6333,
    },
    image: "https://yasmimbueno.com.br/og-image.jpg",
    priceRange: "$$",
    openingHours: "Mo-Fr 09:00-18:00",
    sameAs: [
      "https://www.instagram.com/yasmimbueno",
      "https://www.linkedin.com/in/yasmimbueno",
    ],
    founder: {
      "@type": "Person",
      name: "Yasmim Bueno",
      jobTitle: "Psicóloga Clínica",
      description:
        "Pós-graduada em Psicologia Clínica pela PUC-RS, especializada em Terapia de Aceitação e Compromisso (ACT).",
    },
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    serviceType: [
      "Psicoterapia Individual",
      "Terapia de Aceitação e Compromisso",
      "Atendimento Online",
      "Mentoria para Psicólogos",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
