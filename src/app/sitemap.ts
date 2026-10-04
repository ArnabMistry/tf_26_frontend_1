import type { MetadataRoute } from "next";
import { fetchAllEventSlugs } from "@/lib/api/events";
import { getAllClubSlugs } from "@/lib/clubs";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // 1. Static public routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.url}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/events`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/clubs`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/sponsors`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/speakers`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // 2. Organizing Club routes
  const clubSlugs = getAllClubSlugs();
  const clubRoutes: MetadataRoute.Sitemap = clubSlugs.map((slug) => ({
    url: `${siteConfig.url}/clubs/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 3. Dynamic actual event URLs fetched from backend API
  const eventSlugs = await fetchAllEventSlugs();
  const eventRoutes: MetadataRoute.Sitemap = eventSlugs.map((slug) => ({
    url: `${siteConfig.url}/events/${slug}`,
    lastModified: currentDate,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticRoutes, ...clubRoutes, ...eventRoutes];
}
