/**
 * Public Event Data Types & API Client Abstraction
 *
 * Designed for future integration with the backend public event endpoints:
 *   GET /api/events
 *   GET /api/events/{slug}
 *
 * NOTE: The backend repository manages admin endpoints (/api/admin/events).
 * This module defines the read-only contract for public, SEO-indexable event pages.
 */

export interface EventClubReference {
  name: string;
  slug: string;
  id?: string;
}

export interface EventFAQ {
  question: string;
  answer: string;
}

export interface PublicEvent {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  club: EventClubReference;
  date?: string;
  startDate: string;
  endDate?: string;
  venue?: string;
  rules?: string[];
  eligibility?: string;
  prizes?: string;
  /** Category ids matching `eventCategories` in `@/lib/events` (e.g. "hackathon", "ai-ml"). */
  categories?: string[];
  registrationUrl?: string;
  registrationDeadline?: string;
  image?: string;
  faqs?: EventFAQ[];
}

const BACKEND_API_BASE =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "";

/**
 * Fetches all public events.
 * Returns an empty array gracefully if the backend API is not yet reachable.
 */
export async function fetchPublicEvents(): Promise<PublicEvent[]> {
  if (!BACKEND_API_BASE) {
    return [];
  }

  try {
    const res = await fetch(`${BACKEND_API_BASE}/api/events`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return [];
    }

    return (await res.json()) as PublicEvent[];
  } catch {
    return [];
  }
}

/**
 * Fetches a single public event by slug.
 * Returns null if not found or if the backend API is not yet reachable.
 */
export async function fetchPublicEventBySlug(
  slug: string
): Promise<PublicEvent | null> {
  if (!BACKEND_API_BASE) {
    return null;
  }

  try {
    const res = await fetch(`${BACKEND_API_BASE}/api/events/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as PublicEvent;
  } catch {
    return null;
  }
}

/**
 * Fetches public events organized by a specific club slug.
 */
export async function fetchEventsByClubSlug(
  clubSlug: string
): Promise<PublicEvent[]> {
  const allEvents = await fetchPublicEvents();
  return allEvents.filter((event) => event.club.slug === clubSlug);
}

/**
 * Fetches all event slugs for dynamic sitemap generation and static generation.
 */
export async function fetchAllEventSlugs(): Promise<string[]> {
  const events = await fetchPublicEvents();
  return events.map((e) => e.slug);
}
