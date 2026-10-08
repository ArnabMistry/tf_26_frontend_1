"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";

export interface TimelineItem {
  year: string;
  theme: string;
  title: string;
  description: string;
  link: string;
  alignment: "left" | "right";
}

interface HistoryTimelineProps {
  timelineData: TimelineItem[];
}

export function HistoryTimeline({ timelineData }: HistoryTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll within the timeline container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Calculate car position based on scroll progress
  // The car moves vertically down the container
  const carY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  // Custom keyframes to perfectly track the painted road from the absolute top
  // The physical road merges much further down the scroll (around 28% instead of 21%).
  // This keeps the drone on the right branch significantly longer, preventing it from cutting the corner.
  const carLeft = useTransform(
    scrollYProgress,
    [0, 0.08, 0.16, 0.24, 0.28],
    ["112%", "96%", "79%", "62%", "52.5%"]
  );
  
  // Rotate smoothly as it merges:
  // We hold the angled rotation (-30deg to -40deg) for much longer since the branch extends further down.
  const carRotate = useTransform(
    scrollYProgress,
    [0, 0.08, 0.16, 0.24, 0.28],
    ["-25deg", "-30deg", "-40deg", "-60deg", "-90deg"]
  );

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden mt-8 md:-mt-32">
      {/* Mobile Straight Road (Seamless Repeating, No V-fork) */}
      <div 
        className="md:hidden absolute left-0 top-0 w-[88px] h-full pointer-events-none z-0 opacity-80"
        style={{
          backgroundImage: "url('/assets/path_straight.png')",
          backgroundRepeat: "repeat-y",
          backgroundSize: "88px auto",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 40px, black calc(100% - 60px), transparent 100%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 40px, black calc(100% - 60px), transparent 100%)",
        }}
      />

      {/* Desktop Path Image Layer (Original Curved V-Fork) */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-0 w-full min-w-[1536px] h-full pointer-events-none z-0 flex-col items-center">
        {/* 1. Original Image (V-shape) */}
        <div className="relative w-full flex-shrink-0 leading-none">
          <img src="/assets/path.png" alt="Path" className="w-full h-auto block" />
        </div>
        {/* 2. Mirrored Extension */}
        <div className="relative w-full h-[600px] flex-shrink-0 overflow-hidden md:-mt-[1px]">
          <img src="/assets/path.png" alt="" className="absolute left-0 w-full h-auto max-w-none" style={{ bottom: '100%', transform: 'scaleY(-1)', transformOrigin: 'bottom' }} />
        </div>
        {/* 3. Normal Extension */}
        <div className="relative w-full h-[600px] flex-shrink-0 overflow-hidden -mt-[1px]">
          <img src="/assets/path.png" alt="" className="absolute left-0 w-full h-auto max-w-none" style={{ bottom: '0' }} />
        </div>
        {/* 4. Mirrored Extension */}
        <div className="relative w-full h-[600px] flex-shrink-0 overflow-hidden -mt-[1px]">
          <img src="/assets/path.png" alt="" className="absolute left-0 w-full h-auto max-w-none" style={{ bottom: '100%', transform: 'scaleY(-1)', transformOrigin: 'bottom' }} />
        </div>
      </div>

      {/* Mobile Car (Straight Down along center line x=44px) */}
      <motion.div 
        className="md:hidden absolute z-30 pointer-events-none"
        style={{ top: carY, left: "44px", rotate: "-90deg", x: "-50%" }}
      >
        <div className="relative w-12 h-12 -translate-y-1/2">
          <Image
            src="/assets/drone.png"
            alt="Drone"
            fill
            className="object-contain drop-shadow-[0_0_10px_rgba(231,19,125,0.6)]"
          />
        </div>
      </motion.div>

      {/* Desktop Car (Tracks Curve) */}
      <motion.div 
        className="hidden md:block absolute z-30"
        style={{ top: carY, left: carLeft, rotate: carRotate, x: "-50%" }}
      >
        <div className="relative w-20 h-20 md:w-28 md:h-28 -translate-y-1/2">
          <Image
            src="/assets/drone.png"
            alt="Drone"
            fill
            className="object-contain drop-shadow-[0_0_15px_rgba(231,19,125,0.6)]"
          />
        </div>
      </motion.div>

      {/* Checkpoints / Timeline Items */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-[1200px] mx-auto gap-20 md:gap-24 pt-[180px] md:pt-[600px] pb-32 md:pb-64">
        {timelineData.map((item, index) => (
          <Checkpoint key={item.year} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}

function Checkpoint({ item, index }: { item: TimelineItem; index: number }) {
  const itemRef = useRef<HTMLDivElement>(null);
  
  // Track scroll specifically for this checkpoint
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start center", "center center"]
  });

  // When scrollYProgress reaches 1, the item is fully revealed.
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [0, 0.5, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <div ref={itemRef} className="relative flex items-center justify-center w-full px-4 min-h-[180px] md:min-h-[200px]">
      <motion.div 
        className="w-full flex flex-col md:flex-row md:justify-between items-start md:items-center pl-[96px] sm:pl-[112px] md:pl-0"
        style={{ opacity, scale, y }}
      >
        {/* Mobile View: Logo and Content stacked on the right */}
        <div className="flex md:hidden flex-col gap-3 w-full items-start">
          <TimelineLogo item={item} mobile />
          <TimelineContent item={item} align="left" mobile />
        </div>

        {/* Desktop View: Left Side */}
        <div className="hidden md:flex w-[calc(50%-180px)] lg:w-[calc(50%-240px)] justify-end">
          {item.alignment === 'left' ? (
            <TimelineContent item={item} align="left" />
          ) : (
            <TimelineLogo item={item} />
          )}
        </div>
        
        {/* Desktop View: Right Side */}
        <div className="hidden md:flex w-[calc(50%-180px)] lg:w-[calc(50%-240px)] justify-start">
          {item.alignment === 'right' ? (
            <TimelineContent item={item} align="right" />
          ) : (
            <TimelineLogo item={item} />
          )}
        </div>
      </motion.div>
    </div>
  );
}

function TimelineContent({ item, align = 'left', mobile = false }: { item: TimelineItem, align?: 'left' | 'right', mobile?: boolean }) {
  const isLeft = align === 'left';
  return (
    <div className={`flex flex-col gap-2 md:gap-3 max-w-[280px] md:max-w-[320px] ${!mobile && isLeft ? 'items-end text-right' : 'items-start text-left'}`}>
      <h4 className={`text-[9px] md:text-[10px] text-zinc-400 uppercase tracking-widest font-sans font-bold`}>
        {item.theme}
      </h4>
      <h3 className={`${mobile ? 'text-lg' : 'text-xl md:text-3xl'} font-bold font-sans text-white tracking-wide`}>
        {item.title}
      </h3>
      <p className={`${mobile ? 'text-[11px]' : 'text-xs md:text-[13px]'} text-zinc-200 leading-relaxed font-sans mb-3 md:mb-4`}>
        {item.description}
      </p>
      <div>
        <Link 
          href={item.link}
          className={`inline-flex items-center justify-center gap-2 ${mobile ? 'px-4 py-2 text-[10px]' : 'px-5 py-2.5 text-xs'} border border-[#E7137D] text-[#E7137D] font-semibold rounded-md hover:bg-[#E7137D]/10 transition-colors uppercase tracking-widest`}
        >
          <svg width={mobile ? "12" : "14"} height={mobile ? "12" : "14"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

function TimelineLogo({ item, mobile = false }: { item: TimelineItem, mobile?: boolean }) {
  return (
    <div className={`flex ${mobile ? 'flex-row' : 'flex-col'} items-center gap-3 opacity-90`}>
      <div className={`relative ${mobile ? 'w-10 h-10 p-1' : 'w-20 h-20 md:w-24 md:h-24 p-2'} flex items-center justify-center bg-transparent rounded-full border-2 border-white/80 shrink-0`}>
        <Image
          src="/assets/tf_history.png"
          alt="TF Logo"
          fill
          className="object-contain p-1.5 drop-shadow-md"
        />
      </div>
      <span className={`text-[#E7137D] font-bold ${mobile ? 'text-2xl' : 'text-3xl md:text-5xl'} tracking-wide font-sans ${!mobile && 'mt-2'}`}>
        {item.year}
      </span>
    </div>
  );
}
