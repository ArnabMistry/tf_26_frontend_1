import React from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import Link from "next/link";
import { HistoryTimeline } from "@/components/HistoryTimeline";

export const metadata: Metadata = {
  title: "About | History of TF",
  description: "Learn about TantraFiesta, its history, mission, milestone editions, and student innovation at IIIT Nagpur.",
};

const timelineData = [
  {
    year: "2025",
    theme: "THEME: DARK MATTER ECLIPSE",
    title: "Exploring The Unexplored",
    description: "TantraFiesta 2025 dives deep into the mysteries of the cosmos with \"Dark Matter Eclipse.\" This year marks a rebirth of innovation, where creativity meets the unseen power of technology.",
    link: "#",
    alignment: "right" as const,
  },
  {
    year: "2024",
    theme: "THEME: DIGITAL BIG BANG",
    title: "The Online Revolution",
    description: "TantraFiesta 2024 exploded into the digital universe with its first website launch. The \"Digital Big Bang\" marked our online evolution—bringing the fest closer to every innovator nationwide.",
    link: "#",
    alignment: "left" as const,
  },
  {
    year: "2023",
    theme: "THEME: GENESIS UNLEASHED A NEW DAWN",
    title: "Rise of Intelligence",
    description: "\"Genesis Unleashed\" redefined TantraFiesta with a fully virtual edition. AI-powered challenges and interactive workshops connected innovators from across the globe.",
    link: "#",
    alignment: "right" as const,
  },
  {
    year: "2022",
    theme: "THEME: GREENER TOMORROW",
    title: "Rebirth of Energy",
    description: "With \"Greener Tomorrow,\" TantraFiesta returned to campus life. Sustainability met technology as students reignited the spirit of in-person collaboration.",
    link: "#",
    alignment: "left" as const,
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-[100svh] flex flex-col text-white isolate bg-[#241A4C] overflow-x-hidden">
      {/* Fixed background layer covering viewport */}
      <div
        className="fixed inset-0 -z-10 bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat pointer-events-none"
        aria-hidden="true"
      />

      <Navbar currentPath="/about" />

      {/* === THE ORIGIN SECTION === */}
      <div className="relative z-10 flex flex-col items-center w-full px-4 md:px-8 pt-12 pb-16 max-w-5xl mx-auto">
        <h2 className="font-tantra text-[101.489px] text-white uppercase tracking-normal w-full text-left mb-8 drop-shadow-md leading-none">
          THE ORIGIN
        </h2>

        <div className="flex flex-col gap-6 w-full">
          {/* ABOUT IIIT NAGPUR */}
          <div className="bg-[#FFFF1A] text-black rounded-3xl p-6 md:p-10 shadow-lg border-2 border-black/10">
            <h3 className="font-tantra text-3xl md:text-4xl uppercase mb-4">ABOUT IIIT NAGPUR</h3>
            <p className="font-sans font-medium text-sm md:text-base leading-relaxed">
              Indian Institute of Information Technology, Nagpur (IIITN) is an Institution of National Importance established under the Act of Parliament by the Ministry of Education, Government of India. It is committed to promoting technical education and research, fostering innovation, and building the next generation of technologists and leaders.
            </p>
          </div>

          {/* ABOUT TANTRAFIESTA */}
          <div className="bg-[#FFFF1A] text-black rounded-3xl p-6 md:p-10 shadow-lg border-2 border-black/10">
            <h3 className="font-tantra text-3xl md:text-4xl uppercase mb-4">ABOUT TANTRAFIESTA</h3>
            <div className="space-y-4 font-sans font-medium text-sm md:text-base leading-relaxed">
              <p>
                TantraFiesta is the National-Level Annual Technical Fest of the Indian Institute of Information Technology, Nagpur. It is conceived as a platform where technology is explored beyond the classroom—through experimentation, problem-solving, and original thinking.
              </p>
              <p>
                The fest brings together students with different technical interests and encourages them to question established approaches, work with emerging ideas, and apply knowledge in meaningful ways. With every edition, TantraFiesta reflects the evolving nature of technology while staying rooted in its core purpose: to promote technical curiosity, creativity, and a culture of building beyond the obvious.
              </p>
            </div>
          </div>

          {/* ABOUT THEME */}
          <div className="bg-[#FFFF1A] text-black rounded-3xl p-6 md:p-10 shadow-lg border-2 border-black/10">
            <h3 className="font-tantra text-3xl md:text-4xl uppercase mb-4">ABOUT THEME</h3>
            <div className="space-y-4 font-sans font-medium text-sm md:text-base leading-relaxed">
              <p>
                TantraFiesta 2026 introduces <span className="font-bold">ANANTA: Surpassing the Possible</span>—a theme inspired by the idea of the infinite and technology’s ability to continually redefine its own limits.
              </p>
              <p>
                Its visual identity takes shape through <span className="font-bold">Indian Maximalism</span>, where the richness of Indian aesthetics is reinterpreted through a contemporary technological lens. Bold contrasts, intricate forms, layered compositions, and expressive details create a language that feels distinctly Indian yet futuristic.
              </p>
              <p>
                <span className="font-bold">ANANTA</span> represents a mindset where boundaries are not endpoints, but starting points for what can exist next.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* === STATISTICS SECTION === */}
      <div className="relative z-10 flex flex-col items-center w-full px-4 md:px-8 py-16 max-w-4xl mx-auto">
        <h2 className="font-tantra text-4xl md:text-6xl text-white uppercase tracking-widest text-center mb-12 drop-shadow-md">
          STATISTICS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-3xl mx-auto">

          {/* Stat Card 1 */}
          <div className="bg-[#594DD0] rounded-3xl p-8 flex flex-col items-center justify-center border-b-[12px] border-[#403598] shadow-2xl aspect-square md:aspect-auto md:h-[280px] transform transition-transform hover:scale-105">
            <h3 className="font-sans font-black text-6xl text-[#FFC812] drop-shadow-md mb-2">1.3 M</h3>
            <p className="text-[#FFC812] text-center font-bold tracking-wide text-lg md:text-xl leading-snug">Impressions on<br />Unstop</p>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-[#97D813] rounded-3xl p-8 flex flex-col items-center justify-center border-b-[12px] border-[#6DA20C] shadow-2xl aspect-square md:aspect-auto md:h-[280px] transform transition-transform hover:scale-105">
            <h3 className="font-sans font-black text-6xl text-[#097275] drop-shadow-md mb-2">1.3 M</h3>
            <p className="text-[#097275] text-center font-bold tracking-wide text-lg md:text-xl leading-snug">Impressions on<br />Unstop</p>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-[#F06C00] rounded-3xl p-8 flex flex-col items-center justify-center border-b-[12px] border-[#BD5400] shadow-2xl aspect-square md:aspect-auto md:h-[280px] transform transition-transform hover:scale-105">
            <h3 className="font-sans font-black text-6xl text-white drop-shadow-md mb-2">1.3 M</h3>
            <p className="text-white text-center font-bold tracking-wide text-lg md:text-xl leading-snug">Impressions on<br />Unstop</p>
          </div>

        </div>
      </div>

      {/* === HISTORY OF TF SECTION === */}
      <div className="relative z-10 flex flex-col items-center w-full pt-16 pb-32">
        <div className="relative z-20 flex flex-col items-center justify-center pb-10 px-6 max-w-3xl text-center">
          <h1 className="font-tantra text-5xl md:text-7xl mb-6 tracking-wide drop-shadow-lg uppercase text-white">
            HISTORY OF TF
          </h1>
          <p className="text-zinc-200 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl font-futura tracking-wider">
            Our technical fest began its wonderful journey in 2018 with humble beginnings and laying a strong foundation for future success. Despite the unprecedented challenges posed by the COVID-19 pandemic, we hosted successful fests each year. Our themes have continually evolved, reflecting our commitment to innovation and progress:
          </p>
        </div>

        {/* Timeline Section */}
        <HistoryTimeline timelineData={timelineData} />
      </div>

      {/* === HIGHLIGHTS SECTION === */}
      <div className="relative z-10 flex flex-col items-center w-full px-4 md:px-10 lg:px-16 pt-8 md:pt-12 pb-24 max-w-[1800px] mx-auto gap-16 md:gap-24">

        {/* Row 1 */}
        <div className="flex flex-col md:flex-row items-stretch gap-6 md:gap-12 lg:gap-16 xl:gap-20 w-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
          {/* Yellow Card - Left */}
          <div className="flex-1 md:flex-[0.6] bg-[#FFFF1A] rounded-[32px] p-8 md:p-12 lg:p-16 flex flex-col items-start justify-between text-black shadow-xl order-2 md:order-1">
            <div>
              <h3 className="font-sans font-black text-5xl md:text-6xl lg:text-[72px] leading-[0.9] tracking-tight mb-8">
                Last Year<br />Highlight&apos;s
              </h3>
              <p className="font-sans font-semibold text-xs md:text-sm leading-relaxed max-w-md">
                Our technical fest began its wonderful journey in 2018 with humble beginnings and laying a strong foundation for future success. Despite the unprecedented challenges posed by the COVID-19 pandemic, we hosted successful fests each year. Our themes have continually evolved, reflecting our commitment to innovation and progress:
              </p>
            </div>
            <div className="mt-8">
              <Link href="#" className="inline-flex items-center justify-center gap-2 bg-[#E7137D] text-white px-8 py-3 rounded-md font-bold text-sm tracking-widest uppercase hover:bg-[#c60f69] transition-colors">
                VIEW NOW ↗
              </Link>
            </div>
          </div>

          {/* Green Capsule - Right */}
          <div className="flex-1 md:flex-[1.4] bg-[#97D813] rounded-[100px] md:[border-radius:45%_/_50%] min-h-[300px] md:min-h-0 shadow-xl order-1 md:order-2">
            {/* Placeholder for Video/Image */}
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col md:flex-row-reverse items-stretch gap-6 md:gap-12 lg:gap-16 xl:gap-20 w-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
          {/* Yellow Card - Right */}
          <div className="flex-1 md:flex-[0.6] bg-[#FFFF1A] rounded-[32px] p-8 md:p-12 lg:p-16 flex flex-col items-start justify-between text-black shadow-xl order-2 md:order-1">
            <div>
              <h3 className="font-sans font-black text-5xl md:text-6xl lg:text-[72px] leading-[0.9] tracking-tight mb-8">
                Last Year<br />Highlight&apos;s
              </h3>
              <p className="font-sans font-semibold text-xs md:text-sm leading-relaxed max-w-md">
                Our technical fest began its wonderful journey in 2018 with humble beginnings and laying a strong foundation for future success. Despite the unprecedented challenges posed by the COVID-19 pandemic, we hosted successful fests each year. Our themes have continually evolved, reflecting our commitment to innovation and progress:
              </p>
            </div>
            <div className="mt-8">
              <Link href="#" className="inline-flex items-center justify-center gap-2 bg-[#E7137D] text-white px-8 py-3 rounded-md font-bold text-sm tracking-widest uppercase hover:bg-[#c60f69] transition-colors">
                VIEW NOW ↗
              </Link>
            </div>
          </div>

          {/* Green Capsule - Left */}
          <div className="flex-1 md:flex-[1.4] bg-[#97D813] rounded-[100px] md:[border-radius:45%_/_50%] min-h-[300px] md:min-h-0 shadow-xl order-1 md:order-2">
            {/* Placeholder for Video/Image */}
          </div>
        </div>

      </div>

      {/* === FOOTER === */}
      <div className="relative z-20">
        <Footer variant="yellow" />
      </div>
    </div>
  );
}


