import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Nav } from "@/components/Nav";

/**
 * The landing page.
 *
 * The mock's sections land here in page order — Nav · Hero · Sobre · farol
 * divider · Abordagem · Serviços · Frase · Dúvidas · Contato+Rodapé — one
 * ticket each; the nav is the first of them and the rest of the page is still
 * the shell. Everything here is hardcoded from the mock and takes no data, so
 * this stays a plain server component.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main />
      <FloatingWhatsApp />
    </>
  );
}
