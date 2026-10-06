import React from "react";
import Image from "next/image";
import { CrimeSceneTape } from "@/components/CrimeSceneTape";

interface DossierData {
  caseNo: string;
  tier: string;
  stamp: string;
  code: string;
  rotation: number;
}

const DOSSIERS: DossierData[] = [
  { caseNo: "CASE #01", tier: "TITLE SPONSOR", stamp: "TOP SECRET", code: "TF-TS-01", rotation: -12 },
  { caseNo: "CASE #02", tier: "POWERED BY", stamp: "CLASSIFIED", code: "TF-PB-02", rotation: 10 },
  { caseNo: "CASE #03", tier: "TECH PARTNER", stamp: "EVIDENCE", code: "TF-TP-03", rotation: -8 },
  { caseNo: "CASE #04", tier: "PLATINUM", stamp: "REDACTED", code: "TF-PL-04", rotation: 13 },
  { caseNo: "CASE #05", tier: "ASSOCIATE", stamp: "CONFIDENTIAL", code: "TF-AS-05", rotation: -11 },
  { caseNo: "CASE #06", tier: "INNOVATION", stamp: "UNDER WRAPS", code: "TF-IN-06", rotation: 9 },
  { caseNo: "CASE #07", tier: "GAMING PARTNER", stamp: "TOP SECRET", code: "TF-GM-07", rotation: -14 },
  { caseNo: "CASE #08", tier: "MEDIA PARTNER", stamp: "SEALED FILE", code: "TF-MD-08", rotation: 11 },
  { caseNo: "CASE #09", tier: "CLOUD PARTNER", stamp: "CLASSIFIED", code: "TF-CL-09", rotation: -9 },
  { caseNo: "CASE #10", tier: "MOBILITY", stamp: "EVIDENCE", code: "TF-MB-10", rotation: 12 },
  { caseNo: "CASE #11", tier: "COMMUNITY", stamp: "REDACTED", code: "TF-CM-11", rotation: -13 },
  { caseNo: "CASE #12", tier: "ECOSYSTEM", stamp: "CONFIDENTIAL", code: "TF-EC-12", rotation: 8 },
];

