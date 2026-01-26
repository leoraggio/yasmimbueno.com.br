import { Quote as QuoteIcon } from "lucide-react";
import { QuoteData } from "@/types/strapi";
import { getStrapiMediaUrl } from "@/lib/strapi-helpers";

// Fallback data
const defaultData = {
  text: "O objetivo da terapia não é apenas resolver problemas, mas ajudá-lo a crescer e se tornar a pessoa que você é capaz de ser.",
  author: "Minha Filosofia",
};

interface QuoteProps {
  data?: QuoteData;
}

export function Quote({ data }: QuoteProps) {
  const text = data?.text || defaultData.text;
  const author = data?.author || defaultData.author;
  const backgroundImageUrl =
    getStrapiMediaUrl(data?.backgroundImage) ||
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80";

  return (
    <section id="approach" className="py-24 bg-brand-800 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={backgroundImageUrl}
          alt="Paisagem Calma"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        <QuoteIcon className="h-10 w-10 text-brand-300 mx-auto mb-6 opacity-60" />
        <h2 className="text-3xl md:text-5xl font-serif text-white leading-tight mb-8">
          &ldquo;{text}&rdquo;
        </h2>
        <p className="text-brand-200 text-lg uppercase tracking-widest font-semibold">
          — {author}
        </p>
      </div>
    </section>
  );
}
