import { connection } from "next/server";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { EventsExplorer } from "@/components/EventsExplorer";
import { Footer } from "@/components/Footer";
import { fetchPublicEvents } from "@/lib/api/events";
import { referenceEvents, toEventListing } from "@/lib/events";
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

export default async function EventsPage() {
  // Resolve URL filters during server rendering so the event catalog stays crawlable.
  await connection();
  const hasBackend = Boolean(process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL);
  let events = referenceEvents;

  if (hasBackend) {
    try {
      const remote = await fetchPublicEvents();
      if (remote && remote.length > 0) {
        events = remote.map(toEventListing);
      }
    } catch {
      events = referenceEvents;
    }
  }

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
