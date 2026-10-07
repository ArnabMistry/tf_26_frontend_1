import React from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import Link from "next/link";

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
    <main className="flex-1 min-h-[100svh] w-full bg-[#1A1344] text-white flex flex-col relative overflow-x-hidden">
      <Navbar currentPath="/about" />

      {/* Pattern background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat" />

      {/* === THE ORIGIN SECTION === */}
      <div className="relative z-10 flex flex-col items-center w-full px-4 md:px-8 pt-12 pb-16 max-w-5xl mx-auto">
        <h2 className="font-tantra text-4xl md:text-6xl text-white uppercase tracking-widest w-full text-left mb-8 drop-shadow-md">
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
            <p className="text-[#FFC812] text-center font-bold tracking-wide text-lg md:text-xl leading-snug">Impressions on<br/>Unstop</p>
          </div>
          
          {/* Stat Card 2 */}
          <div className="bg-[#97D813] rounded-3xl p-8 flex flex-col items-center justify-center border-b-[12px] border-[#6DA20C] shadow-2xl aspect-square md:aspect-auto md:h-[280px] transform transition-transform hover:scale-105">
            <h3 className="font-sans font-black text-6xl text-[#097275] drop-shadow-md mb-2">1.3 M</h3>
            <p className="text-[#097275] text-center font-bold tracking-wide text-lg md:text-xl leading-snug">Impressions on<br/>Unstop</p>
          </div>
          
          {/* Stat Card 3 */}
          <div className="bg-[#F06C00] rounded-3xl p-8 flex flex-col items-center justify-center border-b-[12px] border-[#BD5400] shadow-2xl aspect-square md:aspect-auto md:h-[280px] transform transition-transform hover:scale-105">
            <h3 className="font-sans font-black text-6xl text-white drop-shadow-md mb-2">1.3 M</h3>
            <p className="text-white text-center font-bold tracking-wide text-lg md:text-xl leading-snug">Impressions on<br/>Unstop</p>
          </div>
          
        </div>
      </div>

      {/* === HISTORY OF TF SECTION === */}
      <div className="relative z-10 flex flex-col items-center w-full pt-16 pb-32">
        <div className="flex flex-col items-center justify-center pb-10 px-6 max-w-3xl text-center">
          <h1 className="font-tantra text-5xl md:text-7xl mb-6 tracking-wide drop-shadow-lg uppercase text-white">
            HISTORY OF TF
          </h1>
          <p className="text-zinc-200 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl font-futura tracking-wider">
            Our technical fest began its wonderful journey in 2018 with humble beginnings and laying a strong foundation for future success. Despite the unprecedented challenges posed by the COVID-19 pandemic, we hosted successful fests each year. Our themes have continually evolved, reflecting our commitment to innovation and progress:
          </p>
        </div>

        {/* Timeline Section */}
        <div className="relative w-full overflow-hidden mt-10">
          
          {/* Path Image Layer */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[1536px] max-w-none h-full pointer-events-none z-0 flex flex-col items-center">
             
             {/* 1. Original Image */}
             <div className="relative w-full flex-shrink-0 leading-none">
               <img src="/assets/path.png" alt="Path" className="w-full h-auto block" />
               
               {/* Right Branch Drones */}
               <div className="absolute top-[29%] left-[70%] w-20 h-20 md:w-28 md:h-28 rotate-[-40deg] -translate-x-1/2 -translate-y-1/2 z-20">
                 <Image src="/assets/drone.png" alt="Drone" fill className="object-contain drop-shadow-[0_0_15px_rgba(231,19,125,0.6)]" />
               </div>
               <div className="absolute top-[13%] left-[90%] w-20 h-20 md:w-28 md:h-28 rotate-[-25deg] -translate-x-1/2 -translate-y-1/2 z-20">
                 <Image src="/assets/drone.png" alt="Drone" fill className="object-contain drop-shadow-[0_0_15px_rgba(231,19,125,0.6)]" />
               </div>
             </div>

             {/* 2. Mirrored Extension (Connects perfectly to the bottom of the original) */}
             <div className="relative w-full h-[600px] flex-shrink-0 overflow-hidden -mt-[1px]">
               <img src="/assets/path.png" alt="" className="absolute left-0 w-full h-auto max-w-none" style={{ bottom: '100%', transform: 'scaleY(-1)', transformOrigin: 'bottom' }} />
             </div>

             {/* 3. Normal Extension (Connects perfectly to the mirrored bottom) */}
             <div className="relative w-full h-[600px] flex-shrink-0 overflow-hidden -mt-[1px]">
               <img src="/assets/path.png" alt="" className="absolute left-0 w-full h-auto max-w-none" style={{ bottom: '0' }} />
             </div>
             
             {/* 4. Mirrored Extension */}
             <div className="relative w-full h-[600px] flex-shrink-0 overflow-hidden -mt-[1px]">
               <img src="/assets/path.png" alt="" className="absolute left-0 w-full h-auto max-w-none" style={{ bottom: '100%', transform: 'scaleY(-1)', transformOrigin: 'bottom' }} />
             </div>
          </div>

          <div className="relative z-10 flex flex-col items-center w-full max-w-[1200px] mx-auto gap-16 md:gap-24 pt-[700px] md:pt-[750px] pb-32 md:pb-64">
            {timelineData.map((item, index) => (
              <div 
                key={item.year}
                className="relative flex items-center justify-center w-full px-4"
              >
                {/* Drone */}
                <div className="absolute left-1/2 -translate-x-1/2 z-20 top-1/2 -translate-y-1/2">
                  <div className="relative w-20 h-20 md:w-28 md:h-28 -rotate-90">
                    <Image
                      src="/assets/drone.png"
                      alt="Drone"
                      fill
                      className="object-contain drop-shadow-[0_0_15px_rgba(231,19,125,0.6)]"
                    />
                  </div>
                </div>

                {/* Left and Right columns */}
                <div className="w-full flex justify-between items-center">
                  {/* Left Side */}
                  <div className="w-[calc(50%-120px)] md:w-[calc(50%-180px)] lg:w-[calc(50%-240px)] flex justify-end">
                    {item.alignment === 'left' ? (
                      <TimelineContent item={item} align="left" />
                    ) : (
                      <TimelineLogo item={item} />
                    )}
                  </div>
                  
                  {/* Right Side */}
                  <div className="w-[calc(50%-120px)] md:w-[calc(50%-180px)] lg:w-[calc(50%-240px)] flex justify-start">
                    {item.alignment === 'right' ? (
                      <TimelineContent item={item} align="right" />
                    ) : (
                      <TimelineLogo item={item} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* === HIGHLIGHTS SECTION === */}
      <div className="relative z-10 flex flex-col items-center w-full px-4 md:px-8 py-20 max-w-6xl mx-auto gap-16 md:gap-24">
        
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row items-stretch gap-6 md:gap-12 w-full min-h-[400px]">
          {/* Yellow Card - Left */}
          <div className="flex-1 bg-[#FFFF1A] rounded-[32px] p-8 md:p-12 flex flex-col items-start justify-between text-black shadow-xl order-2 md:order-1">
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
          <div className="flex-[1.2] bg-[#97D813] rounded-[100px] md:rounded-[200px] min-h-[300px] shadow-xl order-1 md:order-2">
            {/* Placeholder for Video/Image */}
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col md:flex-row-reverse items-stretch gap-6 md:gap-12 w-full min-h-[400px]">
          {/* Yellow Card - Right */}
          <div className="flex-1 bg-[#FFFF1A] rounded-[32px] p-8 md:p-12 flex flex-col items-start justify-between text-black shadow-xl order-2 md:order-1">
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
          <div className="flex-[1.2] bg-[#97D813] rounded-[100px] md:rounded-[200px] min-h-[300px] shadow-xl order-1 md:order-2">
            {/* Placeholder for Video/Image */}
          </div>
        </div>

      </div>

      {/* === FOOTER === */}
      <div className="relative z-20 bg-[#0c0822]">
        <Footer />
      </div>
    </main>
  );
}

function TimelineContent({ item, align = 'left' }: { item: typeof timelineData[0], align?: 'left' | 'right' }) {
  const isLeft = align === 'left';
  return (
    <div className={`flex flex-col gap-2 md:gap-3 max-w-[280px] md:max-w-[320px] ${isLeft ? 'items-end text-right' : 'items-start text-left'}`}>
      <h4 className="text-[9px] md:text-[10px] text-zinc-400 uppercase tracking-widest font-sans font-bold">
        {item.theme}
      </h4>
      <h3 className="text-xl md:text-3xl font-bold font-sans text-white tracking-wide">
        {item.title}
      </h3>
      <p className="text-xs md:text-[13px] text-zinc-200 leading-relaxed font-sans mb-4">
        {item.description}
      </p>
      <div>
        <Link 
          href={item.link}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-[#E7137D] text-[#E7137D] text-xs font-semibold rounded-md hover:bg-[#E7137D]/10 transition-colors uppercase tracking-widest"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          Visit Website
        </Link>
      </div>
    </div>
  );
}

function TimelineLogo({ item }: { item: typeof timelineData[0] }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 opacity-90">
      <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center bg-transparent rounded-full border-2 border-white/80 p-2">
        <Image
          src="/assets/tf_history.png"
          alt="TF Logo"
          fill
          className="object-contain p-2 drop-shadow-md"
        />
      </div>
      <span className="text-[#E7137D] font-bold text-3xl md:text-5xl tracking-wide font-sans mt-2">
        {item.year}
      </span>
    </div>
  );
}