const SponsorCard = ({ dossier }: { dossier: DossierData }) => (
  <div className="group relative aspect-[4/5] w-full transition-all duration-300 hover:-translate-y-1.5 hover:drop-shadow-[0_16px_28px_rgba(0,0,0,0.5)]">
    {/* Cyberpunk Notched Card Frame */}
    <svg 
      className="absolute inset-0 w-full h-full drop-shadow-xl" 
      viewBox="0 0 100 125" 
      preserveAspectRatio="none"
    >
      <path 
        d="
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
        "
        fill="#181135"
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className="transition-colors duration-300 group-hover:stroke-[#E7137D]"
      />
    </svg>

    {/* Background cyber grid pattern */}
    <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:10px_10px]" />

    {/* Dossier Card Content */}
    <div className="absolute inset-0 p-3 sm:p-4 md:p-5 flex flex-col justify-between text-white pointer-events-none select-none">
      
      {/* Top Header: Case Number & Clearance */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
        <span className="font-mono text-[9px] sm:text-[11px] text-[#FFFF1A] font-bold tracking-wider">
          {dossier.caseNo}
        </span>
        <span className="font-mono text-[8px] sm:text-[10px] text-pink-400 font-semibold tracking-wider">
          LEVEL 5
        </span>
      </div>

      {/* Middle: Classified Target Reticle, Tier & Rubber Stamp */}
      <div className="relative my-auto flex flex-col items-center justify-center py-1">
        
        {/* Animated Reticle with Mystery Icon */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-white/15 group-hover:border-[#E7137D]/40 transition-colors" />
          <div className="absolute inset-1.5 rounded-full border border-dashed border-white/20 animate-[spin_25s_linear_infinite]" />
          
          {/* Mystery Encrypted Lock Icon */}
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#FFFF1A]/80 group-hover:text-[#FFFF1A] transition-colors"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            <circle cx="12" cy="16" r="1.5" />
          </svg>
        </div>

        {/* Sponsor Tier & Redacted Bar */}
        <div className="w-full mt-2 text-center">
          <div className="text-[9px] sm:text-[10px] md:text-[11px] font-mono text-[#FFFF1A] font-bold tracking-wider uppercase mb-1">
            {dossier.tier}
          </div>
          <div className="inline-flex items-center justify-center bg-black/90 border border-white/15 px-2.5 py-0.5 rounded font-mono text-[9px] sm:text-[10px] text-[#E7137D] tracking-widest select-none shadow-inner">
            ███████████
          </div>
        </div>

        {/* Diagonal Distressed Classified Rubber Stamp */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-300 group-hover:scale-105"
          style={{ transform: `rotate(${dossier.rotation}deg)` }}
        >
          <div className="border-2 border-[#E7137D] bg-[#E7137D]/20 text-[#E7137D] font-mono font-black text-[9px] sm:text-[11px] md:text-xs tracking-widest px-2 sm:px-2.5 py-0.5 rounded shadow-lg uppercase backdrop-blur-[0.5px]">
            {dossier.stamp}
          </div>
        </div>

      </div>

      {/* Bottom Footer: Safely offset from the notched cut corner at bottom-right */}
      <div className="w-full pr-8 sm:pr-10">
        <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-mono border-t border-white/10 pt-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold group-hover:hidden">ENCRYPTED</span>
            <span className="text-[#E7137D] font-bold hidden group-hover:inline">ACCESS DENIED</span>
          </div>
          <span className="text-white/40 tracking-wider font-mono">{dossier.code}</span>
        </div>
      </div>

    </div>
  </div>
);

export function Sponsors() {
  return (
    <section className="relative w-full bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat pt-12 md:pt-20 flex flex-col items-center px-4 md:px-8 overflow-hidden">
      <div className="w-full max-w-[1600px] bg-[#FFFF1A] rounded-t-[32px] md:rounded-t-[48px] px-4 md:px-16 pt-16 md:pt-24 pb-16 relative shadow-2xl">
        
        {/* Hovercar Image Box */}
        <div className="absolute -top-12 md:-top-20 left-4 md:left-12 w-48 md:w-80 z-20">
          <Image
            src="/assets/hovercar.png"
            alt="Hovercar"
            width={320}
            height={240}
            className="w-full h-auto object-contain drop-shadow-xl"
          />
        </div>

        {/* Heading */}
        <h2 className="font-tantra text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-black uppercase tracking-tight mb-16 md:mb-24 text-center mt-8 md:mt-0 relative z-10">
          OUR SPONSORS
        </h2>

        {/* Crime Scene Tape across Sponsors */}
        <CrimeSceneTape
          text="CONFIDENTIAL"
          angle={-1.5}
          direction="reverse"
          speed="36s"
          className="top-44 md:top-56"
        />

        {/* Grid */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
          
          {/* Column 1 */}
          <div className="flex flex-col gap-4 md:gap-6">
            <SponsorCard dossier={DOSSIERS[0]} />
            <SponsorCard dossier={DOSSIERS[1]} />
            <SponsorCard dossier={DOSSIERS[2]} />
          </div>

          {/* Column 2 (Offset) */}
          <div className="flex flex-col gap-4 md:gap-6 mt-8 md:mt-20">
            <SponsorCard dossier={DOSSIERS[3]} />
            <SponsorCard dossier={DOSSIERS[4]} />
            <SponsorCard dossier={DOSSIERS[5]} />
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-4 md:gap-6">
            <SponsorCard dossier={DOSSIERS[6]} />
            <SponsorCard dossier={DOSSIERS[7]} />
            <SponsorCard dossier={DOSSIERS[8]} />
          </div>

          {/* Column 4 (Offset) */}
          <div className="flex flex-col gap-4 md:gap-6 mt-8 md:mt-20">
            <SponsorCard dossier={DOSSIERS[9]} />
            <SponsorCard dossier={DOSSIERS[10]} />
            <SponsorCard dossier={DOSSIERS[11]} />
          </div>

        </div>
      </div>
    </section>
  );
}
