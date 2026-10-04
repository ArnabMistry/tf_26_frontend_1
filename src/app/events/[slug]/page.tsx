import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchAllEventSlugs, fetchPublicEventBySlug } from "@/lib/api/events";
import { generateEventJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site";

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Pre-render known event pages statically at build time if available from backend.
 */
export async function generateStaticParams() {
  const slugs = await fetchAllEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Dynamic SEO metadata generator for individual event pages.
 * Optimized for queries like "<Event Name> TantraFiesta" and "<Event Name> IIIT Nagpur".
 */
export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchPublicEventBySlug(slug);

  if (!event) {
    return {
      title: "Event Not Found",
      description: "The requested event could not be found.",
    };
  }

  const title = event.name;
  const description =
    event.shortDescription ||
    event.description ||
    `Join ${event.name} at TantraFiesta 2026, IIIT Nagpur. Organized by ${event.club.name}. Review rules, schedule, prizes, and registration.`;
  const canonicalUrl = `/events/${event.slug}`;
  const fullUrl = `${siteConfig.url}${canonicalUrl}`;
  const imageUrl = event.image
    ? event.image.startsWith("http")
      ? event.image
      : `${siteConfig.url}${event.image}`
    : `${siteConfig.url}/og-image.jpg`;

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

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await fetchPublicEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const jsonLd = generateEventJsonLd(event);

  return (
    <>
      {/* Schema.org Event JSON-LD structured data for Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full space-y-10">
        {/* Breadcrumb Navigation for SEO */}
        <nav aria-label="Breadcrumb" className="text-sm text-zinc-500">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/events" className="hover:underline">Events</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-900 dark:text-zinc-100 font-medium">{event.name}</span>
        </nav>

        <header className="space-y-4">
          {/* Internal linking: Link to organizing club page */}
          {event.club && (
            <div className="text-sm">
              <span className="text-zinc-500">Organized by </span>
              <Link
                href={`/clubs/${event.club.slug}`}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {event.club.name}
              </Link>
            </div>
          )}

          <h1 className="text-4xl font-bold tracking-tight">{event.name}</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {event.description}
          </p>
        </header>

        {/* Event Schedule & Venue */}
        <section id="schedule-venue" aria-labelledby="schedule-heading" className="space-y-4">
          <h2 id="schedule-heading" className="text-2xl font-semibold">
            Schedule & Venue
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 text-zinc-600 dark:text-zinc-400">
            {event.venue && (
              <div>
                <strong className="text-zinc-900 dark:text-zinc-100">Venue:</strong>{" "}
                <span>{event.venue}</span>
              </div>
            )}
            {event.startDate && (
              <div>
                <strong className="text-zinc-900 dark:text-zinc-100">Starts:</strong>{" "}
                <span>{new Date(event.startDate).toLocaleString()}</span>
              </div>
            )}
            {event.endDate && (
              <div>
                <strong className="text-zinc-900 dark:text-zinc-100">Ends:</strong>{" "}
                <span>{new Date(event.endDate).toLocaleString()}</span>
              </div>
            )}
            {event.registrationDeadline && (
              <div>
                <strong className="text-zinc-900 dark:text-zinc-100">Registration Deadline:</strong>{" "}
                <span>{new Date(event.registrationDeadline).toLocaleString()}</span>
              </div>
            )}
          </div>
        </section>

        {/* Eligibility & Prizes */}
        {(event.eligibility || event.prizes) && (
          <section id="eligibility-prizes" aria-labelledby="eligibility-heading" className="space-y-4">
            <h2 id="eligibility-heading" className="text-2xl font-semibold">
              Eligibility & Rewards
            </h2>
            <div className="space-y-3 text-zinc-600 dark:text-zinc-400">
              {event.eligibility && (
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100">Eligibility:</strong>{" "}
                  <p>{event.eligibility}</p>
                </div>
              )}
              {event.prizes && (
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100">Prizes:</strong>{" "}
                  <p>{event.prizes}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Rules */}
        {event.rules && event.rules.length > 0 && (
          <section id="rules" aria-labelledby="rules-heading" className="space-y-4">
            <h2 id="rules-heading" className="text-2xl font-semibold">
              Rules & Guidelines
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
              {event.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQs */}
        {event.faqs && event.faqs.length > 0 && (
          <section id="faqs" aria-labelledby="faqs-heading" className="space-y-4">
            <h2 id="faqs-heading" className="text-2xl font-semibold">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {event.faqs.map((faq, idx) => (
                <div key={idx} className="space-y-1">
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Registration CTA */}
        {event.registrationUrl && (
          <section id="registration" aria-labelledby="registration-heading" className="pt-4">
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              Register Now &rarr;
            </a>
          </section>
        )}
      </article>
    </>
  );
}
