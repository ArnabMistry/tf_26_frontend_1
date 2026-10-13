import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchEventsByClubSlug } from "@/lib/api/events";
import { getAllClubSlugs, getClubBySlug } from "@/lib/clubs";
import { eventDetails } from "@/lib/eventDetails";
import { siteConfig } from "@/lib/site";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

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
  const description = `${club.name} (${club.tagline || "Organizing Club"}) at TantraFiesta 2026, IIIT Nagpur. ${club.description}`.slice(0, 160);
  const canonicalUrl = `${siteConfig.url}/clubs/${club.slug}`;

  return {
    title,
    description,
    keywords: [
      club.name,
      `${club.name} IIIT Nagpur`,
      "TantraFiesta 2026",
      "organizing club",
      "technical club",
      ...(club.tagline ? [club.tagline] : []),
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | Clubs | ${siteConfig.fullName} | ${siteConfig.institute}`,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: siteConfig.fullName,
      locale: siteConfig.locale,
      images: [
        {
          url: `${siteConfig.url}${siteConfig.ogImage}`,
          width: 1200,
          height: 630,
          alt: `${club.name} - TantraFiesta 2026`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Clubs | ${siteConfig.fullName} | ${siteConfig.institute}`,
      description,
      images: [`${siteConfig.url}${siteConfig.ogImage}`],
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

export default async function ClubDetailPage({ params }: ClubPageProps) {
  const { slug } = await params;
  const club = getClubBySlug(slug);

  if (!club) {
    notFound();
  }

  // Fetch events organized by this club from backend; fall back to local records
  let events = await fetchEventsByClubSlug(slug).catch(() => []);
  if (!events || events.length === 0) {
    events = eventDetails
      .filter((e) => e.clubs.some((c) => c.slug === slug))
      .map((e) => ({
        id: e.slug,
        slug: e.slug,
        name: e.name,
        description: e.description,
        shortDescription: e.tagline,
        club: { name: club.name, slug: club.slug },
        startDate: e.startDate || "2026-10-10T09:00:00+05:30",
        image: e.image || e.poster,
      }));
  }

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Clubs", path: "/clubs" },
    { name: club.name, path: `/clubs/${club.slug}` },
  ]);

  const clubJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: club.name,
    description: club.description,
    url: `${siteConfig.url}/clubs/${club.slug}`,
    parentOrganization: {
      "@type": "EducationalOrganization",
      name: "Indian Institute of Information Technology, Nagpur",
      alternateName: "IIIT Nagpur",
      url: "https://iiitn.ac.in",
    },
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#241A4C] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(clubJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {/* Background layer */}
      <div
        className="fixed inset-0 -z-10 bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat pointer-events-none"
        aria-hidden="true"
      />

      <Navbar currentPath="/clubs" />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full space-y-12">
        <header className="space-y-4">
          {/* Breadcrumb Navigation for SEO & Crawlability */}
          <nav aria-label="Breadcrumb" className="text-sm text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/clubs" className="hover:text-white transition-colors">Clubs</Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-100 font-medium">{club.name}</span>
          </nav>

          {club.tagline && (
            <div className="text-xs uppercase font-semibold tracking-wider text-[#E7137D]">
              {club.tagline}
            </div>
          )}
          <h1 className="page-title text-white drop-shadow-md">{club.name}</h1>
          <p className="text-zinc-300 text-sm md:text-base leading-relaxed max-w-2xl">
            {club.description}
          </p>
        </header>

        {/* Events organized by this club */}
        <section id="organized-events" aria-labelledby="organized-events-heading" className="space-y-6">
          <h2 id="organized-events-heading" className="font-tantra text-2xl uppercase tracking-widest text-[#FFFF1A]">
            Events Organized by {club.name}
          </h2>

          {events.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 list-none p-0 m-0">
              {events.map((event) => (
                <li key={event.slug}>
                  <Link
                    href={`/events/${event.slug}`}
                    className="block p-5 border border-white/10 rounded-2xl bg-white/5 hover:border-[#FFFF1A]/60 hover:bg-white/10 transition-all"
                  >
                    <h3 className="text-lg font-bold text-white">
                      {event.name}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-300 line-clamp-2">
                      {event.shortDescription || event.description}
                    </p>
                    <span className="mt-3 inline-block text-xs font-semibold text-[#FFFF1A]">
                      View event details &rarr;
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 border border-dashed border-white/20 rounded-2xl text-zinc-400">
              <p>
                Events organized by {club.name} will be published shortly via the live event schedule. Check back soon!
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer variant="yellow" />
    </div>
  );
}
