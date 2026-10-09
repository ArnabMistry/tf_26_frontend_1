import type { PublicEvent } from "@/lib/api/events";
import { eventDetails } from "@/lib/eventDetails";

export interface EventListing {
  id: string;
  name: string;
  description: string;
  /** One entry per organizing club; most events have exactly one, joint events have two. */
  clubs: { name: string; slug: string }[];
  /** Category ids, e.g. ["hackathon", "ai-ml"]. An event can belong to more than one. */
  categories: string[];
  prize?: string;
  href?: string;
  registrationUrl?: string;
}

export const eventCategories = [
  { id: "hackathon", label: "Hackathon", heading: "Hackathons" },
  { id: "coding", label: "Coding", heading: "Coding" },
  { id: "ai-ml", label: "AI/ML", heading: "AI / ML" },
  { id: "robotics", label: "Robotics", heading: "Robotics" },
  { id: "design", label: "Design", heading: "Design" },
  { id: "gaming", label: "Gaming", heading: "Gaming" },
  { id: "speaking", label: "Speaking", heading: "Speaking" },
  { id: "creative", label: "Creative", heading: "Creative" },
] as const;

/**
 * Category assignments from the organizing team's event/category breakdown.
 * Keyed by the slug in `eventDetails.ts` — the single source of truth for an
 * event's name, club, and description. An event can carry more than one
 * category (Ragnarok and Cascade are both Hackathon and AI/ML).
 *
 * "edge-case-26" wasn't in that breakdown; it's filed under Hackathon here as
 * a reasonable read of its own "Physical AI hackathon" description pending
 * confirmation from GDG.
 */
const CATEGORIES_BY_SLUG: Record<string, string[]> = {
  algorithmia: ["coding"],
  flashcode: ["coding"],
  bugwars: ["coding"],
  "last-man-standing": ["coding"],
  ragnarok: ["hackathon", "ai-ml"],
  cascade: ["hackathon", "ai-ml"],
  "the-game-jam": ["hackathon"],
  "edge-case-26": ["hackathon"],
  "line-o-mania": ["robotics"],
  "the-lost-pathways": ["robotics"],
  "rann-bhoomi": ["robotics"],
  "design-a-thon": ["design"],
  brandxperience: ["design"],
  "firestorm-rampage": ["gaming"],
  "combat-carnage": ["gaming"],
  "phoenix-cup": ["gaming"],
  "critical-ops": ["gaming"],
  "royale-legends": ["gaming"],
  "rc-24": ["gaming"],
  "knights-legacy": ["gaming"],
  yuvaan: ["speaking"],
  "pitch-please": ["creative"],
  "keep-alive-26": ["creative"],
};

// Derived from eventDetails.ts so the listing page and the event detail pages
// can never drift apart on name, club, or description — only category and
// routing are added here.
export const referenceEvents: EventListing[] = eventDetails.map((event) => ({
  id: event.slug,
  name: event.name,
  description:
    event.description ||
    `Full details for ${event.name} will be announced soon by ${event.clubs.map((c) => c.name).join(" & ")}.`,
  clubs: event.clubs,
  categories: CATEGORIES_BY_SLUG[event.slug] ?? [],
  href: `/events/${event.slug}`,
}));

export function groupEventsForLayout(events: EventListing[]): EventListing[][] {
  const groups: EventListing[][] = [];

  // Repeating pair + centered-card units (not long runs of stacked pairs) so
  // a long list reads as organized clusters instead of one unbroken column.
  for (let offset = 0; offset < events.length; offset += 3) {
    groups.push(events.slice(offset, offset + 3));
  }

  return groups;
}

export function toEventListing(event: PublicEvent): EventListing {
  return {
    id: event.id,
    name: event.name,
    description: event.shortDescription || event.description,
    // The backend contract only models a single organizer today; joint events
    // (multiple clubs) aren't representable until it grows a `clubs` field.
    clubs: [{ name: event.club.name, slug: event.club.slug }],
    categories: event.categories ?? [],
    prize: event.prizes,
    href: `/events/${encodeURIComponent(event.slug)}`,
    registrationUrl: event.registrationUrl,
  };
}
