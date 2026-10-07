/**
 * Event detail content for the individual event pages (/events/[slug]).
 *
 * Source: the "EVENT BROCHURE CONTENT" sheet supplied by the organizing team.
 * Club names and slugs are reconciled against `src/lib/clubs.ts`.
 *
 * Design-reference content, used only until the backend event endpoints are
 * configured. Once BACKEND_API_URL is set, `/events/[slug]` prefers the API
 * payload and falls back to these records.
 *
 * Prize splits, schedules, rulebooks, organizer contacts, and registration
 * links are not in the sheet yet, so they are left empty on purpose — the page
 * renders an explicit "to be announced" state rather than invented details.
 */

export interface EventStage {
  name: string;
  /** Human-readable date/time, e.g. "12 Feb 2026, 10:00 AM". */
  when?: string;
  detail?: string;
}

export interface EventPrize {
  /** Placement, 1-indexed. Drives the medal icon. */
  position: number;
  /** Undefined until the club confirms the split. */
  amount?: string;
}

export interface EventOrganizer {
  name: string;
  role?: string;
  phone?: string;
  email?: string;
}

export interface EventDetail {
  slug: string;
  name: string;
  club: { name: string; slug: string };
  /** Empty until the club supplies brochure copy. */
  description: string;
  /** Path under /public. Falls back to a branded placeholder when absent. */
  poster?: string;
  /** Total prize pool, e.g. "\u20b940,000". */
  prizePool?: string;
  prizes: EventPrize[];
  stages: EventStage[];
  rules: string[];
  organizers: EventOrganizer[];
  registrationUrl?: string;
  /** ISO 8601. Required before Schema.org Event JSON-LD is emitted. */
  startDate?: string;
  endDate?: string;
  venue?: string;
}

