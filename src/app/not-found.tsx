import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: "404 — Page Not Found",
  description: "This page doesn't exist. Head back to TantraFiesta 2026.",
};

export default function NotFound() {
  return (
    <main
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat px-4 py-16"
      aria-labelledby="not-found-heading"
    >
      {/* ── Glowing yellow ring behind the 404 ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,26,0.12) 0%, rgba(255,255,26,0.04) 50%, transparent 75%)",
        }}
      />

      {/* ── Logo ── */}
      <Link
        href="/"
        aria-label="Go to TantraFiesta home"
        className="mb-10 flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#ffe43b]"
      >
        <Image
          src="/assets/tf_logo.png"
          alt=""
          width={52}
          height={52}
          className="h-12 w-12 object-contain"
        />
        <Image
          src="/assets/tf_nav.png"
          alt="TantraFiesta"
          width={320}
          height={40}
          className="h-7 w-auto object-contain hidden sm:block"
        />
      </Link>

      {/* ── Yellow tape strip ── */}
      <div className="relative w-screen overflow-hidden rotate-[-2deg] bg-[#FFFF1A] border-y-[3px] border-black py-2 mb-10 shadow-lg">
        <div className="flex w-max animate-marquee gap-12 text-black font-tantra text-2xl md:text-3xl uppercase tracking-tighter">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i}>PAGE NOT FOUND</span>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Giant 404 */}
        <p
          className="font-tantra leading-none select-none"
          aria-hidden="true"
          style={{
            fontSize: "clamp(7rem, 22vw, 18rem)",
            color: "transparent",
            WebkitTextStroke: "2px #FFFF1A",
            textShadow: "0 0 60px rgba(255,255,26,0.25)",
          }}
        >
          404
        </p>

        <h1
          id="not-found-heading"
          className="font-tantra text-2xl sm:text-4xl md:text-5xl text-white uppercase tracking-widest -mt-4 mb-4 drop-shadow-lg"
        >
          LOST IN SPACE
        </h1>

        <p className="text-gray-300 text-sm sm:text-base max-w-sm mb-10 leading-relaxed">
          Looks like this page glitched out of existence.
          <br className="hidden sm:block" />
          Don&apos;t worry — the fest is still on.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="bg-[#E7137D] text-white font-bold text-sm px-8 py-3 uppercase tracking-widest transition-colors hover:bg-[#c60f69] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffe43b]"
          >
            Back to Home
          </Link>
          <Link
            href="/events"
            className="border-2 border-[#FFFF1A] text-[#FFFF1A] font-bold text-sm px-8 py-3 uppercase tracking-widest transition-colors hover:bg-[#FFFF1A] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffe43b]"
          >
            See Events
          </Link>
        </div>
      </div>

      {/* ── Date badge ── */}
      <p
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/40 tracking-widest uppercase whitespace-nowrap"
        aria-hidden="true"
      >
        25–26 October · IIIT Nagpur
      </p>
    </main>
  );
}
