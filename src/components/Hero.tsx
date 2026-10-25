import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { MerchBanner } from "@/components/MerchBanner";
import { ThemeTeaser } from "./ThemeTeaser";

export function Hero() {
  return (
    <>
      <section className="relative min-h-[100svh] w-full overflow-hidden flex flex-col">
        <Navbar />
        <MerchBanner />

        {/* Main Hero Content */}
        <div className="relative flex-1 flex flex-col items-center justify-center w-full py-8 md:py-10 overflow-hidden">
          {/* Visually hidden h1 for screen readers and SEO — the visual title is the tf_hero.png image */}
          <h1 className="sr-only">TantraFiesta 2026 — Annual National Technical Festival, IIIT Nagpur</h1>

          {/* Hero Text */}
          <div className="relative z-20 flex flex-col items-center justify-center pointer-events-none drop-shadow-2xl px-4 w-full">
            <Image src="/assets/tf_hero.webp" alt="Tantra Fiesta" width={800} height={400} preload fetchPriority="high" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 672px, 768px" className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl h-auto object-contain" />
            <p className="mt-6 md:mt-8 text-white text-xl md:text-3xl lg:text-4xl tracking-widest font-regular drop-shadow-lg text-center uppercase">
              {/* THEME REVEAL: Replace this silhouette with the official theme copy. */}
              <ThemeTeaser />
            </p>
          </div>
        </div>
      </section>

      <div className="relative w-full flex flex-col items-center overflow-x-clip">
        {/* Yellow Tape */}
        <div className="relative w-[120vw] left-1/2 -translate-x-1/2 -translate-y-[clamp(5rem,17svh,7.5rem)] rotate-[2deg] bg-[#F2A900] py-1.5 md:py-2.5 z-10 shadow-lg border-y-[3px] border-black my-12 md:my-16">
          <div className="flex w-full whitespace-nowrap overflow-hidden">
            <div className="animate-marquee flex gap-10 md:gap-16 text-black font-tantra text-2xl md:text-4xl uppercase tracking-tighter shrink-0">
              {Array.from({ length: 30 }).map((_, i) => (
                <span key={i}>WHAT THE TF?</span>
              ))}
            </div>
          </div>
        </div>

        {/* Date and Location */}
        <div className="z-20 flex flex-col items-center justify-center text-center drop-shadow-md pb-10" style={{ fontFamily: '"Futura PT", sans-serif' }}>
          <div className="text-5xl md:text-8xl lg:text-[128px] font-bold leading-none uppercase tracking-tight">
            <span className="text-[#E7137D] not-italic">25-26 </span>
            <span className="text-white italic">OCTOBER</span>
          </div>
          <div className="text-5xl md:text-8xl lg:text-[128px] font-bold italic leading-none uppercase tracking-tight text-[#E7137D] mt-2 md:mt-4">
            IIIT NAGPUR
          </div>

          {/* View Itinerary CTA */}
          <Link
            href="/itinerary"
            className="group mt-8 md:mt-10 inline-flex items-center gap-3 rounded-full border-2 border-[#FFFF1A] bg-[#FFFF1A]/10 px-7 py-3.5 text-base md:text-lg font-bold uppercase tracking-wider text-[#FFFF1A] backdrop-blur-md shadow-[0_0_25px_rgba(255,255,26,0.2)] transition-all duration-300 hover:bg-[#FFFF1A] hover:text-[#241A4C] hover:shadow-[0_0_40px_rgba(255,255,26,0.5)] hover:scale-105"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 transition-transform duration-300 group-hover:scale-110"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            View Itinerary
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}
