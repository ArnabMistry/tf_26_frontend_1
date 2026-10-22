"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal } from "@/components/Reveal";
import {
  CORE_FACILITIES,
  ITINERARY_DAYS,
  type DaySchedule,
  type ItineraryEvent,
} from "@/data/itinerary";

export function ItineraryContent() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDays = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return ITINERARY_DAYS.map((day) => {
      // Filter events if search query is provided
      const matchingEvents = day.events.filter((event) => {
        if (!q) return true;
        return (
          event.title.toLowerCase().includes(q) ||
          event.description.toLowerCase().includes(q) ||
          event.location.toLowerCase().includes(q) ||
          event.timeWindow.toLowerCase().includes(q)
        );
      });

      return {
        ...day,
        events: matchingEvents,
      };
    }).filter((day) => {
      // Tab filter
      if (activeTab === "facilities") return false;
      if (activeTab !== "all" && day.id !== activeTab) return false;
      // Search filter: keep only days with matching events if searching
      if (searchQuery.trim() && day.events.length === 0) return false;
      return true;
    });
  }, [activeTab, searchQuery]);

  const filteredFacilities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return CORE_FACILITIES;
    return CORE_FACILITIES.filter(
      (f) =>
        f.unit.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const showFacilities =
    activeTab === "facilities" ||
    (activeTab === "all" && !searchQuery.trim()) ||
    (searchQuery.trim() && filteredFacilities.length > 0 && activeTab === "all");

  return (
    <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* ── Top Hero / Header ── */}
      <div className="text-center">
        {/* Eyebrow tag */}
        <Reveal variant="scale" animateOnMount>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFFF1A]/40 bg-[#FFFF1A]/10 px-4 py-1.5 shadow-[0_0_20px_rgba(255,255,26,0.15)] backdrop-blur-md">
            <span className="size-2 animate-pulse rounded-full bg-[#FFFF1A]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFFF1A] sm:text-sm">
              Master 4-Day Itinerary · TantraFiesta 2026
            </span>
          </div>
        </Reveal>

        {/* Main Title */}
        <Reveal variant="rise" delay={80} animateOnMount>
          <h1 className="mt-4 font-tantra text-5xl uppercase tracking-wider text-white sm:text-7xl md:text-8xl lg:text-9xl">
            FESTIVAL <span className="text-[#FFFF1A]">ITINERARY</span>
          </h1>
        </Reveal>

        {/* Subtitle */}
        <Reveal variant="rise" delay={140} animateOnMount>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-[#b4afc7] sm:text-base md:text-lg">
            Plan your schedule across 4 action-packed days of hackathons, robowars,
            esports, keynote conclaves, cultural shows, and ceremonies.
          </p>
        </Reveal>
      </div>

      {/* ── Core Facilities Quick Glance Bar (All Days) ── */}
      {showFacilities && (
        <Reveal variant="scale" delay={180} animateOnMount>
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#FFFF1A]/15 text-[#FFFF1A] border border-[#FFFF1A]/30">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    Core Operational & Facility Allocations
                  </h2>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#FFFF1A]">
                    Active All Days
                  </p>
                </div>
              </div>
              <span className="text-xs text-[#b4afc7] font-medium">
                Campus-wide Support & Accommodations
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {filteredFacilities.map((fac) => (
                <div
                  key={fac.unit}
                  className="group flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-200 hover:border-[#FFFF1A]/40 hover:bg-white/[0.06]"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-[#FFFF1A] transition-colors group-hover:border-[#FFFF1A]/40">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#b4afc7]">
                        Operational Unit
                      </p>
                      <p className="text-sm font-bold text-white leading-snug">
                        {fac.unit}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-[#b4afc7]">
                      Location
                    </span>
                    <span className="rounded-md bg-[#FFFF1A]/15 px-2.5 py-1 text-xs font-mono font-bold text-[#FFFF1A] border border-[#FFFF1A]/30">
                      {fac.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* ── Search & Tab Controls ── */}
      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto pb-2 scrollbar-none items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === "all"
                ? "bg-[#FFFF1A] text-[#241A4C] shadow-[0_0_15px_rgba(255,255,26,0.4)]"
                : "text-white/70 hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            All Days
          </button>
          {ITINERARY_DAYS.map((day) => {
            const isActive = activeTab === day.id;
            return (
              <button
                key={day.id}
                type="button"
                onClick={() => setActiveTab(day.id)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#FFFF1A] text-[#241A4C] shadow-[0_0_15px_rgba(255,255,26,0.4)]"
                    : "text-white/70 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {day.dayLabel} <span className="opacity-70 text-[11px]">({day.date.split(" ")[0]})</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setActiveTab("facilities")}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === "facilities"
                ? "bg-[#FFFF1A] text-[#241A4C] shadow-[0_0_15px_rgba(255,255,26,0.4)]"
                : "text-white/70 hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            Facilities
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, venues..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-9 text-sm text-white placeholder-white/40 backdrop-blur-md transition-colors focus:border-[#FFFF1A] focus:outline-none focus:ring-1 focus:ring-[#FFFF1A]"
          />
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-white/50 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Day-by-Day Event Timelines ── */}
      <div className="mt-8 space-y-10">
        {filteredDays.length === 0 && activeTab !== "facilities" && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
            <p className="text-lg font-bold text-white">No events found</p>
            <p className="mt-2 text-sm text-[#b4afc7]">
              No events matched &quot;{searchQuery}&quot;. Try checking the spelling or clearing filters.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-4 rounded-xl bg-[#FFFF1A]/10 border border-[#FFFF1A]/30 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#FFFF1A] hover:bg-[#FFFF1A]/20"
            >
              Clear Search
            </button>
          </div>
        )}

        {filteredDays.map((day) => (
          <div
            key={day.id}
            id={day.id}
            className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-7 backdrop-blur-md shadow-2xl"
          >
            {/* Day Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-[#FFFF1A] px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#241A4C]">
                    {day.dayLabel}
                  </span>
                  <span className="text-sm font-semibold text-[#FFFF1A]/90">
                    {day.date}
                  </span>
                </div>
                <h2 className="mt-2 text-xl sm:text-2xl font-black text-white tracking-wide">
                  {day.title}
                </h2>
              </div>
              <div className="shrink-0">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs font-bold text-[#b4afc7]">
                  {day.events.length} {day.events.length === 1 ? "Event" : "Events"}
                </span>
              </div>
            </div>

            {/* Events List */}
            <div className="mt-6 divide-y divide-white/5">
              {day.events.map((event, idx) => (
                <div
                  key={`${event.title}-${idx}`}
                  className="group flex flex-col gap-3 py-4 transition-all duration-200 hover:bg-white/[0.03] sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:px-4 sm:rounded-2xl"
                >
                  {/* Time Window */}
                  <div className="sm:w-64 shrink-0">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-[#FFFF1A]/25 bg-[#FFFF1A]/10 px-3 py-1.5 text-xs font-mono font-bold text-[#FFFF1A] shadow-sm">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="shrink-0"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span className="whitespace-normal leading-tight">{event.timeWindow}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1 space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#FFFF1A] transition-colors leading-snug">
                      {event.title}
                    </h3>
                    <p className="text-sm font-normal text-[#b4afc7] leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="sm:w-56 shrink-0 sm:text-right">
                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/90 group-hover:border-[#FFFF1A]/30">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="shrink-0 text-[#FFFF1A]"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="leading-snug">{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

