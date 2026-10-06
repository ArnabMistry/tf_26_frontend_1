import React from "react";
import { CrimeSceneTape } from "@/components/CrimeSceneTape";

export function PhotoGallery() {
  return (
    <section className="relative w-full bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat py-20 md:py-28 px-4 flex flex-col items-center justify-center overflow-hidden">
      {/* Crime Scene Tape cutting across the gallery */}
      <CrimeSceneTape
        text="DO NOT ENTER"
        angle={-2.5}
        speed="38s"
        fontSize="text-sm md:text-xl"
        className="top-1/2 -translate-y-1/2"
      />

      <div className="relative z-10 select-none">
        <h2 className="font-tantra text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white uppercase tracking-tight text-center drop-shadow-lg">
          PHOTO GALLERY
        </h2>
      </div>
    </section>
  );
}
