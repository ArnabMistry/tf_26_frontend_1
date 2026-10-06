import React from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { CrimeSceneTape } from "@/components/CrimeSceneTape";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat flex flex-col">
      {/* Background Crime Scene Tape running diagonally near top */}
      <CrimeSceneTape
        text="DO NOT ENTER"
        angle={-2.5}
        speed="45s"
        fontSize="text-xs md:text-sm"
        className="top-16 opacity-80"
      />

      <Navbar />

      {/* Main Hero Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center w-full py-10 overflow-hidden">
        
        {/* Hero Text */}
        <div className="relative z-20 flex flex-col items-center justify-center pointer-events-none drop-shadow-2xl px-4 w-full">
          <Image
            src="/assets/tf_hero.png"
            alt="Tantra Fiesta"
            width={800}
            height={400}
            className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl h-auto object-contain"
            priority
          />
        </div>

        {/* Confidential Yellow Tape (Replaces WHAT THE TF?) */}
        <div className="relative w-[125vw] left-1/2 -translate-x-1/2 rotate-[2deg] bg-[#FFE500] py-2 md:py-3 z-20 shadow-2xl border-y-[3px] border-black my-12 md:my-16 pointer-events-none select-none">
          <div className="flex w-full whitespace-nowrap overflow-hidden">
            <div className="animate-marquee flex gap-10 md:gap-16 text-black font-tantra text-2xl md:text-4xl uppercase tracking-tighter shrink-0">
              {Array.from({ length: 30 }).map((_, i) => (
                <span key={i} className="flex items-center gap-6">
                  <span>CONFIDENTIAL</span>
                  <span className="text-xl md:text-2xl font-mono opacity-80">///</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Location & Coming Soon (Date completely hidden) */}
        <div
          className="z-20 flex flex-col items-center justify-center text-center drop-shadow-md pb-10 select-none"
          style={{ fontFamily: '"Futura PT", sans-serif' }}
        >
          <div className="text-4xl md:text-7xl lg:text-[96px] font-bold italic leading-none uppercase tracking-tight text-white/95">
            COMING SOON
          </div>
          <div className="text-5xl md:text-8xl lg:text-[128px] font-bold italic leading-none uppercase tracking-tight text-[#E7137D] mt-2 md:mt-4">
            IIIT NAGPUR
          </div>
        </div>
      </div>

      {/* Crime Scene Tape crossing at bottom of hero */}
      <CrimeSceneTape
        text="AUTHORIZED PERSONNEL ONLY"
        angle={2}
        direction="reverse"
        speed="40s"
        fontSize="text-xs md:text-sm"
        className="-bottom-1"
      />
    </section>
  );
}
