import { About } from "@/components/About";
import { Approach } from "@/components/Approach";
import { FarolDivider } from "@/components/FarolDivider";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";

/**
 * The mock's sections land here in page order, one ticket at a time: Nav ·
 * Hero · Sobre · farol divider · Abordagem · Serviços · Frase · Dúvidas ·
 * Contato+Rodapé.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <FarolDivider />
        <Approach />
      </main>
      <FloatingWhatsApp />
    </>
  );
}
