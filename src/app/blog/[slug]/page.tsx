import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, Clock, User, ArrowLeft, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getBlogPost, getBlogPosts, getLandingPageData } from "@/lib/strapi";
import { getStrapiMediaUrl, isLocalhostUrl } from "@/lib/strapi-helpers";
import { Navigation } from "@/components/sections/Navigation";
import { Footer } from "@/components/sections/Footer";
import { ReadingProgress, CopyLinkButton } from "@/components/blog";

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
    description:
      post.excerpt || `Leia "${post.title}" no blog da Dra. Yasmim Bueno.`,
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
  const [postResponse, landingData, allPostsResponse] = await Promise.all([
    getBlogPost(slug),
    getLandingPageData(),
    getBlogPosts(),
  ]);

  const post = postResponse?.data?.[0];

  if (!post) {
    notFound();
  }

  const imageUrl = getStrapiMediaUrl(post.featuredImage);
  const isLocal = imageUrl ? isLocalhostUrl(imageUrl) : false;

  // Get related posts (other posts, max 3)
  const relatedPosts =
    allPostsResponse?.data
      ?.filter((p) => p.slug !== slug)
      .slice(0, 3) || [];

  // Get about data for author image
  const aboutData = landingData.about?.data;
  const authorImageUrl = getStrapiMediaUrl(aboutData?.profileImage);
  const isAuthorImageLocal = authorImageUrl
    ? isLocalhostUrl(authorImageUrl)
    : false;

  return (
    <>
      <ReadingProgress />
      <Navigation />

      {/* Hero Header */}
      <header className="relative pt-32 pb-12 md:pt-40 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        {/* Back link (mobile) */}
        <Link
          href="/blog"
          className="inline-flex items-center text-brand-600 hover:text-brand-700 font-medium mb-6 md:hidden"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o Blog
        </Link>

        {/* Category Badge */}
        {post.category && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-200 text-xs font-semibold tracking-wide uppercase text-brand-600 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-500" />
            {post.category}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-tight mb-6">
          {post.title}
        </h1>

        {/* Excerpt as subtitle */}
        {post.excerpt && (
          <p className="text-lg md:text-xl text-gray-500 font-serif italic mb-8 max-w-2xl mx-auto">
            {post.excerpt}
          </p>
        )}

        {/* Author Meta */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-3">
            {authorImageUrl ? (
              <Image
                src={authorImageUrl}
                alt={post.author || "Yasmim Bueno"}
                width={44}
                height={44}
                className="rounded-full object-cover border-2 border-white shadow-sm"
                unoptimized={isAuthorImageLocal}
              />
            ) : (
              <div className="w-11 h-11 bg-brand-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-brand-600" />
              </div>
            )}
            <div className="text-left">
              <p className="font-bold text-gray-900">
                {post.author || "Yasmim Bueno"}
              </p>
              <p className="text-xs text-gray-500">Psicóloga Clínica, CRP</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-gray-300" />

          <div className="flex gap-4 md:gap-6">
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </span>
            )}
            {post.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readTime} min de leitura
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {imageUrl && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 md:mb-16">
          <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-xl shadow-lg shadow-brand-200/50">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              priority
              unoptimized={isLocal}
            />
          </div>
        </div>
      )}

      {/* Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Sticky Sidebar Left - Copy Link */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32 flex flex-col gap-4 items-center">
              <CopyLinkButton />
            </div>
          </div>

          {/* Article Content */}
          <article className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 lg:p-12">
              {/* Content with drop cap on first paragraph */}
              <div className="prose prose-lg max-w-none prose-article">
                <ReactMarkdown
                  components={{
                    // Add drop cap to first paragraph
                    p: ({ children, ...props }) => {
                      return <p {...props}>{children}</p>;
                    },
                  }}
                >
                  {post.content || ""}
                </ReactMarkdown>
              </div>

              <hr className="border-gray-200 my-10" />

              {/* Tags */}
              {post.category && (
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/blog?categoria=${encodeURIComponent(post.category)}`}
                    className="px-4 py-1.5 bg-brand-50 border border-brand-200 rounded-full text-xs font-semibold text-brand-600 hover:bg-brand-100 transition-colors"
                  >
                    #{post.category.replace(/\s+/g, "")}
                  </Link>
                  <span className="px-4 py-1.5 bg-brand-50 border border-brand-200 rounded-full text-xs font-semibold text-brand-600">
                    #Psicologia
                  </span>
                  <span className="px-4 py-1.5 bg-brand-50 border border-brand-200 rounded-full text-xs font-semibold text-brand-600">
                    #SaúdeMental
                  </span>
                </div>
              )}
            </div>

            {/* CTA Box */}
            <div className="mt-8 bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-8 text-center text-white shadow-lg">
              <Sparkles className="w-8 h-8 mx-auto mb-4 opacity-80" />
              <h3 className="text-xl md:text-2xl font-serif font-bold mb-3">
                Gostou do conteúdo?
              </h3>
              <p className="text-brand-100 mb-6 max-w-md mx-auto">
                Agende uma consulta e comece sua jornada de autoconhecimento e
                bem-estar emocional.
              </p>
              <Link
                href="/#agendamento"
                className="inline-block px-8 py-3.5 bg-white text-brand-700 rounded-full font-semibold shadow-lg hover:bg-brand-50 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                Agendar Consulta
              </Link>
            </div>

            {/* Mobile copy link */}
            <div className="lg:hidden mt-8 flex justify-center">
              <CopyLinkButton />
            </div>
          </article>

          {/* Sidebar Right */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Author Bio Box */}
            <div className="bg-white border border-brand-100 p-8 rounded-xl shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                {authorImageUrl ? (
                  <Image
                    src={authorImageUrl}
                    alt={post.author || "Yasmim Bueno"}
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                    unoptimized={isAuthorImageLocal}
                  />
                ) : (
                  <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-brand-600" />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-gray-900">
                    {post.author || "Yasmim Bueno"}
                  </h4>
                  <span className="text-xs text-brand-600 font-semibold uppercase tracking-wide">
                    Psicóloga Clínica
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Especialista em Terapia de Aceitação e Compromisso (ACT).
                Ajudando pessoas a desenvolverem flexibilidade psicológica e
                viverem uma vida alinhada com seus valores.
              </p>
              <Link
                href="/#about"
                className="text-sm text-brand-700 font-bold underline decoration-brand-400 decoration-2 hover:text-brand-600 transition-colors"
              >
                Conheça mais sobre mim &rarr;
              </Link>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs border-b border-brand-200 pb-3 mb-6">
                  Artigos Populares
                </h3>
                <div className="space-y-6">
                  {relatedPosts.map((relatedPost, index) => (
                    <Link
                      key={relatedPost.slug}
                      href={`/blog/${relatedPost.slug}`}
                      className="group block"
                    >
                      <div className="flex gap-4">
                        <div className="text-2xl font-serif text-brand-200 font-bold group-hover:text-brand-500 transition-colors">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors leading-snug">
                            {relatedPost.title}
                          </h4>
                          <span className="text-xs text-gray-400 mt-1 block">
                            {relatedPost.category}
                            {relatedPost.readTime &&
                              ` • ${relatedPost.readTime} min`}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back to Blog */}
            <div className="hidden lg:block">
              <Link
                href="/blog"
                className="inline-flex items-center text-brand-600 hover:text-brand-700 font-medium"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Ver todos os artigos
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer data={landingData.siteSettings?.data} />
    </>
  );
}
