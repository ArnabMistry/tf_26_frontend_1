export interface FAQItem {
  id: string;
  category: "general" | "competitions" | "accommodation" | "travel" | "payments" | "prizes";
  question: string;
  answer: string;
}

export const FAQ_CATEGORIES = [
  { id: "all", label: "All Questions" },
  { id: "general", label: "General" },
  { id: "competitions", label: "Competitions & Hackathons" },
  { id: "accommodation", label: "Accommodation & Food" },
  { id: "travel", label: "Travel & Venue" },
  { id: "payments", label: "Registration & Payments" },
  { id: "prizes", label: "Prizes & Certificates" },
] as const;

export const FAQS_DATA: FAQItem[] = [
  // ── General ──
  {
    id: "what-is-tf",
    category: "general",
    question: "What is TantraFiesta 2026?",
    answer:
      "TantraFiesta is the annual national technical festival of the Indian Institute of Information Technology, Nagpur (IIIT Nagpur). Scheduled for 25–26 October 2026, it is Central India's premier tech fest featuring 25+ flagship competitions, 24-hour hackathons, robotics challenges, esports arenas, expert keynote speakers, and industry tech expos.",
  },
  {
    id: "who-can-participate",
    category: "general",
    question: "Who is eligible to participate in TantraFiesta?",
    answer:
      "Students currently enrolled in undergraduate (B.Tech, B.E., B.Sc, BCA, etc.) or postgraduate (M.Tech, MCA, M.Sc, etc.) degree programs at any recognized university or college across India are eligible to participate. A valid college ID card is mandatory for on-campus verification.",
  },
  {
    id: "campus-entry-free",
    category: "general",
    question: "Is entry to the IIIT Nagpur campus free during the fest?",
    answer:
      "General entry to explore campus open zones, public tech exhibitions, and sponsor stalls is open to all students with a valid college ID card. However, participation in competitive events, hackathons, workshops, and flagship challenges requires registration for that specific event.",
  },
  {
    id: "dates-schedule",
    category: "general",
    question: "What are the official dates for TantraFiesta 2026?",
    answer:
      "TantraFiesta 2026 takes place on 25 and 26 October 2026 at the permanent campus of IIIT Nagpur. Several competitions have online preliminary rounds scheduled between 10 October and 20 October 2026 prior to the offline finals.",
  },

  // ── Competitions & Hackathons ──
  {
    id: "register-events",
    category: "competitions",
    question: "How do I register for events and hackathons?",
    answer:
      "Browse our official catalog on the Events page (/events). Click 'More Info' on any competition card to view its rulebook, stages, and eligibility, then click 'Register Now'. For team competitions, the team leader registers the entire squad and supplies teammate details.",
  },
  {
    id: "cross-college-teams",
    category: "competitions",
    question: "Are cross-college or inter-branch teams allowed?",
    answer:
      "Yes! Unless explicitly forbidden in an individual event's rulebook, cross-college, cross-university, and inter-branch teams are enthusiastically permitted for hackathons (e.g. Design-A-Thon, Ragnarok) and technical contests.",
  },
  {
    id: "multiple-events",
    category: "competitions",
    question: "Can I participate in more than one competition?",
    answer:
      "Yes, you can register for multiple events as long as their offline on-campus timings do not clash. We recommend checking the 'Stages & Timeline' tab on each event's detail page to verify scheduled timings before registering.",
  },
  {
    id: "equipment-needed",
    category: "competitions",
    question: "What equipment should offline participants bring?",
    answer:
      "Participants attending on-campus rounds must bring their own laptops, chargers, extension cords (recommended), personal mobile hotspots (backup connectivity), valid government ID, and college student ID cards. Robotics and IoT participants should bring their hardware kits and spare components.",
  },

  // ── Accommodation & Food ──
  {
    id: "accommodation-available",
    category: "accommodation",
    question: "Is accommodation provided for outstation participants?",
    answer:
      "Yes, limited on-campus hostel accommodation is available on a first-come, first-served basis for outstation participants. Accommodation can be booked through the hospitality desk or by emailing tantrafiesta.hospitality@iiitn.ac.in.",
  },
  {
    id: "meals-included",
    category: "accommodation",
    question: "Are food and meals provided during the fest?",
    answer:
      "Registered participants in events with registration fees typically receive complimentary event perks such as meals and refreshments (e.g., '1 Meal + 2 Snacks' or '2 Meals + 2 Snacks' as specified on the event fee card). Additionally, multiple food courts, canteens, and food trucks operate throughout campus.",
  },

  // ── Travel & Venue ──
  {
    id: "how-to-reach",
    category: "travel",
    question: "Where is the venue and how do I reach the campus?",
    answer:
      "IIIT Nagpur is situated at Waranga, PO Dongargaon, Butibori, Nagpur (Maharashtra 441108). You can reach the campus via city bus from Sitabuldi or South Airport Metro Station, by local cab (Ola/Uber), or by auto-rickshaw. Check our detailed 'How to reach?' page (/contact) for exact bus timings and contact numbers for local auto drivers.",
  },
  {
    id: "safety-security",
    category: "travel",
    question: "What safety and security protocols are in place?",
    answer:
      "The campus is monitored 24/7 by security personnel and CCTV surveillance. Medical first-aid facilities, an on-duty campus ambulance, and active discipline committees are available round the clock throughout the festival.",
  },

  // ── Registration & Payments ──
  {
    id: "payment-methods",
    category: "payments",
    question: "What payment methods are supported for event fees?",
    answer:
      "We accept all major domestic Indian payment methods via our secured payment gateway (Razorpay), including UPI (Google Pay, PhonePe, Paytm), Net Banking from all scheduled banks, Debit Cards, and Credit Cards.",
  },
  {
    id: "payment-failure-deducted",
    category: "payments",
    question: "Money was debited from my account but registration shows pending?",
    answer:
      "Payment gateway reconciliation usually completes within 10–15 minutes. If your registration is not confirmed within 2 hours, email us at contact@tantrafiesta.in with your transaction screenshot, Razorpay payment ID, registered email, and event name. Duplicate debits are automatically refunded within 5–7 business days.",
  },
  {
    id: "free-vs-paid-events",
    category: "payments",
    question: "Are all events paid?",
    answer:
      "No. TantraFiesta offers both free and paid competitions. Some events (like Algorithmia) feature completely free online preliminary rounds, while other flagship hackathons with meals, goodies kits, and large cash prize pools charge a nominal entry fee.",
  },

  // ── Prizes & Certificates ──
  {
    id: "certificates-timeline",
    category: "prizes",
    question: "When and how do participants receive certificates?",
    answer:
      "Verified digital certificates of participation and merit certificates for winners are published directly on the TantraFiesta portal within 7 to 10 days following the festival. Participants can download cryptographically verified PDF certificates anytime.",
  },
  {
    id: "prize-disbursement",
    category: "prizes",
    question: "How and when are cash prizes disbursed to winners?",
    answer:
      "Cash prizes are disbursed directly via bank transfer (NEFT/RTGS/UPI) to the verified bank account of the winning team leader or individual winners within 14 to 21 business days after tax compliance and account verification.",
  },
  {
    id: "participation-kit",
    category: "prizes",
    question: "What does the official TantraFiesta Participation Kit include?",
    answer:
      "Eligible registered participants receive the official TantraFiesta 2026 kit upon campus check-in. The kit includes the official fest drawstring bag, personalized delegate ID badge, custom stickers, sponsor goodies, and event merchandise.",
  },
];
