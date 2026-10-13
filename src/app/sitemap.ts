import type { MetadataRoute } from "next";
import { fetchAllEventSlugs } from "@/lib/api/events";
import { getAllClubSlugs } from "@/lib/clubs";
import { getAllEventDetailSlugs } from "@/lib/eventDetails";
import { siteConfig } from "@/lib/site";

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

  // 3. Event routes — prefer live backend, fall back to static event detail records
  //    so all 23 pre-rendered event pages always appear in the sitemap even when
  //    BACKEND_API_URL is not set at build time.
  const apiSlugs = await fetchAllEventSlugs();
  const eventSlugs = [...new Set([...getAllEventDetailSlugs(), ...apiSlugs])].sort();
  const eventRoutes: MetadataRoute.Sitemap = eventSlugs.map((slug) => ({
    url: `${siteConfig.url}/events/${slug}`,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticRoutes, ...clubRoutes, ...eventRoutes];
}
