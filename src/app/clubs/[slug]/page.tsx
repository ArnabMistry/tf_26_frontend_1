import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchEventsByClubSlug } from "@/lib/api/events";
import { getAllClubSlugs, getClubBySlug } from "@/lib/clubs";
import { siteConfig } from "@/lib/site";

interface ClubPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return getAllClubSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: ClubPageProps): Promise<Metadata> {
  const { slug } = await params;
  const club = getClubBySlug(slug);

  if (!club) {
    return {
      title: "Club Not Found",
      description: "The requested organizing club could not be found.",
    };
  }

  const title = club.name;
  const description = `${club.name} (${club.tagline || "Organizing Club"}) at TantraFiesta 2026, IIIT Nagpur. ${club.description}`;
  const canonicalUrl = `/clubs/${club.slug}`;
  const fullUrl = `${siteConfig.url}${canonicalUrl}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | Clubs | ${siteConfig.fullName} | ${siteConfig.institute}`,
      description,
      url: fullUrl,
      type: "website",
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${club.name} - TantraFiesta`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Clubs | ${siteConfig.fullName} | ${siteConfig.institute}`,
      description,
      images: [siteConfig.ogImage],
    },
  };
}

export default async function ClubDetailPage({ params }: ClubPageProps) {
  const { slug } = await params;
  const club = getClubBySlug(slug);

  if (!club) {
    notFound();
  }

  // Fetch events organized by this club from the backend API interface
  const events = await fetchEventsByClubSlug(slug);

  return (
    <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full space-y-12">
      <header className="space-y-4">
        {/* Breadcrumb Navigation for SEO & Crawlability */}
        <nav aria-label="Breadcrumb" className="text-sm text-zinc-500">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/clubs" className="hover:underline">Clubs</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-900 dark:text-zinc-100 font-medium">{club.name}</span>
        </nav>

        {club.tagline && (
          <div className="text-xs uppercase font-semibold tracking-wider text-blue-600 dark:text-blue-400">
            {club.tagline}
          </div>
        )}
        <h1 className="text-4xl font-bold tracking-tight">{club.name}</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {club.description}
        </p>
      </header>

      {/* Events organized by this club */}
      <section id="organized-events" aria-labelledby="organized-events-heading" className="space-y-6">
        <h2 id="organized-events-heading" className="text-2xl font-semibold">
          Events Organized by {club.name}
        </h2>

        {events.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 list-none p-0 m-0">
            {events.map((event) => (
              <li key={event.slug}>
                <Link
                  href={`/events/${event.slug}`}
                  className="block p-5 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {event.name}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {event.shortDescription || event.description}
                  </p>
                  <span className="mt-3 inline-block text-xs font-semibold text-blue-600 dark:text-blue-400">
                    View event details &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-600 dark:text-zinc-400">
            <p>
              Events organized by {club.name} will be published shortly via the live event schedule. Check back soon!
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
