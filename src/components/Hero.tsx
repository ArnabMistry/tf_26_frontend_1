import React from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { CrimeSceneTape } from "@/components/CrimeSceneTape";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat flex flex-col">
      <Navbar />

      {/* Main Hero Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center w-full py-10 overflow-hidden">
        
        {/* Hero Text with Tape Crossing Directly Over the Heading */}
        <div className="relative z-20 flex flex-col items-center justify-center pointer-events-none drop-shadow-2xl px-4 w-full">
          <Image
            src="/assets/tf_hero.png"
            alt="Tantra Fiesta"
            width={800}
            height={400}
            className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl h-auto object-contain"
            priority
          />

          {/* Crime Scene Tape crossing just slightly on top of the Tantra Fiesta heading */}
          <CrimeSceneTape
            text="DO NOT ENTER"
            angle={-2.5}
            speed="45s"
            zIndex={35}
            className="-top-1 sm:top-0 md:top-2 lg:top-3"
          />
        </div>

        {/* Main Center Tape (Unified CrimeSceneTape with identical font size) */}
        <CrimeSceneTape
          position="relative"
          text="CONFIDENTIAL"
          angle={2}
          speed="35s"
          className="my-12 md:my-16"
        />

        {/* Location & Coming Soon (Date completely hidden) */}
        <div
          className="z-20 flex flex-col items-center justify-center text-center drop-shadow-md pb-16 md:pb-24 select-none"
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
        angle={1.5}
        direction="reverse"
        speed="40s"
        className="bottom-6 sm:bottom-8 md:bottom-14 lg:bottom-16"
      />
    </section>
  );
}
