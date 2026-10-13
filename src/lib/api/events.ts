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
  clubs?: EventClubReference[];
  isTeamEvent?: boolean;
  minTeamSize?: number | null;
  maxTeamSize?: number | null;
  price?: number;
  /** Team events only: whether `price` is charged per head or once per team. */
  feeMode?: 'per_team' | 'per_participant';
  paymentTrigger?: string;
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

/**
 * Raw shape returned by the backend's `GET /api/events` and `GET /api/events/:id`.
 * The backend wraps all responses in `{ success, data }` and uses a plain
 * `club` string instead of the `{ name, slug }` object this frontend expects.
 */
interface BackendEvent {
  id: string;
  slug?: string;
  paymentTrigger?: string;
  name: string;
  club: string;           // plain string e.g. "DotSlash"
  description?: string | null;
  venue?: string | null;
  registrationEndTime?: string;
  paymentPageLink?: string | null;
  price?: number;
  feeMode?: 'per_team' | 'per_participant';
  isTeamEvent?: boolean;
  minTeamSize?: number | null;
  maxTeamSize?: number | null;
  rounds?: { roundNumber: number; name?: string; roundEndTime?: string }[];
  _count?: { registrations: number; teams: number };
}

/**
 * Derives a URL-safe slug from a club's display name.
 * "DotSlash" → "dotslash", "GDG IIIT Nagpur" → "gdg-iiit-nagpur"
 */
function clubNameToSlug(name: string): string {
  const aliases: Record<string, string> = {
    'gdg': 'gdg',
    'gdg on campus': 'gdg',
    'dimension': 'dimension',
    'dimensions': 'dimension',
    'the orator club': 'orator',
    'orator': 'orator',
    'iotics': 'iotics',
    'elevate': 'elevate',
    'the orator club x probe': 'orator',
  };
  const lower = name.toLowerCase().trim();
  if (aliases[lower]) return aliases[lower];
  return lower
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Normalises a raw backend event record into the `PublicEvent` contract this
 * frontend consumes. Static content (categories, prize strings, rules) is not
 * sent by the backend — callers merge it from `eventDetails.ts` separately.
 */
function normaliseBackendEvent(raw: BackendEvent): PublicEvent {
  const clubName = raw.club ?? "TantraFiesta";
  const clubs = clubName.split(/\s+[xX&]\s+/).map(name => ({ name: name.trim(), slug: clubNameToSlug(name) }));
  return {
    id: raw.id,
    // Backend has no slug column; derive it from the event id which is already
    // a dash-separated identifier (e.g. "algorithmia", "cascade").
    slug: raw.slug || raw.id,
    name: raw.name,
    description: raw.description ?? "",
    club: clubs[0],
    clubs,
    isTeamEvent: raw.isTeamEvent,
    minTeamSize: raw.minTeamSize,
    maxTeamSize: raw.maxTeamSize,
    price: raw.price,
    feeMode: raw.feeMode,
    paymentTrigger: raw.paymentTrigger,
    venue: raw.venue ?? undefined,
    registrationDeadline: raw.registrationEndTime,
    registrationUrl: `${raw.isTeamEvent ? '/register/team' : '/register/event'}?eventId=${encodeURIComponent(raw.id)}`,
    // startDate / endDate not stored on the backend yet — leave undefined so
    // the detail page falls back gracefully to its "TBA" state.
    startDate: "",
  };
}

const BACKEND_API_BASE =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "";

/**
 * Fetches all public events.
 * Unwraps the backend's `{ success, data: { events } }` envelope and
 * normalises each record into the `PublicEvent` shape this frontend uses.
 * Returns an empty array gracefully if the backend is not reachable.
 */
export async function fetchPublicEvents(): Promise<PublicEvent[]> {
  if (!BACKEND_API_BASE) {
    return [];
  }

  try {
    const events: PublicEvent[] = [];
    let page = 1;
    let totalPages = 1;
    do {
    const res = await fetch(`${BACKEND_API_BASE}/api/events?page=${page}&limit=100`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    // Backend shape: { success: true, data: { events: BackendEvent[], pagination: {...} } }
    const json = await res.json() as { success?: boolean; data?: { events?: BackendEvent[]; pagination?: { totalPages: number } } };
    const raw = json?.data?.events ?? [];
    if (!Array.isArray(raw)) return [];
    events.push(...raw.map(normaliseBackendEvent));
    totalPages = json.data?.pagination?.totalPages || 1;
    page++;
    } while (page <= totalPages);
    return events;
  } catch {
    return [];
  }
}

/**
 * Fetches a single public event by its id / slug.
 * Returns null if not found or if the backend is not reachable.
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

    if (!res.ok) return null;

    // Backend shape: { success: true, data: { ...BackendEvent } }
    const json = await res.json() as { success?: boolean; data?: BackendEvent };
    const raw = json?.data;
    return raw ? normaliseBackendEvent(raw) : null;
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
  return allEvents.filter((event) => (event.clubs || [event.club]).some(club => club.slug === clubSlug));
}

/**
 * Fetches all event slugs for dynamic sitemap generation and static generation.
 */
export async function fetchAllEventSlugs(): Promise<string[]> {
  const events = await fetchPublicEvents();
  return events.map((e) => e.slug);
}
