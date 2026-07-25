import { MetadataRoute } from "next";

const BASE_URL = "https://yasmimbueno.com.br";

/** One page, one URL. The blog and its posts are gone. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
