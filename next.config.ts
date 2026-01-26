import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/**",
      },
      {
        // Strapi Cloud main domain
        protocol: "https",
        hostname: "*.strapiapp.com",
        pathname: "/**",
      },
      {
        // Strapi Cloud specific subdomain
        protocol: "https",
        hostname: "promising-benefit-793e66c25a.strapiapp.com",
        pathname: "/**",
      },
      {
        // Strapi Cloud media CDN (AWS S3)
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
        pathname: "/**",
      },
      {
        // Strapi Cloud media CDN alternate pattern
        protocol: "https",
        hostname: "s3.*.amazonaws.com",
        pathname: "/**",
      },
      {
        // Strapi media bucket
        protocol: "https",
        hostname: "*.media.strapiapp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.yasmimbueno.com.br",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