export const eventDetails: EventDetail[] = [
  {
    slug: "algorithmia",
    name: "Algorithmia",
    club: { name: "DotSlash", slug: "dotslash" },
    description:
      "Algorithmia is a national ICPC-style programming contest where teams of three come together to tackle challenging algorithmic problems under intense time constraints. Combining creativity, teamwork, and strong problem-solving skills, the contest puts participants’ coding abilities and strategic thinking to the test.",
    prizes: [{ position: 1 }, { position: 2 }, { position: 3 }],
    stages: [],
    rules: [],
    organizers: [],
  },
  {
    slug: "flashcode",
    name: "FlashCode",
    club: { name: "DotSlash", slug: "dotslash" },
    description:
      "Flash Code is a dynamic onsite coding competition designed to test speed, adaptability, and creativity. Featuring three surprise mini-games revealed on the event day, each with its own scoring and winners, the contest keeps participants on their toes. With individual participation and fast-paced challenges, Flash Code delivers an unpredictable and exciting coding experience where anyone can seize the opportunity to excel.",
    prizes: [{ position: 1 }, { position: 2 }, { position: 3 }],
    stages: [],
    rules: [],
    organizers: [],
  },
  {
    slug: "design-a-thon",
    name: "Design-A-Thon",
    club: { name: "Strokes", slug: "strokes" },
    description:
      "Design-A-Thon is a UI/UX design competition at IIIT Nagpur, organized by Strokes as part of TantraFiesta. It challenges participants to transform real-world problems into innovative, user-centric solutions through empathy, research, and creative thinking. From identifying user pain points to developing wireframes and interactive prototypes, participants explore the complete design-thinking process. Beyond visual aesthetics, the competition emphasizes usability, accessibility, and functionality, pushing participants to bridge creativity with technology and turn bold ideas into meaningful digital experiences.",
    prizes: [{ position: 1 }, { position: 2 }, { position: 3 }],
    stages: [],
    rules: [],
    organizers: [],
  },
  {
    slug: "brandxperience",
    name: "BrandXperience",
    club: { name: "Strokes", slug: "strokes" },
    description:
      "BrandXperience is a fast-paced branding competition at IIIT Nagpur, where teams transform creative ideas into compelling brand identities and impactful campaigns. Combining strategy, storytelling, visual design, and brand positioning, participants craft theme-aligned concepts that capture attention and connect emotionally with audiences. Under time-bound challenges, the competition tests creativity, strategic thinking, and the ability to build memorable brand experiences.",
    prizes: [{ position: 1 }, { position: 2 }, { position: 3 }],
    stages: [],
    rules: [],
    organizers: [],
  },
  {
    slug: "edge-case-26",
    name: "Edge Case '26",
    club: { name: "GDG on Campus", slug: "gdg" },
    description:
      "EDGE CASE '26 is a national 24-hour Physical AI hackathon by GDG on Campus IIIT Nagpur at Tantrafiesta '26, where student teams build working hardware that senses the real world, lets AI decide, and acts on it. After a nationwide online round, the top 25 teams build on campus on 23–24 October across safety, sustainability, Industry 4.0 and open-innovation tracks.",
    prizes: [{ position: 1 }, { position: 2 }, { position: 3 }],
    stages: [],
    rules: [],
    organizers: [],
  },
  {
    slug: "firestorm-rampage",
    name: "Firestorm Rampage",
    club: { name: "Synergy", slug: "synergy" },
    description:
      "Free Fire Is A Fast-Paced Digital Battleground That Tests Reflexes, Strategy, And Courage, Where Every Decision Can Turn The Tide, Every Move Has A Consequence, And Survival Belongs To Those Who Adapt—An Open Invitation To Enter The Fight And Shape Your Victory",
    prizes: [{ position: 1 }, { position: 2 }, { position: 3 }],
    stages: [],
    rules: [],
    organizers: [],
  },
  {
    slug: "combat-carnage",
    name: "Combat Carnage",
    club: { name: "Synergy", slug: "synergy" },
    description:
      "BGMI Is A Tactical Battle Of Survival That Demands Strategy, Teamwork, And Composure, Where Every Step, Shot, And Decision Can Change The Course Of The Battle, Teaching That Victory Is Earned Through Trust, Precision, And Adaptability—An Open Invitation To Enter The Battleground",
    prizes: [{ position: 1 }, { position: 2 }, { position: 3 }],
    stages: [],
    rules: [],
    organizers: [],
  },
  {
    slug: "royale-legends",
    name: "Royale Legends",
    club: { name: "Synergy", slug: "synergy" },
    description:
      "Clash Royale Is A Strategic Duel Of Wit, Timing, And Courage, Where Every Card Holds Possibility And Every Decision Can Turn The Tide, Challenging Players To Outsmart Opponents, Adapt Under Pressure, And Build Victory One Move At A Time—An Open Invitation To Enter The Arena",
    prizes: [{ position: 1 }, { position: 2 }, { position: 3 }],
    stages: [],
    rules: [],
    organizers: [],
  },
  {
    slug: "pheonix-cup",
    name: "Pheonix Cup",
    club: { name: "Synergy", slug: "synergy" },
    description:
      "Valorant By Synergy ls A Competitive E Gaming Arena Demanding Focus, Strategy, Reflexes, And Teamwork, Urging Squads To Refine Tactics, Chase Rewards, And Lead Teams To Victory-\"Lock. Load. Dominate!",
    prizes: [{ position: 1 }, { position: 2 }, { position: 3 }],
    stages: [],
    rules: [],
    organizers: [],
  },
  {
    slug: "knights-legacy",
    name: "Knights Legacy",
    club: { name: "Synergy", slug: "synergy" },
    description:
      "Chess Is A Timeless Mental Battleground That Builds Patience, Creativity, And Courage, Humbling Ego While Sharpening Intellect And Showing How Even A Pawn Can Change Destiny-An Open Invitation To Experience The Enduring Game.",
    prizes: [{ position: 1 }, { position: 2 }, { position: 3 }],
    stages: [],
    rules: [],
    organizers: [],
  },
  {
    slug: "critical-ops",
    name: "Critical Ops",
    club: { name: "Synergy", slug: "synergy" },
    description:
      "Call Of Duty Is A High-Intensity Test Of Skill, Strategy, And Teamwork, Where Precision Meets Instinct And Every Second Can Define The Outcome, Challenging Players To Think Fast, Stand Fearless, And Fight As One—An Open Invitation To Enter The Mission And Make Every Move Count",
    prizes: [{ position: 1 }, { position: 2 }, { position: 3 }],
    stages: [],
    rules: [],
    organizers: [],
  },
  {
    slug: "the-game-jam",
    name: "The Game Jam™",
    club: { name: "Dimension", slug: "dimension" },
    description:
      "The Game Jam™ is a 24-hour competitive game development hackathon organised by Dimensions Club as part of TantraFiesta 2026 at IIIT Nagpur. Teams work under a live-revealed theme to rapidly design, develop, and prototype games, putting their creativity, technical execution, game mechanics, storytelling, art, sound design, teamwork, and rapid iteration skills to the test in an intense time-constrained environment.",
    prizes: [{ position: 1 }, { position: 2 }, { position: 3 }],
    stages: [],
    rules: [],
    organizers: [],
  },
  {
    slug: "pitch-please",
    name: "Pitch, Please!",
    club: { name: "Dimension", slug: "dimension" },
    description:
      "Pitch Please is a 6-hour game concept pitching competition organised by Dimensions Club as part of TantraFiesta 2026 at IIIT Nagpur, providing student creators and designers with a platform to present original game concepts before an expert judging panel. Participants are evaluated on gameplay design, core mechanics, narrative structure, art direction, target audience, feasibility, and monetisation potential, turning creative ideas into refined blueprints for future indie or commercial games.",
    prizes: [{ position: 1 }, { position: 2 }, { position: 3 }],
    stages: [],
    rules: [],
    organizers: [],
  },
  {
    slug: "line-o-mania",
    name: "Line-O-Mania",
    club: { name: "Iotics", slug: "iotics" },
    description:
      "Line-O-Mania is a robotics contest where teams build autonomous line-following robots to navigate a complex black path on white with curves, loops, sharp turns, junctions, dotted lines, dead ends, and surprise obstacles, demanding smart algorithms, solid engineering, and inventive design to finish the course.",
    prizes: [{ position: 1 }, { position: 2 }, { position: 3 }],
    stages: [],
    rules: [],
    organizers: [],
  },
  {
    slug: "the-lost-pathways",
    name: "The Lost Pathways",
    club: { name: "Iotics", slug: "iotics" },
    description:
      "The Lost Pathways is TantraFiesta's robotic event where autonomous bots solve a 16x16 maze from a corner to the center, testing algorithm design, decision-making, engineering, teamwork, and innovation to highlight the blend of human creativity and machine intelligence.",
    prizes: [{ position: 1 }, { position: 2 }, { position: 3 }],
    stages: [],
    rules: [],
    organizers: [],
  },
  {
    slug: "rann-bhoomi",
    name: "Rann Bhoomi 2.0",
    club: { name: "Iotics", slug: "iotics" },
    description:
      "Rann Bhoomi 2.0 is a competitive arena battle where teams build and drive weaponized robots (e.g., spinners, hammers) to disable opponents, testing mechanical design, weapon systems, durability, control, and match strategy.",
    prizes: [{ position: 1 }, { position: 2 }, { position: 3 }],
    stages: [],
    rules: [],
    organizers: [],
  },
  {
    slug: "last-man-standing",
    name: "Last Man Standing",
    club: { name: "Elevate", slug: "elevate" },
    description:
      "Last Man Standing as a tech quiz built around survival-style eliminations, where each team member represents one life and incorrect answers can cost a life, with the last surviving team ultimately winning. The event begins with 20 shortlisted teams of four members each, progressing through two elimination phases that reduce the field from 20 to 10 and then 10 to 4 teams, followed by a Redemption Round that gives eliminated teams a chance to secure one Wildcard spot. The final five teams then compete in a Jeopardy-style finale. Key mechanics include the Spin-the-Wheel elimination system, Power Cards across three tiers, Blitz and Spotlight Rounds, the Twist Wheel, and the Graveyard, creating a mix of strategy, competition, and audience engagement. The draft lists prizes of ₹8,000 for the winner, ₹5,000 for the first runner-up, and ₹2,000 for the second runner-up, while the final date and venue are yet to be confirmed.",
    prizes: [{ position: 1 }, { position: 2 }, { position: 3 }],
    stages: [],
    rules: [],
    organizers: [],
  },
  {
    slug: "ragnarok",
    name: "Ragnarok",
    club: { name: "CRISPR", slug: "crispr" },
    description:
      "",
    prizes: [{ position: 1 }, { position: 2 }, { position: 3 }],
    stages: [],
    rules: [],
    organizers: [],
  },
];

export function getEventDetail(slug: string): EventDetail | null {
  return eventDetails.find((event) => event.slug === slug) ?? null;
}

export function getAllEventDetailSlugs(): string[] {
  return eventDetails.map((event) => event.slug);
}
