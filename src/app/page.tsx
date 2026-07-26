import { About } from "@/components/About";
import { Approach } from "@/components/Approach";
import { ContactFooter } from "@/components/ContactFooter";
import { Faq } from "@/components/Faq";
import { FarolDivider } from "@/components/FarolDivider";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Quote } from "@/components/Quote";
import { Services } from "@/components/Services";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <FarolDivider />
        <Approach />
        <Services />
        <Quote />
        <Faq />
      </main>
      <ContactFooter />
      <FloatingWhatsApp />
    </>
  );
}
