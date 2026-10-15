import { connection } from "next/server";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { EventsExplorer } from "@/components/EventsExplorer";
import { Footer } from "@/components/Footer";
import { fetchPublicEvents } from "@/lib/api/events";
import { referenceEvents, toEventListing, type EventListing } from "@/lib/events";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/jsonld";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata(
  "Events",
  "Explore all official technical competitions, hackathons, robotics challenges, and coding contests at TantraFiesta 2026, IIIT Nagpur.",
  "/events",
  {
    keywords: [
      "TantraFiesta events",
      "technical competitions",
      "hackathons 2026",
      "coding competitions",
      "robotics challenges",
      "AI ML competitions",
      "IIIT Nagpur tech fest",
      "TantraFiesta 2026",
      "college technical competitions",
    ],
  }
);

const PINNED_SLUGS = ["cascade", "ragnarok", "last-man-standing"];

function sortWithPinned(list: EventListing[]): EventListing[] {
  const pinned: EventListing[] = [];
  const rest: EventListing[] = [];

  for (const slug of PINNED_SLUGS) {
    const found = list.find((e) => e.id === slug || e.href === `/events/${slug}`);
    if (found) pinned.push(found);
  }

  for (const item of list) {
    const isPinned = PINNED_SLUGS.some((slug) => item.id === slug || item.href === `/events/${slug}`);
    if (!isPinned) rest.push(item);
  }

  return [...pinned, ...rest];
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EventsPage() {
  // Resolve URL filters during server rendering so the event catalog stays crawlable.
  await connection();
  let events: EventListing[] = [];
  try {
    const remote = await fetchPublicEvents();
    if (remote && remote.length > 0) {
      events = remote.map(toEventListing);
    } else {
      events = referenceEvents;
    }
  } catch {
    events = referenceEvents;
  }

  events = sortWithPinned(
    events.filter((e) => {
      const slug = (e.id || "").toLowerCase();
      const name = (e.name || "").toLowerCase();
      const href = (e.href || "").toLowerCase();
      return !slug.includes("edge") && !name.includes("edge case") && !href.includes("edge");
    })
  );

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
  ]);

  const eventCatalogJsonLd = itemListJsonLd(
    events.map((e) => ({
      name: e.name,
      url: e.href || `/events/${e.id}`,
      description: e.description || `${e.name} technical competition at TantraFiesta 2026`,
      image: e.image,
    })),
    "TantraFiesta 2026 Competitions and Events"
  );

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventCatalogJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <a href="#events-content" className={styles.skipLink}>Skip to events</a>
      <Navbar currentPath="/events" registrationHref="/register" />
      <Suspense fallback={<main id="events-content">Loading events…</main>}>
        <EventsExplorer events={events} />
      </Suspense>
      <Footer variant="yellow" />
    </div>
  );
}
