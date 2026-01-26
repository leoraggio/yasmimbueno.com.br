import { MetadataRoute } from "next";

const BASE_URL = "https://yasmimbueno.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    // Blog routes will be added in Phase 3
    // {
    //   url: `${BASE_URL}/blog`,
    //   lastModified: new Date(),
    //   changeFrequency: "weekly" as const,
    //   priority: 0.8,
    // },
  ];

  return routes;
}
