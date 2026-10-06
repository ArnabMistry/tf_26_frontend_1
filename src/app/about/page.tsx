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
          The National-Level Annual Technical Fest of the Indian Institute of Information Technology, Nagpur.
        </p>
      </header>

      {/* Section: About TantraFiesta */}
      <section id="about-tantrafiesta" aria-labelledby="about-heading" className="space-y-4">
        <h2 id="about-heading" className="text-2xl font-semibold">
          About TantraFiesta
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          TantraFiesta is the National-Level Annual Technical Fest of the Indian Institute of Information Technology, Nagpur. It is conceived as a platform where technology is explored beyond the classroom—through experimentation, problem-solving, and original thinking.
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          The fest brings together students with different technical interests and encourages them to question established approaches, work with emerging ideas, and apply knowledge in meaningful ways. With every edition, TantraFiesta reflects the evolving nature of technology while staying rooted in its core purpose: to promote technical curiosity, creativity, and a culture of building beyond the obvious.
        </p>
      </section>

      {/* Section: Theme */}
      <section id="theme" aria-labelledby="theme-heading" className="space-y-4">
        <h2 id="theme-heading" className="text-2xl font-semibold">
          Theme: Indian Maximalism
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          TantraFiesta 2026 introduces <strong className="text-zinc-900 dark:text-zinc-100">ANANTA: Surpassing the Possible</strong>—a theme inspired by the idea of the infinite and technology’s ability to continually redefine its own limits.
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Its visual identity takes shape through Indian Maximalism, where the richness of Indian aesthetics is reinterpreted through a contemporary technological lens. Bold contrasts, intricate forms, layered compositions, and expressive details create a language that feels distinctly Indian yet futuristic.
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          ANANTA represents a mindset where boundaries are not endpoints, but starting points for what can exist next.
        </p>
      </section>

      {/* Section: History of TantraFiesta */}
      <section id="history" aria-labelledby="history-heading" className="space-y-4">
        <h2 id="history-heading" className="text-2xl font-semibold">
          History &amp; Legacy
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Since its inception, TantraFiesta has grown continuously in scale, participation, and technical breadth. Each year features premier hackathons, keynote sessions, robotic combat tournaments, and competitions that push the boundaries of undergraduate innovation.
        </p>
      </section>
    </main>
  );
}
