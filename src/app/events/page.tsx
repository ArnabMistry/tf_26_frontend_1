import { connection } from "next/server";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { EventsExplorer } from "@/components/EventsExplorer";
import { Footer } from "@/components/Footer";
import { fetchPublicEvents } from "@/lib/api/events";
import { referenceEvents, toEventListing } from "@/lib/events";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata("Events", "Explore all official technical competitions, hackathons, robotics challenges, and coding contests at TantraFiesta 2026, IIIT Nagpur.", "/events");

export default async function EventsPage() {
  // Resolve URL filters during server rendering so the event catalog stays crawlable.
  await connection();
  const hasBackend = Boolean(process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL);
  const events = hasBackend
    ? (await fetchPublicEvents()).map(toEventListing)
    : referenceEvents;

  return (
    <div className={styles.page}>
      <a href="#events-content" className={styles.skipLink}>Skip to events</a>
      <Navbar currentPath="/events" registrationHref="/register" />
      <Suspense fallback={<main id="events-content">Loading events…</main>}>
        <EventsExplorer events={events} />
      </Suspense>
      <Footer variant="yellow" />
    </div>
  );
}
