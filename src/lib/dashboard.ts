export interface DashboardUser {
  name: string;
  role: string;
  email: string;
  ticketId: string;
  initials: string;
}

export interface DashboardStat {
  id: string;
  label: string;
  value: number;
}

export interface RegisteredEvent {
  id: string;
  name: string;
  club: string;
  date: string;
  status: "confirmed" | "pending";
}

export interface QualificationRound {
  id: string;
  event: string;
  round: string;
  result: "qualified" | "in-progress";
}

export interface TeamSummary {
  name: string;
  code: string;
  leader: string;
  rosterFilled: number;
  rosterTotal: number;
  status: "registered" | "incomplete";
  note: string;
}

export interface TeamInvitation {
  id: string;
  teamName: string;
  event: string;
  invitedBy: string;
}

export interface MealPass {
  id: string;
  day: string;
  meal: string;
  redeemed: boolean;
}

export const dashboardUser: DashboardUser = {
  name: "Shrenik Gedam",
  role: "Participant",
  email: "shrenik@gmail.com",
  ticketId: "#TF123456",
  initials: "SG",
};

export const dashboardStats: DashboardStat[] = [
  { id: "events", label: "Events Registered", value: 2 },
  { id: "rounds", label: "Rounds Qualified", value: 1 },
  { id: "team", label: "Team & Squad", value: 1 },
  { id: "invitations", label: "Team Invitation", value: 1 },
];

export const registeredEvents: RegisteredEvent[] = [
  { id: "ragnarok", name: "Ragnarok", club: "DotSlash", date: "14 Feb 2026", status: "confirmed" },
  { id: "algorithmia", name: "Algorithmia", club: "DotSlash", date: "15 Feb 2026", status: "confirmed" },
];

export const qualificationRounds: QualificationRound[] = [
  { id: "algorithmia-r1", event: "Algorithmia", round: "Round 1 — Prelims", result: "qualified" },
  { id: "ragnarok-r1", event: "Ragnarok", round: "Round 1 — Ideation", result: "in-progress" },
];

export const teamSummary: TeamSummary = {
  name: "Team Genesis",
  code: "123456",
  leader: "Shrenik",
  rosterFilled: 1,
  rosterTotal: 4,
  status: "registered",
  note: "Team Registration is finalized for the event.",
};

export const teamInvitations: TeamInvitation[] = [
  { id: "inv-1", teamName: "Team Cascade", event: "Ragnarok", invitedBy: "Aarav Sharma" },
];

export const mealPasses: MealPass[] = [
  { id: "day1-lunch", day: "Day 1", meal: "Lunch", redeemed: true },
  { id: "day1-dinner", day: "Day 1", meal: "Dinner", redeemed: false },
  { id: "day2-lunch", day: "Day 2", meal: "Lunch", redeemed: false },
  { id: "day2-dinner", day: "Day 2", meal: "Dinner", redeemed: false },
];
