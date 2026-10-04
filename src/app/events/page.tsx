import type { Metadata } from "next";
import Link from "next/link";
import { fetchPublicEvents } from "@/lib/api/events";
import { getAllClubs } from "@/lib/clubs";
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
  const events = await fetchPublicEvents();
  const clubs = getAllClubs();

  return (
    <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Competitions & Events</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Individual competitive challenges, hackathons, and technical sprints organized across student clubs at IIIT Nagpur.
        </p>
      </header>

      {/* Events Listing */}
      <section id="all-events" aria-labelledby="events-heading" className="space-y-6">
        <h2 id="events-heading" className="text-2xl font-semibold">
          All Events
        </h2>

        {events.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
            {events.map((event) => (
              <li key={event.slug}>
                <Link
                  href={`/events/${event.slug}`}
                  className="block p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                >
                  <div className="text-xs uppercase font-medium text-blue-600 dark:text-blue-400">
                    {event.club.name}
                  </div>
                  <h3 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    {event.name}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {event.shortDescription || event.description}
                  </p>
                  <span className="mt-4 inline-block text-xs font-semibold text-blue-600 dark:text-blue-400">
                    View event &amp; register &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg space-y-3 text-zinc-600 dark:text-zinc-400">
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
              Event Announcements Coming Soon
            </h3>
            <p>
              Official competition problem statements and registration links will sync dynamically once the public event schedule goes live.
            </p>
          </div>
        )}
      </section>

      {/* Organizing Communities Section for internal linking */}
      <section id="browse-by-club" aria-labelledby="browse-heading" className="space-y-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <div className="space-y-2">
          <h2 id="browse-heading" className="text-2xl font-semibold">
            Browse by Organizing Club
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Each student club at TantraFiesta hosts dedicated technical events, workshops, and challenges.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {clubs.map((club) => (
            <Link
              key={club.slug}
              href={`/clubs/${club.slug}`}
              className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
            >
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                {club.name}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">{club.tagline}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
