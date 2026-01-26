import { StrapiMedia } from "@/types/strapi";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

// Extended type to handle various Strapi response formats
interface StrapiMediaResponse {
  url?: string;
  data?: {
    url?: string;
    attributes?: {
      url?: string;
    };
  } | null;
}

/**
 * Get the full URL for a Strapi media file
 * Handles multiple possible response formats from Strapi v5
 */
export function getStrapiMediaUrl(media: StrapiMedia | StrapiMediaResponse | undefined | null): string {
  if (!media) return "";
  
  // Try to extract URL from various possible structures
  let url: string | undefined;
  
  // Direct url property (flat structure)
  if ("url" in media && typeof media.url === "string") {
    url = media.url;
  }
  // Wrapped in data.attributes (Strapi v4/v5 format)
  else if ("data" in media && media.data) {
    if ("attributes" in media.data && media.data.attributes?.url) {
      url = media.data.attributes.url;
    } else if ("url" in media.data && typeof media.data.url === "string") {
      url = media.data.url;
    }
  }
  
  if (!url) {
    console.log("[Strapi] Could not extract URL from media:", JSON.stringify(media));
    return "";
  }
  
  // If it's already a full URL, return as is
  if (url.startsWith("http")) {
    return url;
  }
  
  // Otherwise, prepend the Strapi URL
  return `${STRAPI_URL}${url}`;
}

/**
 * Check if a URL is from localhost (needs unoptimized images)
 */
export function isLocalhostUrl(url: string): boolean {
  return url.includes("localhost") || url.includes("127.0.0.1");
}

/**
 * Get icon component name from Strapi icon string
 */
export function getIconName(icon: string | undefined): string {
  if (!icon) return "Circle";
  
  // Map common icon names to Lucide icon names
  const iconMap: Record<string, string> = {
    "heart": "Heart",
    "compass": "Compass",
    "footprints": "Footprints",
    "user": "User",
    "heart-handshake": "HeartHandshake",
    "book-open": "BookOpen",
    "check-circle": "CheckCircle",
    "check": "Check",
  };
  
  return iconMap[icon.toLowerCase()] || "Circle";
}
