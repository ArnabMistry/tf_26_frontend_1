import React from "react";
import Image from "next/image";
import { HoverTilt } from "./HoverTilt";
import { Reveal } from "./Reveal";

export interface SponsorItem {
  name: string;
  image: string;
  bgColor: string;
}

export const pastSponsorsData: SponsorItem[] = [
  { name: "Abhibus", image: "/assets/past_sponsors/abhibus-Iuz0rWX0.webp", bgColor: "#FFFFFF" },
  { name: "BenQ", image: "/assets/past_sponsors/benq-C85IPEkf.webp", bgColor: "#FFFFFF" },
  { name: "BSNL", image: "/assets/past_sponsors/bsnl-ORKlsoU7.webp", bgColor: "#FFFFFF" },
  { name: "Canara Bank", image: "/assets/past_sponsors/canara-diYW7kVB.webp", bgColor: "#0F5B9A" },
  { name: "Coca Cola", image: "/assets/past_sponsors/cocaCola-CLA30lmC.webp", bgColor: "#FFFFFF" },
  { name: "Decathlon", image: "/assets/past_sponsors/decathlon-BJzAvx-s.webp", bgColor: "#FFFFFF" },
  { name: "EaseMyTrip", image: "/assets/past_sponsors/easeMyTrip-CnSfBvRc.webp", bgColor: "#FFFFFF" },
  { name: "GiveMyCertificate", image: "/assets/past_sponsors/giveMyCertificate-DF64kp8V.webp", bgColor: "#FFFFFF" },
  { name: "Harley Davidson", image: "/assets/past_sponsors/harleyDavidson-Bhb27S1I.webp", bgColor: "#FFFFFF" },
  { name: "Hitavada", image: "/assets/past_sponsors/hitavada-CNfjNuYh.webp", bgColor: "#FFFFFF" },
  { name: "IIITIans Network", image: "/assets/past_sponsors/iiitiansNetwork-BBb0yO67.webp", bgColor: "#1E3A8A" },
  { name: "Ixigo", image: "/assets/past_sponsors/ixigo-CKkheZ0E.webp", bgColor: "#E85828" },
  { name: "Kazo", image: "/assets/past_sponsors/kazo-Lm588W1S.webp", bgColor: "#FFFFFF" },
  { name: "Kolourfly", image: "/assets/past_sponsors/kolourfly-D51g3U_1.webp", bgColor: "#FFFFFF" },
  { name: "Korean Maggi Noodles", image: "/assets/past_sponsors/koreanMaggiNoodles-DNHep1Q8.webp", bgColor: "#FFDE00" },
  { name: "LaVie", image: "/assets/past_sponsors/lavie-QRYTp_R-.webp", bgColor: "#FFEEFD" },
  { name: "Nvidia", image: "/assets/past_sponsors/nvidia-DBeNlgA0.webp", bgColor: "#C1F579" },
  { name: "ONGC", image: "/assets/past_sponsors/ongc-HtWvFemz.webp", bgColor: "#980808" },
  { name: "SBI", image: "/assets/past_sponsors/sbi-CpN8tQia.webp", bgColor: "#0073C0" },
  { name: "Shree Comp Systems", image: "/assets/past_sponsors/shreeCompSystems-Dtf3lZ-B.webp", bgColor: "#FFFFFF" },
  { name: "Skechers", image: "/assets/past_sponsors/skechers-GTdJi7SM.webp", bgColor: "#000000" },
  { name: "Trends", image: "/assets/past_sponsors/trends-B5mxHhFf.webp", bgColor: "#FFFFFF" },
];

export const currentSponsorsData: SponsorItem[] = [
  { name: "State Bank of India (Title Sponsor)", image: "/assets/sponsors/Title_Sponsor.webp", bgColor: "#FFFFFF" },
  { name: "Krafton", image: "/assets/sponsors/Krafton_Logo.webp", bgColor: "#000000" },
  { name: "HP", image: "/assets/sponsors/Hp_logo.webp", bgColor: "#FFFFFF" },
  { name: "Fueler", image: "/assets/sponsors/FuelerLogo.webp", bgColor: "#FFFFFF" },
  { name: "HackerEarth", image: "/assets/sponsors/HackerEarth.webp", bgColor: "#FFFFFF" },
  { name: "InterviewBuddy", image: "/assets/sponsors/InterviewBuddy.webp", bgColor: "#FFFFFF" },
  { name: "Otaku's Paradise", image: "/assets/sponsors/Otaku_Paradise.webp", bgColor: "#FFFFFF" },
  { name: "Trips 24x7", image: "/assets/sponsors/Trip_24_7.webp", bgColor: "#FFFFFF" },
  { name: "TruScholar", image: "/assets/sponsors/truscholar_logo.webp", bgColor: "#FFFFFF" },
  { name: "The Trading Mitra", image: "/assets/sponsors/the_trading_mitra_logo.webp", bgColor: "#FFFFFF" },
  { name: "Evoltica Energy", image: "/assets/sponsors/Evoltica_Energy.webp", bgColor: "#FFFFFF" },
  { name: "Arya Chanakya", image: "/assets/sponsors/Arya_chanakya.webp", bgColor: "#FFFFFF" },
];

