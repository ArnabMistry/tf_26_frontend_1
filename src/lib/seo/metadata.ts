import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const fullTitle = `${title} | ${siteConfig.fullName} | ${siteConfig.institute}`;
  return {
    title, description,
    alternates: { canonical: `${siteConfig.url}${path === "/" ? "" : path}` },
    openGraph: {
      type: "website", title: fullTitle, description,
      url: `${siteConfig.url}${path === "/" ? "" : path}`,
      siteName: siteConfig.fullName, locale: siteConfig.locale,
      images: [{ url: siteConfig.ogImage, alt: siteConfig.fullName }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [siteConfig.ogImage] },
  };
}
