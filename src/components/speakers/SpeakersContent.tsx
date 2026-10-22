"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Reveal } from "@/components/Reveal";

interface Speaker {
  id: string;
  number: string;
  firstName: string;
  lastName: string;
  role: string;
  company: string;
  companyTag?: string;
  portrait: string;
  cardImage: string;
  highlights: string[];
  audience: {
    platform: string;
    count: string;
  }[];
  socials: {
    type: "linkedin" | "instagram" | "youtube" | "website";
    url: string;
    label: string;
  }[];
  accentColor?: string;
}

const speakers: Speaker[] = [
  {
    id: "vanshika-pandey",
    number: "01",
    firstName: "Vanshika",
    lastName: "Pandey",
    role: "Senior Software Engineer & AI Developer Advocate",
    company: "National Award-Winning Creator",
    companyTag: "Creator & AI Advocate",
    portrait: "/speakers/vanshika-pandey.webp",
    cardImage: "/speakers/vanshika-pandey-card.webp",
    highlights: [
      "Senior Software Engineer & AI Developer Advocate",
      "National Award-Winning Tech Creator",
      "Top 25 Unstop Creator Awardee",
      "Keynote Speaker on Agentic AI & Modern Devtools",
    ],
    audience: [
      { platform: "Instagram", count: "289K+" },
      { platform: "LinkedIn", count: "150K+" },
    ],
    socials: [
      {
        type: "instagram",
        url: "https://www.instagram.com/codecrookshanks/",
        label: "@codecrookshanks",
      },
      {
        type: "linkedin",
        url: "https://www.linkedin.com/in/vanshikapandeyy",
        label: "LinkedIn Profile",
      },
    ],
  },
  {
    id: "santosh-kumar-mishra",
    number: "02",
    firstName: "Santosh K.",
    lastName: "Mishra",
    role: "Director of AI Innovation at Alta & Founder of InterviewCafe",
    company: "Alta School of Technology",
    companyTag: "Ex-Microsoft · VMware",
    portrait: "/speakers/santosh-mishra.webp",
    cardImage: "/speakers/santosh-mishra-card.webp",
    highlights: [
      "Director of AI Innovation at Alta School of Technology",
      "Founder of InterviewCafe Academy",
      "Ex-Microsoft & Ex-VMware Senior Engineer",
      "NIT Tiruchirappalli Alumnus & Tech Author",
    ],
    audience: [
      { platform: "LinkedIn", count: "300K+" },
    ],
    socials: [
      {
        type: "linkedin",
        url: "https://www.linkedin.com/in/iamsantoshmishra",
        label: "LinkedIn Profile",
      },
      {
        type: "website",
        url: "https://interviewcafe.io",
        label: "interviewcafe.io",
      },
    ],
  },
  {
    id: "chandan-jha",
    number: "03",
    firstName: "Dr. Chandan",
    lastName: "Jha",
    role: "Associate Vice President at GeeksforGeeks (GFG)",
    company: "GeeksforGeeks (GFG)",
    companyTag: "Ex-ISRO Scientist",
    portrait: "/speakers/chandan-jha.webp",
    cardImage: "/speakers/chandan-jha-card.webp",
    highlights: [
      "Associate Vice President at GeeksforGeeks (GFG)",
      "Ex-ISRO Scientist & Aerospace Researcher",
      "GATE All India Rank 23 & AIR 26",
      "Director – Exponential Learning (IIT-JEE)",
    ],
    audience: [
      { platform: "Community", count: "50K+" },
    ],
    socials: [
      {
        type: "linkedin",
        url: "https://www.linkedin.com/in/chandan-jha-56a22534",
        label: "LinkedIn Profile",
      },
    ],
  },
  {
    id: "ajay-suneja",
    number: "04",
    firstName: "Ajay",
    lastName: "Suneja",
    role: "Senior Software Engineer at Adidas & Tech Educator",
    company: "Adidas",
    companyTag: "Founder @CodeCompile",
    portrait: "/speakers/ajey-suneja.webp",
    cardImage: "/speakers/ajey-suneja-card.webp",
    highlights: [
      "Senior Software Engineer at Adidas",
      "Full Stack & AI Engineer",
      "Founder of CodeCompile (codecompile.ai)",
      "Host of Technical Suneja Tech Community",
    ],
    audience: [
      { platform: "YouTube", count: "600K+" },
      { platform: "LinkedIn", count: "250K+" },
      { platform: "Instagram", count: "200K+" },
    ],
    socials: [
      {
        type: "youtube",
        url: "https://www.youtube.com/@codecompile7",
        label: "@codecompile7",
      },
      {
        type: "linkedin",
        url: "https://www.linkedin.com/in/ajaysuneja",
        label: "LinkedIn Profile",
      },
      {
        type: "instagram",
        url: "https://www.instagram.com/sunejaajay",
        label: "@sunejaajay",
      },
    ],
  },
];

