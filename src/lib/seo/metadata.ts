import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export interface PageMetadataOptions {
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
}

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  options?: PageMetadataOptions
): Metadata {
  const fullTitle = `${title} | ${siteConfig.fullName} | ${siteConfig.institute}`;
  const canonicalUrl = `${siteConfig.url}${path === "/" ? "" : path}`;
  const ogImg = options?.image || siteConfig.ogImage;
  const fullOgImg = ogImg.startsWith("http")
    ? ogImg
    : `${siteConfig.url}${ogImg.startsWith("/") ? "" : "/"}${ogImg}`;

  return {
    title,
    description,
    ...(options?.keywords && options.keywords.length > 0 ? { keywords: options.keywords } : {}),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: siteConfig.fullName,
      locale: siteConfig.locale,
      images: [
        {
          url: fullOgImg,
          width: 1200,
          height: 630,
          alt: options?.imageAlt || fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [fullOgImg],
      creator: "@tantrafiesta",
      site: "@tantrafiesta",
    },
    ...(options?.noIndex
      ? { robots: { index: false, follow: false } }
      : {
          robots: {
            index: true,
            follow: true,
            googleBot: {
              index: true,
              follow: true,
              "max-video-preview": -1,
              "max-image-preview": "large",
              "max-snippet": -1,
            },
          },
        }),
  };
}
