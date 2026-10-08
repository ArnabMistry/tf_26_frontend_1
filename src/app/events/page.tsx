import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { EventsExplorer } from "@/components/EventsExplorer";
import { Footer } from "@/components/Footer";
import { fetchPublicEvents } from "@/lib/api/events";
import { referenceEvents, toEventListing } from "@/lib/events";
import styles from "./page.module.css";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Explore all official technical competitions, hackathons, robotics challenges, and coding contests at TantraFiesta 2026, IIIT Nagpur.",
  alternates: {
    canonical: "/events",
  },
  openGraph: {
    title: `Events | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description:
      "Explore all official technical competitions, hackathons, robotics challenges, and coding contests at TantraFiesta 2026, IIIT Nagpur.",
    url: `${siteConfig.url}/events`,
  },
  twitter: {
    title: `Events | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description:
      "Explore all official technical competitions, hackathons, robotics challenges, and coding contests at TantraFiesta 2026, IIIT Nagpur.",
  },
};

export default async function EventsPage() {
  const hasBackend = Boolean(process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL);
  const events = hasBackend
    ? (await fetchPublicEvents()).map(toEventListing)
    : referenceEvents;

  return (
    <div className={styles.page}>
      <a href="#events-content" className={styles.skipLink}>Skip to events</a>
      <Navbar currentPath="/events" registrationHref="/register" />
      <EventsExplorer events={events} referenceContent={!hasBackend} />
      <Footer variant="yellow" />
    </div>
  );
}
