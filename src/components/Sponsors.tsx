import React from "react";

const SponsorCard = () => (
  <div className="relative aspect-[4/5] w-full">
    <svg 
      className="absolute inset-0 w-full h-full text-[#FDF8E4]" 
      viewBox="0 0 100 125" 
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    >
      {/* 
        Path tracing the folder shape:
        Start top-left (2,2)
        Go to top-right (98,2)
        Go down right edge to (98, 95)
        Go left horizontally to (75, 95)
        Slope down to bottom edge (60, 123)
        Go left to bottom-left (2, 123)
        Close back to top-left
      */}
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
    <section className="relative w-full bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat py-20 px-6 md:px-12 overflow-hidden flex flex-col items-center">
      
      {/* Heading */}
      <h2 className="font-tantra text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#FDF8E4] uppercase tracking-tight mb-16 md:mb-24 text-center">
        OUR SPONSORS
      </h2>

      {/* Grid */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        
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

    </section>
  );
}
