import Image from "next/image";

import { Reveal } from "@/components/Reveal";

export function Quote() {
  return (
    <section className="bg-navy-deep">
      <Reveal className="mx-auto max-w-205 px-5 py-10 text-center md:px-8 md:py-14 lg:px-10 lg:py-20">
        <Image
          src="/brand/farol-branco.png"
          alt=""
          width={4354}
          height={4525}
          className="mx-auto mb-5.5 h-11.5 w-auto opacity-85"
        />
        <blockquote className="mb-6 font-display text-2xl leading-[1.4] font-normal text-cream italic md:text-[28px] lg:text-[33px]">
          Quanto mais tentamos eliminar a dor, mais reduzimos nossa vida. A
          melhor forma de lidar com o sofrimento é ampliando a vida e
          fortalecendo o que é valoroso para nós.
        </blockquote>
        <cite className="font-subtitle text-xs leading-[normal] font-semibold tracking-[.12em] text-slate-blue not-italic uppercase">
          Steven C. Hayes
        </cite>
      </Reveal>
    </section>
  );
}
