"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PhysicsText } from "./PhysicsText";

interface FooterProps {
  variant?: "purple" | "yellow";
}

export function Footer({ variant = "purple" }: FooterProps) {
  const isYellow = variant === "yellow";
  const headingText = "TANTRAFIESTA 2026";
  const [isVisible, setIsVisible] = useState(false);
  const [fallDistance, setFallDistance] = useState(300);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (containerRef.current && headingRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const headingRect = headingRef.current.getBoundingClientRect();
      const dist = containerRect.bottom - headingRect.bottom - 48; 
      setFallDistance(dist);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
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

          {/* Bottom Cutouts (Cyberpunk slanted chamfers cut into yellow container matching #241A4C page bg) */}
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

          {/* Content Layout */}
          <div className="relative z-10 flex flex-col md:flex-row justify-between w-full h-full text-black">
            {/* Left Column */}
            <div className="flex flex-col gap-10 md:w-1/3">
              <div>
                <div ref={headingRef} className="relative z-50 min-h-[48px]">
                  <PhysicsText startTrigger={isVisible} />
                </div>
                <p className="text-xs md:text-sm font-medium mt-1 relative z-10 text-[#F44383]">
                  ANANTA: Surpassing the Possible
                </p>
              </div>

              <div>
                <h3 className="text-sm md:text-base font-bold text-black mb-3">Quick Links</h3>
                <div className="flex flex-wrap gap-4 text-xs md:text-sm font-semibold text-black">
                  <Link href="/" className="hover:underline">Home</Link>
                  <Link href="/about" className="hover:underline">About</Link>
                  <Link href="/events" className="hover:underline">Events</Link>
                  <Link href="/contact" className="hover:underline">How to reach?</Link>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-10 md:w-1/3 md:items-end mt-12 md:mt-0">
              {/* Social Icons */}
              <div className="flex gap-2">
                <a
                  href="#"
                  className="w-6 h-6 md:w-8 md:h-8 bg-[#8B4513] rounded flex items-center justify-center text-white hover:bg-[#A0522D] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a
                  href="#"
                  className="w-6 h-6 md:w-8 md:h-8 bg-[#8B4513] rounded flex items-center justify-center text-white hover:bg-[#A0522D] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </a>
                <a
                  href="#"
                  className="w-6 h-6 md:w-8 md:h-8 bg-[#8B4513] rounded flex items-center justify-center text-white hover:bg-[#A0522D] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>

              <div className="md:text-right">
                <h3 className="text-sm md:text-base font-bold text-black mb-3">Contact Us</h3>
                <div className="flex flex-col gap-1 text-xs md:text-sm font-semibold text-black">
                  <a href="mailto:support@tantrafiesta.in" className="hover:underline">support@tantrafiesta.in</a>
                  <a href="tel:+919992233445" className="hover:underline">+91 99922-33445</a>
                </div>
              </div>
            </div>
          </div>

          {/* Center Character Image */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[240px] sm:w-[300px] md:w-[400px] z-20 pointer-events-none flex flex-col items-center">
            <Image
              src="/assets/distorted_gurl.png"
              alt="Cyberpunk Mascot"
              width={500}
              height={500}
              className="w-full h-auto object-contain drop-shadow-2xl"
              priority
            />
          </div>

          {/* Meet Our Developers Button */}
          <Link 
            href="/developers" 
            className="absolute bottom-8 right-8 md:bottom-12 md:right-16 z-30 pointer-events-auto bg-[#F44383] text-white font-bold text-[10px] md:text-xs px-4 md:px-6 py-2 md:py-2.5 rounded-md shadow-lg hover:bg-[#d8356f] hover:scale-105 transition-transform tracking-wide"
            style={{ fontFamily: '"Futura PT", sans-serif', wordSpacing: "0.15em" }}
          >
            Meet Our Developers
          </Link>
        </div>
      </section>
    );
  }

  // Original Purple Variant for Landing Page
  return (
    <section className="relative w-full bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat pt-0 pb-12 md:pb-20 flex flex-col items-center px-4 md:px-8">
      
      {/* Bottom half of Yellow Container */}
      <div className="relative w-full max-w-[1600px] bg-[#FFFF1A] rounded-b-[32px] md:rounded-b-[48px] px-2 md:px-8 pt-12 md:pt-16 pb-4 md:pb-8 shadow-2xl">

        {/* Purple Inner Container */}
        <div ref={containerRef} className="footer-bounds relative w-full bg-[#2b1f5e] rounded-[24px] md:rounded-[32px] shadow-inner pt-16 pb-48 md:pt-20 md:pb-64 px-8 md:px-12 mx-auto text-white min-h-[400px] md:min-h-[500px]">
          
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

          {/* Content Layout */}
          <div className="relative z-10 flex flex-col md:flex-row justify-between w-full h-full text-white">
            
            {/* Left Column */}
            <div className="flex flex-col gap-10 md:w-1/3">
              <div>
                <div ref={headingRef} className="relative z-50 min-h-[48px]">
                  <PhysicsText startTrigger={isVisible} />
                </div>
                <p className="text-xs md:text-sm font-medium mt-1 relative z-10 text-[#F44383]">
                  ANANTA: Surpassing the Possible
                </p>
              </div>

              <div>
                <h3 className="text-sm md:text-base font-bold text-[#FFFF1A] mb-3">Quick Links</h3>
                <div className="flex flex-wrap gap-4 text-xs md:text-sm font-semibold">
                  <Link href="/" className="hover:underline">Home</Link>
                  <Link href="/about" className="hover:underline">About</Link>
                  <Link href="/events" className="hover:underline">Events</Link>
                  <Link href="/contact" className="hover:underline">How to reach?</Link>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-10 md:w-1/3 md:items-end mt-12 md:mt-0">
              {/* Social Icons */}
              <div className="flex gap-2">
                <a href="#" className="w-6 h-6 md:w-8 md:h-8 bg-[#8B4513] rounded flex items-center justify-center text-white hover:bg-[#A0522D] transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" className="w-6 h-6 md:w-8 md:h-8 bg-[#8B4513] rounded flex items-center justify-center text-white hover:bg-[#A0522D] transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </a>
                <a href="#" className="w-6 h-6 md:w-8 md:h-8 bg-[#8B4513] rounded flex items-center justify-center text-white hover:bg-[#A0522D] transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>

              <div className="md:text-right">
                <h3 className="text-sm md:text-base font-bold text-[#FFFF1A] mb-3">Contact Us</h3>
                <div className="flex flex-col gap-1 text-xs md:text-sm font-semibold">
                  <a href="mailto:support@tantrafiesta.in" className="hover:underline">support@tantrafiesta.in</a>
                  <a href="tel:+919992233445" className="hover:underline">+91 99922-33445</a>
                </div>
              </div>
            </div>

          </div>

          {/* Center Character Image */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[240px] sm:w-[300px] md:w-[400px] z-20 pointer-events-none flex flex-col items-center">
            <Image
              src="/assets/distorted_gurl.png"
              alt="Cyberpunk Mascot"
              width={500}
              height={500}
              className="w-full h-auto object-contain drop-shadow-2xl"
              priority
            />
          </div>

          {/* Meet Our Developers Button */}
          <Link 
            href="/developers" 
            className="absolute bottom-8 right-8 md:bottom-12 md:right-16 z-30 pointer-events-auto bg-[#F44383] text-white font-bold text-[10px] md:text-xs px-4 md:px-6 py-2 md:py-2.5 rounded-md shadow-lg hover:bg-[#d8356f] hover:scale-105 transition-transform tracking-wide"
            style={{ fontFamily: '"Futura PT", sans-serif', wordSpacing: "0.15em" }}
          >
            Meet Our Developers
          </Link>

        </div>
      </div>
    </section>
  );
}
