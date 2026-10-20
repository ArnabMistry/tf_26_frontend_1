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

import { formatMealsLabel } from "@/lib/eventDetails";

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
  isPaid?: boolean;
  registrationFee?: string;
  meals?: string;
  participationKit?: boolean;
  requirements?: Record<string, unknown> | null;
  date?: string;
  startDate: string;
  endDate?: string;
  venue?: string;
  rules?: string[];
  eligibility?: string;
  /** Total prize pool, already formatted for display (for example "₹35,000"). */
  prizePool?: string;
  /** Optional explanatory note about how the pool is split. */
  prizeNote?: string;
  /** Per-position breakdown from the event brochure. */
  prizeBreakdown?: { position: number; label?: string; amount?: string; note?: string }[];
  /** Legacy summary field used by event listing cards. */
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
  isPublic?: boolean;
  isPublished?: boolean;
  startDate?: string;
  endDate?: string;
  image?: string;
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
  prizePool?: number | string | null;
  prizePoolStr?: string | null;
  prizeNote?: string | null;
  prizeBreakdown?: PublicEvent['prizeBreakdown'];
  requirements?: {
    prizePool?: string | null;
    prizeAmount?: number | null;
    prizeNote?: string | null;
    prizes?: PublicEvent['prizeBreakdown'];
    registrationFee?: string | null;
    meals?: string | null;
    participationKit?: boolean | null;
    [key: string]: unknown;
  } | null;
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
  const rawPrizePool = raw.requirements?.prizePool ?? raw.prizePoolStr ?? raw.prizePool;
  const prizePool = typeof rawPrizePool === 'number'
    ? `₹${new Intl.NumberFormat('en-IN').format(rawPrizePool)}`
    : rawPrizePool?.trim() || undefined;
  return {
    id: raw.id,
    // Prefer the public slug; legacy records expose their ID as the identifier.
    slug: raw.slug || raw.id,
    name: raw.name,
    description: raw.description ?? "",
    club: clubs[0],
    clubs,
    isTeamEvent: raw.isTeamEvent,
    minTeamSize: raw.minTeamSize,
    maxTeamSize: raw.maxTeamSize,
    prizePool,
    prizeNote: raw.requirements?.prizeNote ?? raw.prizeNote ?? undefined,
    prizeBreakdown: raw.requirements?.prizes ?? raw.prizeBreakdown,
    prizes: prizePool,
    price: raw.price,
    feeMode: raw.feeMode,
    paymentTrigger: raw.paymentTrigger,
    isPaid: raw.price !== undefined && raw.price > 0,
    // Always derived from `price`. The `requirements` JSON also carries a
    // registrationFee string, but it is seeded data that no price edit
    // rewrites, so preferring it showed a stale fee forever. The only value
    // the backend itself writes there is "Free", on an event whose price is
    // already 0 - which this expression reports as "Free" anyway.
    registrationFee: raw.price === undefined || raw.price === 0
      ? "Free"
      : `₹${raw.price}${raw.isTeamEvent && raw.feeMode === "per_team" ? " per team" : " per participant"}`,
    meals: raw.requirements?.meals ? formatMealsLabel(raw.requirements.meals) : undefined,
    participationKit: raw.requirements?.participationKit !== undefined ? Boolean(raw.requirements.participationKit) : undefined,
    requirements: raw.requirements,
    venue: raw.venue ?? undefined,
    registrationDeadline: raw.registrationEndTime,
    registrationUrl: `${raw.isTeamEvent ? '/register/team' : '/register/event'}?eventId=${encodeURIComponent(raw.id)}`,
    // Never substitute registration or round deadlines for event dates.
    startDate: raw.startDate || "",
    endDate: raw.endDate,
    image: raw.image,
  };
}

export const BACKEND_API_BASE =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "";

/**
 * Fetches all public events.
 * Unwraps the backend's `{ success, data: { events } }` envelope and
 * normalises each record into the `PublicEvent` shape this frontend uses.
 * Propagates API failures so an outage cannot publish an incomplete sitemap.
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
      const res = await fetch(`${BACKEND_API_BASE.replace(/\/$/, "")}/api/events?page=${page}&limit=100`, {
        next: { revalidate: 60 },
      });

      if (!res.ok) throw new Error(`Public events API returned ${res.status}`);

      // Backend shape: { success: true, data: { events: BackendEvent[], pagination: {...} } }
      const json = await res.json() as { success?: boolean; data?: { events?: BackendEvent[]; pagination?: { totalPages: number } } };
      const raw = json?.data?.events;
      if (json.success !== true || !Array.isArray(raw)) throw new Error("Invalid public event response");
      events.push(...raw.filter(isPublicEvent).map(normaliseBackendEvent));
      totalPages = json.data?.pagination?.totalPages || 1;
      if (!Number.isInteger(totalPages) || totalPages < 1 || totalPages > 1000) throw new Error("Invalid event pagination");
      page++;
    } while (page <= totalPages);
    return [...new Map(events.map(event => [event.slug, event])).values()];
  } catch {
    console.warn("Backend API offline or unreachable; falling back to local brochure data.");
    return [];
  }
}

/**
 * Fetches a single public event by its id / slug.
 * Returns null for a missing public event or API failures.
 */
export async function fetchPublicEventBySlug(
  slug: string
): Promise<PublicEvent | null> {
  if (!BACKEND_API_BASE) {
    return null;
  }

  try {
    // The list supplies the canonical slug and database ID. Do not assume the
    // detail endpoint accepts a slug, or expose duplicate ID aliases.
    const events = await fetchPublicEvents();
    const listed = events.find(event => event.slug === slug);
    if (!listed) return null;
    const res = await fetch(`${BACKEND_API_BASE.replace(/\/$/, "")}/api/events/${encodeURIComponent(listed.id)}`, {
      next: { revalidate: 60 },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Public event API returned ${res.status}`);
    const json = await res.json() as { success?: boolean; data?: BackendEvent };
    if (json.success !== true || !json.data) throw new Error("Invalid public event response");
    return isPublicEvent(json.data) ? { ...normaliseBackendEvent(json.data), slug: listed.slug } : null;
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
  try {
    const allEvents = await fetchPublicEvents();
    return allEvents.filter((event) => (event.clubs || [event.club]).some(club => club.slug === clubSlug));
  } catch {
    return [];
  }
}

/**
 * Fetches all event slugs for dynamic sitemap generation and static generation.
 */
export async function fetchAllEventSlugs(): Promise<string[]> {
  try {
    const events = await fetchPublicEvents();
    return events.map((e) => e.slug);
  } catch {
    return [];
  }
}

/** Safe identifiers from the public endpoint, respecting explicit visibility flags. */
function isPublicEvent(event: BackendEvent): boolean {
  if (
    event.id.toLowerCase().includes("edge_case") ||
    event.name.toLowerCase().includes("edge case") ||
    (event.slug && event.slug.toLowerCase().includes("edge-case"))
  ) {
    return false;
  }
  return event.isPublic !== false && event.isPublished !== false &&
    typeof event.id === "string" && typeof event.name === "string" &&
    /^[a-zA-Z0-9]+(?:[-_][a-zA-Z0-9]+)*$/.test(event.slug || event.id);
}
