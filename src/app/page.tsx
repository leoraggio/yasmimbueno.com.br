import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

/**
 * The landing page, stripped to its shell.
 *
 * The mock's sections land here in page order — Nav · Hero · Sobre · farol
 * divider · Abordagem · Serviços · Frase · Dúvidas · Contato+Rodapé — one
 * ticket each. Everything on the page is hardcoded from the mock and takes no
 * data, so this stays a plain server component.
 */
export default function Home() {
  return (
    <>
      <main />
      <FloatingWhatsApp />
    </>
  );
}
