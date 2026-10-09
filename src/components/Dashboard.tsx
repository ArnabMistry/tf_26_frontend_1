"use client";

import { useState } from "react";
import {
  dashboardUser,
  dashboardStats,
  registeredEvents,
  qualificationRounds,
  teamSummary,
  teamInvitations,
  mealPasses,
} from "@/lib/dashboard";

const TABS = [
  { id: "activities", label: "Activities & Qualifications" },
  { id: "events", label: "Registered Events" },
  { id: "team", label: "My Teams & Squad" },
  { id: "invitations", label: "Team Invitations" },
  { id: "meals", label: "Meal Passes" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("team");

  return (
    <div className="w-full max-w-[1100px] mx-auto">
      {/* Identity bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 bg-[#FFFF1A] rounded-2xl px-5 sm:px-7 py-5 sm:py-6 shadow-xl">
        <div className="flex size-14 sm:size-16 shrink-0 items-center justify-center rounded-xl bg-[#E7137D] text-white font-tantra text-xl sm:text-2xl tracking-wide">
          {dashboardUser.initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 className="font-tantra text-lg sm:text-xl text-black tracking-wide uppercase truncate">
              {dashboardUser.name}
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-black/10 px-2.5 py-0.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-black/70">
              <span className="size-1.5 rounded-full bg-[#107548]" aria-hidden="true" />
              {dashboardUser.role}
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm font-semibold text-black/70 truncate">
            {dashboardUser.email}
          </p>
        </div>

        <div className="shrink-0 sm:text-right">
          <span className="font-tantra text-lg sm:text-2xl text-[#E7137D] tracking-wider">
            {dashboardUser.ticketId}
          </span>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="mt-5 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {dashboardStats.map((stat) => (
          <div
            key={stat.id}
            className="flex items-center gap-3 rounded-xl bg-[#D45631] px-4 py-3.5 sm:py-4 shadow-lg"
          >
            <span className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-lg bg-white font-tantra text-base sm:text-lg text-[#D45631]">
              {stat.value}
            </span>
            <span className="text-[10.5px] sm:text-xs font-extrabold uppercase leading-tight tracking-wide text-white">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Tab pills */}
      <div className="mt-6 sm:mt-7 flex flex-wrap gap-2 sm:gap-3">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={isActive}
              className={`rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-[10.5px] sm:text-xs font-extrabold uppercase tracking-wide transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffe43b] ${
                isActive
                  ? "bg-[#E7137D] text-white shadow-lg shadow-[#E7137D]/30"
                  : "bg-[#393163] text-[#cdc6e6] hover:bg-[#45396e] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="mt-5 sm:mt-6">
        {activeTab === "activities" && <ActivitiesPanel />}
        {activeTab === "events" && <EventsPanel />}
        {activeTab === "team" && <TeamPanel />}
        {activeTab === "invitations" && <InvitationsPanel />}
        {activeTab === "meals" && <MealPassesPanel />}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-white/15 px-6 py-10 text-center text-sm font-semibold text-[#A49FBD]">
      {message}
    </div>
  );
}

function EventsPanel() {
  if (registeredEvents.length === 0) {
    return <EmptyState message="You haven't registered for any events yet." />;
  }
  return (
    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
      {registeredEvents.map((event) => (
        <div
          key={event.id}
          className="rounded-xl border-2 border-[#393163] bg-[#2b1f5e]/60 px-5 py-4"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-tantra text-base sm:text-lg text-white tracking-wide uppercase">
              {event.name}
            </h3>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                event.status === "confirmed"
                  ? "bg-[#107548]/20 text-[#3ddc8c]"
                  : "bg-[#D45631]/20 text-[#f0a58c]"
              }`}
            >
              {event.status}
            </span>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm font-semibold text-[#A49FBD]">
            {event.club} · {event.date}
          </p>
        </div>
      ))}
    </div>
  );
}

function ActivitiesPanel() {
  if (qualificationRounds.length === 0) {
    return <EmptyState message="No activity yet. Qualifications will show up here." />;
  }
  return (
    <div className="flex flex-col gap-3">
      {qualificationRounds.map((round) => (
        <div
          key={round.id}
          className="flex items-center justify-between gap-3 rounded-xl border-2 border-[#393163] bg-[#2b1f5e]/60 px-5 py-4"
        >
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-extrabold text-white truncate">{round.event}</h3>
            <p className="mt-0.5 text-xs sm:text-sm font-semibold text-[#A49FBD]">{round.round}</p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
              round.result === "qualified"
                ? "bg-[#107548]/20 text-[#3ddc8c]"
                : "bg-[#564BE3]/20 text-[#b4adf5]"
            }`}
          >
            {round.result === "qualified" ? "Qualified" : "In Progress"}
          </span>
        </div>
      ))}
    </div>
  );
}

function TeamPanel() {
  return (
    <div className="relative rounded-2xl border-2 border-[#FFFF1A] bg-[#2b1f5e]/60 px-5 sm:px-7 py-5 sm:py-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-tantra text-xl sm:text-2xl text-white tracking-wide uppercase">
            {teamSummary.name}
          </h3>
          <p className="mt-2 text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#A49FBD]">
            Code: <span className="text-white">{teamSummary.code}</span>
            <span className="mx-2 text-[#A49FBD]/40">|</span>
            Leader: <span className="text-white">{teamSummary.leader}</span>
            <span className="mx-2 text-[#A49FBD]/40">|</span>
            Roster: <span className="text-white">{teamSummary.rosterFilled}/{teamSummary.rosterTotal} members</span>
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[#E7137D] px-4 py-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-white">
          {teamSummary.status === "registered" ? "Registered" : "Incomplete"}
        </span>
      </div>

      <p className="mt-4 text-xs sm:text-sm font-semibold text-[#cdc6e6]">
        {teamSummary.note}
      </p>
    </div>
  );
}

function InvitationsPanel() {
  if (teamInvitations.length === 0) {
    return <EmptyState message="No pending team invitations." />;
  }
  return (
    <div className="flex flex-col gap-3">
      {teamInvitations.map((invite) => (
        <div
          key={invite.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-[#393163] bg-[#2b1f5e]/60 px-5 py-4"
        >
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">{invite.teamName}</h3>
            <p className="mt-0.5 text-xs sm:text-sm font-semibold text-[#A49FBD]">
              {invite.event} · invited by {invite.invitedBy}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-full bg-[#107548] px-4 py-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-[#0c5c38] cursor-pointer"
            >
              Accept
            </button>
            <button
              type="button"
              className="rounded-full bg-[#393163] px-4 py-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#cdc6e6] transition-colors hover:bg-[#45396e] cursor-pointer"
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function MealPassesPanel() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {mealPasses.map((pass) => (
        <div
          key={pass.id}
          className={`rounded-xl border-2 px-4 py-4 text-center ${
            pass.redeemed
              ? "border-[#107548] bg-[#107548]/10"
              : "border-[#393163] bg-[#2b1f5e]/60"
          }`}
        >
          <p className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#A49FBD]">
            {pass.day}
          </p>
          <p className="mt-1 font-tantra text-sm sm:text-base text-white uppercase tracking-wide">
            {pass.meal}
          </p>
          <span
            className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider ${
              pass.redeemed ? "bg-[#107548]/20 text-[#3ddc8c]" : "bg-white/10 text-[#A49FBD]"
            }`}
          >
            {pass.redeemed ? "Redeemed" : "Available"}
          </span>
        </div>
      ))}
    </div>
  );
}
