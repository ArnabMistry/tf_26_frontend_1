import type { NextConfig } from "next";

if (process.env.NODE_ENV === 'production') {
  const required = ['NEXT_PUBLIC_SITE_URL', 'NEXT_PUBLIC_API_URL', 'BACKEND_API_URL'] as const;
  const missing = required.filter(key => !process.env[key]?.trim());
  if (missing.length) throw new Error(`Missing frontend production configuration: ${missing.join(', ')}`);

  if (process.env.TF26_DEPLOY_BUILD === 'true') {
    for (const key of ['NEXT_PUBLIC_SITE_URL', 'NEXT_PUBLIC_API_URL'] as const) {
      const value = process.env[key]!;
      if (!URL.canParse(value) || new URL(value).protocol !== 'https:') {
        throw new Error(`${key} must be an HTTPS URL for deployment`);
      }
    }
    const backend = new URL(process.env.BACKEND_API_URL!);
    if (!['127.0.0.1', 'localhost'].includes(backend.hostname)) {
      throw new Error('BACKEND_API_URL must point to the local API on this VPS');
    }
  }
}

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};

export default nextConfig;
