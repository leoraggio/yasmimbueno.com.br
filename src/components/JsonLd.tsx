export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://yasmimbueno.com.br",
    name: "Yasmim Bueno - Psicóloga Clínica",
    description:
      "Psicóloga clínica especializada em Terapia de Aceitação e Compromisso (ACT) e Terapia Comportamental Dialética (DBT), com psicoterapia individual para adultos, online e presencial em Alphaville.",
    url: "https://yasmimbueno.com.br",
    telephone: "+55-11-94304-6621",
    email: "contato@yasmimbueno.com.br",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Alameda Grajaú, 98, 18º andar",
      addressLocality: "Barueri",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    sameAs: [
      "https://instagram.com/yasmimbueno.psi",
      "https://linkedin.com/in/yasmim-bueno-720720187",
    ],
    founder: {
      "@type": "Person",
      name: "Yasmim Bueno",
      jobTitle: "Psicóloga Clínica",
      description:
        "Pós-graduada em Psicologia Clínica pela PUC-RS, especializada em Terapias Contextuais, Terapia de Aceitação e Compromisso (ACT) e Terapia Comportamental Dialética (DBT).",
    },
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          serviceType: "Psicoterapia individual para adultos",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          serviceType: "Atendimento psicológico online",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          serviceType: "Atendimento psicológico presencial em Alphaville",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
