import {
  Navigation,
  Hero,
  About,
  Approach,
  Services,
  Quote,
  FAQ,
  Scheduling,
  BlogSection,
  Contact,
  Footer,
  WhatsAppButton,
} from "@/components/sections";
import { getLandingPageData } from "@/lib/strapi";

export default async function Home() {
  const data = await getLandingPageData();

  return (
    <>
      <Navigation />
      <main>
        <Hero data={data.homepage?.data} />
        <About data={data.about?.data} />
        <Approach data={data.approach?.data} />
        <Services data={data.services?.data} />
        <Quote data={data.quote?.data} />
        <FAQ data={data.faq?.data} />
        <Scheduling whatsappNumber={data.siteSettings?.data?.whatsappNumber} />
        <BlogSection posts={data.blogPosts?.data} />
        <Contact data={data.contact?.data} />
      </main>
      <Footer data={data.siteSettings?.data} />
      <WhatsAppButton whatsappNumber={data.siteSettings?.data?.whatsappNumber} />
    </>
  );
}
