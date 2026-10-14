"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { HoverTilt } from "./HoverTilt";
import { ThemeTeaser } from "./ThemeTeaser";

const PhysicsText = dynamic(() => import("./PhysicsText").then((m) => m.PhysicsText), { ssr: false });

interface FooterProps {
  variant?: "purple" | "yellow";
}

export function Footer({ variant = "purple" }: FooterProps) {
  const isYellow = variant === "yellow";
  const [isVisible, setIsVisible] = useState(false);
  const [animationRun, setAnimationRun] = useState(0);
  const wasVisibleRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0]?.isIntersecting ?? false;
        if (isIntersecting && !wasVisibleRef.current) {
          setAnimationRun((run) => run + 1);
        }
        wasVisibleRef.current = isIntersecting;
        setIsVisible(isIntersecting);
      },
      { threshold: 0.5, rootMargin: "0px 0px -100px 0px" }
    );

    if (headingRef.current) {
      observer.observe(headingRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (isYellow) {
    return (
      <section className="relative w-full pt-0 pb-12 md:pb-20 flex flex-col items-center px-4 md:px-8">
        {/* Yellow Container for Developers Page */}
        <div
          ref={containerRef}
          className="footer-bounds relative w-full max-w-[1600px] bg-[#FFFF1A] rounded-[24px] md:rounded-[32px] shadow-2xl pt-16 pb-48 md:pt-20 md:pb-64 px-8 md:px-12 mx-auto text-black min-h-[400px] md:min-h-[500px]"
        >
          {/* Top Center Tab in Yellow */}
          <div className="absolute -top-8 md:-top-10 left-1/2 -translate-x-1/2 w-48 md:w-64 h-8 md:h-10 bg-[#FFFF1A] flex items-center justify-center">
            {/* Left slanted wing */}
            <svg
              className="absolute top-0 left-[-48px] md:left-[-60px] w-[48px] md:w-[60px] h-full text-[#FFFF1A]"
              viewBox="0 0 60 40"
              fill="currentColor"
              preserveAspectRatio="none"
            >
              <path d="M 0 40 C 10 40 20 35 25 30 L 45 10 C 50 5 55 0 60 0 L 60 40 Z" />
            </svg>
            {/* Right slanted wing */}
            <svg
              className="absolute top-0 right-[-48px] md:right-[-60px] w-[48px] md:w-[60px] h-full text-[#FFFF1A]"
              viewBox="0 0 60 40"
              fill="currentColor"
              preserveAspectRatio="none"
            >
              <path d="M 60 40 C 50 40 40 35 35 30 L 15 10 C 10 5 5 0 0 0 L 0 40 Z" />
            </svg>
          </div>

          {/* Bottom Cutouts */}
          <svg
            className="absolute bottom-[-1px] left-[-1px] w-[120px] md:w-[160px] h-[48px] md:h-[64px] text-[#241A4C] z-20 pointer-events-none"
            viewBox="0 0 100 60"
            fill="currentColor"
            preserveAspectRatio="none"
          >
            <path d="M 100 60 C 90 60 85 55 80 50 L 55 25 C 50 20 45 20 35 20 L 20 20 C 5 20 0 10 0 0 L 0 60 Z" />
          </svg>
          <svg
            className="absolute bottom-[-1px] right-[-1px] w-[120px] md:w-[160px] h-[48px] md:h-[64px] text-[#241A4C] z-20 pointer-events-none"
            viewBox="0 0 100 60"
            fill="currentColor"
            preserveAspectRatio="none"
          >
            <path d="M 0 60 C 10 60 15 55 20 50 L 45 25 C 50 20 55 20 65 20 L 80 20 C 95 20 100 10 100 0 L 100 60 Z" />
          </svg>

          {/* Top Center PhysicsText Spawn Point */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none hidden md:flex justify-center w-full">
            <div ref={headingRef}>
              <PhysicsText key={animationRun} startTrigger={isVisible} />
            </div>
          </div>

          {/* Content Layout */}
          <div className="relative z-10 flex flex-col md:flex-row justify-between w-full h-full text-black">
            {/* Left Column */}
            <div className="flex flex-col md:w-1/2">
              <div>
                <h2 className="font-tantra text-3xl md:text-4xl lg:text-5xl tracking-widest uppercase mb-2">TANTRAFIESTA 2026</h2>
                <p className="text-sm md:text-base font-bold text-[#B81163]">
                  {/* THEME REVEAL: Replace this silhouette with the official theme copy. */}
                  <ThemeTeaser />
                </p>
                <div className="h-[1px] bg-black/20 w-full md:max-w-md mt-6 mb-8"></div>
              </div>

              <div>
                <h3 className="text-xs md:text-sm font-black text-black mb-4 tracking-[0.2em] uppercase">Explore</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm font-semibold max-w-[250px] text-gray-600">
                  <Link href="/" className="hover:text-black hover:underline py-1 transition-colors">Home</Link>
                  <Link href="/about" className="hover:text-black hover:underline py-1 transition-colors">About</Link>
                  <Link href="/events" className="hover:text-black hover:underline py-1 transition-colors">Events</Link>
                  <Link href="/contact" className="hover:text-black hover:underline py-1 transition-colors">How to reach?</Link>
                </div>
              </div>
            </div>

            {/* Right Column — always stacked on mobile */}
            <div className="flex flex-col w-full md:w-1/3 items-start md:items-end mt-12 md:mt-0 text-left md:text-right">
              {/* Mobile Separator */}
              <div className="h-[1px] bg-black/20 w-full mb-8 md:hidden"></div>

              {/* Get in Touch */}
              <div className="w-full md:w-auto">
                <h3 className="text-xs md:text-sm font-black text-black mb-4 tracking-[0.2em] uppercase">Get in touch</h3>
                <div className="flex flex-col gap-2 text-sm font-bold">
                  <a href="mailto:support@tantrafiesta.in" className="hover:underline break-all">support@tantrafiesta.in</a>
                  <a href="tel:+918604551326" className="hover:underline">+91 86045 51326</a>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex gap-3 mt-6 justify-start md:justify-end relative z-30">
                <a
                  href="https://www.instagram.com/tantrafiesta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 border border-black/30 rounded flex items-center justify-center hover:bg-black/5 transition-colors group"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black group-hover:scale-110 transition-transform"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/tantrafiesta-iiitn/home/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 border border-black/30 rounded flex items-center justify-center hover:bg-black/5 transition-colors group"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black group-hover:scale-110 transition-transform"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>

              {/* Meet Our Developers Button */}
              <div className="z-30 pointer-events-auto mt-4 md:mt-24">
                <Link
                  href="/developers"
                  className="inline-block bg-[#241A4C] border-[1.5px] border-[#db3d79] text-[#f7b2c9] font-bold text-[11px] sm:text-xs px-3.5 py-1.5 rounded-[10px] hover:bg-[#2b1f5e] hover:border-[#f7b2c9] transition-all duration-200 shadow-md active:scale-[0.97] whitespace-nowrap"
                >
                  Meet Our Developers
                </Link>
              </div>
            </div>
          </div>

          {/* Center Character Image */}
          <HoverTilt className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[160px] xs:w-[190px] sm:w-[250px] md:w-[350px] lg:w-[400px] z-10 pointer-events-auto flex flex-col items-center" rotationIntensity={10} scaleIntensity={1.03}>
            <Image
              src="/assets/Neon Cosmic Cyberpunk Robot Portrait.webp"
              alt="Neon cosmic cyberpunk robot mascot"
              width={1100}
              height={1430}
              className="w-full h-auto object-contain drop-shadow-2xl"
              loading="lazy"
              data-mascot
            />
          </HoverTilt>
        </div>
      </section>
    );
  }

  // Original Purple Variant for Landing Page
  return (
    <section className="relative w-full pt-0 pb-12 md:pb-20 flex flex-col items-center px-4 md:px-8">

      {/* Bottom half of Yellow Container */}
      <div className="relative w-full max-w-[1600px] bg-[#FFFF1A] rounded-b-[32px] md:rounded-b-[48px] px-2 md:px-8 pt-12 md:pt-16 pb-4 md:pb-8">

        {/* Purple Inner Container */}
        {/* Below md the mascot sits in normal flow, so no bottom padding is
            reserved for it. From md up it goes back to absolute centering and
            pb-64 is what keeps the content clear of it. */}
        <div ref={containerRef} className="footer-bounds relative w-full bg-[#2b1f5e] rounded-[24px] md:rounded-[32px] shadow-inner pt-16 pb-0 md:pt-20 md:pb-64 px-8 md:px-12 mx-auto text-white min-h-[400px] md:min-h-[500px]">

          {/* Top Center Tab */}
          <div className="absolute -top-8 md:-top-10 left-1/2 -translate-x-1/2 w-48 md:w-64 h-8 md:h-10 bg-[#2b1f5e] flex items-center justify-center">
            {/* Left slanted wing */}
            <svg className="absolute top-0 left-[-48px] md:left-[-60px] w-[48px] md:w-[60px] h-full text-[#2b1f5e]" viewBox="0 0 60 40" fill="currentColor" preserveAspectRatio="none">
              <path d="M 0 40 C 10 40 20 35 25 30 L 45 10 C 50 5 55 0 60 0 L 60 40 Z" />
            </svg>
            {/* Right slanted wing */}
            <svg className="absolute top-0 right-[-48px] md:right-[-60px] w-[48px] md:w-[60px] h-full text-[#2b1f5e]" viewBox="0 0 60 40" fill="currentColor" preserveAspectRatio="none">
              <path d="M 60 40 C 50 40 40 35 35 30 L 15 10 C 10 5 5 0 0 0 L 0 40 Z" />
            </svg>
          </div>

          {/* Bottom Cutouts (Cyberpunk slanted chamfers matching yellow bg) */}
          <svg className="absolute bottom-[-1px] left-[-1px] w-[120px] md:w-[160px] h-[48px] md:h-[64px] text-[#FFFF1A] z-20 pointer-events-none" viewBox="0 0 100 60" fill="currentColor" preserveAspectRatio="none">
            <path d="M 100 60 C 90 60 85 55 80 50 L 55 25 C 50 20 45 20 35 20 L 20 20 C 5 20 0 10 0 0 L 0 60 Z" />
          </svg>
          <svg className="absolute bottom-[-1px] right-[-1px] w-[120px] md:w-[160px] h-[48px] md:h-[64px] text-[#FFFF1A] z-20 pointer-events-none" viewBox="0 0 100 60" fill="currentColor" preserveAspectRatio="none">
            <path d="M 0 60 C 10 60 15 55 20 50 L 45 25 C 50 20 55 20 65 20 L 80 20 C 95 20 100 10 100 0 L 100 60 Z" />
          </svg>

          {/* Top Center PhysicsText Spawn Point */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none hidden md:flex justify-center w-full">
            <div ref={headingRef}>
              <PhysicsText key={animationRun} startTrigger={isVisible} />
            </div>
          </div>

          {/* Content Layout */}
          <div className="relative z-10 flex flex-col md:flex-row justify-between w-full h-full text-white">

            {/* Left Column */}
            <div className="flex flex-col md:w-1/2">
              <div>
                <h2 className="font-tantra text-3xl md:text-4xl lg:text-5xl tracking-widest uppercase mb-2">TANTRAFIESTA 2026</h2>
                <p className="text-sm md:text-base font-bold text-[#F44383]">
                  {/* THEME REVEAL: Replace this silhouette with the official theme copy. */}
                  <ThemeTeaser />
                </p>
                <div className="h-[1px] bg-white/20 w-full md:max-w-md mt-6 mb-8"></div>
              </div>

              <div>
                <h3 className="text-xs md:text-sm font-black text-[#FFFF1A] mb-4 tracking-[0.2em] uppercase">Explore</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm font-semibold max-w-[250px] text-gray-300">
                  <Link href="/" className="hover:text-white hover:underline py-1 transition-colors">Home</Link>
                  <Link href="/about" className="hover:text-white hover:underline py-1 transition-colors">About</Link>
                  <Link href="/events" className="hover:text-white hover:underline py-1 transition-colors">Events</Link>
                  <Link href="/contact" className="hover:text-white hover:underline py-1 transition-colors">How to reach?</Link>
                </div>
              </div>
            </div>

            {/* Right Column — always stacked, never side-by-side on mobile */}
            <div className="flex flex-col w-full md:w-1/3 items-start md:items-end mt-12 md:mt-0 text-left md:text-right">
              {/* Mobile Separator */}
              <div className="h-[1px] bg-white/20 w-full mb-8 md:hidden"></div>

              {/* Get in Touch */}
              <div className="w-full md:w-auto">
                <h3 className="text-xs md:text-sm font-black text-[#FFFF1A] mb-4 tracking-[0.2em] uppercase">Get in touch</h3>
                <div className="flex flex-col gap-2 text-sm font-bold">
                  <a href="mailto:support@tantrafiesta.in" className="hover:underline break-all">support@tantrafiesta.in</a>
                  <a href="tel:+918604551326" className="hover:underline">+91 86045 51326</a>
                </div>
              </div>

              {/* Social Icons — stacked below contact, high z-index to stay above mascot */}
              <div className="flex gap-3 mt-6 justify-start md:justify-end relative z-30">
                <a
                  href="https://www.instagram.com/tantrafiesta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 border border-white/30 rounded flex items-center justify-center hover:bg-white/10 transition-colors group"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FFFF1A] group-hover:scale-110 transition-transform"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/tantrafiesta-iiitn/home/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 border border-white/30 rounded flex items-center justify-center hover:bg-white/10 transition-colors group"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FFFF1A] group-hover:scale-110 transition-transform"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>

              {/* Meet Our Developers Button — always on its own row */}
              <div className="z-30 pointer-events-auto mt-4 md:mt-24">
                <Link
                  href="/developers"
                  className="inline-block bg-[#241A4C] border-[1.5px] border-[#db3d79] text-[#f7b2c9] font-bold text-[11px] sm:text-xs px-3.5 py-1.5 rounded-[10px] hover:bg-[#2b1f5e] hover:border-[#f7b2c9] transition-all duration-200 shadow-md active:scale-[0.97] whitespace-nowrap"
                >
                  Meet Our Developers
                </Link>
              </div>
            </div>

          </div>

          {/* Center Character Image. In flow (and so unable to overlap the
              contact column) until md, absolutely centered on the container
              bottom from md up. The art is a bust crop, so sitting flush with
              the bottom edge is intentional. */}
          <HoverTilt className="relative mx-auto mt-10 w-[180px] sm:w-[240px] md:absolute md:bottom-0 md:left-1/2 md:-translate-x-1/2 md:mt-0 md:w-[350px] lg:w-[400px] z-10 pointer-events-auto flex flex-col items-center" rotationIntensity={10} scaleIntensity={1.03}>
            <Image
              src="/assets/Neon Cosmic Cyberpunk Robot Portrait.webp"
              alt="Neon cosmic cyberpunk robot mascot"
              width={1100}
              height={1430}
              className="w-full h-auto object-contain drop-shadow-2xl"
              loading="lazy"
              data-mascot
            />
          </HoverTilt>

        </div>
      </div>
    </section>
  );
}
