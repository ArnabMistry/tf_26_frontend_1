import React from "react";
import Image from "next/image";
import { HoverTilt } from "./HoverTilt";

const sponsorsData = [
  {name:"Abhibus",image:"/assets/sponsors/abhibus-Iuz0rWX0.webp", bgColor: "#FFFFFF"},
  {name:"BenQ",image:"/assets/sponsors/benq-C85IPEkf.webp", bgColor: "#FFFFFF"},
  {name:"BSNL",image:"/assets/sponsors/bsnl-ORKlsoU7.webp", bgColor: "#FFFFFF"},
  {name:"Canara Bank",image:"/assets/sponsors/canara-diYW7kVB.webp", bgColor: "#0F5B9A"},
  {name:"Coca Cola",image:"/assets/sponsors/cocaCola-CLA30lmC.webp", bgColor: "#FFFFFF"},
  {name:"Decathlon",image:"/assets/sponsors/decathlon-BJzAvx-s.webp", bgColor: "#FFFFFF"},
  {name:"EaseMyTrip",image:"/assets/sponsors/easeMyTrip-CnSfBvRc.webp", bgColor: "#FFFFFF"},
  {name:"GiveMyCertificate",image:"/assets/sponsors/giveMyCertificate-DF64kp8V.webp", bgColor: "#FFFFFF"},
  {name:"Harley Davidson",image:"/assets/sponsors/harleyDavidson-Bhb27S1I.webp", bgColor: "#FFFFFF"},
  {name:"Hitavada",image:"/assets/sponsors/hitavada-CNfjNuYh.webp", bgColor: "#FFFFFF"},
  {name:"IIITIans Network",image:"/assets/sponsors/iiitiansNetwork-BBb0yO67.webp", bgColor: "#1E3A8A"},
  {name:"Ixigo",image:"/assets/sponsors/ixigo-CKkheZ0E.webp", bgColor: "#E85828"},
  {name:"Kazo",image:"/assets/sponsors/kazo-Lm588W1S.webp", bgColor: "#FFFFFF"},
  {name:"Kolourfly",image:"/assets/sponsors/kolourfly-D51g3U_1.webp", bgColor: "#FFFFFF"},
  {name:"Korean Maggi Noodles",image:"/assets/sponsors/koreanMaggiNoodles-DNHep1Q8.webp", bgColor: "#FFDE00"},
  {name:"LaVie",image:"/assets/sponsors/lavie-QRYTp_R-.webp", bgColor: "#FFEEFD"},
  {name:"Nvidia",image:"/assets/sponsors/nvidia-DBeNlgA0.webp", bgColor: "#C1F579"},
  {name:"ONGC",image:"/assets/sponsors/ongc-HtWvFemz.webp", bgColor: "#980808"},
  {name:"SBI",image:"/assets/sponsors/sbi-CpN8tQia.webp", bgColor: "#0073C0"},
  {name:"Shree Comp Systems",image:"/assets/sponsors/shreeCompSystems-Dtf3lZ-B.webp", bgColor: "#FFFFFF"},
  {name:"Skechers",image:"/assets/sponsors/skechers-GTdJi7SM.webp", bgColor: "#000000"},
  {name:"Trends",image:"/assets/sponsors/trends-B5mxHhFf.webp", bgColor: "#FFFFFF"}
];

const SponsorCard = ({ sponsor }: { sponsor: { name: string, image: string, bgColor: string } }) => {
  const isSquareLogo = 
    sponsor.name === "ONGC" || 
    sponsor.name === "Korean Maggi Noodles" || 
    sponsor.name === "Harley Davidson" ||
    sponsor.name.toUpperCase() === "EPICENTER CHAPTER";
  
  return (
    <div className="relative aspect-[4/5] w-full rounded-2xl md:rounded-none group hover:scale-105 transition-transform duration-300">
      {/* Mobile background */}
      <div 
        className="absolute inset-0 rounded-2xl md:hidden"
        style={{ backgroundColor: sponsor.bgColor }}
      />
      {/* Desktop SVG background */}
      <svg 
        className="absolute inset-0 w-full h-full hidden md:block" 
        viewBox="0 0 100 125" 
        preserveAspectRatio="none"
        stroke="rgba(0,0,0,0.85)"
        strokeWidth="2.5"
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
        className={`absolute z-10 flex items-center justify-center ${
          isSquareLogo 
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

export function Sponsors() {
  const columns: { name: string, image: string }[][] = [[], [], [], []];
  sponsorsData.forEach((s, i) => columns[i % 4].push(s));

  return (
    <section className="relative w-full bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat pt-12 md:pt-20 flex flex-col items-center px-4 md:px-8">
      <div className="w-full max-w-[1600px] bg-[#FFFF1A] rounded-t-[32px] md:rounded-t-[48px] px-4 md:px-16 pt-16 md:pt-24 pb-16 md:pb-32 relative">
        
        {/* Hovercar Image Box */}
        <HoverTilt className="absolute -top-12 md:-top-20 left-4 md:left-12 w-48 md:w-80 z-20" rotationIntensity={10} scaleIntensity={1.03}>
          <Image
            src="/assets/hovercar.png"
            alt="Hovercar"
            width={320}
            height={240}
            className="w-full h-auto object-contain drop-shadow-xl"
          />
        </HoverTilt>

        {/* Heading */}
        <h2 className="font-tantra text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-black uppercase tracking-tight mb-16 md:mb-24 text-center mt-8 md:mt-0 relative z-10">
          OUR SPONSORS
        </h2>

        {/* Grid */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
          
          {columns.map((col, colIndex) => (
            <div 
              key={colIndex} 
              className={`flex flex-col gap-4 md:gap-6 ${
                colIndex % 2 === 1 ? 'mt-8 md:mt-24' : ''
              }`}
            >
              {col.map((sponsor, idx) => (
                <SponsorCard key={idx} sponsor={sponsor} />
              ))}
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
