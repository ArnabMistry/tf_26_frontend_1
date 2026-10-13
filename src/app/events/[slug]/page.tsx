import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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
  const local = getEventDetail(event.slug);
  return {
    slug: event.slug,
    name: event.name,
    // The backend contract only models a single organizer today; joint events
    // (multiple clubs) aren't representable until it grows a `clubs` field.
    clubs: event.clubs || [event.club],
    description: event.description || event.shortDescription || "",
    poster: event.image || local?.image || local?.poster,
    image: event.image || local?.image,
    prizePool: event.prizes,
    prizes: [{ position: 1 }, { position: 2 }, { position: 3 }],
    stages: local?.stages ?? [],
    organizers: local?.organizers ?? [],
    rules: event.rules ?? local?.rules ?? [],
    // The backend contract has no highlights field yet, and models eligibility
    // as one free-text string rather than the bullet list the page renders.
    highlights: local?.highlights ?? [],
    eligibility: event.eligibility ? [event.eligibility] : (local?.eligibility ?? []),
    registrationUrl: event.registrationUrl,
    entryFeeLabel: !event.price || event.paymentTrigger === "free"
      ? "Free"
      : event.isTeamEvent
        ? `₹${event.price} ${event.feeMode === "per_participant" ? "per participant; team leader pays for all members" : "per team; team leader pays once"}`
        : `₹${event.price} per participant`,
    registrationDeadline: event.registrationDeadline,
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
  const organizers = event.clubs.map((c) => c.name).join(" & ");
  const description =
    event.description ||
    `Join ${event.name} at TantraFiesta 2026, IIIT Nagpur. Organized by ${organizers}. Review rules, schedule, prizes, and registration.`;
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