function SocialIcon({ type }: { type: Speaker["socials"][number]["type"] }) {
  if (type === "linkedin") {
    return (
      <svg
        className="size-4 shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    );
  }
  if (type === "instagram") {
    return (
      <svg
        className="size-4 shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }
  if (type === "youtube") {
    return (
      <svg
        className="size-4 shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  return (
    <svg
      className="size-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export function SpeakersContent() {
  const [isPosterOpen, setIsPosterOpen] = useState(false);

  useEffect(() => {
    if (!isPosterOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPosterOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPosterOpen]);

  return (
    <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* ── Top Hero / Header ── */}
      <div className="text-center">
        {/* Eyebrow tag */}
        <Reveal variant="scale" animateOnMount>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFFF1A]/40 bg-[#FFFF1A]/10 px-4 py-1.5 shadow-[0_0_20px_rgba(255,255,26,0.15)] backdrop-blur-md">
            <span className="size-2 animate-pulse rounded-full bg-[#FFFF1A]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFFF1A] sm:text-sm">
              Ideas · Industry · Insights
            </span>
          </div>
        </Reveal>

        {/* Main Title */}
        <Reveal variant="rise" delay={80} animateOnMount>
          <h1 className="mt-4 font-tantra text-5xl uppercase tracking-wider text-white sm:text-7xl md:text-8xl lg:text-9xl">
            PANEL <span className="text-[#FFFF1A]">GUESTS</span>
          </h1>
        </Reveal>

        {/* Subtitle */}
        <Reveal variant="rise" delay={140} animateOnMount>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-[#b4afc7] sm:text-base md:text-lg">
            Experience visionary keynotes and power-packed discussions with renowned tech leaders,
            award-winning creators, and industry pioneers at TantraFiesta 2026.
          </p>
        </Reveal>

        {/* ── Event Details Bar (from poster) ── */}
        <Reveal variant="scale" delay={200} animateOnMount>
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md sm:p-5 shadow-2xl">
            <div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {/* Date */}
              <div className="flex items-center justify-center gap-3 py-3 sm:py-0">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FFFF1A]/15 text-[#FFFF1A] border border-[#FFFF1A]/30">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#b4afc7]">
                    Date
                  </p>
                  <p className="font-bold text-white text-sm sm:text-base">
                    Sunday, 25 Oct
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center justify-center gap-3 py-3 sm:py-0">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FFFF1A]/15 text-[#FFFF1A] border border-[#FFFF1A]/30">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#b4afc7]">
                    Time
                  </p>
                  <p className="font-bold text-white text-sm sm:text-base">
                    06:00 - 07:45 PM
                  </p>
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-center justify-center gap-3 py-3 sm:py-0">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FFFF1A]/15 text-[#FFFF1A] border border-[#FFFF1A]/30">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#b4afc7]">
                    Venue
                  </p>
                  <p className="font-bold text-white text-sm sm:text-base">
                    Amphitheatre
                  </p>
                </div>
              </div>
            </div>

            {/* Poster CTA button */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsPosterOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#FFFF1A] border border-[#FFFF1A]/30 transition-all hover:bg-[#FFFF1A]/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                View Official Poster
              </button>

              <span className="text-xs text-[#b4afc7]">
                Free entry for all registered TantraFiesta attendees
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── Speakers Grid ── */}
      <section aria-label="Featured Speakers" className="mt-14 sm:mt-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:gap-8">
          {speakers.map((speaker, index) => (
            <Reveal
              key={speaker.id}
              variant={index % 2 === 0 ? "left" : "right"}
              delay={index * 120}
              className="h-full"
            >
              <article
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-[#241a4c]/90 to-[#160f38]/95 p-5 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-[#FFFF1A]/50 hover:shadow-[0_0_35px_rgba(255,255,26,0.18)]"
              >
                {/* Cyberpunk Top Accent Bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FFFF1A] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Top Row: Speaker Number & Audience Pill */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-tantra text-3xl sm:text-4xl tracking-tighter text-[#FFFF1A]/90">
                    {speaker.number}
                  </span>

                  {/* Company / Tag */}
                  <span className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90">
                    {speaker.companyTag || speaker.company}
                  </span>
                </div>

                {/* Main Card Content: Photo + Details */}
                <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                  {/* Portrait photo */}
                  <div className="relative size-44 sm:size-48 md:size-52 shrink-0 overflow-hidden rounded-2xl border-2 border-[#FFFF1A]/40 bg-[#FFFF1A]/10 shadow-[0_0_20px_rgba(255,255,26,0.12)]">
                    <Image
                      src={speaker.portrait}
                      alt={speaker.firstName + " " + speaker.lastName}
                      fill
                      sizes="(max-width: 640px) 176px, (max-width: 768px) 192px, 208px"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      priority={index < 2}
                    />
                    {/* Inner yellow glow overlay */}
                    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/20" />
                  </div>

                  {/* Info block */}
                  <div className="flex flex-1 flex-col text-center sm:text-left">
                    {/* Name */}
                    <h2 className="font-tantra text-2xl uppercase tracking-wide text-white sm:text-3xl">
                      {speaker.firstName}{" "}
                      <span className="text-[#FFFF1A]">{speaker.lastName}</span>
                    </h2>

                    {/* Role */}
                    <p className="mt-1 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#FFFF1A]/90">
                      {speaker.role}
                    </p>

                    {/* Key Highlights */}
                    <ul className="mt-3.5 space-y-1.5 text-xs text-[#d6d0e6]">
                      {speaker.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#FFFF1A] shrink-0 font-bold">▸</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Audience Counters */}
                    <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      {speaker.audience.map((aud, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#FFFF1A]/30 bg-[#FFFF1A]/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FFFF1A]"
                        >
                          <span className="size-1.5 rounded-full bg-[#FFFF1A]" />
                          {aud.count} {aud.platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer / Social Links */}
                <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {speaker.socials.map((soc, i) => (
                      <Link
                        key={i}
                        href={soc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white/90 transition-all hover:border-[#FFFF1A]/60 hover:bg-[#FFFF1A]/15 hover:text-[#FFFF1A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffe43b]"
                      >
                        <SocialIcon type={soc.type} />
                        <span>{soc.label}</span>
                      </Link>
                    ))}
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFFF1A]/70">
                    Panel Guest
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Official Panel Banner Section ── */}
      <Reveal variant="scale" delay={300} className="mt-16 sm:mt-24">
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-[#1c1340] via-[#2a1b5c] to-[#1c1340] p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center lg:text-left">
              <span className="rounded-full border border-[#FFFF1A]/40 bg-[#FFFF1A]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#FFFF1A]">
                Official Poster Release
              </span>
              <h2 className="mt-4 font-tantra text-3xl uppercase tracking-wider text-white sm:text-4xl md:text-5xl">
                The Mega Panel of TantraFiesta 2026
              </h2>
              <p className="mt-3 text-sm text-[#b4afc7] leading-relaxed">
                Connect with industry leaders, ask questions during the interactive Q&A session, and
                gain career-defining insights on AI innovation, competitive programming, and scaling
                global software platforms.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  type="button"
                  onClick={() => setIsPosterOpen(true)}
                  className="rounded-xl bg-[#FFFF1A] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#241a4c] transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,26,0.3)] cursor-pointer"
                >
                  View Full Poster
                </button>
                <Link
                  href="/register"
                  className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
                >
                  Register For Fest
                </Link>
              </div>
            </div>

            {/* Poster Thumbnail Preview */}
            <div
              onClick={() => setIsPosterOpen(true)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-[#FFFF1A]/30 shadow-2xl transition-all duration-300 hover:border-[#FFFF1A] hover:shadow-[0_0_35px_rgba(255,255,26,0.25)]"
            >
              <div className="relative h-72 w-52 sm:h-80 sm:w-60">
                <Image
                  src="/speakers/panel-poster.webp"
                  alt="TantraFiesta Panel Guests Poster"
                  fill
                  sizes="240px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="rounded-xl bg-[#FFFF1A] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#241a4c] shadow-lg">
                    Click to Zoom
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── Lightbox Modal for Poster ── */}
      <AnimatePresence>
        {isPosterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
            onClick={() => setIsPosterOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[92vh] max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-[#160f38] shadow-2xl"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setIsPosterOpen(false)}
                className="absolute right-3 top-3 z-20 flex size-9 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90 hover:text-[#FFFF1A] transition-colors cursor-pointer border border-white/20"
                aria-label="Close poster view"
              >
                ✕
              </button>

              {/* Poster Image */}
              <div className="relative max-h-[85vh] w-auto overflow-y-auto">
                <Image
                  src="/speakers/panel-poster.webp"
                  alt="Official TantraFiesta 2026 Panel Guests Poster"
                  width={768}
                  height={1024}
                  className="h-auto w-full object-contain"
                  priority
                />
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-between border-t border-white/10 bg-[#1a1240] px-5 py-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FFFF1A]">
                  TantraFiesta 2026 · Official Panel Poster
                </span>
                <a
                  href="/speakers/panel-poster.webp"
                  download="TantraFiesta-2026-Panel-Guests.webp"
                  className="rounded-lg bg-[#FFFF1A] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#241a4c] transition-transform hover:scale-105 active:scale-95"
                >
                  Download
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

