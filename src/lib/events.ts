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
];

// The repeated Esports tab follows the supplied design.
export const eventCategories = [
  { id: "hackathon", label: "Hackathon", heading: "Hackathons" },
  { id: "design", label: "Design", heading: "Design" },
  { id: "ai-ml", label: "AI/ML", heading: "AI / ML" },
  { id: "esports", label: "Esports", heading: "Esports" },
  { id: "photography", label: "Photography", heading: "Photography" },
  { id: "esports", label: "Esports", heading: "Esports" },
] as const;

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
