import { pageMetadata } from "@/lib/seo/metadata";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AboutSection } from "@/components/AboutSection";
import { AboutPeople } from "@/components/AboutPeople";
import { Reveal } from "@/components/Reveal";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata(
  "About",
  "Discover TantraFiesta 2026, IIIT Nagpur’s annual national technical festival, and the ideas, team, and student innovation behind it.",
  "/about",
  {
    keywords: [
      "About TantraFiesta",
      "TantraFiesta 2026",
      "IIIT Nagpur tech fest history",
      "technical festival central india",
      "student innovation",
      "annual tech fest",
    ],
  }
);

export default function AboutPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);

  return (
    <div className="relative min-h-[100svh] flex flex-col text-white isolate bg-[#241A4C] overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c"),
        }}
      />
      {/* Fixed background layer covering viewport */}
      <div
className="fixed inset-0 -z-10 bg-[#241A4C] bg-[url(/assets/bg.webp)] bg-cover bg-center bg-no-repeat pointer-events-none"
        aria-hidden="true"
      />

      <Navbar currentPath="/about" />
      <main id="about-content" className="relative flex-1">
        <Reveal animateOnMount variant="scale" className={`${styles.openingTitle} mx-auto max-w-6xl px-4 text-center`}>
          <header>
          <h1 className="font-tantra text-7xl uppercase leading-none tracking-wide text-white sm:text-8xl md:text-9xl">About Us</h1>
          </header>
        </Reveal>

        <section aria-labelledby="institute-heading" className={`${styles.instituteGrid} mx-auto grid gap-4 px-4 sm:px-6 md:grid-cols-2`}>
          <Reveal animateOnMount variant="scale" delay={120} className={`${styles.instituteCard} rounded-2xl border-2 border-black/10 bg-[#FFFF1A] p-6 text-black shadow-2xl sm:p-8 md:col-span-2 md:rounded-[28px] md:p-12`}>
            <article>
            <h2 id="institute-heading" className="font-tantra text-3xl uppercase tracking-tight sm:text-5xl md:text-6xl">About IIIT Nagpur</h2>
            <p className="mt-6 max-w-3xl text-sm font-medium leading-relaxed sm:text-base md:text-lg">
              Established in 2016–17 under a public-private partnership, IIIT Nagpur is an Institution of National Importance. The institute operates from its permanent campus in Butibori, Nagpur, with support from the Government of India, the Government of Maharashtra, and industry partners including Tata Consultancy Services.
            </p>
            </article>
          </Reveal>

          <Reveal animateOnMount variant="left" delay={280} className={`${styles.instituteCard} rounded-2xl border-2 border-black/10 bg-[#FFFF1A] p-6 text-black shadow-2xl sm:p-8 md:rounded-[28px] md:p-10`}>
            <article>
            <h3 className="font-tantra text-2xl uppercase tracking-tight sm:text-4xl">Institute’s Mandate</h3>
            <p className="mt-5 text-sm font-medium leading-relaxed sm:text-base md:text-lg">
              Develop capable young innovators and entrepreneurs who use information technology to address the country’s needs with social and environmental responsibility.
            </p>
            </article>
          </Reveal>

          <Reveal animateOnMount variant="right" delay={420} className={`${styles.instituteCard} rounded-2xl border-2 border-black/10 bg-[#FFFF1A] p-6 text-black shadow-2xl sm:p-8 md:rounded-[28px] md:p-10`}>
            <article>
            <h3 className="font-tantra text-2xl uppercase tracking-tight sm:text-4xl">Institute’s Vision</h3>
            <p className="mt-5 text-sm font-medium leading-relaxed sm:text-base md:text-lg">
              Become a leading institution in information technology and allied fields through globally relevant education and outstanding research.
            </p>
            </article>
          </Reveal>

          <Reveal animateOnMount variant="rise" delay={560} className={`${styles.instituteCard} rounded-2xl border-2 border-black/10 bg-[#FFFF1A] p-6 text-black shadow-2xl sm:p-8 md:col-span-2 md:rounded-[28px] md:p-10`}>
            <article>
            <h3 className="font-tantra text-2xl uppercase tracking-tight sm:text-4xl">Institute’s Mission</h3>
            <p className="mt-5 max-w-3xl text-sm font-medium leading-relaxed sm:text-base md:text-lg">
              Advance industry-oriented and socially relevant research in information technology while encouraging innovation and entrepreneurship that serve society and the environment.
            </p>
            </article>
          </Reveal>
        </section>

        <AboutSection compactTop />

        <AboutPeople />

      </main>

      {/* === FOOTER === */}
      <div className="relative z-20">
        <Footer variant="yellow" />
      </div>
    </div>
  );
}
