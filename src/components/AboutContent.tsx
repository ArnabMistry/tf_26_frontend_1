import dynamic from "next/dynamic";
import Link from "next/link";

const HistoryTimeline = dynamic(() => import("@/components/HistoryTimeline").then(m => m.HistoryTimeline), {
  loading: () => <div className="py-24 text-center text-zinc-500">Loading festival timeline…</div>,
});

const timelineData = [
  {
    year: "2025",
    theme: "THEME: DARK MATTER ECLIPSE",
    title: "Exploring The Unexplored",
    description: "TantraFiesta 2025 dives deep into the mysteries of the cosmos with \"Dark Matter Eclipse.\" This year marks a rebirth of innovation, where creativity meets the unseen power of technology.",
    link: "https://2025.tantrafiesta.in/",
    alignment: "right" as const,
  },
  {
    year: "2024",
    theme: "THEME: DIGITAL BIG BANG",
    title: "The Online Revolution",
    description: "TantraFiesta 2024 exploded into the digital universe with its first website launch. The \"Digital Big Bang\" marked our online evolution—bringing the fest closer to every innovator nationwide.",
    link: "https://2024.tantrafiesta.in/",
    alignment: "left" as const,
  },
  {
    year: "2023",
    theme: "THEME: GENESIS UNLEASHED A NEW DAWN",
    title: "Rise of Intelligence",
    description: "\"Genesis Unleashed\" redefined TantraFiesta with a fully virtual edition. AI-powered challenges and interactive workshops connected innovators from across the globe.",
    link: "https://2023.tantrafiesta.in/",
    alignment: "right" as const,
  },
  {
    year: "2022",
    theme: "THEME: GREENER TOMORROW",
    title: "Rebirth of Energy",
    description: "With \"Greener Tomorrow,\" TantraFiesta returned to campus life. Sustainability met technology as students reignited the spirit of in-person collaboration.",
    link: "https://2022.tantrafiesta.in/",
    alignment: "left" as const,
  },
];

