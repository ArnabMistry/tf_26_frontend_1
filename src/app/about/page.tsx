import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about TantraFiesta, its history, mission, milestone editions, and student innovation at IIIT Nagpur.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: `About | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description:
      "Learn about TantraFiesta, its history, mission, milestone editions, and student innovation at IIIT Nagpur.",
    url: `${siteConfig.url}/about`,
  },
  twitter: {
    title: `About | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description:
      "Learn about TantraFiesta, its history, mission, milestone editions, and student innovation at IIIT Nagpur.",
  },
};

export default function AboutPage() {
  return (
    <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">About TantraFiesta</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          The annual national technical festival of IIIT Nagpur, empowering engineering innovation and collaboration.
        </p>
      </header>

      {/* Section: About TantraFiesta */}
      <section id="about-tantrafiesta" aria-labelledby="about-heading" className="space-y-4">
        <h2 id="about-heading" className="text-2xl font-semibold">
          About TantraFiesta
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          TantraFiesta is the flagship technical festival of the Indian Institute of Information Technology,
          Nagpur. Built and managed by student communities, it serves as a melting pot for tech visionaries,
          competitive coders, robotics builders, and innovative minds from across the country.
        </p>
      </section>

      {/* Section: History of TantraFiesta */}
      <section id="history" aria-labelledby="history-heading" className="space-y-4">
        <h2 id="history-heading" className="text-2xl font-semibold">
          History of TantraFiesta
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Since its inception, TantraFiesta has grown continuously in scale, participation, and technical
          breadth. Each year features premier hackathons, keynote sessions, robotic combat tournaments,
          and paper presentations that push the boundaries of undergraduate innovation.
        </p>
      </section>

      {/* Section: Gallery */}
      <section id="gallery" aria-labelledby="gallery-heading" className="space-y-4">
        <h2 id="gallery-heading" className="text-2xl font-semibold">
          Gallery
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Explore captured highlights, stages, and project showcases from past editions of TantraFiesta.
        </p>
      </section>
    </main>
  );
}
