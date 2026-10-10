import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DeveloperCard } from "@/components/DeveloperCard";
import { heads, team } from "@/data/developers";
import { siteConfig } from "@/lib/site";
import styles from "./developers.module.css";

export const metadata: Metadata = {
  title: "Meet the Developers",
  description:
    "Meet the heads and developer team who built the official platform for TantraFiesta 2026 at IIIT Nagpur.",
  alternates: {
    canonical: "/developers",
  },
  openGraph: {
    title: `Meet the Developers | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description:
      "Meet the heads and developer team who built the official platform for TantraFiesta 2026 at IIIT Nagpur.",
    url: `${siteConfig.url}/developers`,
  },
};

export default function DevelopersPage() {
  return (
    <div className="relative min-h-[100svh] flex flex-col text-white isolate">
      {/* Fixed background layer covering viewport at exact 1:1 scale of Hero landing page */}
      <div
        className="fixed inset-0 -z-10 bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat pointer-events-none"
        aria-hidden="true"
      />

      {/* Same Navbar as landing page */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1160px] mx-auto px-4 min-[360px]:px-6 sm:px-8 pt-8 sm:pt-12 pb-20 md:pb-28">
        {/* Page Header */}
        <header className="mb-14 sm:mb-20">
          <h1 className={`${styles.heading} drop-shadow-md`}>
            MEET THE DEVELOPERS
          </h1>
          <p
            className="mt-4 sm:mt-5 text-xs sm:text-sm md:text-base font-normal text-white/80 tracking-wider"
            style={{ fontFamily: 'var(--font-futura)' }}
          >
            Our team did a phenomenal job
          </p>
        </header>

        {/* Section: Meet the Heads */}
        <section aria-labelledby="heads-heading" className="mb-16 sm:mb-24">
          <h2
            id="heads-heading"
            className="text-2xl sm:text-4xl md:text-5xl uppercase font-bold tracking-wider text-center text-white mb-8 sm:mb-12"
            style={{ fontFamily: 'var(--font-futura)' }}
          >
            MEET THE <span className="italic">HEADS</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 sm:gap-y-12 gap-x-8 sm:gap-x-10 justify-items-center">
            {heads.map((developer, index) => (
              <DeveloperCard key={`head-${index}`} developer={developer} />
            ))}
          </div>
        </section>

        {/* Section: Our Team */}
        <section aria-labelledby="team-heading" className="mb-12 sm:mb-16">
          <h2
            id="team-heading"
            className="text-2xl sm:text-4xl md:text-5xl uppercase font-bold tracking-wider text-center text-white mb-8 sm:mb-12"
            style={{ fontFamily: 'var(--font-futura)' }}
          >
            OUR <span className="italic">TEAM</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 sm:gap-y-12 gap-x-8 sm:gap-x-10 justify-items-center">
            {team.map((developer, index) => (
              <DeveloperCard key={`team-${index}`} developer={developer} />
            ))}
          </div>
        </section>
      </main>

      {/* Yellow Footer for Developers Page */}
      <Footer variant="yellow" />
    </div>
  );
}