/** Shared About page content, also featured on the homepage before Past Sponsors. */
export function AboutContent() {
  return <>
    {/* === HIGHLIGHTS SECTION === */}
    <div className="relative z-10 flex flex-col items-center w-full px-4 md:px-10 lg:px-16 pt-8 md:pt-12 pb-24 max-w-[1800px] mx-auto gap-16 md:gap-24">
      <div className="flex flex-col md:flex-row items-stretch gap-6 md:gap-12 lg:gap-16 xl:gap-20 w-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
        <div className="flex-1 md:flex-[0.6] bg-[#FFFF1A] rounded-[32px] p-8 md:p-12 lg:p-16 flex flex-col items-start justify-between text-black shadow-xl order-2 md:order-1">
          <div>
            <h3 className="font-sans font-black text-5xl md:text-6xl lg:text-[72px] leading-[0.9] tracking-tight mb-8">Last Year<br />Highlight&apos;s</h3>
            <div className="font-sans font-semibold text-xs md:text-sm leading-relaxed max-w-md">
              <div className="space-y-4">
                <p>From 9–11 October 2025, IIIT Nagpur hosted TantraFiesta’25 — Dark Matter Eclipse: Exploring the Unexplored.</p>
                <p>With 11,000+ registrations, participation from 33+ countries, 30+ events, and a prize pool of ₹8 lakh+, TF’25 brought technology to life through coding, robotics, and innovation.</p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <Link href="https://www.instagram.com/reel/DQRoQQqjHql/?mdxt=MXRoaTd2bDc3YWE0aQ==" className="inline-flex items-center justify-center gap-2 bg-[#E7137D] text-white px-8 py-3 rounded-md font-bold text-sm tracking-widest uppercase hover:bg-[#c60f69] transition-colors">VIEW NOW ↗</Link>
          </div>
        </div>
        <div className="flex-1 md:flex-[1.4] bg-[#97D813] rounded-full min-h-[300px] md:min-h-0 shadow-xl order-1 md:order-2 overflow-hidden relative">
          <video className="absolute inset-0 w-full h-full object-cover pointer-events-none" autoPlay muted loop playsInline preload="none" poster="/assets/bg.png" aria-label="TantraFiesta Highlights 1">
            <source src="/highlights-1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div className="flex flex-col md:flex-row-reverse items-stretch gap-6 md:gap-12 lg:gap-16 xl:gap-20 w-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
        <div className="flex-1 md:flex-[0.6] bg-[#FFFF1A] rounded-[32px] p-8 md:p-12 lg:p-16 flex flex-col items-start justify-between text-black shadow-xl order-2 md:order-1">
          <div>
            <h3 className="font-sans font-black text-5xl md:text-6xl lg:text-[72px] leading-[0.9] tracking-tight mb-8">Last Year<br />Highlight&apos;s</h3>
            <div className="font-sans font-semibold text-xs md:text-sm leading-relaxed max-w-md">
              <div className="space-y-4">
                <p>TantraFiesta’25 transformed IIIT Nagpur into a celebration of curiosity, creativity, and collaboration. From exciting competitions and gaming showdowns to engaging workshops and vibrant night events, every moment brought students together.</p>
                <p>Inspiring sessions by Bharat Acharya and industry experts created new perspectives, lasting friendships, unforgettable memories, and a legacy that will inspire future editions.</p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <Link href="https://www.instagram.com/reel/DPpvsaeApN5/?mdxt=MTBueHR0MTc1ajd2Zg==" className="inline-flex items-center justify-center gap-2 bg-[#E7137D] text-white px-8 py-3 rounded-md font-bold text-sm tracking-widest uppercase hover:bg-[#c60f69] transition-colors">VIEW NOW ↗</Link>
          </div>
        </div>
        <div className="flex-1 md:flex-[1.4] bg-[#97D813] rounded-full min-h-[300px] md:min-h-0 shadow-xl order-1 md:order-2 overflow-hidden relative">
          <video className="absolute inset-0 w-full h-full object-cover pointer-events-none" autoPlay muted loop playsInline preload="none" poster="/assets/bg.png" aria-label="TantraFiesta Highlights 2">
            <source src="/highlights-2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
    {/* === STATISTICS SECTION === */}
    <div className="relative z-10 flex flex-col items-center w-full px-4 md:px-8 py-16 max-w-4xl mx-auto">
      <h2 className="font-tantra text-4xl md:text-6xl text-white uppercase tracking-widest text-center mb-12 drop-shadow-md">STATISTICS</h2>
      <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-12 w-full max-w-4xl mx-auto">
        <div className="bg-[#594DD0] rounded-xl sm:rounded-3xl p-3 sm:p-8 flex flex-col items-center justify-center border-b-[6px] sm:border-b-[12px] border-[#403598] shadow-2xl aspect-square md:aspect-auto md:h-[280px] transform transition-transform hover:scale-105">
          <h3 className="font-sans font-black text-xl sm:text-4xl md:text-6xl text-[#FFC812] drop-shadow-md mb-1 sm:mb-2">11K+</h3>
          <p className="text-[#FFC812] text-center font-bold tracking-tight sm:tracking-wide text-[10px] sm:text-base md:text-xl leading-tight sm:leading-snug">Registrations</p>
        </div>
        <div className="bg-[#97D813] rounded-xl sm:rounded-3xl p-3 sm:p-8 flex flex-col items-center justify-center border-b-[6px] sm:border-b-[12px] border-[#6DA20C] shadow-2xl aspect-square md:aspect-auto md:h-[280px] transform transition-transform hover:scale-105">
          <h3 className="font-sans font-black text-xl sm:text-4xl md:text-6xl text-[#097275] drop-shadow-md mb-1 sm:mb-2">₹8L+</h3>
          <p className="text-[#097275] text-center font-bold tracking-tight sm:tracking-wide text-[10px] sm:text-base md:text-xl leading-tight sm:leading-snug">Prize Pool</p>
        </div>
        <div className="bg-[#F06C00] rounded-xl sm:rounded-3xl p-3 sm:p-8 flex flex-col items-center justify-center border-b-[6px] sm:border-b-[12px] border-[#BD5400] shadow-2xl aspect-square md:aspect-auto md:h-[280px] transform transition-transform hover:scale-105">
          <h3 className="font-sans font-black text-xl sm:text-4xl md:text-6xl text-white drop-shadow-md mb-1 sm:mb-2">33+</h3>
          <p className="text-white text-center font-bold tracking-tight sm:tracking-wide text-[10px] sm:text-base md:text-xl leading-tight sm:leading-snug">Countries Represented</p>
        </div>
      </div>
    </div>

    {/* === HISTORY OF TF SECTION === */}
    <div className="relative z-10 flex flex-col items-center w-full pt-16 pb-32">
      <div className="relative z-20 flex flex-col items-center justify-center pb-10 px-6 max-w-3xl text-center">
        <h2 className="page-title text-white mb-6 tracking-wide drop-shadow-lg text-center">HISTORY OF TF</h2>
        <p className="text-zinc-200 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl font-futura tracking-wider">
          Our technical fest began its wonderful journey in 2018 with humble beginnings and laying a strong foundation for future success. Despite the unprecedented challenges posed by the COVID-19 pandemic, we hosted successful fests each year. Our themes have continually evolved, reflecting our commitment to innovation and progress:
        </p>
      </div>
      <HistoryTimeline timelineData={timelineData} />
    </div>

  </>;
}
