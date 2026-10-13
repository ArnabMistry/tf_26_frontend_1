import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventDetail } from "@/components/EventDetail";
import { BACKEND_API_BASE, fetchAllEventSlugs, fetchPublicEventBySlug, type PublicEvent } from "@/lib/api/events";
import {
  getAllEventDetailSlugs,
  getEventDetail,
  type EventDetail as EventDetailData,
} from "@/lib/eventDetails";
import { generateEventJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site";
import styles from "./page.module.css";

/**
 * Pre-render every event page known at build time. Backend slugs are added
 * automatically once the API is configured; until then the local
 * design-reference records drive the route.
 */
export async function generateStaticParams() {
  return (BACKEND_API_BASE ? await fetchAllEventSlugs() : getAllEventDetailSlugs()).map((slug) => ({ slug }));
}

/** Maps the backend contract onto the shape the detail page renders. */
function fromPublicEvent(event: PublicEvent): EventDetailData {
  const local = getEventDetail(event.slug);
  return {
    ...local,
    slug: event.slug,
    name: event.name,
    // Joint clubs are supplied by the normalized API contract.
    clubs: event.clubs || [event.club],
    description: local?.description || event.description || event.shortDescription || "",
    poster: event.image || local?.image || local?.poster,
    image: event.image || local?.image,
    prizePool: event.prizes || local?.prizePool,
    prizes: local?.prizes ?? [],
    stages: local?.stages ?? [],
    organizers: local?.organizers ?? [],
    rules: event.rules ?? local?.rules ?? [],
    // The backend contract has no highlights field yet, and models eligibility
    // as one free-text string rather than the bullet list the page renders.
    highlights: local?.highlights ?? [],
    eligibility: event.eligibility ? [event.eligibility] : (local?.eligibility ?? []),
    registrationUrl: event.registrationUrl,
    registrationDeadline: event.registrationDeadline,
    startDate: event.startDate || undefined,
    endDate: event.endDate,
    registrationFee: event.price === undefined ? undefined : event.price === 0 ? "Free" : `₹${event.price}`,
    teamSize: event.minTeamSize && event.maxTeamSize ? { min: event.minTeamSize, max: event.maxTeamSize } : local?.teamSize,
    venue: event.venue,
  };
}

/** The configured API controls existence; local brochures enrich its records. */
const resolveEvent = cache(async (slug: string): Promise<EventDetailData | null> => {
  const remote = await fetchPublicEventBySlug(slug);
  return remote ? fromPublicEvent(remote) : BACKEND_API_BASE ? null : getEventDetail(slug);
});

export const revalidate = 60;

export async function generateMetadata(
  props: PageProps<"/events/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const event = await resolveEvent(slug);

  if (!event) {
    notFound();
  }

  const title = event.name;
  const organizers = event.clubs.map((c) => c.name).join(" & ");
  const description = (
    event.description ||
    `Join ${event.name} at TantraFiesta 2026, IIIT Nagpur. Organized by ${organizers}. Review rules, schedule, prizes, and registration.`
  ).replace(/\s+/g, " ").trim().slice(0, 160);
  const canonicalUrl = `/events/${event.slug}`;
  const fullUrl = `${siteConfig.url}${canonicalUrl}`;
  const posterSrc = event.image || event.poster;
  const imageUrl = posterSrc
    ? posterSrc.startsWith("http")
      ? posterSrc
      : `${siteConfig.url}${posterSrc}`
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

  // Registration windows in the brochure are not verified event dates.
  const jsonLd = BACKEND_API_BASE && event.startDate && !Number.isNaN(Date.parse(event.startDate))
    ? generateEventJsonLd({
        id: event.slug,
        slug: event.slug,
        name: event.name,
        description: event.description,
        // Schema.org Event models a single organizer; joint events are
        // credited to their first-listed club here.
        club: event.clubs[0],
        startDate: event.startDate,
        endDate: event.endDate,
        venue: event.venue,
        rules: event.rules,
        prizes: event.prizePool,
        registrationUrl: event.registrationUrl,
        image: event.image || event.poster,
      })
    : null;

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Events", path: "/events" }, { name: event.name, path: `/events/${event.slug}` }])).replace(/</g, "\\u003c") }} />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      )}
      <a href="#event-content" className={styles.skipLink}>
        Skip to event details
      </a>
      <Navbar currentPath="/events" registrationHref={event.registrationUrl ?? "/register"} />
      <EventDetail event={event} />
      <Footer variant="yellow" />
    </div>
  );
}
