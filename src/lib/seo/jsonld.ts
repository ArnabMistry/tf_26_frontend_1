import type { PublicEvent } from "@/lib/api/events";
import { siteConfig } from "@/lib/site";

/**
 * Generates Schema.org Event JSON-LD structured data.
 * Enhances Google rich snippets for individual events.
 */
export function generateEventJsonLd(event: PublicEvent) {
  const eventUrl = `${siteConfig.url}/events/${event.slug}`;
  const imageUrl = event.image
    ? event.image.startsWith("http")
      ? event.image
      : `${siteConfig.url}${event.image}`
    : `${siteConfig.url}/og-image.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.shortDescription || event.description,
    url: eventUrl,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue || "IIIT Nagpur Campus",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Nagpur",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
    },
    image: [imageUrl],
    organizer: {
      "@type": "Organization",
      name: event.club?.name
        ? `${event.club.name} - ${siteConfig.fullName}`
        : siteConfig.fullName,
      url: event.club?.slug
        ? `${siteConfig.url}/clubs/${event.club.slug}`
        : siteConfig.url,
    },
    offers: event.registrationUrl
      ? {
          "@type": "Offer",
          url: event.registrationUrl,
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };
}
