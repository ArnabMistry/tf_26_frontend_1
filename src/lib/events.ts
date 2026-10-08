import type { PublicEvent } from "@/lib/api/events";

export interface EventListing {
  id: string;
  name: string;
  description: string;
  prize?: string;
  category?: string;
  href?: string;
  registrationUrl?: string;
}

// Design-reference content, used only until a backend URL is configured.
// Registration destinations and club assignments have not been provided yet.
export const referenceEvents: EventListing[] = [
  {
    id: "brandx",
    name: "BrandX",
    description: "Build a brand that stands out. Turn a bold idea into an identity, craft your story, and pitch your vision.",
    prize: "₹40,000",
    category: "hackathon",
  },
  {
    id: "ragnarok",
    name: "Ragnarok",
    description: "Build a brand that stands out. Turn a bold idea into an identity, craft your story, and pitch your vision.",
    prize: "₹20,000",
    category: "hackathon",
  },
  {
    id: "designathon",
    name: "Designathon",
    description: "Build a brand that stands out. Turn a bold idea into an identity, craft your story, and pitch your vision.",
    prize: "₹20,000",
    category: "hackathon",
  },
  // Demo entries for previewing the four-card Design layout.
  {
    id: "design-brandcraft",
    name: "Brandcraft",
    description: "Create a fresh brand identity with a memorable logo, a bold palette, and a story that brings it all together.",
    prize: "₹20,000",
    category: "design",
  },
  {
    id: "design-pixeljam",
    name: "Pixel Jam",
    description: "Turn an everyday problem into a thoughtful app interface. Design the screens and present your user journey.",
    prize: "₹15,000",
    category: "design",
  },
  {
    id: "design-posterlab",
    name: "Poster Lab",
    description: "Make a statement through typography, colour, and composition. Create a poster that captures the theme.",
    prize: "₹10,000",
    category: "design",
  },
  {
    id: "design-motioncraft",
    name: "Motioncraft",
    description: "Bring your ideas to life with motion. Craft a short animated story using shapes, type, and expressive transitions.",
    prize: "₹15,000",
    category: "design",
  },
];

export const eventCategories = [
  { id: "hackathon", label: "Hackathon", heading: "Hackathons" },
  { id: "design", label: "Design", heading: "Design" },
  { id: "ai-ml", label: "AI/ML", heading: "AI / ML" },
  { id: "esports", label: "Esports", heading: "Esports" },
  { id: "photography", label: "Photography", heading: "Photography" },
] as const;

export function groupEventsForLayout(events: EventListing[]): EventListing[][] {
  const groups: EventListing[][] = [];

  for (let offset = 0; offset < events.length;) {
    const remaining = events.length - offset;
    // Lead with paired groups; reserve a final trio instead of leaving one card.
    const size = remaining === 5 || remaining === 6
      ? remaining - 3
      : Math.min(4, remaining);
    groups.push(events.slice(offset, offset + size));
    offset += size;
  }

  return groups;
}

export function toEventListing(event: PublicEvent): EventListing {
  return {
    id: event.id,
    name: event.name,
    description: event.shortDescription || event.description,
    prize: event.prizes,
    href: `/events/${encodeURIComponent(event.slug)}`,
    registrationUrl: event.registrationUrl,
    // The current API contract has no category field. Do not guess from a club.
  };
}
