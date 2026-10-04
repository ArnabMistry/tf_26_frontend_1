import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "Explore past and present sponsors, corporate partners, and technology enterprises supporting TantraFiesta.",
  alternates: {
    canonical: "/sponsors",
  },
  openGraph: {
    title: `Sponsors | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description:
      "Explore past and present sponsors, corporate partners, and technology enterprises supporting TantraFiesta.",
    url: `${siteConfig.url}/sponsors`,
  },
  twitter: {
    title: `Sponsors | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description:
      "Explore past and present sponsors, corporate partners, and technology enterprises supporting TantraFiesta.",
  },
};

export default function SponsorsPage() {
  return (
    <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Sponsors & Partners</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Recognizing the organizations empowering technology, hackathons, and youth innovation at TantraFiesta.
        </p>
      </header>

      {/* Section: Past Sponsors */}
      <section id="past-sponsors" aria-labelledby="past-sponsors-heading" className="space-y-4">
        <h2 id="past-sponsors-heading" className="text-2xl font-semibold">
          Past Sponsors
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          We gratefully acknowledge our previous corporate sponsors, cloud providers, hardware partners,
          and developer communities who have supported TantraFiesta over the years.
        </p>
      </section>
    </main>
  );
}
