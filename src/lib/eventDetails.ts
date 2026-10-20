/**
 * Event detail content for the individual event pages (/events/[slug]).
 *
 * Source: the TantraFiesta'26 listing on Unstop (festival 521405) —
 * https://unstop.com/college-fests/tantrafiesta26-indian-institute-of-information-technology-iiit-nagpur-521405
 * Descriptions, stage timelines, rules, prizes, team sizes and registration
 * windows are transcribed from each event's own Unstop brochure, which the
 * organizing clubs author. Earlier brochure-sheet copy is kept where Unstop
 * carries no equivalent.
 *
 * Structured dates (`registrationOpens`, `registrationDeadline`, `startDate`,
 * `endDate`) come from Unstop's registration fields, which the clubs edit live.
 * Where a brochure's prose disagrees with those fields, the prose is kept in
 * the stage text and the fields stay authoritative — see the
 * Synergy esports events for the notes on this.
 *
 * Design-reference content, used only until the backend event endpoints are
 * configured. Once BACKEND_API_URL is set, `/events/[slug]` prefers the API
 * payload and falls back to these records.
 */

export interface EventStage {
  name: string;
  /** Human-readable date/time, e.g. "25 Oct 2026, 11:00 AM". */
  when?: string;
  /** Where the stage runs, when the brochure says. */
  mode?: "Online" | "Offline";
  detail?: string;
}

export interface EventPrize {
  /** Placement, 1-indexed. Drives the medal icon. */
  position: number;
  /** The club's own wording, e.g. "Winner", "Sharpest RCA Award". */
  label?: string;
  /** Undefined until the club confirms the split. */
  amount?: string;
  /** Goodies, certificates and other non-cash rewards attached to this rank. */
  note?: string;
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
  /** Short subtitle shown under the title, e.g. the format or the game. */
  tagline?: string;
  /** One entry per organizing club; most events have exactly one, joint events have two. */
  clubs: { name: string; slug: string }[];
  /** Empty until the club supplies brochure copy. */
  description: string;
  /** Path under /public. Falls back to a branded placeholder when absent. */
  poster?: string;
  image?: string;
  /** Total prize pool, e.g. "₹40,000". */
  prizePool?: string;
  /** Qualifier on the pool, e.g. how it splits across themes or mini games. */
  prizeNote?: string;
  prizes: EventPrize[];
  stages: EventStage[];
  rules: string[];
  rulesDocument?: { name: string; url: string };
  /** "What we're looking for" / key details — the brochure's own bullets. */
  highlights: string[];
  /** Who may enter, one bullet per condition. */
  eligibility: string[];
  organizers: EventOrganizer[];
  registrationUrl?: string;
  /** ISO 8601. Registration window. */
  registrationOpens?: string;
  registrationDeadline?: string;
  /** What it costs to enter. */
  registrationFee?: string;
  /** Live fee wording from the API, including whether a team fee is per member. */
  entryFeeLabel?: string;
  feeMode?: "per_team" | "per_participant";
  meals?: string;
  participationKit?: boolean;
  accommodation?: string;
  /** Team size the platform enforces. `min === max` means a fixed team. */
  teamSize?: { min: number; max: number };
  mode?: "Online" | "Offline" | "Hybrid";
  /** ISO 8601. Required before Schema.org Event JSON-LD is emitted. */
  startDate?: string;
  endDate?: string;
  venue?: string;
}

/**
 * Normalizes meal/snack perk strings according to quantity:
 * - If meal count > 1, displays "Meals" instead of "Meal".
 * - If meal count === 1, displays "Meal" instead of "Meals".
 * - If snack count === 1, displays "Snack" instead of "Snacks".
 * - If snack count > 1, displays "Snacks" instead of "Snack".
 */
export function formatMealsLabel(str?: string | null): string {
  if (!str) return "";
  return str
    .replace(/\b([2-9]|\d{2,})\s+Meal\b/gi, "$1 Meals")
    .replace(/\b1\s+Meals\b/gi, "1 Meal")
    .replace(/\b1\s+Snacks\b/gi, "1 Snack")
    .replace(/\b([2-9]|\d{2,})\s+Snack\b/gi, "$1 Snacks");
}

const FREE = "Free";
const IIITN = "Indian Institute of Information Technology, Nagpur";

