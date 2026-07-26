import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { brandFontVariables } from "./fonts";
import "./globals.css";

const PAGE_TITLE =
  "Yasmim Bueno | Psicóloga Clínica em Alphaville e Online";
const PAGE_DESCRIPTION =
  "Psicoterapia individual para adultos, online e em Alphaville, com Yasmim Bueno, psicóloga clínica especializada em ACT e DBT.";

export const metadata: Metadata = {
  title: {
    default: PAGE_TITLE,
    template: "%s | Yasmim Bueno",
  },
  description: PAGE_DESCRIPTION,
  keywords: [
    "psicóloga clínica",
    "psicoterapia individual",
    "psicóloga em Alphaville",
    "psicóloga online",
    "terapia para adultos",
    "ACT",
    "Terapia de Aceitação e Compromisso",
    "DBT",
    "Terapia Comportamental Dialética",
  ],
  authors: [{ name: "Yasmim Bueno" }],
  creator: "Yasmim Bueno",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://yasmimbueno.com.br",
    siteName: "Yasmim Bueno - Psicóloga Clínica",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
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
    <html lang="pt-BR" className={brandFontVariables}>
      <head>
        <JsonLd />
      </head>
      <body>{children}</body>
    </html>
  );
}
