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
 * Pre-render every event page known at build time. Combines backend slugs
 * and local design-reference records so all events are statically built.
 */
export async function generateStaticParams() {
  const remoteSlugs = BACKEND_API_BASE ? await fetchAllEventSlugs().catch(() => []) : [];
  const localSlugs = getAllEventDetailSlugs();
  const allSlugs = [...new Set([...remoteSlugs, ...localSlugs])];
  return allSlugs.map((slug) => ({ slug }));
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
    entryFeeLabel: !event.price || event.paymentTrigger === "free"
      ? "Free"
      : event.isTeamEvent
        ? `₹${event.price} ${event.feeMode === "per_participant" ? "per participant; team leader pays for all members" : "per team; team leader pays once"}`
        : `₹${event.price} per participant`,
    registrationDeadline: event.registrationDeadline,
    startDate: event.startDate || undefined,
    endDate: event.endDate,
    registrationFee: event.price === undefined ? undefined : event.price === 0 ? "Free" : `₹${event.price}`,
    teamSize: event.minTeamSize && event.maxTeamSize ? { min: event.minTeamSize, max: event.maxTeamSize } : local?.teamSize,
    venue: event.venue,
  };
}

/** Resolves event from API backend if available; falls back smoothly to local verified record. */
const resolveEvent = cache(async (slug: string): Promise<EventDetailData | null> => {
  const normalizedSlug = slug.toLowerCase();
  const remote = await fetchPublicEventBySlug(normalizedSlug).catch(() => null);
  if (remote) {
    return fromPublicEvent(remote);
  }
  return getEventDetail(normalizedSlug) || getEventDetail(slug) || null;
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

  // Include the primary descriptor / tagline in the title so Google indexes format queries
  // e.g. "Algorithmia — The ICPC-style coding challenge | TantraFiesta 2026 | IIIT Nagpur"
  const title = event.tagline
    ? `${event.name} — ${event.tagline}`
    : event.name;

  const organizers = event.clubs.map((c) => c.name).join(" & ");

  // High-CTR snippet answering search queries: what it is, college, prizes, organizers & CTA
  const descPrefix = event.tagline
    ? `${event.name} (${event.tagline}) at TantraFiesta 2026, IIIT Nagpur.`
    : `${event.name} — Official Competition at TantraFiesta 2026, IIIT Nagpur.`;
  const descPrize = event.prizePool ? ` Prize Pool: ${event.prizePool}.` : "";
  const descClub = organizers ? ` Organized by ${organizers}.` : "";

  let description = `${descPrefix}${descPrize}${descClub} View rules, schedule, prizes & registration details.`;
  if (description.length > 160) {
    description = `${descPrefix}${descPrize} View rules, schedule & registration details.`;
  }
  if (description.length > 160) {
    description = `${descPrefix}${descPrize} Review stages and registration details.`;
  }

  const canonicalUrl = `${siteConfig.url}/events/${event.slug.toLowerCase()}`;
  const posterSrc = event.image || event.poster;
  const imageUrl = posterSrc
    ? posterSrc.startsWith("http")
      ? posterSrc
      : `${siteConfig.url}${posterSrc.startsWith("/") ? "" : "/"}${posterSrc}`
    : `${siteConfig.url}${siteConfig.ogImage}`;

  const nameSpaced = event.name.replace(/[-_]/g, " ");
  const nameCondensed = event.name.replace(/[\s-_]/g, "");

  const keywords = [
    event.name,
    nameSpaced,
    nameCondensed,
    `${event.name} 2026`,
    `${event.name} event`,
    `${event.name} competition`,
    `${event.name} registration`,
    `${event.name} TantraFiesta`,
    `${event.name} TantraFiesta 2026`,
    `${event.name} IIIT Nagpur`,
    `${event.name} IIITN`,
    ...(event.tagline ? [event.tagline, `${event.name} ${event.tagline}`] : []),
    ...event.clubs.map((c) => c.name),
    ...event.clubs.map((c) => `${event.name} ${c.name}`),
    "TantraFiesta 2026",
    "IIIT Nagpur",
    "technical fest competition",
    "coding contest",
    "hackathons",
    "robotics challenge",
    ...(event.prizePool ? [`${event.name} prizes`, `prize pool ${event.prizePool}`] : []),
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | ${siteConfig.fullName} | ${siteConfig.institute}`,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: siteConfig.fullName,
      locale: siteConfig.locale,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${event.name} - ${siteConfig.fullName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.fullName} | ${siteConfig.institute}`,
      description,
      images: [imageUrl],
      creator: "@tantrafiesta",
      site: "@tantrafiesta",
    },
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
  };
}

export default async function EventPage(props: PageProps<"/events/[slug]">) {
  const { slug } = await props.params;
  const event = await resolveEvent(slug);

  if (!event) {
    notFound();
  }

  const jsonLd = generateEventJsonLd({
    slug: event.slug,
    name: event.name,
    description: event.description,
    tagline: event.tagline,
    club: event.clubs[0],
    clubs: event.clubs,
    startDate: event.startDate,
    endDate: event.endDate,
    venue: event.venue,
    mode: event.mode,
    rules: event.rules,
    prizePool: event.prizePool,
    registrationUrl: event.registrationUrl,
    image: event.image || event.poster,
    registrationDeadline: event.registrationDeadline,
    registrationOpens: event.registrationOpens,
  });

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Events", path: "/events" },
              { name: event.name, path: `/events/${event.slug}` },
            ])
          ).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <a href="#event-content" className={styles.skipLink}>
        Skip to event details
      </a>
      <Navbar currentPath="/events" registrationHref={event.registrationUrl ?? "/register"} />
      <EventDetail event={event} />
      <Footer variant="yellow" />
    </div>
  );
}
