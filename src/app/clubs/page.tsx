import type { Metadata } from "next";
import Link from "next/link";
import { getAllClubs } from "@/lib/clubs";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Clubs & Organizing Bodies",
  description:
    "Discover the student clubs and organizing communities powering competitions, hackathons, and symposiums at TantraFiesta.",
  alternates: {
    canonical: "/clubs",
  },
  openGraph: {
    title: `Clubs & Organizing Bodies | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description:
      "Discover the student clubs and organizing communities powering competitions, hackathons, and symposiums at TantraFiesta.",
    url: `${siteConfig.url}/clubs`,
  },
  twitter: {
    title: `Clubs & Organizing Bodies | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description:
      "Discover the student clubs and organizing communities powering competitions, hackathons, and symposiums at TantraFiesta.",
  },
};

export default function ClubsIndexPage() {
  const clubs = getAllClubs();

  return (
    <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Clubs & Organizing Groups</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          The technical societies and student communities curating individual events at TantraFiesta.
        </p>
      </header>

      <section id="clubs-directory" aria-labelledby="clubs-heading" className="space-y-6">
        <h2 id="clubs-heading" className="text-2xl font-semibold">
          Organizing Communities
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club) => (
            <Link
              key={club.slug}
              href={`/clubs/${club.slug}`}
              className="group block p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
            >
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {club.name}
              </h3>
              {club.tagline && (
                <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500 font-medium">
                  {club.tagline}
                </p>
              )}
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {club.description}
              </p>
              <span className="mt-4 inline-block text-xs font-semibold text-blue-600 dark:text-blue-400">
                View organized events &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
