import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { BrandFooter } from "@/components/BrandFooter";
import { EventDetail } from "@/components/EventDetail";
import { fetchPublicEventBySlug, type PublicEvent } from "@/lib/api/events";
import {
  getAllEventDetailSlugs,
  getEventDetail,
  type EventDetail as EventDetailData,
} from "@/lib/eventDetails";
import { generateEventJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site";
import styles from "./page.module.css";

/**
 * Pre-render every event page known at build time. Backend slugs are added
 * automatically once the API is configured; until then the local
 * design-reference records drive the route.
 */
export async function generateStaticParams() {
  return getAllEventDetailSlugs().map((slug) => ({ slug }));
}

/** Maps the backend contract onto the shape the detail page renders. */
function fromPublicEvent(event: PublicEvent): EventDetailData {
  return {
    slug: event.slug,
    name: event.name,
    club: { name: event.club.name, slug: event.club.slug },
    description: event.description || event.shortDescription || "",
    poster: event.image,
    prizePool: event.prizes,
    prizes: [{ position: 1 }, { position: 2 }, { position: 3 }],
    stages: [],
    rules: event.rules ?? [],
    organizers: [],
    registrationUrl: event.registrationUrl,
    startDate: event.startDate,
    endDate: event.endDate,
    venue: event.venue,
  };
}

/** Backend data wins when available; otherwise fall back to local content. */
async function resolveEvent(slug: string): Promise<EventDetailData | null> {
  const remote = await fetchPublicEventBySlug(slug);
  return remote ? fromPublicEvent(remote) : getEventDetail(slug);
}

export async function generateMetadata(
  props: PageProps<"/events/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const event = await resolveEvent(slug);

  if (!event) {
    return {
      title: "Event Not Found",
      description: "The requested event could not be found.",
    };
  }

  const title = event.name;
  const description =
    event.description ||
    `Join ${event.name} at TantraFiesta 2026, IIIT Nagpur. Organized by ${event.club.name}. Review rules, schedule, prizes, and registration.`;
  const canonicalUrl = `/events/${event.slug}`;
  const fullUrl = `${siteConfig.url}${canonicalUrl}`;
  const imageUrl = event.poster
    ? event.poster.startsWith("http")
      ? event.poster
      : `${siteConfig.url}${event.poster}`
    : `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | ${siteConfig.fullName} | ${siteConfig.institute}`,
      description,
      url: fullUrl,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${event.name} - TantraFiesta 2026`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.fullName} | ${siteConfig.institute}`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function EventPage(props: PageProps<"/events/[slug]">) {
  const { slug } = await props.params;
  const event = await resolveEvent(slug);

  if (!event) {
    notFound();
  }

  // Schema.org Event requires a start date — skip the markup until one exists.
  const jsonLd = event.startDate
    ? generateEventJsonLd({
        id: event.slug,
        slug: event.slug,
        name: event.name,
        description: event.description,
        club: event.club,
        startDate: event.startDate,
        endDate: event.endDate,
        venue: event.venue,
        rules: event.rules,
        prizes: event.prizePool,
        registrationUrl: event.registrationUrl,
        image: event.poster,
      })
    : null;

  return (
    <div className={styles.page}>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <a href="#event-content" className={styles.skipLink}>
        Skip to event details
      </a>
      <Navbar currentPath="/events" registrationHref={event.registrationUrl ?? "/events"} />
      <EventDetail event={event} />
      <BrandFooter />
    </div>
  );
}
