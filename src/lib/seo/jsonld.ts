import type { PublicEvent } from "@/lib/api/events";
import { siteConfig } from "@/lib/site";

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem", position: index + 1, name: item.name,
      item: `${siteConfig.url}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

/** Emit only fields actually supplied by the public API. Registration dates
 * are not event start dates; unknown attendance, status and offers are omitted. */
export function generateEventJsonLd(event: PublicEvent) {
  return {
    "@context": "https://schema.org", "@type": "Event",
    name: event.name, description: event.description,
    url: `${siteConfig.url}/events/${event.slug}`,
    startDate: event.startDate,
    endDate: event.endDate || undefined,
    image: [new URL(event.image || siteConfig.ogImage, siteConfig.url).href],
    location: event.venue ? { "@type": "Place", name: event.venue } : undefined,
    organizer: { "@type": "Organization", name: event.club.name },
  };
}
