import type {
  HomepageData,
  AboutData,
  ApproachData,
  QuoteData,
  ContactData,
  SiteSettingsData,
  ServiceData,
  FAQData,
  BlogPostData,
  LandingPageData,
} from "@/types/strapi";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

interface StrapiResponse<T> {
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

async function fetchStrapi<T>(endpoint: string): Promise<StrapiResponse<T> | null> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (STRAPI_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_TOKEN}`;
  }

  try {
    const url = `${STRAPI_URL}/api${endpoint}`;
    console.log(`[Strapi] Fetching: ${url}`);
    
    const isDev = process.env.NODE_ENV === "development";
    
    const res = await fetch(url, {
      headers,
      ...(isDev 
        ? { cache: "no-store" as const }
        : { next: { revalidate: 3600 } } // Cache for 1 hour in production
      ),
    });

    if (!res.ok) {
      console.error(`[Strapi] Failed to fetch ${endpoint}: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`[Strapi] Error fetching ${endpoint}:`, error);
    return null;
  }
}

// Helper to build nested populate query
function buildPopulate(fields: string[]): string {
  return fields.map((field, index) => `populate[${index}]=${field}`).join("&");
}

// Landing page content - Single Types
export const getHomepage = (): Promise<StrapiResponse<HomepageData> | null> =>
  fetchStrapi<HomepageData>(
    "/homepage?" +
      buildPopulate([
        "primaryCTA",
        "secondaryCTA",
        "trustBadges",
        "heroImage",
        "seo",
        "seo.ogImage",
      ])
  );

export const getAbout = (): Promise<StrapiResponse<AboutData> | null> =>
  fetchStrapi<AboutData>(
    "/about?" +
      buildPopulate([
        "profileImage",
        "signatureImage",
        "credentials",
      ])
  );

export const getApproach = (): Promise<StrapiResponse<ApproachData> | null> =>
  fetchStrapi<ApproachData>("/approach?" + buildPopulate(["pillars"]));

export const getQuote = (): Promise<StrapiResponse<QuoteData> | null> =>
  fetchStrapi<QuoteData>("/quote?" + buildPopulate(["backgroundImage"]));

export const getContact = (): Promise<StrapiResponse<ContactData> | null> =>
  fetchStrapi<ContactData>("/contact?" + buildPopulate(["socialLinks"]));

export const getSiteSettings = (): Promise<StrapiResponse<SiteSettingsData> | null> =>
  fetchStrapi<SiteSettingsData>("/site-setting?populate=*");

// Landing page content - Collection Types
export const getFAQ = (): Promise<StrapiResponse<FAQData[]> | null> =>
  fetchStrapi<FAQData[]>("/faqs?sort=order:asc");

export const getServices = (): Promise<StrapiResponse<ServiceData[]> | null> =>
  fetchStrapi<ServiceData[]>("/services?sort=order:asc&" + buildPopulate(["features"]));

// Blog content (Phase 3)
export const getBlogPosts = (): Promise<StrapiResponse<BlogPostData[]> | null> =>
  fetchStrapi<BlogPostData[]>(
    "/blog-posts?populate=*&sort=publishedAt:desc&publicationState=live"
  );

export const getBlogPost = (slug: string): Promise<StrapiResponse<BlogPostData[]> | null> =>
  fetchStrapi<BlogPostData[]>(
    `/blog-posts?filters[slug][$eq]=${slug}&populate=*&publicationState=live`
  );

// Helper to get all landing page data in one call
export async function getLandingPageData(): Promise<LandingPageData> {
  console.log(`[Strapi] Fetching all landing page data from: ${STRAPI_URL}`);
  
  const [homepage, about, approach, quote, contact, siteSettings, faq, services] =
    await Promise.all([
      getHomepage(),
      getAbout(),
      getApproach(),
      getQuote(),
      getContact(),
      getSiteSettings(),
      getFAQ(),
      getServices(),
    ]);

  return {
    homepage,
    about,
    approach,
    quote,
    contact,
    siteSettings,
    faq,
    services,
  };
}
