import type { NextConfig } from "next";

/**
 * No `images.remotePatterns` and no `/admin` redirect: every image the page
 * shows is committed under `public/`, and there is no CMS behind the site to
 * send anyone to. Both went with the Strapi layer.
 */
const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default nextConfig;
