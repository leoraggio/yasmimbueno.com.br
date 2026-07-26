import Image from "next/image";

export function FarolDivider() {
  return (
    <div
      role="separator"
      aria-label="Farol"
      className="flex w-full items-center justify-center gap-6 bg-navy-deep px-5 py-6 md:gap-10"
    >
      <div aria-hidden="true" className="h-px flex-1 bg-slate-blue/35" />
      <Image
        src="/brand/farol-branco.png"
        alt=""
        width={4354}
        height={4525}
        sizes="(min-width: 768px) 120px, 84px"
        className="h-auto w-21 opacity-90 md:w-30"
      />
      <div aria-hidden="true" className="h-px flex-1 bg-slate-blue/35" />
    </div>
  );
}
