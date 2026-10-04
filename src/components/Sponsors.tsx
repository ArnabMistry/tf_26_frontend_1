import React from "react";
import Image from "next/image";

const SponsorCard = () => (
  <div className="relative aspect-[4/5] w-full">
    <svg 
      className="absolute inset-0 w-full h-full text-black" 
      viewBox="0 0 100 125" 
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    >
      <path d="
        M 4 4 
        L 96 4 
        L 96 90 
        Q 96 93 93 93 
        L 73 93 
        Q 70 93 67 96 
        L 57 119 
        Q 55 121 52 121 
        L 4 121 
        Z
      " />
    </svg>
  </div>
);

export function Sponsors() {
  return (
    <section className="relative w-full bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat pt-12 md:pt-20 flex flex-col items-center px-4 md:px-8">
      <div className="w-full max-w-[1600px] bg-[#FFFF1A] rounded-t-[32px] md:rounded-t-[48px] px-4 md:px-16 pt-16 md:pt-24 pb-8 relative shadow-2xl">
        
        {/* Hovercar Image Box */}
        <div className="absolute -top-12 md:-top-20 left-4 md:left-12 w-48 md:w-80 z-20">
          <Image
            src="/assets/hovercar.png"
            alt="Hovercar"
            width={320}
            height={240}
            className="w-full h-auto object-contain drop-shadow-xl"
          />
        </div>

        {/* Heading */}
        <h2 className="font-tantra text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-black uppercase tracking-tight mb-16 md:mb-24 text-center mt-8 md:mt-0 relative z-10">
          OUR SPONSORS
        </h2>

        {/* Grid */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
          
          {/* Column 1 */}
          <div className="flex flex-col gap-4 md:gap-6">
            <SponsorCard />
            <SponsorCard />
            <SponsorCard />
          </div>

          {/* Column 2 (Offset) */}
          <div className="flex flex-col gap-4 md:gap-6 mt-12 md:mt-24">
            <SponsorCard />
            <SponsorCard />
            <SponsorCard />
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-4 md:gap-6">
            <SponsorCard />
            <SponsorCard />
            <SponsorCard />
          </div>

          {/* Column 4 (Offset) */}
          <div className="flex flex-col gap-4 md:gap-6 mt-12 md:mt-24">
            <SponsorCard />
            <SponsorCard />
            <SponsorCard />
          </div>

        </div>
      </div>
    </section>
  );
}
