import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat flex flex-col">
      {/* Navigation */}
      <nav className="relative z-30 flex w-full items-center justify-between px-6 py-4 lg:px-12 bg-transparent">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/assets/tf_logo.png" alt="TantraFiesta Logo" width={40} height={40} className="h-10 w-10 object-contain" />
          <Image src="/assets/tf_nav.png" alt="Nav Logo" width={200} height={40} className="h-6 md:h-7 w-auto object-contain hidden sm:block" />
        </Link>
        <div className="hidden items-center gap-6 text-sm md:flex font-bold uppercase tracking-wider text-white">
          <Link href="/about" className="hover:text-[#FFFF1A] transition-colors">About</Link>
          <Link href="/sponsors" className="hover:text-[#FFFF1A] transition-colors">Sponsors</Link>
          <Link href="/events" className="hover:text-[#FFFF1A] transition-colors">Events</Link>
          <Link href="/speakers" className="hover:text-[#FFFF1A] transition-colors">Speakers</Link>
          <Link href="/register" className="bg-[#E7137D] text-white px-5 py-2 hover:bg-[#c60f69] transition-colors">Register Now</Link>
        </div>
      </nav>

      {/* Main Hero Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center w-full py-10 overflow-hidden">
        
        {/* Hero Text */}
        <div className="relative z-20 flex flex-col items-center justify-center pointer-events-none drop-shadow-2xl px-4 w-full">
          <Image src="/assets/tf_hero.png" alt="Tantra Fiesta" width={800} height={400} className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl h-auto object-contain" />
          <p className="mt-6 md:mt-8 text-white text-xl md:text-3xl lg:text-4xl tracking-widest font-regular drop-shadow-lg text-center uppercase">
            ANANTA: SURPASSING THE POSSIBLE
          </p>
        </div>

        {/* Yellow Tape */}
        <div className="relative w-[120vw] left-1/2 -translate-x-1/2 rotate-[2deg] bg-[#F2A900] py-1.5 md:py-2.5 z-10 shadow-lg border-y-[3px] border-black my-12 md:my-16">
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
          <div className="text-5xl md:text-8xl lg:text-[128px] font-bold italic leading-none uppercase tracking-tight">
            <span className="text-[#E7137D]">23-24 </span>
            <span className="text-white">OCTOBER 2026</span>
          </div>
          <div className="text-5xl md:text-8xl lg:text-[128px] font-bold italic leading-none uppercase tracking-tight text-[#E7137D] mt-2 md:mt-4">
            IIIT NAGPUR
          </div>
        </div>
      </div>
    </section>
  );
}
