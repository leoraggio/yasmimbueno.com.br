import { StrapiMedia } from "@/types/strapi";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

/**
 * Get the full URL for a Strapi media file
 */
export function getStrapiMediaUrl(media: StrapiMedia | undefined): string {
  if (!media?.url) return "";
  
  // If it's already a full URL, return as is
  if (media.url.startsWith("http")) {
    return media.url;
  }
  
  // Otherwise, prepend the Strapi URL
  return `${STRAPI_URL}${media.url}`;
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
