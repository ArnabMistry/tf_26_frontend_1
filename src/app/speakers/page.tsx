import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Speakers",
  description:
    "Meet past keynote speakers, technology visionaries, and researchers who have spoken at TantraFiesta.",
  alternates: {
    canonical: "/speakers",
  },
  openGraph: {
    title: `Speakers | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description:
      "Meet past keynote speakers, technology visionaries, and researchers who have spoken at TantraFiesta.",
    url: `${siteConfig.url}/speakers`,
  },
  twitter: {
    title: `Speakers | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description:
      "Meet past keynote speakers, technology visionaries, and researchers who have spoken at TantraFiesta.",
  },
};

export default function SpeakersPage() {
  return (
    <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Keynote Speakers</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Visionary leaders, researchers, and open-source architects sharing knowledge at TantraFiesta.
        </p>
      </header>

      {/* Section: Past Speakers */}
      <section id="past-speakers" aria-labelledby="past-speakers-heading" className="space-y-4">
        <h2 id="past-speakers-heading" className="text-2xl font-semibold">
          Past Speakers
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Distinguished founders, industry pioneers, and engineering luminaries who delivered talks
          and masterclasses during previous editions of TantraFiesta.
        </p>
      </section>
    </main>
  );
}
