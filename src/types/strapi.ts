// Strapi Media type
export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

// Components
export interface CTAButton {
  id: number;
  text: string;
  link: string;
  variant: "primary" | "secondary";
}

export interface TrustBadge {
  id: number;
  text: string;
  icon?: string;
}

export interface SEO {
  id: number;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: StrapiMedia;
}

export interface Credential {
  id: number;
  label: string;
  value: string;
}

export interface Pillar {
  id: number;
  title: string;
  description: string;
  icon?: string;
}

export interface SocialLink {
  id: number;
  platform: "instagram" | "linkedin" | "facebook" | "twitter" | "youtube";
  url: string;
}

export interface Feature {
  id: number;
  text: string;
}

// Single Types
export interface HomepageData {
  id: number;
  badge?: string;
  heroTitle?: string;
  heroTitleHighlight?: string;
  heroSubtitle?: string;
  primaryCTA?: CTAButton;
  secondaryCTA?: CTAButton;
  trustBadges?: TrustBadge[];
  heroImage?: StrapiMedia;
  seo?: SEO;
}

export interface AboutData {
  id: number;
  title?: string;
  content?: string;
  profileImage?: StrapiMedia;
  signatureImage?: StrapiMedia;
  credentials?: Credential[];
}

export interface ApproachData {
  id: number;
  badge?: string;
  title?: string;
  description?: string;
  pillars?: Pillar[];
}

export interface QuoteData {
  id: number;
  text?: string;
  author?: string;
  backgroundImage?: StrapiMedia;
}

export interface ContactData {
  id: number;
  title?: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  addressLabel?: string;
  socialLinks?: SocialLink[];
}

export interface SiteSettingsData {
  id: number;
  siteName?: string;
  whatsappNumber?: string;
  footerCopyright?: string;
  privacyPolicyLink?: string;
  termsLink?: string;
}

// Collection Types
export interface ServiceData {
  id: number;
  title: string;
  description?: string;
  tag?: string;
  tagColor?: "primary" | "secondary";
  icon?: string;
  features?: Feature[];
  isPopular?: boolean;
  order?: number;
}

export interface FAQData {
  id: number;
  question: string;
  answer: string;
  order?: number;
}

// Blog
export interface BlogPostData {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featuredImage?: StrapiMedia;
  author?: string;
  readTime?: number;
  category?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Strapi Response wrapper
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Landing Page Data (all combined)
export interface LandingPageData {
  homepage: StrapiResponse<HomepageData> | null;
  about: StrapiResponse<AboutData> | null;
  approach: StrapiResponse<ApproachData> | null;
  quote: StrapiResponse<QuoteData> | null;
  contact: StrapiResponse<ContactData> | null;
  siteSettings: StrapiResponse<SiteSettingsData> | null;
  faq: StrapiResponse<FAQData[]> | null;
  services: StrapiResponse<ServiceData[]> | null;
}
