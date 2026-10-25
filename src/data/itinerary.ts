export interface FacilityAllocation {
  unit: string;
  location: string;
}

export interface ItineraryEvent {
  timeWindow: string;
  title: string;
  description: string;
  location: string;
}

export interface DaySchedule {
  id: string;
  dayLabel: string;
  date: string;
  title: string;
  events: ItineraryEvent[];
}

export const CORE_FACILITIES: FacilityAllocation[] = [
  {
    unit: "Logistics HQ & Operations",
    location: "CR-002 & CR-Exam",
  },
  {
    unit: "Hospitality Desk & Catering / Dining",
    location: "CR-303 & CR-304",
  },
  {
    unit: "Male Accommodations",
    location: "CR-001 & CR-102",
  },
  {
    unit: "Female Accommodation",
    location: "CR-101",
  },
];

export const ITINERARY_DAYS: DaySchedule[] = [
  {
    id: "day--1",
    dayLabel: "Day (-1)",
    date: "23rd October 2026",
    title: "Official Launch & Theme Reveal",
    events: [
      {
        timeWindow: "06:00 PM – 07:15 PM",
        title: "Crowd Onboarding & Pre-buzz",
        description:
          "Live music, student skits, vibrant decor, and TantraFiesta short movie screening.",
        location: "Acad Front Gate",
      },
      {
        timeWindow: "07:15 PM – 07:30 PM",
        title: "The Grand Reveal",
        description:
          "Dual banner drop from the Academic building — official Theme & Edition Reveal!",
        location: "Acad Front Gate",
      },
      {
        timeWindow: "07:30 PM – 09:30 PM",
        title: "Open Mic: TF's Got Latent 2026",
        description:
          "Open mic performances (comedy, music, beatboxing, poetry) + Food & Sponsor Stalls open.",
        location: "Amphitheatre",
      },
      {
        timeWindow: "09:30 PM – 10:30 PM",
        title: "Launch DJ Night",
        description: "High-energy opening dance session.",
        location: "Amphitheatre",
      },
      {
        timeWindow: "10:30 PM",
        title: "Day (-1) Wrap-up",
        description: "Day (-1) close; overnight preps begin.",
        location: "Campus-wide",
      },
    ],
  },
  {
    id: "day-0",
    dayLabel: "Day 0",
    date: "24th October 2026",
    title: "Inauguration & Overnight Kick-offs",
    events: [
      {
        timeWindow: "04:00 PM – 05:00 PM",
        title: "Official Opening Ceremony",
        description:
          "Inaugural address, lamp lighting, dignitaries & guest welcomes.",
        location: "Main Stage",
      },
      {
        timeWindow: "05:00 PM – 07:00 PM",
        title: "Chief Guest Keynote Session",
        description:
          "Opening address & interactions with festival chief guests and dignitaries.",
        location: "Main Stage",
      },
      {
        timeWindow: "06:00 PM – 09:00 PM",
        title: "BugWars",
        description: "DotSlash fast-paced code debugging showdown.",
        location: "Admin Hall 1",
      },
      {
        timeWindow: "06:00 PM – Ongoing (Until D1 10:00 AM)",
        title: "Strokes Designathon",
        description: "16-hour overnight UI/UX and product design sprint.",
        location: "CR-305 & CR-306",
      },
      {
        timeWindow: "06:00 PM – Ongoing (Until D1 06:00 PM)",
        title: "Brand-Xperience + Multimedia",
        description:
          "24-hour brand strategy, marketing, creative design, and multimedia challenge.",
        location: "CR-203 & Reading Room",
      },
      {
        timeWindow: "10:00 PM onwards",
        title: "Overnight Hackathons & Rest",
        description:
          "Food & refreshments in CR-303 & CR-304; Accommodations live in CR-001 & CR-102 (Male) and CR-101 (Female).",
        location: "Designated Rooms",
      },
    ],
  },
  {
    id: "day-1",
    dayLabel: "Day 1",
    date: "25th October 2026",
    title: "Flagship Hackathons, Robotics, Gaming & Arena Battles",
    events: [
      {
        timeWindow: "09:00 AM – Ongoing (Until D2 10:00 AM)",
        title: "RAGNAROK Hackathon",
        description: "CRISPR 24-hour flagship hackathon kicks off.",
        location: "Seminar Hall",
      },
      {
        timeWindow: "09:00 AM – Ongoing (Until D2 11:00 AM)",
        title: "The Game Jam™",
        description: "Dimensions 24-hour game development marathon.",
        location: "CR-201 & CR-202",
      },
      {
        timeWindow: "09:00 AM – 02:00 PM",
        title: "The Lost Pathways - Micromouse",
        description: "Autonomous maze-solving robot competition.",
        location: "Fountain Area / Acad Ground Floor",
      },
      {
        timeWindow: "09:00 AM – 04:00 PM",
        title: "Line-O-Mania",
        description: "High-precision autonomous line-follower bot races.",
        location: "Acad Ground Floor",
      },
      {
        timeWindow: "10:00 AM",
        title: "Designathon Ends",
        description: "Designathon hacking concludes; submission freeze.",
        location: "CR-305 & CR-306",
      },
      {
        timeWindow: "10:00 AM – 04:00 PM",
        title: "Algorithmia",
        description: "DotSlash algorithmic competitive programming battle.",
        location: "Admin Hall 1",
      },
      {
        timeWindow: "10:30 AM – 12:00 PM",
        title: "Designathon Evaluation",
        description: "Strokes Designathon jury review & presentations.",
        location: "Admin Hall 2",
      },
      {
        timeWindow: "11:00 AM – Ongoing (Until D2 03:00 PM)",
        title: "CASCADE Hackathon",
        description:
          "CRISPR x ELEVATE 24-hour massive multi-track hackathon starts.",
        location: "CR-301, 302, 306, 307",
      },
      {
        timeWindow: "12:00 PM – 04:00 PM",
        title: "Firestorm Rampage",
        description: "Synergy PC gaming tournament.",
        location: "Lab 1 & Lab 2",
      },
      {
        timeWindow: "12:00 PM – 04:00 PM",
        title: "Combat Carnage",
        description: "Synergy battle royale / shooter showdown.",
        location: "Lab 7 & Lab 8",
      },
      {
        timeWindow: "12:00 PM – 06:00 PM",
        title: "Pitch, Please!",
        description: "Dimensions startup & product pitching competition.",
        location: "CR-204",
      },
      {
        timeWindow: "01:00 PM – 04:00 PM",
        title: "RC 24",
        description: "Real Cricket 24 esports knockout round 1.",
        location: "Lab 5",
      },
      {
        timeWindow: "01:00 PM – 05:00 PM",
        title: "Phoenix Cup - Prelims",
        description: "Synergy competitive gaming tournament.",
        location: "Lab 3",
      },
      {
        timeWindow: "04:00 PM – 06:00 PM",
        title: "Rann Bhoomi 2.0 (Robowars) – Slot 1",
        description: "Metal-clashing heavy bot warfare prelims.",
        location: "Acad Parking Arena",
      },
      {
        timeWindow: "06:00 PM",
        title: "Brand-Xperience Concludes",
        description:
          "24-hour branding marathon ends; final evaluations.",
        location: "CR-203; Multimedia continues in Reading Room",
      },
      {
        timeWindow: "06:00 PM – 08:00 PM",
        title: "Panel Session",
        description: "Tech leaders, founders, and keynote panel discussion.",
        location: "Amphitheatre",
      },
      {
        timeWindow: "08:00 PM – 11:00 PM",
        title: "Rann Bhoomi 2.0 (Robowars) – Slot 2",
        description: "Night arena matches under floodlights.",
        location: "Acad Parking Arena",
      },
      {
        timeWindow: "08:00 PM – 02:00 AM",
        title: "Cultural Performances",
        description:
          "Pro-shows, band acts, and evening cultural performances.",
        location: "Amphitheatre",
      },
      {
        timeWindow: "02:00 AM – 03:00 AM",
        title: "Zero Hour",
        description:
          "Late-night student interaction, music, and social hangout.",
        location: "Amphitheatre",
      },
    ],
  },
  {
    id: "day-2",
    dayLabel: "Day 2",
    date: "26th October 2026",
    title: "Grand Finals, Conclaves & Valedictory",
    events: [
      {
        timeWindow: "09:00 AM – 02:00 PM",
        title: "VLSI Workshop",
        description: "Advanced chip design & hardware systems workshop.",
        location: "CR-204",
      },
      {
        timeWindow: "09:00 AM – 08:00 PM",
        title: "Keep Alive '26",
        description: "GDG Nagpur & CNCF Noida dev/cloud conference.",
        location: "CR-203",
      },
      {
        timeWindow: "10:00 AM",
        title: "RAGNAROK Ends",
        description: "Hacking phase freeze.",
        location: "Seminar Hall",
      },
      {
        timeWindow: "10:00 AM – 02:00 PM",
        title: "RAGNAROK Evaluations",
        description: "CRISPR project evaluations and judging rounds.",
        location: "CR-305",
      },
      {
        timeWindow: "10:00 AM – 02:00 PM",
        title: "Knights Legacy",
        description: "Chess & strategic intellect championship.",
        location: "Lab 4",
      },
      {
        timeWindow: "11:00 AM",
        title: "The Game Jam™ Ends",
        description: "Game dev marathon ends.",
        location: "CR-201 & CR-202",
      },
      {
        timeWindow: "11:00 AM – 12:00 PM",
        title: "Yuvaan: Youth Conclave – Opening",
        description: "The Orator Club x Probe flagship conclave opening.",
        location: "Admin Hall 2",
      },
      {
        timeWindow: "11:00 AM – 03:00 PM",
        title: "CASCADE Hackathon Evaluation",
        description: "Final round evaluations and top demo shortlists.",
        location: "CR-301, 302, 306, 307",
      },
      {
        timeWindow: "12:00 PM – 06:00 PM",
        title: "Yuvaan: Conclave Committee Sessions",
        description: "Debates, policy deliberations, and committee rounds.",
        location: "CR-201 & CR-202",
      },
      {
        timeWindow: "12:00 PM – 06:00 PM",
        title: "FlashCode",
        description:
          "Rapid-fire competitive speed coding showdown (relocated to Admin Hall 1).",
        location: "Admin Hall 1",
      },
      {
        timeWindow: "01:00 PM – 04:00 PM",
        title: "Critical Ops",
        description: "Tactical multiplayer matches.",
        location: "Lab 3",
      },
      {
        timeWindow: "01:00 PM – 04:00 PM",
        title: "RC 24 - Finals",
        description: "Real Cricket 24 championship match.",
        location: "Lab 5",
      },
      {
        timeWindow: "01:00 PM – 05:00 PM",
        title: "Crown Clash",
        description: "Clash Royale / strategy knockout rounds.",
        location: "Lab 6",
      },
      {
        timeWindow: "01:00 PM – 06:00 PM",
        title: "Last Man Standing - LMS",
        description:
          "Elevate endurance multi-round elimination challenge (relocated to Seminar Hall).",
        location: "Seminar Hall",
      },
      {
        timeWindow: "01:00 PM – 06:00 PM",
        title: "Rann Bhoomi 2.0 (Robowars) – Grand Finals",
        description: "Semifinals and championship heavyweight clashes.",
        location: "Acad Parking Arena",
      },
      {
        timeWindow: "06:00 PM – 07:00 PM",
        title: "Yuvaan Conclave Felicitation",
        description: "Valedictory ceremony & awards for Youth Conclave.",
        location: "Admin Hall 2 / Amphitheatre",
      },
      {
        timeWindow: "06:00 PM – 07:30 PM",
        title: "Chief Guest Keynote Session",
        description: "Inspiring valedictory address by festival dignitaries.",
        location: "Main Stage",
      },
      {
        timeWindow: "07:30 PM – 09:00 PM",
        title: "Grand Closing Ceremony & Prize Distribution",
        description:
          "Awarding winners across all hackathons, robowars, and competitions.",
        location: "Main Stage",
      },
      {
        timeWindow: "09:00 PM – 11:00 PM",
        title: "DJ Night - Grand Finale",
        description: "Official festival blowout closing dance celebration.",
        location: "Main Stage / Arena",
      },
    ],
  },
];

