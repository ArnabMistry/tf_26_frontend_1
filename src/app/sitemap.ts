import type { MetadataRoute } from "next";
import { BACKEND_API_BASE, fetchAllEventSlugs } from "@/lib/api/events";
import { getAllClubSlugs } from "@/lib/clubs";
import { getAllEventDetailSlugs } from "@/lib/eventDetails";
import { siteConfig } from "@/lib/site";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1. Static public routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.url}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/events`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/clubs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/itinerary`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/sponsors`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/speakers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/developers`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/faqs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/refund-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // 2. Organizing Club routes
  const clubSlugs = getAllClubSlugs();
  const clubRoutes: MetadataRoute.Sitemap = clubSlugs.map((slug) => ({
    url: `${siteConfig.url}/clubs/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 3. Match the event route resolver: merge backend and verified local slugs
  const remoteSlugs = BACKEND_API_BASE ? await fetchAllEventSlugs().catch(() => []) : [];
  const localSlugs = getAllEventDetailSlugs();
  const allSlugs = [...new Set([...remoteSlugs, ...localSlugs])];
  const eventSlugs = allSlugs
    .filter((slug) => /^[a-zA-Z0-9]+(?:[-_][a-zA-Z0-9]+)*$/.test(slug))
    .sort();

  const eventRoutes: MetadataRoute.Sitemap = eventSlugs.map((slug) => ({
    url: `${siteConfig.url}/events/${slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticRoutes, ...clubRoutes, ...eventRoutes];
}
