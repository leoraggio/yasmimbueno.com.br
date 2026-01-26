import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { getBlogPosts } from "@/lib/strapi";
import { getStrapiMediaUrl, isLocalhostUrl } from "@/lib/strapi-helpers";
import { Navigation } from "@/components/sections/Navigation";
import { Footer } from "@/components/sections/Footer";
import { getLandingPageData } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "Blog | Yasmim Bueno - Psicóloga Clínica",
  description:
    "Artigos sobre saúde mental, psicologia, ACT e bem-estar emocional. Dicas e reflexões para uma vida mais plena.",
  openGraph: {
    title: "Blog | Yasmim Bueno - Psicóloga Clínica",
    description:
      "Artigos sobre saúde mental, psicologia, ACT e bem-estar emocional.",
    type: "website",
  },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const [postsResponse, landingData] = await Promise.all([
    getBlogPosts(),
    getLandingPageData(),
  ]);

  const posts = postsResponse?.data || [];

  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20 bg-sand-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-brand-600 font-bold tracking-widest uppercase text-xs mb-3 block">
              Blog
            </span>
            <h1 className="text-4xl lg:text-5xl font-serif text-gray-900 mb-4">
              Artigos e <span className="text-brand-500 italic">Reflexões</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conteúdos sobre saúde mental, psicologia e bem-estar emocional
              para ajudar você em sua jornada.
            </p>
          </div>

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                const imageUrl = getStrapiMediaUrl(post.featuredImage);
                const isLocal = imageUrl ? isLocalhostUrl(imageUrl) : false;

                return (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
                  >
                    {/* Featured Image */}
                    {imageUrl && (
                      <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                          unoptimized={isLocal}
                        />
                        {post.category && (
                          <span className="absolute top-4 left-4 bg-brand-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                            {post.category}
                          </span>
                        )}
                      </Link>
                    )}

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        {post.publishedAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(post.publishedAt)}</span>
                          </div>
                        )}
                        {post.readTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{post.readTime} min</span>
                          </div>
                        )}
                      </div>

                      <h2 className="text-xl font-serif text-gray-900 mb-3 hover:text-brand-600 transition-colors">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>

                      {post.excerpt && (
                        <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-brand-600 font-medium text-sm hover:text-brand-700 transition-colors mt-auto"
                      >
                        Ler mais
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                Nenhum artigo publicado ainda. Volte em breve!
              </p>
              <Link
                href="/"
                className="inline-block mt-6 text-brand-600 hover:text-brand-700 font-medium"
              >
                ← Voltar para a página inicial
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer data={landingData.siteSettings?.data} />
    </>
  );
}