export const SponsorCard = ({ sponsor }: { sponsor: SponsorItem }) => {
  const isSquareLogo =
    sponsor.name === "ONGC" ||
    sponsor.name === "Korean Maggi Noodles" ||
    sponsor.name === "Harley Davidson" ||
    sponsor.name.toUpperCase() === "EPICENTER CHAPTER" ||
    sponsor.name === "HP" ||
    sponsor.name === "Fueler" ||
    sponsor.name === "HackerEarth" ||
    sponsor.name === "InterviewBuddy" ||
    sponsor.name === "Otaku's Paradise" ||
    sponsor.name === "The Trading Mitra" ||
    sponsor.name === "Trips 24x7" ||
    sponsor.name === "Arya Chanakya" ||
    sponsor.name.includes("Title Sponsor") ||
    sponsor.name.includes("State Bank of India");

  return (
    <div className="relative aspect-[4/5] w-full group hover:scale-105 transition-transform duration-300">
      {/* SVG background */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 125"
        preserveAspectRatio="none"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="1"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      >
        <path fill={sponsor.bgColor} d="
          M 4 4 
          L 96 4 
          L 96 90 
          Q 96 93 93 93 
          L 73 93 
          Q 70 93 67 96 
          L 57 119 
          Q 55 121 52 121 
          L 4 121 
          Z
        " />
      </svg>
      <div
        className={`absolute z-10 flex items-center justify-center ${isSquareLogo
          ? "top-[10%] left-[10%] right-[15%] bottom-[28%]"
          : "top-[12%] left-[12%] right-[12%] bottom-[12%]"
          }`}
      >
        <Image
          src={sponsor.image}
          alt={sponsor.name}
          fill
          className="object-contain filter drop-shadow-sm group-hover:drop-shadow-md transition-all"
        />
      </div>
    </div>
  );
};

export interface SponsorsSectionProps {
  title?: React.ReactNode;
  headingTag?: "h1" | "h2";
  sponsors?: SponsorItem[];
  id?: string;
  className?: string;
}

export function SponsorsSection({
  title = (
    <>
      PA<span className="ml-[0.02em]">S</span><span className="ml-[0.02em]">T</span> SPONSORS
    </>
  ),
  headingTag = "h2",
  sponsors = pastSponsorsData,
  id,
  className = "",
}: SponsorsSectionProps) {
  const columns: SponsorItem[][] = [[], [], [], []];
  sponsors.forEach((s, i) => columns[i % 4].push(s));

  const HeadingTag = headingTag;

  return (
    <section id={id} className={`relative w-full pt-12 md:pt-20 flex flex-col items-center px-4 md:px-8 ${className}`}>
      <div className="w-full max-w-[1600px] bg-[#FFFF1A] rounded-t-[32px] md:rounded-t-[48px] px-4 md:px-16 pt-16 md:pt-24 pb-16 md:pb-32 relative">

        {/* Hovercar Image Box */}
        <Reveal variant="left" className="absolute -top-12 md:-top-20 left-4 md:left-12 w-48 md:w-80 z-20">
          <HoverTilt className="w-full" rotationIntensity={10} scaleIntensity={1.03}>
            <Image
              src="/assets/hovercar.webp"
              alt="Hovercar"
              width={320}
              height={240}
              className="w-full h-auto object-contain drop-shadow-xl"
            />
          </HoverTilt>
        </Reveal>

        {/* Heading */}
        <Reveal variant="scale" delay={100}>
          <HeadingTag className="font-regular font-semibold text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-black uppercase tracking-normal mb-16 md:mb-24 text-center mt-8 md:mt-0 relative z-10">
            {title}
          </HeadingTag>
        </Reveal>

        {/* Grid */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">

          {columns.map((col, colIndex) => (
            <div
              key={colIndex}
              className={`flex flex-col gap-4 md:gap-6 ${colIndex % 2 === 1 ? 'mt-8 md:mt-24' : ''
                }`}
            >
              {col.map((sponsor, idx) => (
                <Reveal key={sponsor.name} variant={(colIndex + idx) % 2 === 0 ? "sponsor-left" : "sponsor-right"} delay={colIndex * 65}>
                  <SponsorCard sponsor={sponsor} />
                </Reveal>
              ))}
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

// Default export for landing page (PAST SPONSORS)
export function Sponsors() {
  return (
    <SponsorsSection
      title={
        <>
          PA<span className="ml-[0.02em]">S</span><span className="ml-[0.02em]">T</span> SPONSORS
        </>
      }
      headingTag="h2"
      sponsors={pastSponsorsData}
    />
  );
}

// Current sponsors section for the /sponsors route
export function CurrentSponsors({ headingTag = "h1" }: { headingTag?: "h1" | "h2" }) {
  return (
    <SponsorsSection
      title={
        <>
          SP<span className="ml-[0.02em]">O</span><span className="ml-[0.02em]">N</span>SORS
        </>
      }
      headingTag={headingTag}
      sponsors={currentSponsorsData}
    />
  );
}
