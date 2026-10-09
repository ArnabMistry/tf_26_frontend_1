export interface ClubInfo {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  /** Path under /public to the club's real logo mark. Omitted when no asset exists yet. */
  logo?: string;
}

export const KNOWN_CLUBS: readonly ClubInfo[] = [
  {
    id: "central-tf",
    slug: "central-tf",
    name: "Central TF",
    tagline: "Core Organizing Committee",
    description:
      "The central organizing and executive body coordinating the flagship symposiums, ceremonies, and overarching operations of TantraFiesta.",
  },
  {
    id: "elevate",
    slug: "elevate",
    name: "Elevate",
    tagline: "Development & Hackathons",
    description:
      "Technical society focused on software development, open-source projects, and intense competitive hackathons.",
    logo: "/assets/club-logos/elevate.png",
  },
  {
    id: "orator",
    slug: "orator",
    name: "Orator",
    tagline: "Debating & Public Discourse",
    description:
      "Public speaking and literary community hosting debates, keynote panels, and leadership symposiums.",
    logo: "/assets/club-logos/orator.png",
  },
  {
    id: "crispr",
    slug: "crispr",
    name: "CRISPR",
    tagline: "Algorithms & Scientific Computing",
    description:
      "Special interest group exploring computational biology, bioinformatics, and deep algorithmic challenges.",
    logo: "/assets/club-logos/crispr.png",
  },
  {
    id: "probe",
    slug: "probe",
    name: "Probe",
    tagline: "Electronics & Embedded Systems",
    description:
      "Hardware exploration wing focusing on embedded systems, microcontrollers, VLSI, and circuit challenges.",
    logo: "/assets/club-logos/probe.png",
  },
  {
    id: "strokes",
    slug: "strokes",
    name: "Strokes",
    tagline: "Design & Creative Arts",
    description:
      "Creative community bringing together UI/UX designers, 2D/3D artists, and visual storytellers.",
    logo: "/assets/club-logos/strokes.png",
  },
  {
    id: "dimension",
    slug: "dimension",
    name: "Dimension",
    tagline: "Game Dev & XR",
    description:
      "Interactive media society spearheading game development, 3D world building, virtual reality, and spatial computing.",
    logo: "/assets/club-logos/dimension.png",
  },
  {
    id: "dotslash",
    slug: "dotslash",
    name: "DotSlash",
    tagline: "Competitive Programming & CyberSec",
    description:
      "Competitive coding and cybersecurity club hosting algorithmic sprints, Capture The Flag (CTF), and security audits.",
    logo: "/assets/club-logos/dotslash.png",
  },
  {
    id: "gdg",
    slug: "gdg",
    name: "GDG on Campus",
    tagline: "Google Developer Group",
    description:
      "Google Developer Group on Campus IIIT Nagpur, running developer-focused build events and hackathons spanning AI, hardware, and open technologies.",
    logo: "/assets/club-logos/gdg.png",
  },
  {
    id: "synergy",
    slug: "synergy",
    name: "Synergy",
    tagline: "Esports & Gaming",
    description:
      "Gaming and esports society hosting competitive tournaments across titles including Valorant, BGMI, Free Fire, Call of Duty, Clash Royale, and chess.",
    logo: "/assets/club-logos/synergy.png",
  },
  {
    id: "iotics",
    slug: "iotics",
    name: "Iotics",
    tagline: "Robotics & Automation",
    description:
      "Premier robotics society building autonomous bots, robowars gladiators, line-followers, and intelligent automation systems.",
    logo: "/assets/club-logos/iotics.png",
  },
] as const;

export type ClubSlug = (typeof KNOWN_CLUBS)[number]["slug"];

export function getAllClubs(): readonly ClubInfo[] {
  return KNOWN_CLUBS;
}

export function getClubBySlug(slug: string): ClubInfo | null {
  return KNOWN_CLUBS.find((club) => club.slug === slug) ?? null;
}

export function getAllClubSlugs(): string[] {
  return KNOWN_CLUBS.map((club) => club.slug);
}

/** Looks up a club's real logo by slug. Returns undefined when none exists yet. */
export function getClubLogo(slug: string): string | undefined {
  return getClubBySlug(slug)?.logo;
}
