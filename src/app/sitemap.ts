import type { MetadataRoute } from "next";
import { BACKEND_API_BASE, fetchAllEventSlugs } from "@/lib/api/events";
import { getAllClubSlugs } from "@/lib/clubs";
import { getAllEventDetailSlugs } from "@/lib/eventDetails";
import { siteConfig } from "@/lib/site";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static public routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.url}`,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/events`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/clubs`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/about`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/sponsors`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/speakers`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/contact`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/developers`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // 2. Organizing Club routes
  const clubSlugs = getAllClubSlugs();
  const clubRoutes: MetadataRoute.Sitemap = clubSlugs.map((slug) => ({
    url: `${siteConfig.url}/clubs/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Match the event route resolver: the configured public API is authoritative.
  const slugs = BACKEND_API_BASE ? await fetchAllEventSlugs() : getAllEventDetailSlugs();
  const eventSlugs = [...new Set(slugs)].filter(slug => /^[a-zA-Z0-9]+(?:[-_][a-zA-Z0-9]+)*$/.test(slug)).sort();
  const eventRoutes: MetadataRoute.Sitemap = eventSlugs.map((slug) => ({
    url: `${siteConfig.url}/events/${slug}`,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticRoutes, ...clubRoutes, ...eventRoutes];
}
