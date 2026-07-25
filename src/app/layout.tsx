import type { Metadata } from "next";
import { Lato, Cormorant_Garamond } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { brandFontVariables } from "./fonts";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Yasmim Bueno | Psicóloga Clínica",
    template: "%s | Yasmim Bueno",
  },
  description:
    "Psicóloga Clínica especializada em Terapia de Aceitação e Compromisso (ACT). Atendimento online e presencial para ansiedade, depressão e autoconhecimento.",
  keywords: [
    "psicóloga",
    "psicologia",
    "terapia",
    "ACT",
    "terapia de aceitação e compromisso",
    "ansiedade",
    "depressão",
    "autoconhecimento",
    "saúde mental",
    "psicóloga online",
  ],
  authors: [{ name: "Yasmim Bueno" }],
  creator: "Yasmim Bueno",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://yasmimbueno.com.br",
    siteName: "Yasmim Bueno - Psicóloga Clínica",
    title: "Yasmim Bueno | Psicóloga Clínica",
    description:
      "Psicóloga Clínica especializada em Terapia de Aceitação e Compromisso (ACT). Atendimento online e presencial.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Yasmim Bueno - Psicóloga Clínica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yasmim Bueno | Psicóloga Clínica",
    description:
      "Psicóloga Clínica especializada em Terapia de Aceitação e Compromisso (ACT).",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`scroll-smooth ${brandFontVariables}`}>
      <head>
        <JsonLd />
      </head>
      <body className={`${lato.variable} ${cormorant.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
