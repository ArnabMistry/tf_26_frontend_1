import { pageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllClubs } from "@/lib/clubs";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = pageMetadata("Clubs & Organizing Bodies", "Discover the student clubs and organizing communities powering competitions, hackathons, and symposiums at TantraFiesta.", "/clubs");

export default function ClubsIndexPage() {
  const clubs = getAllClubs();

  return (
    <div className="relative min-h-screen flex flex-col bg-[#241A4C] text-white">
      {/* Background layer */}
      <div
        className="fixed inset-0 -z-10 bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat pointer-events-none"
        aria-hidden="true"
      />

      <Navbar currentPath="/clubs" />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full space-y-12">
        <header className="space-y-4">
          <h1 className="page-title text-white drop-shadow-md">
            CLUBS
          </h1>
          <p className="text-zinc-300 text-sm md:text-base leading-relaxed max-w-xl">
            The technical societies and student communities curating individual events at TantraFiesta.
          </p>
        </header>

        <section id="clubs-directory" aria-labelledby="clubs-heading" className="space-y-6">
          <h2 id="clubs-heading" className="font-tantra text-2xl uppercase tracking-widest text-[#FFFF1A]">
            Organizing Communities
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club) => (
              <Link
                key={club.slug}
                href={`/clubs/${club.slug}`}
                className="group block p-6 border border-white/10 rounded-2xl bg-white/5 hover:border-[#FFFF1A]/60 hover:bg-white/10 transition-all"
              >
                <h3 className="text-xl font-bold text-white group-hover:text-[#FFFF1A] transition-colors">
                  {club.name}
                </h3>
                {club.tagline && (
                  <p className="mt-1 text-xs uppercase tracking-wider text-[#E7137D] font-semibold">
                    {club.tagline}
                  </p>
                )}
                <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
                  {club.description}
                </p>
                <span className="mt-4 inline-block text-xs font-semibold text-[#FFFF1A]">
                  View organized events &rarr;
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer variant="yellow" />
    </div>
  );
}