export const eventDetails: EventDetail[] = [
  {
    slug: "cascade",
    registrationUrl: "https://unstop.com/hackathons/cascade26-flagship-hackathon-tantrafiesta26-iiitn-1766233",
    name: "Cascade",
    tagline: "The flagship 24-hour hackathon",
    image: "/event-posters/Cas-Cade.webp",
    clubs: [
      { name: "CRISPR", slug: "crispr" },
      { name: "Elevate", slug: "elevate" },
    ],
    description:
      "CASCADE is the flagship hackathon of TantraFiesta 2026 at IIIT Nagpur, organised by CRISPR × ELEVATE. It is a 24-hour offline hackathon with a prize pool of up to ₹2 lakh including cash and goodies, where teams build practical solutions to real-world problems across four themes. Stacking of themes is allowed.",
    prizePool: "₹2,00,000",
    prizeNote:
      "₹2,00,000 total prize pool across 4 themes: ₹45,000 for each of the 4 themes, ₹10,000 for the Side Quest, and ₹10,000 for the Best Women Team.",
    prizes: [
      {
        position: 0,
        label: "",
        amount: "₹45,000 × 4 Themes",
        note: "₹45,000 for each of the 4 themes.",
      },
      {
        position: 0,
        label: "Side Quest",
        amount: "₹10,000",
        note: "₹10,000 for the Side Quest.",
      },
      {
        position: 0,
        label: "Best Women Team",
        amount: "₹10,000",
        note: "₹10,000 for the Best Women Team.",
      },
    ],
    stages: [
      {
        name: "Round 1 — Online GitHub & Portfolio Screening",
        when: "14–21 Oct 2026",
        mode: "Online",
        detail:
          "GitHub profiles, repositories, previous projects and portfolios are screened. Teams are evaluated on previous work, technical skills, individual contributions and problem-solving ability — project quality and technical depth, individual contribution and collaboration, and portfolio and problem-solving ability. The Team Leader must provide the required links and details for every member. The top 60 teams qualify for the offline hackathon.",
      },
      {
        name: "Round 2 — CASCADE '26, 24-hour offline hackathon",
        when: "25 Oct 2026, 11:00 AM – 26 Oct 2026, 2:00 PM",
        mode: "Offline",
        detail:
          "On the IIIT Nagpur campus, shortlisted teams develop practical solutions across four real-world themes. Judged on problem understanding and relevance, innovation and creativity, technical implementation, feasibility and real-world impact, execution and completeness, and demo and presentation.",
      },
      {
        name: "Mid-Evaluation",
        when: "25 Oct 2026, approx. 11:00 PM",
        mode: "Offline",
        detail:
          "Mentors assess each team's problem understanding, solution approach, technical progress, technologies used, feasibility and implementation plan. Teams should be ready to explain their progress and demonstrate the work completed so far.",
      },
      {
        name: "Side Quest",
        when: "Opens 26 Oct 2026, 12:00 AM",
        mode: "Offline",
        detail:
          "A separate challenge conducted alongside the main hackathon, with its own winner recognition and evaluation. Further instructions are communicated by the organisers.",
      },
    ],
    highlights: [
      "Four real-world themes, plus a separate Side Quest with its own winners.",
      "Stars — a peer engagement system: each team gets Star stickers marked with its own team letter and awards them to other teams during designated engagement windows. Self-voting is not allowed, and Stars contribute a limited portion of the overall evaluation score.",
      "Best Women in Tech Team Award, recognising an outstanding team made up entirely of women, separate from the main theme prizes.",
      "Prize stacking: teams may participate in multiple themes and win awards in more than one.",
    ],
    eligibility: [
      "Team size: 3–4 members. Inter-college teams are allowed.",
      "Only the Team Leader needs to submit the team registration.",
      "Round 1 requires GitHub profile links for all members, along with relevant repositories, projects or portfolio links.",
      "The top 60 teams from Round 1 are shortlisted for the offline round.",
    ],
    rules: [
      "Teams must have 3–4 members and provide accurate registration details.",
      "All submitted work must be original or appropriately credited — plagiarism and misrepresentation are prohibited.",
      "Teams may compete in multiple themes and win multiple awards, subject to each award's eligibility criteria.",
      "**STACKING ALLOWED —** Participants may choose multiple themes on the day of the hackathon.",
      "Self-voting in the Stars system is not allowed.",
      "Participants must follow organiser instructions and maintain respectful conduct.",
      "Judges' decisions are final, subject to the officially published event rules.",
    ],
    organizers: [
      { name: "Rakshit Jain", phone: "+91 78777 78284", email: "bt25csa047@iiitn.ac.in" },
      { name: "Yash Khule", phone: "+91 99305 01541", email: "bt25csd036@iiitn.ac.in" },
      { name: "Arnav Bansal", phone: "+91 85955 37494", email: "bt25cse001@iiitn.ac.in" },
      { name: "Satyam Samal", phone: "+91 96925 09119", email: "bt25csd059@iiitn.ac.in" },
      { name: "Yash Gaikwad", phone: "+91 98921 98168", email: "bt25cse047@iiitn.ac.in" },
      { name: "Krushna Mali", phone: "+91 85302 96969", email: "bt25csd037@iiitn.ac.in" },
    ],
    registrationOpens: "2026-10-11T00:00:00+05:30",
    registrationDeadline: "2026-10-21T23:59:00+05:30",
    registrationFee: "₹550 per person",
    entryFeeLabel: "₹550 per participant; team leader pays for all members",
    feeMode: "per_participant",
    meals: "2 Meals + 2 Snacks",
    participationKit: true,
    teamSize: { min: 3, max: 4 },
    mode: "Hybrid",
    startDate: "2026-10-25T11:00:00+05:30",
    endDate: "2026-10-26T14:00:00+05:30",
    venue: "CR-301, 302, 306, 307, Indian Institute of Information Technology, Nagpur",
  },
  {
    slug: "ragnarok",
    registrationUrl: "https://unstop.com/hackathons/ragnarok-tantrafiesta26-iiitn-1767921",
    name: "Ragnarok",
    tagline: "The agentic hackathon",
    image: "/event-posters/ragnarok.webp",
    clubs: [{ name: "CRISPR", slug: "crispr" }],
    description:
      "RAGNAROK is the flagship agentic hackathon of TantraFiesta 2026, organized by AIRA, the AI/ML domain at CRISPR, IIIT Nagpur. The age of passive AI is ending: the next wave of software is built from agents that reason, plan, use tools, and act on their own. RAGNAROK brings together the sharpest student builders in India to design, ship, and battle-test such systems under real pressure. Qualify online, then reach the IIIT Nagpur campus for a 24-hour build where only the best agents survive.",
    prizePool: "₹50,000",
    prizes: [
      { position: 1, label: "Winner", amount: "₹25,000", note: "Including cash and goodies." },
      { position: 2, label: "1st Runner Up", amount: "₹15,000", note: "Including cash and goodies." },
      { position: 3, label: "2nd Runner Up", amount: "₹10,000", note: "Including cash and goodies." },
    ],
    stages: [
      {
        name: "Round 1 — Online MCQ Round",
        when: "20 Oct 2026",
        mode: "Online",
        detail:
          "A timed, online objective test covering problem solving, AI/ML concepts, LLMs, and agentic AI concepts such as tool use, planning, memory and prompting. The link is shared via your registered email and the official event group. Top-scoring teams are shortlisted for the finale.",
      },
      {
        name: "Round 2 — Offline Finale",
        when: "25 Oct 2026, 9:00 AM – 26 Oct 2026, 10:00 AM",
        mode: "Offline",
        detail:
          "Shortlisted teams get 24 hours of continuous building on the IIIT Nagpur campus. Problem statements are revealed at the start of the finale; teams build, demo and defend their solution in front of the evaluators. All finalists must report to campus by 9:30 AM on 25 October 2026, and participation in the offline round is mandatory to be eligible for prizes.",
      },
    ],
    highlights: [
      "Build something real: challenging, open-ended problems that need agentic thinking, not a tutorial clone.",
      "24 hours, one campus, India's best teams — hack through the night with sharp peers.",
      "Surprise problem statements: nobody knows what's coming until the finale begins, so adaptability counts as much as your stack.",
      "Cash prizes, goodies, certificates and recognition at one of Central India's biggest tech fests.",
      "Visibility: your work is reviewed by experienced evaluators, and strong teams get noticed.",
    ],
    eligibility: [
      "Open to all students currently enrolled at any college or university in India.",
      "Inter-college and inter-university teams are allowed, with no limit on teams per college.",
      "Team size: 2 to 4 members — solo participation is not allowed.",
      "One participant can be part of only one team, and every team member must register individually on Unstop.",
    ],
    rules: [
      "Registration on Unstop is mandatory — entries from unregistered participants are invalid.",
      "Round 1: tab switching is strictly not allowed and may lead to auto-submission or disqualification.",
      "Round 1: the use of AI tools of any kind — chatbots, assistants, AI-powered search or solvers — is strictly prohibited.",
      "Round 1: collaboration between teams, impersonation and any other malpractice leads to disqualification, and the test must be completed within the allotted window.",
      "Round 2: problem statements are shared only on-site and no pre-built solutions are allowed.",
      "Round 2: all development must start after the official start time. Prior code, pre-trained models, public libraries, frameworks and APIs may be used if properly credited, but the core solution must be built during the event.",
      "Round 2: AI coding assistants and LLM APIs may be used — this is an agentic hackathon — but the solution must be your team's own work and you must be able to explain it fully.",
      "Plagiarism or copying another team's work leads to immediate disqualification.",
      "Participants must bring their own laptops, chargers and any required setup.",
      "Source code must be shared via a Git repository, and a working demo is required.",
      "Any public or free-to-use resource must be credited.",
      "Decisions of the judges and organizers are final and binding.",
    ],
    organizers: [
      { name: "TantraFiesta IIIT Nagpur", email: "tantrafiesta@iiitn.ac.in" },
      { name: "Abdul Ahad", phone: "+91 78608 78412", email: "abdulahad43149031@gmail.com" },
      { name: "Tejas Tajane", phone: "+91 90215 64389", email: "tejastajane007@gmail.com" },
    ],
    registrationOpens: "2026-10-08T20:30:00+05:30",
    registrationDeadline: "2026-10-20T23:59:00+05:30",
    registrationFee: "₹450 per person",
    entryFeeLabel: "₹450 per participant; team leader pays for all members",
    feeMode: "per_participant",
    meals: "2 Meals + 2 Snacks",
    participationKit: true,
    teamSize: { min: 2, max: 4 },
    mode: "Hybrid",
    startDate: "2026-10-18T00:00:00+05:30",
    endDate: "2026-10-26T10:00:00+05:30",
    venue: "Seminar Hall, Indian Institute of Information Technology, Nagpur",
  },
  {
    slug: "last-man-standing",
    registrationUrl: "https://unstop.com/competitions/last-man-standing-40-tantrafiesta26-iiitn-1765830",
    name: "Last Man Standing 4.0",
    tagline: "The tech quiz where only one team walks out alive",
    image: "/event-posters/LMS.webp",
    clubs: [{ name: "Elevate", slug: "elevate" }],
    description:
      "Part quiz, part survival game. Every member of your team is a life: answer right and you live, answer wrong and the Wheel decides who's out. Play your Power Cards at the right moment and outlast all 19 other teams to be the Last Team Standing. Brought to you by Elevate, the technical club of IIIT Nagpur, as part of TantraFiesta'26.",
    prizePool: "₹20,000",
    prizes: [
      { position: 1, label: "Winner", amount: "₹10,000", note: "Certificate included." },
      { position: 2, label: "1st Runner-up", amount: "₹6,500", note: "Certificate included." },
      { position: 3, label: "2nd Runner-up", amount: "₹3,500", note: "Certificate included." },
    ],
    stages: [
      {
        name: "Online shortlisting round",
        when: "18 Oct 2026, 8:00 AM – 8:00 PM",
        mode: "Online",
        detail:
          "The top 20 teams qualify for the offline finale and are contacted with the round details.",
      },
      {
        name: "Offline finale",
        when: "26 Oct 2026, 1:00 PM – 6:00 PM",
        mode: "Offline",
        detail:
          "Two rounds at IIIT Nagpur: a non-stop survival quiz that runs until only the Top 5 teams remain, then a high-risk Tiles round to crown the champion.",
      },
    ],
    highlights: [
      "Spin-the-Wheel eliminations: every wrong answer costs a life.",
      "Three tiers of Power Cards: survive, strategize, unleash chaos.",
      "A high-risk, high-reward Tiles round where the points can swing fast.",
      "Teams of 4 — every member is a life.",
    ],
    eligibility: [
      "Open to everyone, from any college.",
      "Fixed teams of 4 members.",
      "First-years and early-stage participants especially encouraged — this one is built to be approachable, fast and loud.",
    ],
    rules: [
      "Register your team of 4; every member counts as one life.",
      "Clear the online shortlisting round on Sun, 18 Oct 2026.",
      "The top 20 teams are shortlisted and contacted with offline-round details.",
      "Battle it out live at IIIT Nagpur on 26 Oct 2026.",
    ],
    organizers: [
      { name: "Samyaak Jain", phone: "+91 93535 83515", email: "bt25csh048@iiitn.ac.in" },
      { name: "Elevate Co-Lead", phone: "+91 63926 51839", email: "tantrafiesta@iiitn.ac.in" },
    ],
    registrationOpens: "2026-10-11T00:00:00+05:30",
    registrationDeadline: "2026-10-17T23:59:00+05:30",
    registrationFee: "₹150 per person",
    entryFeeLabel: "₹150 per participant; team leader pays for all members",
    feeMode: "per_participant",
    meals: "1 Snack",
    participationKit: true,
    teamSize: { min: 4, max: 4 },
    mode: "Hybrid",
    startDate: "2026-10-18T00:00:00+05:30",
    endDate: "2026-10-26T17:00:00+05:30",
    venue: "Admin Hall 1, Indian Institute of Information Technology, Nagpur",
  },
  {
    slug: "algorithmia",
    registrationUrl: "https://unstop.com/hackathons/algorithmia-the-icpc-style-coding-challenge-iiitn-1768266",
    name: "Algorithmia",
    tagline: "The ICPC-style coding challenge",
    image: "/event-posters/Algorithmia.webp",
    clubs: [{ name: "DotSlash", slug: "dotslash" }],
    description:
      "Get ready to embark on an exciting journey into the world of algorithms and programming with Algorithmia, a prestigious ICPC-style coding competition by DotSlash, the coding club of IIIT Nagpur. Teams of two to three battle to solve challenging algorithmic problems, testing their teamwork, creativity, and coding speed at a national level during TantraFiesta.",
    prizePool: "₹35,000",
    prizeNote: "Prize pool worth INR 35,000, certificates and goodies for the top 3 teams.",
    prizes: [
      {
        position: 1,
        label: "1st Prize",
        amount: "₹15,000",
        note: "Goodies, certificate, and an online interaction with Mr. Jaskaran Singh — Co-founder, AskSenior and ICPC World Finalist (AIR 1, 2023).",
      },
      { position: 2, label: "2nd Prize", amount: "₹12,000", note: "Goodies and certificate." },
      { position: 3, label: "3rd Prize", amount: "₹8,000", note: "Goodies and certificates." },
    ],
    stages: [
      {
        name: "Stage 1 — Preliminary Coding Contest",
        when: "18 Oct 2026",
        mode: "Online",
        detail:
          "Conducted online on Codeforces. Teams of 2–3 register as a team on Codeforces. Two hours, 5–6 programming problems, ranked by ICPC rules — problems solved first, then penalty time. The top 10 teams qualify for Stage 2, and standby teams may be invited if a selected team drops out.",
      },
      {
        name: "Stage 2 — Onsite Round",
        when: "25 Oct 2026, 10:00 AM – 4:00 PM",
        mode: "Offline",
        detail:
          "Held on campus at IIIT Nagpur, again on Codeforces. Five hours, 7–8 programming problems, same ICPC ranking rules. One computer — your own laptop — is allotted per team and every submission must be made from it.",
      },
    ],
    highlights: [
      "Passionate problem-solvers with strong algorithmic and programming skills.",
      "Team players who can collaborate and think creatively under pressure.",
      "Enthusiastic coders eager to take on ICPC-style challenges.",
      "A national-level, ICPC-style competition: a preliminary online round followed by an on-campus finale at IIIT Nagpur.",
    ],
    eligibility: [
      "Teams of 2–3 members.",
      "Open to engineering students at the undergraduate level.",
      "Free registration — the preliminary round is conducted online on Codeforces.",
    ],
    rules: [
      "Registration is free and the preliminary contest is conducted online on Codeforces.",
      "Teams of 2–3 members must also register as a team on Codeforces.",
      "Stage 1 runs for 2 hours with 5–6 programming problems.",
      "Ranking follows ICPC rules: problems solved first, then penalty time.",
      "The top 10 teams qualify for Stage 2; standby teams may be invited if selected teams drop out.",
      "Stage 2 is conducted offline at IIIT Nagpur over 5 hours with 7–8 problems.",
      "One computer — your own laptop — is allotted per team, and all submissions must be made from it.",
      "Top teams receive free goodies; the winning team gets an online interaction with Mr. Jaskaran Singh, Co-founder of AskSenior and ICPC World Finalist (AIR 1, 2023).",
    ],
    organizers: [
      { name: "Agraj Shukla", phone: "+91 63928 86837", email: "dotslash@iiitn.ac.in" },
      { name: "Aditya Singh", phone: "+91 92649 66840", email: "bt24csh051@iiitn.ac.in" },
    ],
    registrationOpens: "2026-10-10T12:00:00+05:30",
    registrationDeadline: "2026-10-18T23:59:00+05:30",
    registrationFee: "₹350 per person",
    entryFeeLabel: "₹350 per participant; team leader pays for all members",
    feeMode: "per_participant",
    meals: "1 Snack",
    participationKit: true,
    teamSize: { min: 2, max: 3 },
    mode: "Hybrid",
    startDate: "2026-10-10T12:00:00+05:30",
    endDate: "2026-10-25T16:00:00+05:30",
    venue: "Admin Hall 1, Indian Institute of Information Technology, Nagpur",
  },
  {
    slug: "flashcode",
    registrationUrl: "https://unstop.com/hackathons/flashcode-tantrafiesta26-iiitn-1765827",
    name: "FlashCode",
    tagline: "Three surprise mini coding games",
    image: "/event-posters/FlashCode.webp",
    clubs: [{ name: "DotSlash", slug: "dotslash" }],
    description:
      "Flash Code is a unique and exciting coding challenge hosted by DotSlash, IIIT Nagpur, designed to test participants in a fun, fast, and competitive way. Unlike traditional contests, Flash Code features 3 surprise mini coding games revealed only on the event day. Each game has its own winner, runner-up and second runner-up — giving everyone multiple chances to shine.",
    prizePool: "₹35,000",
    prizeNote:
      "₹35,000 total prize pool: 1st Prize is ₹15,000, 2nd Prize is ₹12,000, and 3rd Prize is ₹8,000, with goodies and certificates for winners.",
    prizes: [
      { position: 1, label: "1st Prize", amount: "₹15,000", note: "Goodies and certificate." },
      { position: 2, label: "2nd Prize", amount: "₹12,000", note: "Goodies and certificate." },
      {
        position: 3,
        label: "3rd Prize",
        amount: "₹8,000",
        note: "Goodies and certificate.",
      },
    ],
    stages: [
      {
        name: "FlashCode — Onsite mini games",
        when: "26 Oct 2026",
        mode: "Offline",
        detail:
          "Three surprise mini coding games revealed only on the event day, each with its own scoring and its own set of winners. Individual participation throughout.",
      },
    ],
    highlights: [
      "Quick thinkers who can adapt to surprise challenges.",
      "Coders with speed, accuracy, and creativity.",
      "Individuals ready to compete solo under pressure.",
      "Enthusiasts eager for a fun, fast-paced coding experience.",
    ],
    eligibility: [
      "Individual participation only.",
      "Only 1st and 2nd year students pursuing a B.E./B.Tech. degree are allowed.",
    ],
    rules: [
      "Individual participation only.",
      "Only 1st and 2nd year students pursuing a B.E./B.Tech. degree are allowed.",
      "3 surprise mini coding games are revealed on the event day.",
      "1st (₹15,000), 2nd (₹12,000), and 3rd (₹8,000) place winners share the prize pool worth ₹35,000.",
      "Separate winners, runners-up and 2nd runners-up for each game.",
      "Scoring rewards speed, adaptability and creativity.",
      "Goodies, prizes and certificates for all winners.",
    ],
    organizers: [
      { name: "Hrushikesh Paithankar", phone: "+91 83290 96785", email: "bt24csh044@iiitn.ac.in" },
      { name: "Agraj Shukla", phone: "+91 63928 86837", email: "dotslash@iiitn.ac.in" },
    ],
    registrationOpens: "2026-10-10T00:00:00+05:30",
    registrationDeadline: "2026-10-26T11:00:00+05:30",
    registrationFee: FREE,
    entryFeeLabel: "Free",
    feeMode: "per_participant",
    meals: "1 Snack",
    participationKit: false,
    teamSize: { min: 1, max: 1 },
    mode: "Offline",
    startDate: "2026-10-26T12:00:00+05:30",
    endDate: "2026-10-26T18:00:00+05:30",
    venue: "Seminar Hall, Indian Institute of Information Technology, Nagpur",
  },
  {
    slug: "bugwars",
    registrationUrl: "https://unstop.com/hackathons/bugwars-the-coding-challenge-tantrafiesta26-iiitn-1768954",
    name: "BugWars",
    tagline: "The debugging challenge",
    image: "/event-posters/BugWars.webp",
    clubs: [{ name: "DotSlash", slug: "dotslash" }],
    description:
      "BugWars is a high-energy coding challenge focused on debugging, problem-solving, and programming skills. Participants tackle a range of coding problems designed to test their ability to identify errors, analyze logic, optimize solutions, and think under pressure. Covering concepts from DSA and competitive programming, the event challenges participants to turn broken code into efficient, working solutions. Participation is individual-only, making it a fair and thrilling competition for all coders and debuggers.",
    prizePool: "₹10,000",
    prizeNote: "Three winners, with goodies, prizes and certificates.",
    prizes: [
      { position: 1, label: "1st Prize", amount: "₹5,000" },
      { position: 2, label: "2nd Prize", amount: "₹3,000" },
      { position: 3, label: "3rd Prize", amount: "₹2,000" },
    ],
    stages: [
      {
        name: "BugWars — Onsite contest",
        when: "24 Oct 2026, 6:00 PM – 8:00 PM",
        mode: "Offline",
        detail:
          "A 2-hour individual contest. The exact format and the judging platform are revealed on the spot.",
      },
    ],
    highlights: [
      "Problem solving: strong logical and analytical thinking.",
      "Debugging skills: identifying and fixing errors efficiently.",
      "DSA & CP: familiarity with core concepts and algorithms.",
      "Code optimization: improving solutions for efficiency and performance.",
      "Attention to detail: spotting logical, syntactical and runtime errors.",
      "Competitive mindset: solving problems under time constraints.",
    ],
    eligibility: ["Solo participation only.", "Open to all."],
    rules: [
      "Solo participation.",
      "The contest lasts for 2 hours.",
      "There will be 3 winners in the contest.",
      "The exact format and the platforms will be revealed then and there.",
      "Participants must strictly avoid cheating, plagiarism, or using AI tools/assistants — violations lead to immediate disqualification.",
      "Goodies, prizes and certificates will be awarded to the winners of each mini game.",
      "Participation certificates will be awarded to all participants.",
    ],
    organizers: [
      { name: "Agraj Shukla", phone: "+91 63928 86837", email: "dotslash@iiitn.ac.in" },
      { name: "Aditya Singh", phone: "+91 92649 66840", email: "bt24csh051@iiitn.ac.in" },
    ],
    registrationOpens: "2026-10-12T12:00:00+05:30",
    registrationDeadline: "2026-10-24T18:00:00+05:30",
    registrationFee: "₹150 per person",
    entryFeeLabel: "₹150 per participant",
    feeMode: "per_participant",
    participationKit: false,
    teamSize: { min: 1, max: 1 },
    mode: "Offline",
    startDate: "2026-10-24T18:00:00+05:30",
    endDate: "2026-10-24T20:00:00+05:30",
    venue: "Admin Hall 1, Indian Institute of Information Technology, Nagpur",
  },
  {
    slug: "design-a-thon",
    registrationUrl: "https://unstop.com/hackathons/designathon-tantrafiesta26-iiitn-1767529",
    name: "Design-A-Thon",
    tagline: "UI/UX design hackathon",
    image: "/event-posters/Design-A-Thon.webp",
    clubs: [{ name: "Strokes", slug: "strokes" }],
    description:
      "Design-A-thon is a premier UI/UX hackathon that challenges participants to transform real-world problems into innovative, user-centric design solutions. Organized by Strokes, the official design club of IIIT Nagpur, this event pushes participants to explore the boundaries of creativity, problem-solving, and design methodologies under pressure. The competition simulates real-world design challenges through case studies, user research, and time-bound hackathon-style rounds. Beyond just visuals, the focus is on creating designs that are functional, inclusive, and impactful.",
    prizePool: "₹40,000",
    prizes: [
      { position: 1, label: "Winner", amount: "₹20,000" },
      { position: 2, label: "1st Runner-Up", amount: "₹12,000" },
      { position: 3, label: "2nd Runner-Up", amount: "₹8,000" },
    ],
    prizeNote: "Certificates for all participants.",
    stages: [
      {
        name: "Round 1 — Online Case Study Submission",
        when: "10 Oct 2026, 12:00 AM – 19 Oct 2026, 11:59 PM",
        mode: "Online",
        detail:
          "A research-driven design project: user personas, heuristic evaluations of popular designs, or a critique of design flaws in major platforms. Each submission needs research findings with insights and data, a clear identification of UX issues and pain points, practical recommendations, and mockups, wireframes or prototypes. Submit one comprehensive PDF case study plus supporting visuals (PNG/JPEG/PDF); a video walkthrough of the design process and Figma or source files are optional.",
      },
      {
        name: "Round 2 — Offline Finals (15-hour hackathon)",
        when: "24 Oct 2026, 6:00 PM – 25 Oct 2026, 9:00 AM",
        mode: "Offline",
        detail:
          "A 15-hour on-campus design hackathon. Teams receive the problem statement at the start and must research, ideate and deliver a complete design solution — wireframes, prototypes and final designs — within the deadline. Any design or collaboration tool is allowed. Surprise twists may include target-audience shifts, theme reversals, limited palettes, or mandatory design elements.",
      },
    ],
    highlights: [
      "Teams who can think creatively and craft visually stunning yet user-friendly interfaces.",
      "Designers who can deliver seamless, intuitive and thoughtful user journeys.",
      "Participants ready to take on surprise challenges and constraints, adapting flexibly while maintaining design quality.",
      "Problem solvers who can balance creativity with functionality and inclusivity.",
      "Round 1 judging: research depth and clarity, identification of design flaws, feasibility of recommendations, quality of supporting prototypes, professional presentation.",
      "Round 2 judging: creativity and innovation, usability and functionality, adherence to the problem statement, visual quality, adaptability to restrictions, presentation clarity.",
    ],
    eligibility: [
      "Open to all students across India, from any discipline.",
      "Teams of 2–4 members; individuals are also allowed.",
      "Cross-college and cross-specialization teams are welcome.",
      "Each participant can only join one team.",
    ],
    rules: [
      "Final-round submission is a Figma file link containing research insights, wireframes, prototypes, the final design, and a dedicated presentation section.",
      "The Figma file must be set to “anyone with the link can view”.",
      "All submissions must be original work — strict no-plagiarism policy.",
      "Participants must bring their own laptops and equipment for the offline rounds.",
      "Respect IIIT Nagpur's campus rules and code of conduct.",
      "Organizers' and judges' decisions are final.",
    ],
    organizers: [
      { name: "Lakshay Garg", phone: "+91 72398 49103", email: "lakshaygarg842@gmail.com" },
      { name: "Dharmendra Shukla", phone: "+91 70119 63526", email: "strokes@iiitn.ac.in" },
    ],
    registrationOpens: "2026-10-10T12:00:00+05:30",
    registrationDeadline: "2026-10-19T23:59:00+05:30",
    registrationFee: "₹400 per person",
    entryFeeLabel: "₹400 per participant; team leader pays for all members",
    feeMode: "per_participant",
    meals: "1 Meal + 2 Snacks",
    participationKit: true,
    teamSize: { min: 2, max: 4 },
    mode: "Hybrid",
    startDate: "2026-10-10T12:00:00+05:30",
    endDate: "2026-10-25T09:00:00+05:30",
    venue: "CR 305 & 306, Indian Institute of Information Technology, Nagpur",
  },
  {
    slug: "brandxperience",
    registrationUrl: "https://unstop.com/competitions/brand-xperience-tantrafiesta26-iiitn-1766416",
    name: "Brand Xperience",
    tagline: "Innovative branding challenge",
    image: "/event-posters/Brand-Xperience.webp",
    clubs: [
      { name: "Strokes", slug: "strokes" },
      { name: "Probe", slug: "probe" },
    ],
    description:
      "Brand Xperience is an innovative branding challenge that blends creativity with strategy. Organized as part of IIIT Nagpur’s flagship tech fest TantraFiesta 2026, this is an event by Strokes (Design Club) in collaboration with Probe (Photography & Videography Club). Participants will step into the shoes of a brand strategist, using the powerful tools of videography, photography, editing, and design to craft a complete brand identity from scratch. From logos and colour palettes to storytelling visuals, teams will showcase how design and media can bring a brand to life.",
    prizePool: "₹35,000",
    prizes: [
      {
        position: 1,
        label: "Winner",
        amount: "₹18,000",
        note: "Cash, Certificate, GOODIES",
      },
      {
        position: 2,
        label: "1st Runner-up",
        amount: "₹10,000",
        note: "Cash, Certificate, GOODIES",
      },
      {
        position: 3,
        label: "2nd Runner-up",
        amount: "₹7,000",
        note: "Cash, Certificate, GOODIES",
      },
    ],
    stages: [
      {
        name: "Preliminary Round (Online) – Concept Pitch",
        when: "12 Oct 26, 12:15 AM IST – 20 Oct 26, 12:15 AM IST",
        mode: "Online",
        detail:
          "Before the on-campus rounds, teams must submit a Brand case study (PDF) on a Real brand of their choice. Template Link: https://docs.google.com/document/d/1ZhXEK1IJ1n3yvqUHTAifi7vry4tF8xpruEoO13zoXsw/edit?usp=sharing",
      },
      {
        name: "Day 1 – Kick-off & Design Sprint",
        when: "24 Oct 26, 06:00 PM IST – 25 Oct 26, 02:00 AM IST",
        mode: "Offline",
        detail:
          "The on-ground event begins on Day 1. Teams will get 8 hours in an offline, hackathon-style setting to craft the foundation of their brand’s visual identity based on a given Problem Statement which will be announced prior the start of the event.",
      },
      {
        name: "Day 2 – Promotional Video & Storytelling",
        when: "25 Oct 26, 02:00 AM IST – 25 Oct 26, 04:00 PM IST",
        mode: "Offline",
        detail:
          "After the design phase, participants create a promotional ad / short video, using their logos, fonts, colours, and other design elements. They’ll combine videography, photography, editing, and storytelling skills to communicate the brand’s personality. Editing and final assembly must be completed by the 4:00 PM Day 2 deadline.",
      },
      {
        name: "Final Pitch & Evaluation",
        when: "25 Oct 26, 04:00 PM IST – 25 Oct 26, 06:00 PM IST",
        mode: "Offline",
        detail:
          "Each team will present its projects to the jury, explaining: • Their thought process and reasoning behind each design choice • Filming techniques, creative direction, and overall narrative. • Branding and marketing elements, demonstrating how effectively the brand identity is developed and represented on paper.",
      },
    ],
    highlights: [
      "Innovative branding and marketing solutions for fictional or real-world brands.",
      "Campaigns that demonstrate originality, strategic thinking, and compelling storytelling.",
      "Redefine and redesign the identity of an existing brand using logos, colour palettes, typography, photography, and videography.",
    ],
    eligibility: ["Open to all college students.", "Teams of 2 to 4 members."],
    rules: [],
    organizers: [
      { name: "TantraFiesta IIIT Nagpur", email: "tantrafiesta@iiitn.ac.in" },
      { name: "TEJAS", email: "bt25cse194@iiitn.ac.in", phone: "+91 95189 95714" },
    ],
    registrationOpens: "2026-10-12T00:15:00+05:30",
    registrationDeadline: "2026-10-20T00:15:00+05:30",
    registrationFee: "₹450 per person",
    entryFeeLabel: "₹450 per participant; team leader pays for all members",
    feeMode: "per_participant",
    meals: "2 Meals + 2 Snacks",
    participationKit: true,
    teamSize: { min: 2, max: 4 },
    mode: "Hybrid",
    startDate: "2026-10-12T00:15:00+05:30",
    endDate: "2026-10-25T18:00:00+05:30",
    venue: "CR 203 & Reading Room, Indian Institute of Information Technology, Nagpur",
  },
  {
    slug: "firestorm-rampage",
    registrationUrl: "https://unstop.com/events/firestorm-rampage-tantrafiesta26-iiitn-1766235",
    name: "Firestorm Rampage",
    tagline: "Free Fire — Battle Royale squads",
    image: "/event-posters/firstom-rampage.webp",
    clubs: [{ name: "Synergy", slug: "synergy" }],
    description:
      "Firestorm Rampage is the official Free Fire battle-royale tournament of TantraFiesta'26, hosted by Synergy Club, IIIT Nagpur. Squads of four (plus one substitute) fight through online preliminaries before the top twelve meet for an offline final on campus — a fast-paced digital battleground that tests reflexes, strategy, and courage, where every decision can turn the tide.",
    prizePool: "₹15,000",
    prizes: [
      { position: 1, label: "1st Prize", amount: "₹7,000" },
      { position: 2, label: "2nd Prize", amount: "₹5,000" },
      { position: 3, label: "3rd Prize", amount: "₹3,000" },
    ],
    stages: [
      {
        name: "Registration",
        when: "11 Oct – 19 Oct 2026",
        mode: "Online",
        detail: "Open to students of any discipline from any college in India.",
      },
      {
        name: "Preliminary Round",
        when: "23 Oct – 24 Oct 2026",
        mode: "Online",
        detail:
          "All registered teams are divided into groups based on the total number of registrations. Each group plays 3 matches across 3 maps, scored on team placement and total eliminations. The top 12 teams across the preliminaries qualify for the offline finals.",
      },
      {
        name: "Final Round",
        when: "25 Oct 2026, 11:00 AM – 4:00 PM",
        mode: "Offline",
        detail:
          "Held on the IIIT Nagpur campus. The top 12 qualified teams compete across a total of 5 matches — details shared closer to the date. Official results and winner announcements follow immediately after the final matches.",
      },
      { name: "Result announcement", when: "26 Oct 2026" },
    ],
    highlights: [
      "Game: Free Fire, Battle Royale — Squad format.",
      "Teams of 4 main players plus 1 optional substitute.",
      "Own mobile phones only — emulators are strictly prohibited.",
      "Teams are expected to demonstrate high-level coordination, strategic planning and competitive spirit.",
    ],
    eligibility: [
      "Open to students of any discipline from any college in India.",
      "Squads of 4 players, with 1 substitute allowed.",
    ],
    rules: [
      "Team composition: 4 main players, with up to 1 substitute.",
      "Own mobile phones only — emulators are strictly prohibited.",
      "Match scoring is calculated from team placement and total eliminations.",
      "Strict enforcement of fair-play protocols; breaking the rules or using unauthorised devices leads to immediate disqualification.",
    ],
    organizers: [
      { name: "Synergy Lead", phone: "+91 77801 14237", email: "synergy@iiitn.ac.in" },
    ],
    registrationOpens: "2026-10-11T12:00:00+05:30",
    registrationDeadline: "2026-10-19T23:59:00+05:30",
    registrationFee: "₹200 per team",
    entryFeeLabel: "₹200 per team; team leader pays once",
    feeMode: "per_team",
    participationKit: false,
    teamSize: { min: 4, max: 5 },
    mode: "Hybrid",
    startDate: "2026-10-23T00:00:00+05:30",
    endDate: "2026-10-25T16:00:00+05:30",
    venue: "Lab 1 & Lab 2, Indian Institute of Information Technology, Nagpur",
  },
  {
    slug: "combat-carnage",
    registrationUrl: "https://unstop.com/events/combat-carnage-tantrafiesta26-iiitn-1767679",
    name: "Combat Carnage",
    tagline: "BGMI — Squad TPP",
    image: "/event-posters/combact-carnage.webp",
    clubs: [{ name: "Synergy", slug: "synergy" }],
    description:
      "Combat Carnage is the official Battlegrounds Mobile India tournament of TantraFiesta'26 at IIIT Nagpur. Squads play third-person perspective matches in custom rooms across Erangel, Miramar and Rondo, qualifying online before the top sixteen meet offline for the championship — a tactical battle of survival that demands strategy, teamwork and composure.",
    prizePool: "₹15,000",
    prizes: [
      { position: 1, label: "1st Prize", amount: "₹5,000" },
      { position: 2, label: "2nd Prize", amount: "₹2,000" },
      { position: 3, label: "3rd Prize", amount: "₹1,000" },
      { position: 4, label: "4th Place", amount: "₹800" },
      { position: 5, label: "5th Place", amount: "₹600" },
      { position: 6, label: "6th Place", amount: "₹400" },
    ],
    stages: [
      { name: "Registration", when: "10 Oct – 19 Oct 2026", mode: "Online" },
      { name: "Selected squads declared", when: "20 Oct 2026" },
      {
        name: "Qualifier Round 1",
        when: "21 Oct 2026",
        mode: "Online",
        detail:
          "Registered squads play 3 custom-room matches across 3 different maps. The top 8 squads from each group, by total cumulative points, advance to the offline stage.",
      },
      {
        name: "Round 2 — Final",
        when: "25 Oct 2026, 11:00 AM – 4:00 PM",
        mode: "Offline",
        detail:
          "The top 16 qualified squads compete offline for the championship title and the prize pool. Official winners and results are declared the same day.",
      },
      { name: "Result announcement", when: "25 Oct 2026" },
    ],
    highlights: [
      "Game: Battlegrounds Mobile India (BGMI), Squad TPP in custom rooms.",
      "Maps: Erangel, Miramar and Rondo.",
      "Mobile devices only — emulators are strictly prohibited.",
      "Squads must show strategic rotations, team coordination and consistent performance.",
    ],
    eligibility: ["Open to all.", "Squads of 4 players, with 1 substitute allowed."],
    rules: [
      "Placement points: 1st — 10, 2nd — 6, 3rd — 5, 4th — 4, 5th — 3, 6th — 2, 7th and 8th — 1 each, 9th and below — 0.",
      "Kill points: 1 point per finish.",
      "Game mode is Squad, third-person perspective, in organizer-created custom rooms.",
      "Mobile devices only — emulators are strictly prohibited.",
      "Absolute adherence to fair play and sportsmanship; any form of cheating leads to immediate disqualification.",
    ],
    organizers: [
      { name: "Synergy Lead", phone: "+91 87881 79852", email: "synergy@iiitn.ac.in" },
    ],
    registrationOpens: "2026-10-10T12:00:00+05:30",
    registrationDeadline: "2026-10-19T23:59:00+05:30",
    registrationFee: FREE,
    entryFeeLabel: "Free",
    feeMode: "per_team",
    participationKit: false,
    teamSize: { min: 4, max: 5 },
    mode: "Hybrid",
    startDate: "2026-10-21T00:00:00+05:30",
    endDate: "2026-10-25T16:00:00+05:30",
    venue: "Lab 7 & Lab 8, Indian Institute of Information Technology, Nagpur",
  },
  {
    slug: "crown-clash",
    registrationUrl: "https://unstop.com/events/crown-clash-tantrafiesta26-iiitn-1766244",
    name: "Crown Clash",
    tagline: "Clash Royale — 1v1 knockout",
    image: "/event-posters/crown-clash.webp",
    clubs: [{ name: "Synergy", slug: "synergy" }],
    description:
      "Crown Clash is the official Clash Royale esports tournament of TantraFiesta, hosted by Synergy Club at IIIT Nagpur. Players from across colleges battle through knockout rounds and an offline final to prove their deck management, timing, and strategic gameplay, competing for the championship title and prizes.",
    prizePool: "₹5,000",
    prizes: [
      { position: 1, label: "1st Prize", amount: "₹3,000" },
      { position: 2, label: "2nd Prize", amount: "₹2,000" },
    ],
    stages: [
      { name: "Registration", when: "10 Oct – 19 Oct 2026", mode: "Online" },
      {
        name: "Prelims Round",
        when: "23 Oct – 24 Oct 2026",
        mode: "Online",
        detail:
          "1v1 knockout matches played through official friendly-battle / tournament links created by the organizers. The winner advances; the loser is eliminated.",
      },
      {
        name: "Final Round",
        when: "25 Oct 2026, 1:00 PM – 5:00 PM",
        mode: "Offline",
        detail: "Played on the IIIT Nagpur campus for the championship title.",
      },
      { name: "Result announcement", when: "26 Oct 2026" },
    ],
    highlights: [
      "Game: Clash Royale, mobile devices only — emulators are not allowed.",
      "Mode: 1v1, played via official friendly-battle / tournament links created by the organizers.",
      "Format: knockout (single elimination) throughout the event.",
      "Players with strong tactical execution, deck mastery and precise timing in high-stakes 1v1 battles.",
    ],
    eligibility: [
      "Open to students of any discipline from any college in India.",
      "Individual participation.",
    ],
    rules: [
      "Standard 1v1 battle settings; the winner advances to the next round, the loser is eliminated.",
      "Own mobile phones only — emulators are strictly prohibited.",
      "Fair play and sportsmanship are required; cheating or foul play of any kind leads to immediate disqualification.",
    ],
    organizers: [
      { name: "Synergy Lead", phone: "+91 63013 48147", email: "synergy@iiitn.ac.in" },
    ],
    registrationOpens: "2026-10-11T12:00:00+05:30",
    registrationDeadline: "2026-10-19T23:59:00+05:30",
    registrationFee: "₹50 per person",
    entryFeeLabel: "₹50 per participant",
    feeMode: "per_participant",
    participationKit: false,
    teamSize: { min: 1, max: 1 },
    mode: "Hybrid",
    startDate: "2026-10-23T00:00:00+05:30",
    endDate: "2026-10-25T17:00:00+05:30",
    venue: "Lab 3, Indian Institute of Information Technology, Nagpur",
  },
  {
    slug: "phoenix-cup",
    registrationUrl: "https://unstop.com/events/pheonix-cup-tantrafiesta26-iiitn-1766240",
    name: "Phoenix Cup",
    tagline: "Valorant — 5v5",
    image: "/event-posters/phoenix-cup.webp",
    clubs: [{ name: "Synergy", slug: "synergy" }],
    description:
      "Phoenix Cup is the Valorant tournament of TantraFiesta'26 at IIIT Nagpur — a competitive 5v5 arena demanding focus, strategy, reflexes and teamwork. Teams fight through two online qualifying stages on the Mumbai server before four survivors meet for the offline final. Lock. Load. Dominate.",
    prizePool: "₹8,000",
    prizes: [
      { position: 1, label: "Winner", amount: "₹5,000" },
      { position: 2, label: "Runner-up", amount: "₹3,000" },
    ],
    stages: [
      { name: "Registration", when: "10 Oct – 19 Oct 2026, 11:30 PM", mode: "Online" },
      {
        name: "Qualifier Round 1",
        when: "22 Oct 2026",
        mode: "Online",
        detail:
          "Single-elimination, best-of-one matches in custom lobbies. The top 8 teams advance to the group stage.",
      },
      {
        name: "Qualifier Round 2 — Group Stage",
        when: "23 Oct 2026",
        mode: "Online",
        detail:
          "The top 8 teams are split into two groups of four and play round-robin, best-of-one. The top 2 teams per group — 4 teams in all — advance to the offline finals.",
      },
      {
        name: "Round 3 — Final",
        when: "25 Oct 2026, 1:00 PM – 4:00 PM",
        mode: "Offline",
        detail:
          "The qualifying teams compete offline for the championship title and prize money. Official results and winner announcements take place the same day.",
      },
    ],
    highlights: [
      "Game: Valorant (PC), 5v5 standard mode on the Mumbai server for online matches.",
      "Match rules: first to 13 rounds with overtime enabled, in organizer-created custom lobbies.",
      "Map pool: Ascent, Abyss, Haven, Lotus, Split, Summit, Sunset.",
      "Agent policy: all agents are allowed; any restrictions will be announced before the event.",
    ],
    eligibility: ["Open to all.", "Teams of 5 players, with 1 substitute allowed."],
    rules: [
      "Matches are played in custom lobbies created by the organizers, first to 13 rounds with overtime enabled.",
      "Online matches run on the Mumbai server.",
      "Teams must show strong communication, strategic utility usage and consistent performance across maps.",
      "Strict enforcement of sportsmanship and fair play; cheating or unauthorized software usage leads to immediate disqualification.",
    ],
    organizers: [
      { name: "Synergy Lead", phone: "+91 92510 10664", email: "synergy@iiitn.ac.in" },
    ],
    registrationOpens: "2026-10-11T12:00:00+05:30",
    registrationDeadline: "2026-10-19T23:30:00+05:30",
    registrationFee: "₹250 per team",
    entryFeeLabel: "₹250 per team; team leader pays once",
    feeMode: "per_team",
    participationKit: false,
    teamSize: { min: 5, max: 6 },
    mode: "Hybrid",
    startDate: "2026-10-22T00:00:00+05:30",
    endDate: "2026-10-25T16:00:00+05:30",
    venue: "Lab 6, Indian Institute of Information Technology, Nagpur",
  },
  {
    slug: "rc-24",
    registrationUrl: "https://unstop.com/events/rc24-esports-tournament-tantrafiesta26-iiitn-1768504",
    name: "RC 24",
    tagline: "Real Cricket 24 — 1v1 knockout",
    image: "/event-posters/RC-24.webp",
    poster: "/event-posters/RC-24.webp",
    clubs: [{ name: "Synergy", slug: "synergy" }],
    description:
      "The RC24 Esports Tournament is the official Real Cricket 24 competition of TantraFiesta, hosted by IIIT Nagpur. Players from any college face off 1v1 in a knockout bracket — first in the Open Rounds and then in the Finals — to prove their batting, bowling and game sense and win the championship title and prizes.",
    prizePool: "₹5,000",
    prizes: [
      { position: 1, label: "1st Prize", amount: "₹2,000" },
      { position: 2, label: "2nd Prize", amount: "₹1,000" },
      { position: 3, label: "3rd Prize", amount: "₹600" },
      { position: 4, label: "4th Place", amount: "₹600" },
      { position: 5, label: "5th Place", amount: "₹400" },
      { position: 6, label: "6th Place", amount: "₹400" },
    ],
    stages: [
      {
        name: "Open Rounds",
        when: "25 Oct 2026, 1:00 PM – 5:00 PM",
        mode: "Offline",
        detail:
          "1v1 knockout matches, 2 overs per innings, played under organizer supervision at IIIT Nagpur. The bracket is drawn randomly by the organizers and shared on WhatsApp on 24 Oct 2026; byes are assigned if the player count is not a power of two. Players are called to their station by the organizers — a player not ready 5 minutes after being called loses by walkover. Room ID and password are created and shared at the station. Winners progress each round until 8 players remain.",
      },
      {
        name: "Final Round",
        when: "26 Oct 2026, 1:00 PM – 5:00 PM",
        mode: "Offline",
        detail:
          "At IIIT Nagpur, the top 8 players from the Open Rounds compete through Quarter-Finals, Semi-Finals, a Third-Place Match and the Final, all 1v1. Quarter-Finals, Semi-Finals and the Third-Place Match are one match each at 2 overs per innings. The Final is best of 3 at 5 overs per innings — the first player to win 2 matches is the champion. Finalists are seeded by the order in which they qualified, and the Final bracket is announced before the Quarter-Finals begin.",
      },
    ],
    highlights: [
      "Single-elimination knockout, capped at 64 players and filled first come, first served.",
      "Players with strong shot selection, smart bowling variations and calm decision-making under pressure.",
      "Fair play and sportsmanship — cheating of any kind leads to immediate disqualification.",
    ],
    eligibility: [
      "Open to players from any college.",
      "Individual participation — squads are not used.",
      "Player count is capped at 64, first come, first served.",
    ],
    rules: [
      "Single-elimination knockout throughout the tournament.",
      "A player who is not ready 5 minutes after being called to their station loses by walkover.",
      "Room ID and password are created and shared by the organizers at the station.",
      "Each player must bring their own device, charger and earphones; stable Wi-Fi/network is provided by the organizers.",
      "Cheating of any kind leads to immediate disqualification.",
    ],
    organizers: [
      { name: "Synergy Lead", phone: "+91 76808 14695", email: "synergy@iiitn.ac.in" },
    ],
    registrationOpens: "2026-10-10T06:30:00+05:30",
    registrationDeadline: "2026-10-19T13:00:00+05:30",
    registrationFee: FREE,
    entryFeeLabel: "Free",
    feeMode: "per_participant",
    participationKit: false,
    teamSize: { min: 1, max: 1 },
    mode: "Offline",
    startDate: "2026-10-25T13:00:00+05:30",
    endDate: "2026-10-26T17:00:00+05:30",
    venue: "Lab 5, Indian Institute of Information Technology, Nagpur",
  },
  {
    slug: "knights-legacy",
    registrationUrl: "https://unstop.com/events/knights-legacy-tantrafiesta26-iiitn-1766245",
    name: "Knights Legacy",
    tagline: "Chess — Blitz qualifiers, Rapid final",
    image: "/event-posters/knights-legacy.webp",
    clubs: [{ name: "Synergy", slug: "synergy" }],
    description:
      "Knights Legacy is a three-stage chess tournament conducted at IIIT Nagpur. It begins with a first online Blitz qualification round on 22 October 2026, followed by a second online Blitz round on 23 October. The top 8 players advance to the final offline Rapid round on 25 October at the Academic Building, IIIT Nagpur. The tournament gives players a structured competitive environment to demonstrate strategic thinking, consistency and sportsmanship.",
    prizePool: "₹5,000",
    prizes: [
      { position: 1, label: "1st Prize", amount: "₹3,000" },
      { position: 2, label: "2nd Prize", amount: "₹2,000" },
    ],
    stages: [
      {
        name: "Day 1 — First Qualifier: Blitz Chess",
        when: "22 Oct 2026",
        mode: "Online",
        detail: "Players compete in the first qualifier; the top 18 advance to Round 2.",
      },
      {
        name: "Day 2 — Second Qualifier: Blitz Chess",
        when: "23 Oct 2026",
        mode: "Online",
        detail: "The 18 qualified players compete; the top 8 advance to the final.",
      },
      {
        name: "Day 3 — Final Round: Rapid Chess",
        when: "25 Oct 2026, 10:00 AM – 2:00 PM",
        mode: "Offline",
        detail:
          "Held at the Academic Building, IIIT Nagpur. The top 8 players compete for the Winner and Runner-up positions.",
      },
    ],
    highlights: [
      "Game: Chess. Format: individual.",
      "Players with strong chess skills and strategic thinking.",
      "Consistent performance across tournament rounds.",
      "Fair play, sportsmanship, and respect for fellow players and tournament officials.",
    ],
    eligibility: ["Open to all.", "Individual participation."],
    rules: [
      "All participants must use their own mobile phone or laptop for the online qualification rounds and the offline final.",
      "Participants are responsible for bringing their personal devices to the venue on the final day.",
      "Round 1: the top 18 players advance to Round 2. Round 2: the top 8 advance to the final.",
    ],
    organizers: [
      { name: "Synergy Lead", phone: "+91 95012 11477", email: "synergy@iiitn.ac.in" },
    ],
    registrationOpens: "2026-10-12T19:30:00+05:30",
    registrationDeadline: "2026-10-21T23:59:00+05:30",
    registrationFee: "₹50 per person",
    entryFeeLabel: "₹50 per participant",
    feeMode: "per_participant",
    participationKit: false,
    teamSize: { min: 1, max: 1 },
    mode: "Hybrid",
    startDate: "2026-10-22T00:00:00+05:30",
    endDate: "2026-10-25T14:00:00+05:30",
    venue: "Lab 4, Indian Institute of Information Technology, Nagpur",
  },
  {
    slug: "critical-ops",
    registrationUrl: "https://unstop.com/events/critical-ops-tantrafiesta26-iiitn-1766242",
    name: "Critical Ops",
    tagline: "Call of Duty: Mobile — 5v5",
    image: "/event-posters/critical-ops.webp",
    clubs: [{ name: "Synergy", slug: "synergy" }],
    description:
      "Critical Ops is a competitive Call of Duty: Mobile 5v5 esports tournament designed to test team coordination, mechanical skill, strategy, communication, objective control, and composure under match pressure. Teams progress through structured competitive rounds before an offline playoff and final stage, with matches administered under consistent settings and an evidence-based dispute process.",
    prizePool: "₹8,000",
    prizes: [
      { position: 1, label: "1st Prize", amount: "₹5,000" },
      { position: 2, label: "2nd Prize", amount: "₹3,000" },
    ],
    stages: [
      { name: "Registration", when: "10 Oct – 19 Oct 2026", mode: "Online" },
      { name: "Prelims Round", when: "23 Oct 2026", mode: "Online" },
      {
        name: "Final Round",
        when: "26 Oct 2026, 1:00 PM – 3:00 PM",
        mode: "Offline",
        detail: "Offline playoff and final at IIIT Nagpur; results announced the same day.",
      },
      { name: "Result announcement", when: "25 Oct 2026" },
    ],
    highlights: [
      "Five-player teams with coordinated communication and role discipline.",
      "Strong objective play, map awareness, rotations, trading and clutch decision-making.",
      "Professional conduct before, during and after matches.",
      "Teams that can perform consistently across Hardpoint, Search & Destroy, and Control.",
    ],
    eligibility: ["Open to all.", "Teams of 5 players, with 1 substitute allowed."],
    rules: [
      "Matches are administered under consistent settings with an evidence-based dispute process.",
      "Fair play is required: no cheating, exploiting, account sharing, collusion, match manipulation, or unauthorised software or hardware.",
    ],
    organizers: [
      { name: "Sai Nitish", phone: "+91 96721 15599", email: "bt25eci052@iiitn.ac.in" },
    ],
    registrationOpens: "2026-10-10T12:00:00+05:30",
    registrationDeadline: "2026-10-19T23:59:00+05:30",
    registrationFee: "₹250 per team",
    entryFeeLabel: "₹250 per team; team leader pays once",
    feeMode: "per_team",
    participationKit: false,
    teamSize: { min: 5, max: 6 },
    mode: "Hybrid",
    startDate: "2026-10-23T00:00:00+05:30",
    endDate: "2026-10-26T15:00:00+05:30",
    venue: "Lab 5, Indian Institute of Information Technology, Nagpur",
  },
  {
    slug: "the-game-jam",
    registrationUrl: "https://unstop.com/hackathons/game-jam-tantrafiesta-2026-iiitn-1758206",
    name: "The Game Jam™",
    tagline: "Theme: Plot Twist",
    image: "/event-posters/The-Game-Jam.webp",
    clubs: [{ name: "Dimension", slug: "dimension" }],
    description:
      "The Game Jam™ is a flagship competition of TantraFiesta 2026, the annual technical fest of IIIT Nagpur and one of the largest tech fests in Central India. It brings together game developers, designers and innovators from across the country to showcase their talent. Teams work under the theme “Plot Twist” to rapidly design, develop and prototype games, putting creativity, technical execution, game mechanics, storytelling, art, sound design, teamwork and rapid iteration to the test.",
    prizePool: "₹35,000",
    prizes: [
      { position: 1, label: "1st Prize", amount: "₹20,000", note: "Certificate included." },
      { position: 2, label: "2nd Prize", amount: "₹10,000", note: "Certificate included." },
      { position: 3, label: "3rd Prize", amount: "₹5,000", note: "Certificate included." },
    ],
    stages: [
      {
        name: "Round 1 — Online",
        when: "25 Sep – 5 Oct 2026 (Registration Closed)",
        mode: "Online",
        detail:
          "Games are submitted through the official Game Jam portal at itch.io/jam/tf-iiitn-game-jam-2026, with documentation covering credits, assets and the compiled game, plus a Git repository link containing all game files. After submitting on itch.io, participants post about their game on GameDoora so the Round 2 judges can play it. Judged on theme adherence, gameplay and mechanics, innovation and creativity, aesthetics, sound and music, and enjoyment factor.",
      },
      {
        name: "Round 2 — Offline Finale",
        when: "25 Oct 2026, 10:00 AM – 26 Oct 2026, 10:00 AM (Evaluation till 2:00 PM)",
        mode: "Offline",
        detail:
          "Shortlisted teams are invited to the IIIT Nagpur campus and given 24 hours to work on and modify their game. The Round 2 theme is revealed on the day the round begins. All finalist teams must reach campus by 9:00 AM on 23 October 2026. Judgment parameters for the final round are announced on the day of the event.",
      },
    ],
    highlights: [
      "Theme: Plot Twist.",
      "Any game engine is allowed.",
      "Round 1 judging: theme adherence, gameplay and mechanics, innovation and creativity, aesthetics, sound and music, enjoyment factor.",
      "Participation in the offline round is mandatory to be eligible for prizes.",
    ],
    eligibility: [
      "Open to all students studying at any college or university in India.",
      "Inter-college and inter-university teams are allowed.",
      "There is no limit on the number of teams per college.",
      "Team size can range from 1 to 4 members; one participant can only be in one team.",
    ],
    rules: [
      "The game must run standalone without requiring judges to download external software, and must be playable using only keyboard and mouse (web or PC builds) or touch controls (Android builds).",
      "The game must be published and submitted through the itch.io page and comply with the submission criteria.",
      "The game must not be a copy of any existing game — it should be unique.",
      "Participants must share the source code of their game through a Git repository.",
      "The submitted game must be set as free so judges can play and evaluate it.",
      "Individual assets may be used if you hold the legal rights or licenses; full scenes and pre-made game prefabs are not allowed.",
      "The use of generative AI is NOT allowed.",
      "All external assets must be credited properly; pirated assets and content lead to disqualification.",
      "The entry is invalid if the participant has not registered on Unstop.",
      "All participants must bring their own laptop and setup for the final round.",
      "Finalists arriving before 23 October must arrange their own accommodation or contact the organizers about the Guest House (charges apply).",
      "Decisions of the judges and organizers are final and binding.",
    ],
    organizers: [
      { name: "Samarth Kodape", phone: "+91 78880 45421", email: "bt25csh049@iiitn.ac.in" },
      { name: "Akshat Vyas", phone: "+91 78801 45151", email: "bt25csh058@iiitn.ac.in" },
      { name: "Hetansh Vakta", phone: "+91 99799 55969", email: "bt25csh001@iiitn.ac.in" },
    ],
    registrationOpens: "2026-09-19T13:00:00+05:30",
    registrationDeadline: "2026-10-05T23:59:00+05:30",
    registrationFee: "₹450 per person",
    entryFeeLabel: "₹450 per participant; team leader pays for all members",
    feeMode: "per_participant",
    meals: "2 Meals + 2 Snacks",
    participationKit: true,
    teamSize: { min: 1, max: 4 },
    mode: "Hybrid",
    startDate: "2026-10-25T10:00:00+05:30",
    endDate: "2026-10-26T14:00:00+05:30",
    venue: "CR-201, CR-202 & Admin Hall 2, Indian Institute of Information Technology, Nagpur",
  },
  {
    slug: "pitch-please",
    registrationUrl: "https://unstop.com/competitions/pitch-please-tantrafiesta26-iiitn-1765831",
    name: "Pitch, Please!",
    tagline: "6-hour game concept pitching",
    image: "/event-posters/Pitch-Please.webp",
    clubs: [{ name: "Dimension", slug: "dimension" }],
    description:
    "Pitch, Please! is a game idea pitching competition organized as part of TantraFiesta’26, the annual technical fest of IIIT Nagpur. The event brings together game developers, designers, and innovators to showcase their creativity and present their original game concepts.",
    prizePool: "₹20,000",
    prizes: [
      { position: 1, label: "1st", amount: "₹10,000", note: "Certificate included." },
      { position: 2, label: "2nd", amount: "₹6,500", note: "Certificate included." },
      { position: 3, label: "3rd", amount: "₹3,500", note: "Certificate included." },
    ],
    stages: [
      {
        name: "Pitch Day",
        when: "25 Oct 2026, 12:00 PM – 6:00 PM",
        mode: "Offline",
        detail:
          "Round 1: Game Pitch Presentation — Participants will have 15 minutes to present their complete game concept to the judges and fellow competitors. The presentation must cover all major aspects of the game, including gameplay mechanics, visual theme, storyline, and other relevant elements. Selection will be based on the judges’ evaluation and audience voting.",
      },
      {
        name: "Round 2 & Round 3",
        detail:
          "The formats and requirements for the subsequent rounds will be revealed on the day of the event, while maintaining the overall game-pitching format.",
      },
      {
        name: "Theme Announcement",
        detail:
          "The theme will be announced on 20 October 2026, and all participants must develop their game concepts according to the given theme.",
      },
    ],
    highlights: [
      "Pitch, Please! is a game idea pitching competition organized as part of TantraFiesta’26, the annual technical fest of IIIT Nagpur.",
      "The event brings together game developers, designers, and innovators to showcase their creativity and present ",
      "their original game concepts.",
    ],
    eligibility: [
      "Open to students across disciplines.",
      "Teams of 1–4 members.",
    ],
    rules: [
      "Teams must consist of 1–4 members, with at least 3 members recommended.",
      "Participants may compete in only one team.",
      "Inter-college and inter-university teams are permitted.",
      "The Round 1 presentation must be submitted as a Google Drive link before 11:59 PM on 24 October 2026.",
      "Presentations must be in PPT, PPTX, or PDF format.",
      "A maximum of 4 text-heavy slides is allowed. Additional image slides are permitted, containing only images and minimal text.",
      "Participants may edit their presentation until the competition begins. The final version must be uploaded to the same Google Drive link.",
      "External assets may be used only with appropriate legal rights or licenses and must be properly credited.",
      "AI tools are permitted.",
      "The decisions of the judges and organizers are final and binding.",
     
    ],
    organizers: [
      { name: "Akshat Vyas", phone: "+91 78801 45151", email: "dimensions@iiitn.ac.in" },
      { name: "Samarth Kodape", phone: "+91 78880 45421", email: "tantrafiesta@iiitn.ac.in" },
    ],
    registrationOpens: "2026-10-11T12:00:00+05:30",
    registrationDeadline: "2026-10-24T00:00:00+05:30",
    registrationFee: "₹150 per person",
    entryFeeLabel: "₹150 per participant; team leader pays for all members",
    feeMode: "per_participant",
    meals: "1 Snack",
    participationKit: true,
    teamSize: { min: 1, max: 4 },
    mode: "Offline",
    startDate: "2026-10-25T12:00:00+05:30",
    endDate: "2026-10-25T18:00:00+05:30",
    venue: "CR 204, Indian Institute of Information Technology, Nagpur",
  },
  {
    slug: "rann-bhoomi",
    registrationUrl: "https://unstop.com/competitions/rann-bhoomi-20-tantrafiesta26-iiitn-1768975",
    name: "Rann Bhoomi 2.0",
    tagline: "The Robowars",
    image: "/event-posters/Rann-Bhoomi.webp",
    poster: "/event-posters/Rann-Bhoomi.webp",
    clubs: [{ name: "Iotics", slug: "iotics" }],
    description:
      "Rann Bhoomi 2.0 challenges participants to design and build a manually controlled combat robot capable of engaging in head-to-head battles inside a dedicated arena. Robots must demonstrate superior strength, control, durability and strategy to overpower their opponents — the goal is to outlast and outfight competitors while adhering to strict safety and design standards.",
    prizePool: "₹1,20,000+",
    prizeNote: "Winners are declared across 3 weight categories: 1.5 kg, 8 kg, and 15 kg.",
    prizes: [
      { position: 1, label: "15 kg Winner", amount: "₹60,000 (15 kg)" },
      { position: 1, label: "8 kg Winner", amount: "₹40,000 (8 kg)" },
      { position: 1, label: "1.5 kg Winner", amount: "₹20,000 (1.5 kg)" },
      { position: 4, label: "Best Design", amount: "Best Design", note: "Special recognition across all weight classes" },
      { position: 5, label: "Best Warrior", amount: "Best Warrior", note: "Special recognition across all weight classes" },
    ],
    stages: [
      {
        name: "Round 1 — Qualification: Portfolio Submission",
        when: "By 22 Oct 2026, 6:00 PM",
        mode: "Online",
        detail:
          "Teams submit an abstract detailing the design, weapon system and power supply of their bot, together with images, CAD models or a video. Portfolios are reviewed for eligibility, safety and innovation, and are used for seeding and shortlisting. Incomplete machines are still eligible to submit. Only shortlisted teams qualify for the main competition.",
      },
      {
        name: "Round 2 — Knockout Elimination: Arena Battle",
        when: "25 Oct 2026, 5:00 PM – 11:00 PM",
        mode: "Offline",
        detail:
          "Five-minute matches in an elimination format. The losing bot is eliminated and the winner advances, continuing until the top 6 teams qualify for the finals — 2 from 1.5 kg, 2 from 8 kg and 2 from 15 kg. Victory by knock-out: the opposing bot fails to move 6 inches within 30 seconds. Scored on aggression, damage, control and strategy.",
      },
      {
        name: "Round 3 — Finals: Championship Battles",
        when: "26 Oct 2026, 10:00 AM – 6:00 PM",
        mode: "Offline",
        detail:
          "Three championship matches, one final per weight category: 1.5 kg, 8 kg, and 15 kg, consisting of two rounds of 3 minutes each, with a 5-minute break after Round 1 for technical repairs. Winners of each weight category are declared on final-match performance.",
      },
    ],
    highlights: [
      "Weight categories: 1.5 kg (±5% tolerance), 8 kg (±5% tolerance), and 15 kg (±5% tolerance).",
      "Prizes: ₹60,000 for 15 kg winner, ₹40,000 for 8 kg winner, ₹20,000 for 1.5 kg winner, plus Best Design and Best Warrior awards.",
      "Accommodation: Available for registered outstation participants on campus.",
      "Arena: a dedicated enclosed 16 × 16 × 10 ft arena built from transparent polycarbonate sheets and metal.",
      "Every robot undergoes a safety inspection before being cleared for competition.",
      "Typical wheel RPM by class: 400–800 RPM at 1.5 kg, 300–500 RPM at 8 kg, 200–400 RPM at 15 kg.",
      "Judging: matches decided by knock-out or points, scored on aggression, damage, control and strategy.",
    ],
    eligibility: [
      "Open to all students with a valid college ID card; teams must register before the event.",
      "Each team may consist of up to 6 members, all from the same institute — multiple teams per institute are allowed.",
      "A unique team name is mandatory, and each team must assign a Team Representative (Leader) for official communication.",
      "Valid student ID cards are required at registration.",
    ],
    rules: [
      "Weight categories: 1.5 kg, 8 kg, and 15 kg with ±5% error/tolerance permitted on robot weight.",
      "Power supply: electrical (batteries) only — internal combustion engines are prohibited. Maximum 52 V DC between any two points.",
      "Robots must have a manual kill switch, an emergency stop on the controller, and proper insulation and secure wiring.",
      "Hydraulics and pneumatics: maximum 50 bar, fully self-contained and leak-proof; pneumatics need certified tanks and regulators with mandatory safety approvals.",
      "Mobility: wheels, tracks and walking mechanisms are allowed; flying mechanisms and suction-based attachments are prohibited. Jumping or hopping is allowed up to 4 feet.",
      "Weapons allowed: cutters, flippers, saws, lifting devices and spinning hammers.",
      "Weapons prohibited: flames, explosives, liquids, nets, glue, entanglement devices, lasers, magnets and projectiles.",
      "Spinning weapons must stop within 60 seconds of power loss.",
      "Robots must not damage the arena — violations result in penalties or disqualification.",
      "Once robots enter the arena no team member may step inside; only organizers may adjust if required.",
      "Robots may only be activated inside the arena or in designated testing zones.",
      "Safety and compliance are checked before every round, and judges' decisions are final and binding.",
      "The rules in the brochure may change according to circumstances.",
    ],
    organizers: [
      { name: "General Support", phone: "+91 72318 36153", email: "tantrafiesta@iiitn.ac.in" },
      { name: "Shamit Chandra", phone: "+91 89605 65026", email: "bt25ece005@iiitn.ac.in" },
      { name: "Siddhesh Balkawade", phone: "+91 79726 58621", email: "bt25cse178@iiitn.ac.in" },
      { name: "Neel Kotecha", phone: "+91 79765 77767", email: "iotics@iiitn.ac.in" },
    ],
    registrationOpens: "2026-10-12T12:00:00+05:30",
    registrationDeadline: "2026-10-22T18:00:00+05:30",
    registrationFee: "₹300 per person",
    entryFeeLabel: "₹300 per participant; team leader pays for all members",
    feeMode: "per_participant",
    meals: "1 Meal + 1 Snack",
    participationKit: true,
    accommodation: "Available for registered participants",
    teamSize: { min: 1, max: 6 },
    mode: "Hybrid",
    startDate: "2026-10-22T18:00:00+05:30",
    endDate: "2026-10-26T18:00:00+05:30",
    venue: "Academic Parking Area, Indian Institute of Information Technology, Nagpur",
  },
  {
    slug: "the-lost-pathways",
    registrationUrl: "https://unstop.com/hackathons/the-lost-pathways-a-micromouse-event-tantrafiesta26-iiitn-1767543",
    name: "The Lost Pathways",
    tagline: "A micromouse event",
    image: "/event-posters/The-Lost-Pathways.webp",
    clubs: [{ name: "Iotics", slug: "iotics" }],
    description:
      "Teams must engineer an autonomous robot — a MicroMouse — that finds the shortest path through a 16×16 maze from a specified start square to the destination square at its centre. Robots must map, learn and optimize their path in the least time possible, testing algorithm design, decision-making, engineering, teamwork and innovation.",
    prizePool: "₹30,000",
    prizes: [
      { position: 1, label: "Winner", amount: "₹15,000", note: "Certificate included." },
      { position: 2, label: "First Runner-Up", amount: "₹9,000", note: "Certificate included." },
      { position: 3, label: "Second Runner-Up", amount: "₹6,000", note: "Certificate included." },
    ],
    stages: [
      {
        name: "Final Round",
        when: "25 Oct 2026, 9:00 AM – 2:00 PM",
        mode: "Offline",
        detail:
          "Each robot is allocated a total of 20 minutes of access to the final maze, including any time spent adjusting it between runs. Teams may perform as many runs as they want within that window; the fastest successful run is the official result. After the third run, a 1-minute penalty is added to each subsequent run. First place goes to the robot with the shortest official time; robots that do not finish are ranked by how close they got to the destination square.",
      },
    ],
    highlights: [
      "The maze is built from 18 cm × 18 cm unit squares, up to 16 × 16, with walls 7 cm high and 1.2 cm thick and 16.8 cm wall-to-wall within a square.",
      "Maze walls are white-sided with possibly red tops on a matt black floor — none of it uniform, and friction may vary across the floor.",
      "The start is at one of the four corners, walled on three sides; the goal is the four-square target zone at the centre, which has only one entrance, positioned so a wall-hugging robot cannot find it.",
      "Two timers run: an overall timer for the 20-minute allocation, and a run timer that starts when the robot's front edge crosses the start line and stops when it crosses the finish line.",
      "Open to all college students from any institute — no prior robotics experience required.",
    ],
    eligibility: [
      "Team size: 1–5 members — one operator and up to four assistants per robot.",
      "The team may change the designated operator in accordance with the competition rules.",
      "Each team must have a unique team name, and the Team Leader must be present as the primary contact.",
      "Up to 1 member is allowed at the maze table during runs.",
      "Open to all college students from any institute; no prior robotics experience required.",
    ],
    rules: [
      "The robot must be autonomous — no remote controls allowed.",
      "The robot must not leave any part of its body behind while solving the maze.",
      "The robot may not jump over, fly over, climb, scratch, cut, burn, mark, damage or destroy the maze walls.",
      "The robot must not exceed 16 cm in length or width — including while changing its parameters mid-run — and must be under 10 cm tall.",
      "Power: onboard batteries only, not exceeding 15 V.",
      "Cameras or any device used to scan or memorize the maze are strictly prohibited.",
      "No harmful mechanisms, pneumatics or hydraulics.",
      "Each run must be made from the starting square; the operator may abort a run at any time.",
      "Touching the robot during a run aborts it, and the robot must be removed from the maze — unless it has already crossed the finish line.",
      "After the maze is disclosed, the operator cannot feed information about it into the robot.",
      "Between runs, contestants may change switch positions, adjust sensors and make repairs if the robot breaks down.",
      "Damaging the maze results in penalty or disqualification, and a bot leaving the maze area restarts from the starting square.",
      "The decisions of the referees are final and not subject to appeal; complaints must be submitted during or immediately after the match.",
      "Rude behaviour is not tolerated and can lead to disqualification by the head referee or event organisers.",
      "Rules may be subject to change according to the circumstances.",
    ],
    organizers: [
      { name: "IoTics Lead", phone: "+91 74989 12500", email: "iotics@iiitn.ac.in" },
      { name: "Neel Kotecha", phone: "+91 79765 77767", email: "bt25eci057@iiitn.ac.in" },
    ],
    registrationOpens: "2026-10-10T12:00:00+05:30",
    registrationDeadline: "2026-10-20T23:59:00+05:30",
    registrationFee: "₹150 per person",
    entryFeeLabel: "₹150 per participant; team leader pays for all members",
    feeMode: "per_participant",
    meals: "1 Snack",
    participationKit: true,
    teamSize: { min: 1, max: 5 },
    mode: "Offline",
    startDate: "2026-10-26T09:00:00+05:30",
    endDate: "2026-10-26T14:00:00+05:30",
    venue: "Besides Amphitheatre, Indian Institute of Information Technology, Nagpur",
  },
  {
    slug: "line-o-mania",
    registrationUrl: "https://unstop.com/hackathons/line-o-mania-tantrafiesta26-iiitn-1767447",
    name: "Line-O-Mania",
    tagline: "A line follower competition",
    image: "/event-posters/Line-O-Mania.webp",
    clubs: [{ name: "Iotics", slug: "iotics" }],
    description:
      "Line-O-Mania is a robotics contest where teams build an autonomous robot capable of following a pre-defined path on a contrast background. The track is black and white and includes bends, loops, sharp turns, junctions, dotted lines and dead ends. Bots require precise navigation to reach the end point in the shortest possible time. A special element is introduced in the track and disclosed only on the day of the event, adding an extra layer of challenge and unpredictability.",
    prizePool: "₹25,000",
    prizes: [
      { position: 1, label: "Winner", amount: "₹12,500", note: "Certificate included." },
      { position: 2, label: "First Runner-Up", amount: "₹7,500", note: "Certificate included." },
      { position: 3, label: "Second Runner-Up", amount: "₹5,000", note: "Certificate included." },
    ],
    stages: [
      {
        name: "Video Submission",
        when: "By 23 Oct 2026, 2:00 PM",
        mode: "Online",
        detail: "Submit an unedited 30–60 second demonstration of a working bot.",
      },
      {
        name: "Qualifiers",
        when: "25 Oct 2026, 10:00 AM – 1:00 PM",
        mode: "Offline",
        detail: "Run at IIIT Nagpur on a track disclosed on the spot.",
      },
      {
        name: "Final Track",
        when: "25 Oct 2026, 2:00 PM – 4:00 PM",
        mode: "Offline",
        detail:
          "The final track includes junctions, dotted lines, loops, dead ends, and a surprise element.",
      },
    ],
    highlights: [
      "Track: a 3 cm wide line on a black-and-white contrast track made of PVC flex sheets, with different start and end points.",
      "The track layout — including a surprise element — is disclosed only on the day of the event.",
      "Scoring system: (600 − time taken in seconds) − (penalties + skips), with bonus points for completing the track.",
      "A maximum of 2 figures or obstacles may be skipped; beyond that, all must be cleared or the team may choose to end the run.",
    ],
    eligibility: [
      "Teams of 1–4 members; one participant cannot be in more than one team.",
      "No restriction on the number of teams from a college, and inter-college teams are allowed.",
      "Each team must have a unique team name and appoint a Team Leader, who must be present during the run.",
    ],
    rules: [
      "Robots must be completely autonomous — no remote-controlled bots allowed.",
      "A pre-run inspection will be conducted.",
      "No pneumatics, hydraulics or harmful mechanisms are allowed.",
      "No pre-made kits or Lego kits are permitted.",
      "Maximum DC voltage of 12 V between any two circuit points.",
      "If the bot malfunctions, a 30-second repair timeout may be taken; runtime resumes after 30 seconds or whenever the team is ready.",
      "Only one member selected by the team may hand-touch the bot if required.",
      "Damaging the arena leads to instant disqualification.",
      "If the bot leaves the track or needs intervention it restarts from the previous checkpoint; only five such penalties are allowed before disqualification.",
      "One minute is allowed for sensor calibration before the run; the timer starts regardless after this.",
      "The judge's decision is final and binding, and misbehaviour leads to immediate disqualification.",
      "Rules may be subject to change according to the circumstances.",
    ],
    organizers: [
      { name: "IoTics Lead", phone: "+91 93430 80363", email: "iotics@iiitn.ac.in" },
      { name: "IoTics Co-Lead", phone: "+91 93479 75307", email: "tantrafiesta@iiitn.ac.in" },
      { name: "Shreyansh Jain", phone: "+91 83027 99631", email: "bt25eci003@iiitn.ac.in" },
    ],
    registrationOpens: "2026-10-05T00:00:00+05:30",
    registrationDeadline: "2026-10-23T14:00:00+05:30",
    registrationFee: "₹150 per person",
    entryFeeLabel: "₹150 per participant; team leader pays for all members",
    feeMode: "per_participant",
    meals: "1 Snack",
    participationKit: true,
    teamSize: { min: 1, max: 4 },
    mode: "Offline",
    startDate: "2026-10-25T09:00:00+05:30",
    endDate: "2026-10-25T16:00:00+05:30",
    venue: "Academic Block Ground Floor, Indian Institute of Information Technology, Nagpur",
  },
  {
    slug: "yuvaan",
    registrationUrl: "https://unstop.com/conferences/yuvaan-youth-conclave-iiitn-1766418",
    name: "Yuvaan: Youth Conclave",
    tagline: "Structured debate and discussion",
    image: "/event-posters/yuvaan.webp",
    clubs: [{ name: "Orator", slug: "orator" }],
    description:
      "Yuvaan is a youth conclave designed to encourage structured discussion, critical thinking, public speaking, questioning and constructive disagreement. The format combines prepared individual speeches with direct questioning and open interactive discussion, treating the committee as an intellectual discussion rather than a personal confrontation.",
    prizePool: "₹30,000",
    prizes: [],
    stages: [
      {
        name: "Conclave",
        when: "26 Oct 2026, 12:00 PM – 6:00 PM",
        mode: "Offline",
        detail:
          "Prepared individual speeches followed by direct questioning and open interactive discussion, at IIIT Nagpur.",
      },
    ],
    highlights: [
      "Promote substantive and respectful discourse.",
      "Encourage delegates to examine issues from multiple perspectives.",
      "Develop public speaking, reasoning, questioning, rebuttal and spontaneous response.",
      "Encourage engagement with arguments rather than the delivery of isolated prepared statements.",
      "Clarity, relevance, reasoning, responsiveness and respectful disagreement guide participation.",
    ],
    eligibility: ["Open to all.", "Individual participation."],
    rules: [
      "These Rules of Procedure apply throughout the committee unless the Organising Committee issues a specific procedural instruction.",
      "Delegates are expected to familiarise themselves with the procedure before the committee commences.",
    ],
    organizers: [
      { name: "Atharva Singh", phone: "+91 98926 73856", email: "atharvasingh07119@gmail.com" },
      { name: "TantraFiesta IIIT Nagpur", email: "tantrafiesta@iiitn.ac.in" },
    ],
    registrationOpens: "2026-10-11T12:00:00+05:30",
    registrationDeadline: "2026-10-24T23:59:00+05:30",
    registrationFee: "₹300 per person",
    entryFeeLabel: "₹300 per participant",
    feeMode: "per_participant",
    meals: "1 Snack",
    participationKit: true,
    teamSize: { min: 1, max: 1 },
    mode: "Offline",
    startDate: "2026-10-26T12:00:00+05:30",
    endDate: "2026-10-26T18:00:00+05:30",
    venue: "CR 201, 202 & Admin Hall 2, Indian Institute of Information Technology, Nagpur",
  },
  {
    slug: "keep-alive-26",
    rulesDocument: {
      name: "Finalist_kit",
      url: "https://drive.google.com/drive/folders/1Np8FfD9jSm5RVci8Fm5VsyViebPrQgrd?usp=sharing",
    },
    registrationUrl: "https://unstop.com/hackathons/keep-alive-26-iiitn-1766226",
    name: "Keep Alive '26",
    tagline: "National incident response championship",
    image: "/event-posters/Keep-Alive-20261019.webp",
    clubs: [{ name: "GDG on Campus", slug: "gdg" }],
    description:
      "An alert just fired. Checkout is failing. Can your team find out why before the clock runs out? KEEP ALIVE '26 is a national incident response championship for students who have been learning DevOps. You've practised Linux, Docker and Kubernetes — now test it in the field: read the alerts, dashboards, logs and traces of a live microservices system, find what broke and why, and explain how you would fix it. It runs on the same incident platform as Panic at the Pod, the live Kubernetes incident challenge by CNCG Noida, our Community Partner, hosted by GDG on Campus IIIT Nagpur at TantraFiesta 2026.",
    prizePool: "₹50,000",
    prizes: [
      {
        position: 1,
        label: "Winner",
        amount: "₹12,000 + SWAGS",
        note: "Cash prize, merit certificates and goodies.",
      },
      {
        position: 2,
        label: "1st Runner-up",
        amount: "₹7,000 + SWAGS",
        note: "Cash prize, merit certificates and goodies.",
      },
      {
        position: 3,
        label: "2nd Runner-up",
        amount: "₹4,000 + SWAGS",
        note: "Cash prize, merit certificates and goodies.",
      },
      {
        position: 4,
        label: "Sharpest RCA Award",
        amount: "₹2,000 + SWAGS",
        note: "Highest total root-cause accuracy across all 10 finale incidents, among teams outside the top 3.",
      },
    ],
    prizeNote:
      "Every finalist present at the finale receives a certificate of participation and goodies.",
    stages: [
      {
        name: "Round 1 — The Night Shift",
        when: "13 Oct, 9:00 AM – 18 Oct 2026, 11:59 PM",
        mode: "Online",
        detail:
          "One 30-minute assessment per team, taken once from the team leader's account: multiple-choice questions on DevOps and observability, one incident to investigate from screenshots of dashboards, logs and traces, and two short written answers. Proctored and taken in full screen — no AI tools, no search and no second device. The top 15 teams reach the finale; the next 10 form the waitlist.",
      },
      {
        name: "Finalists and waitlist announced",
        when: "19 Oct 2026, 6:00 AM",
      },
      {
        name: "Finalists confirm their seats",
        when: "By 20 Oct 2026, 6:00 PM IST. Waitlist offers from 7:00 PM; final list fixed 21 Oct, 11:59 PM",
      },
      {
        name: "Finale — KEEP ALIVE Live",
        when: "26 Oct 2026, 9:00 AM – 6:00 PM",
        mode: "Offline",
        detail:
          "On campus at IIIT Nagpur. A hands-on session on the platform, Grafana and the report form, with one practice incident. Phase 1, First Responder: 6 incidents in 90 minutes. Phase 2, Deep Dive: 3 intermediate incidents and 1 critical, cascading incident in 90 minutes. You never change the system — you read its signals and submit a short solution report for each incident covering the root cause, the evidence and the fix. Each team then presents its findings to the judges in a 10-minute slot.",
      },
    ],
    highlights: [
      "₹50,000 in cash prizes for the top three teams and the Sharpest RCA award.",
      "Investigate real incidents on a real observability stack: Grafana dashboards, Prometheus metrics, logs and traces.",
      "No production experience needed — a 30-minute hands-on session at the finale teaches every tool you will use.",
      "After the finale, the platform team walks everyone through all 10 incidents and how they were solved.",
      "Goodies and certificates for every finalist, and merit certificates for the winners.",
      "Bring your senior: one recent graduate (2024–2026) of your college can join your team.",
    ],
    eligibility: [
      "Teams of 2–3, all from the same college.",
      "UG, PG and diploma students from any branch or year.",
      "Up to one alumnus per team, graduated in 2024, 2025 or 2026 — working alumni are welcome.",
      "PhD students and research scholars are not eligible.",
      "Made for students with at least 6 to 12 months of DevOps learning: if you have used Linux and Docker, run kubectl and opened Grafana a few times, you are ready.",
    ],
    rules: [
      "Round 1 is one 30-minute assessment per team, taken once from the team leader's account.",
      "Round 1 is proctored and taken in full screen: no AI tools, no search and no second device.",
      "In the finale you never change the system — you read its signals and submit a short solution report per incident: root cause, evidence and fix.",
      "AI tools, search and documentation are allowed in the finale, but every team must be able to explain what it submits.",
      "Travel and stay for the finale are arranged by each team.",
      "Every team brings at least 2 laptops.",
    ],
    organizers: [
      { name: "Khushal Badaya", phone: "+91 98280 98997", email: "bt25csh041@iiitn.ac.in" },
      { name: "GDGoC IIITN", phone: "+91 89038 92943", email: "gdg@iiitn.ac.in" },
    ],
    registrationOpens: "2026-10-09T02:00:00+05:30",
    registrationDeadline: "2026-10-18T23:59:00+05:30",
    registrationFee: "₹250 per person",
    entryFeeLabel: "₹250 per participant; team leader pays for all members",
    feeMode: "per_participant",
    meals: "1 Meal + 1 Snack",
    participationKit: true,
    teamSize: { min: 2, max: 3 },
    mode: "Hybrid",
    startDate: "2026-10-11T09:00:00+05:30",
    endDate: "2026-10-26T18:00:00+05:30",
    venue: "CR 203, Indian Institute of Information Technology, Nagpur",
  },
  {
    slug: "digital-time-capsule",
    registrationUrl: "https://unstop.com/events/digital-time-capsule-dtc-tantrafiesta26-iiitn-1766419",
    name: "Digital Time Capsule",
    tagline: "Photography & videography challenge",
    image: "/event-posters/digital-timecapsule.webp",
    clubs: [{ name: "Probe", slug: "probe" }],
    description:
      "The Digital Time Capsule gives participants a platform to document and interpret the vibrant spirit of TantraFiesta through photography and videography. It encourages original visual storytelling, creative observation and thoughtful curation of festival moments, preserving them as a digital archive that future audiences can revisit — a curated visual record of the festival, captured from the perspectives of the people in it.",
    prizePool: "₹10,000",
    prizes: [
      { position: 1, label: "Winner", amount: "₹5,000" },
      { position: 2, label: "1st Runner-Up", amount: "₹3,000" },
      { position: 3, label: "2nd Runner-Up", amount: "₹2,000" },
    ],
    stages: [
      {
        name: "Registration",
        mode: "Online",
        detail: "Participants register individually through the official Unstop event portal.",
      },
      {
        name: "Festival capture",
        when: "During TantraFiesta '26",
        detail:
          "Participants capture memorable, authentic and visually engaging moments during the festival.",
      },
      {
        name: "Curation & submission",
        when: "Until 30 Oct 2026",
        mode: "Online",
        detail:
          "Participants curate their final entry in the permitted submission format, then submit the final files and mandatory entry details through the official Unstop portal before the deadline.",
      },
      {
        name: "Evaluation, shortlisting & results",
        detail:
          "Entries are screened and evaluated by the appointed jury against the published criteria. Winning and shortlisted entries are selected following jury evaluation, and official results are communicated by the organisers.",
      },
    ],
    highlights: [
      "Document and interpret the vibrant spirit of TantraFiesta through photography and videography.",
      "Original visual storytelling, creative observation and thoughtful curation of festival moments.",
      "Preserve memorable and authentic moments as part of a digital archive that future audiences can revisit.",
    ],
    eligibility: ["Open to all students.", "Individual participation."],
    rules: [
      "Participants register individually through the official Unstop event portal.",
      "Entries must be curated in the permitted submission format.",
      "Final files and mandatory entry details must be submitted through the official Unstop portal before the deadline.",
      "Entries are screened and evaluated by the appointed jury according to the published evaluation criteria.",
    ],
    organizers: [
      { name: "Sarthak Jain", phone: "+91 93027 92396", email: "bt25ece084@iiitn.ac.in" },
      { name: "Abhijna Hadimani", phone: "+91 63663 16755", email: "bt25csa041@iiitn.ac.in" },
    ],
    registrationOpens: "2026-10-11T00:00:00+05:30",
    registrationDeadline: "2026-10-30T23:59:00+05:30",
    registrationFee: FREE,
    entryFeeLabel: "Free",
    feeMode: "per_participant",
    participationKit: false,
    teamSize: { min: 1, max: 1 },
    mode: "Online",
    startDate: "2026-10-11T00:00:00+05:30",
    endDate: "2026-10-30T23:59:00+05:30",
    venue: IIITN,
  },
  {
    slug: "vlsi-workshop",
    registrationUrl: "https://unstop.com/workshops-webinars/silicon-rush-tantrafiesta26-iiitn-1770343",
    name: "Silicon Rush — VLSI Workshop",
    tagline: "Hands-on silicon design and semiconductor workshop",
    image: "/event-posters/VLSI.webp",
    clubs: [{ name: "Iotics", slug: "iotics" }],
    description:
      "A comprehensive, hands-on workshop on Very Large Scale Integration (VLSI) and semiconductor design organized by Iotics, the robotics and IoT club of IIIT Nagpur. Learn modern EDA workflows, digital circuit modeling, and silicon architecture fundamentals.",
    prizePool: "₹1,00,000+",
    prizeNote:
      "Certificates, kits, and workshop goodies for all attendees. Participation and learning-focused with no cash prize.",
    prizes: [],
    stages: [
      {
        name: "Workshop Session",
        when: "26 Oct 2026, 9:00 AM – 2:00 PM",
        mode: "Offline",
        detail:
          "Hands-on VLSI design workshop in CR 204. Interactive lecture, EDA tool walkthrough, and simulation.",
      },
    ],
    highlights: [
      "Industry-standard EDA tool exploration.",
      "Comprehensive digital circuit synthesis concepts.",
      "Hands-on mentoring by experienced electronics engineers.",
    ],
    eligibility: [
      "Solo participation only.",
      "Open to all college students interested in electronics and semiconductor systems.",
    ],
    rules: [
      "Participants must carry their own laptops with required software installed prior to the session.",
      "Organizers' decisions and safety protocols are binding during all lab modules.",
    ],
    organizers: [
      { name: "IoTics Coordinator", phone: "+91 99601 22268", email: "iotics@iiitn.ac.in" },
    ],
    registrationOpens: "2026-10-10T12:00:00+05:30",
    registrationDeadline: "2026-10-25T23:59:00+05:30",
    registrationFee: "₹150 per person",
    entryFeeLabel: "₹150 per participant",
    feeMode: "per_participant",
    meals: "1 Snack",
    participationKit: true,
    teamSize: { min: 1, max: 1 },
    mode: "Offline",
    startDate: "2026-10-26T09:00:00+05:30",
    endDate: "2026-10-26T14:00:00+05:30",
    venue: "CR 204, Indian Institute of Information Technology, Nagpur",
  },
];

export function getEventDetail(slug: string): EventDetail | null {
  return eventDetails.find((event) => event.slug === slug) ?? null;
}

export function getAllEventDetailSlugs(): string[] {
  return eventDetails.map((event) => event.slug);
}
