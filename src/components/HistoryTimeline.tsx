"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "motion/react";
import { getHistoryRoadPosition } from "@/lib/historyRoad";

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
  const dimensions = useMotionValue({ width: 1278, height: 2000, mobile: false });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const desktop = window.matchMedia("(min-width: 768px)");
    const measure = () => dimensions.set({ width: container.clientWidth, height: container.clientHeight, mobile: !desktop.matches });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    desktop.addEventListener("change", measure);
    return () => {
      observer.disconnect();
      desktop.removeEventListener("change", measure);
    };
  }, [dimensions]);
  
  // Track scroll within the timeline container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 75%"]
  });

  // Smooth out mouse wheel / trackpad scroll steps for buttery fluid animation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    restDelta: 0.001
  });

  const carPosition = useTransform(() => {
    const { width, height, mobile } = dimensions.get();
    return getHistoryRoadPosition(smoothProgress.get(), width, height, mobile);
  });
  const carY = useTransform(carPosition, (position) => position.y);
  const carLeft = useTransform(carPosition, (position) => position.x);
  const carRotate = useTransform(carPosition, (position) => position.rotate);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden mt-8 md:mt-0">
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

      {/* Desktop Path Image Layer (V-Fork + Seamless Straight Road, NO mirrored distortions) */}
      <div className="hidden md:flex absolute inset-0 w-full h-full pointer-events-none z-0 flex-col items-center" aria-hidden="true">
        {/* 1. Original Image (V-shape fork) */}
        <div className="relative w-full flex-shrink-0 leading-none">
          <Image src="/assets/path.png" alt="" width={1278} height={1230} sizes="100vw" className="w-full h-auto block" />
        </div>
        {/* 2. Seamless Straight Continuation (matching exact 261/1278 road width with smooth bottom fade) */}
        <div 
          className="relative flex-1 w-full flex justify-center -mt-[1px]"
          style={{
            maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)"
          }}
        >
          <div 
            className="h-full"
            style={{
              width: "calc(100% * 261 / 1278)",
              backgroundImage: "url('/assets/path_straight.png')",
              backgroundRepeat: "repeat-y",
              backgroundSize: "100% auto",
              backgroundPosition: "top center"
            }}
          />
        </div>
      </div>

      {/* The road and auto share the same responsive coordinate system. */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-30" aria-hidden="true">
        <motion.div 
          className="absolute pointer-events-none"
          style={{ top: carY, left: carLeft, rotate: carRotate, x: "-50%", y: "-50%" }}
        >
          <div className="relative w-12 h-12 md:w-[clamp(48px,8vw,112px)] md:h-[clamp(48px,8vw,112px)]">
            <Image
              src="/assets/drone.png"
              alt=""
              fill
              className="object-contain drop-shadow-[0_0_15px_rgba(231,19,125,0.6)]"
            />
          </div>
        </motion.div>
      </div>

      {/* Checkpoints / Timeline Items */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-[1600px] mx-auto gap-20 md:gap-24 pt-[180px] md:pt-[64.2vw] pb-32 md:pb-64">
        {timelineData.map((item) => (
          <Checkpoint key={item.year} item={item} />
        ))}
      </div>
    </div>
  );
}

function Checkpoint({ item }: { item: TimelineItem }) {
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
        <div className="hidden md:flex w-[calc(50%-13vw)] justify-end">
          {item.alignment === 'left' ? (
            <TimelineContent item={item} align="left" />
          ) : (
            <TimelineLogo item={item} />
          )}
        </div>
        
        {/* Desktop View: Right Side */}
        <div className="hidden md:flex w-[calc(50%-13vw)] justify-start">
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
