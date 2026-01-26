import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { BlogPostData } from "@/types/strapi";
import { getStrapiMediaUrl, isLocalhostUrl } from "@/lib/strapi-helpers";

interface BlogSectionProps {
  posts?: BlogPostData[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogSection({ posts = [] }: BlogSectionProps) {
  // Show only the latest 3 posts
  const latestPosts = posts.slice(0, 3);

  if (latestPosts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="py-20 bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-brand-600 font-bold tracking-widest uppercase text-xs mb-3 block">
            Blog
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
            Artigos e <span className="text-brand-500 italic">Reflexões</span>
          </h2>
          <div className="w-16 h-1 bg-brand-500 mx-auto rounded-full" />
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Conteúdos sobre saúde mental, psicologia e bem-estar emocional para
            ajudar você em sua jornada.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPosts.map((post) => {
            const imageUrl = getStrapiMediaUrl(post.featuredImage);
            const isLocal = imageUrl ? isLocalhostUrl(imageUrl) : false;

            return (
              <article
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                {/* Featured Image */}
                {imageUrl && (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block relative h-48 overflow-hidden"
                  >
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

                  <h3 className="text-xl font-serif text-gray-900 mb-3 hover:text-brand-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

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

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-brand-600 text-brand-600 font-semibold rounded-full hover:bg-brand-600 hover:text-white transition-all duration-300"
          >
            Ver Todos os Artigos
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
