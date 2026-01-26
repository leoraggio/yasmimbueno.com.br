import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, User } from "lucide-react";
import { getBlogPost, getBlogPosts, getLandingPageData } from "@/lib/strapi";
import { getStrapiMediaUrl, isLocalhostUrl } from "@/lib/strapi-helpers";
import { Navigation } from "@/components/sections/Navigation";
import { Footer } from "@/components/sections/Footer";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const response = await getBlogPost(slug);
  const post = response?.data?.[0];

  if (!post) {
    return {
      title: "Post não encontrado | Yasmim Bueno",
    };
  }

  const imageUrl = getStrapiMediaUrl(post.featuredImage);

  return {
    title: `${post.title} | Yasmim Bueno - Psicóloga Clínica`,
    description: post.excerpt || `Leia "${post.title}" no blog da Dra. Yasmim Bueno.`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author || "Yasmim Bueno"],
      images: imageUrl ? [imageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const response = await getBlogPosts();
  const posts = response?.data || [];

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [postResponse, landingData] = await Promise.all([
    getBlogPost(slug),
    getLandingPageData(),
  ]);

  const post = postResponse?.data?.[0];

  if (!post) {
    notFound();
  }

  const imageUrl = getStrapiMediaUrl(post.featuredImage);
  const isLocal = imageUrl ? isLocalhostUrl(imageUrl) : false;

  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20 bg-sand-50 min-h-screen">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-brand-600 hover:text-brand-700 font-medium mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o Blog
          </Link>

          {/* Header */}
          <header className="mb-8">
            {post.category && (
              <span className="inline-block bg-brand-100 text-brand-700 text-xs font-medium px-3 py-1 rounded-full mb-4">
                {post.category}
              </span>
            )}

            <h1 className="text-3xl lg:text-5xl font-serif text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {post.author && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
              )}
              {post.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
              )}
              {post.readTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime} min de leitura</span>
                </div>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {imageUrl && (
            <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-10 shadow-lg">
              <Image
                src={imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
                unoptimized={isLocal}
              />
            </div>
          )}

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            {post.excerpt && (
              <p className="text-xl text-gray-600 italic border-l-4 border-brand-400 pl-6 mb-8">
                {post.excerpt}
              </p>
            )}

            <div
              className="prose prose-lg prose-brand max-w-none
                prose-headings:font-serif prose-headings:text-gray-900
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900
                prose-ul:text-gray-700 prose-ol:text-gray-700
                prose-blockquote:border-brand-400 prose-blockquote:italic prose-blockquote:text-gray-600"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
          </div>

          {/* Author Card */}
          <div className="mt-10 bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-brand-600" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-serif text-gray-900 mb-1">
                {post.author || "Yasmim Bueno"}
              </h3>
              <p className="text-gray-600">
                Psicóloga Clínica especializada em Terapia de Aceitação e
                Compromisso (ACT).
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <p className="text-gray-600 mb-4">
              Gostou do conteúdo? Agende uma consulta e comece sua jornada de
              autoconhecimento.
            </p>
            <Link
              href="/#agendamento"
              className="inline-block px-8 py-3.5 bg-brand-600 text-white rounded-full font-medium shadow-lg hover:bg-brand-700 hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Agendar Consulta
            </Link>
          </div>
        </article>
      </main>
      <Footer data={landingData.siteSettings?.data} />
    </>
  );
}
