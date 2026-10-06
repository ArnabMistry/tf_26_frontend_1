import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path((?!$|_next|favicon.ico|assets|fonts|robots.txt|sitemap.xml).*)",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
