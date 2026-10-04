"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const headingText = "TANTRAFIESTA 2026";
  const [isVisible, setIsVisible] = useState(false);
  const [fallDistance, setFallDistance] = useState(400);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (containerRef.current && headingRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const headingRect = headingRef.current.getBoundingClientRect();
      // Drop distance: from bottom of the text to the bottom of the yellow container, minus some padding
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

  return (
    <section className="relative w-full bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat pt-32 pb-16 px-4 md:px-12 overflow-hidden flex flex-col items-center">
      
      {/* Yellow Container */}
      <div ref={containerRef} className="relative w-full max-w-6xl min-h-[500px] md:min-h-[600px] bg-[#FFFF1A] rounded-[32px] md:rounded-[48px] shadow-2xl pt-16 pb-48 md:pt-24 md:pb-64 px-8 md:px-16 mx-auto mt-12">
        
        {/* Top Center Tab */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-12 bg-[#FFFF1A] rounded-t-3xl flex items-center justify-center">
          <svg className="absolute top-0 left-[-30px] w-[30px] h-full text-[#FFFF1A]" viewBox="0 0 30 48" fill="currentColor">
            <path d="M30,48 V0 C30,26 13.4,48 0,48 Z" />
          </svg>
          <svg className="absolute top-0 right-[-30px] w-[30px] h-full text-[#FFFF1A]" viewBox="0 0 30 48" fill="currentColor">
            <path d="M0,48 V0 C0,26 16.6,48 30,48 Z" />
          </svg>
        </div>

        {/* Bottom Cutouts (Fake using absolute shapes matching bg) */}
        <div className="absolute -bottom-1 left-8 w-16 h-4 bg-[#241A4C] rounded-t-xl z-20"></div>
        <div className="absolute -bottom-1 right-8 w-16 h-4 bg-[#241A4C] rounded-t-xl z-20"></div>

        {/* Content Layout */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between w-full h-full text-black">
          
          {/* Left Column */}
          <div className="flex flex-col gap-12 md:w-1/3">
            <div>
              <h2 ref={headingRef} className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight flex flex-wrap">
                {headingText.split("").map((char, idx) => {
                  const randomRotation = (Math.random() - 0.5) * 120; // random between -60 and 60
                  return (
                    <span
                      key={idx}
                      className={`inline-block origin-center ${isVisible ? "animate-fall-to-bottom" : ""}`}
                      style={{
                        animationDelay: `${idx * 0.12}s`,
                        "--fall-rotation": `${randomRotation}deg`,
                        "--fall-distance": `${fallDistance}px`
                      } as React.CSSProperties}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  );
                })}
              </h2>
              <p className="text-sm md:text-base font-medium mt-1 relative z-10 bg-[#FFFF1A]">
                ANANTA: Surpassing the Possible
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-3">Quick Links</h3>
              <div className="flex flex-wrap gap-4 text-sm font-semibold">
                <Link href="/" className="hover:underline">Home</Link>
                <Link href="/about" className="hover:underline">About</Link>
                <Link href="/events" className="hover:underline">Events</Link>
                <Link href="/contact" className="hover:underline">How to reach?</Link>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-12 md:w-1/3 md:items-end mt-12 md:mt-0">
            {/* Social Icons */}
            <div className="flex gap-2">
              <a href="#" className="w-8 h-8 bg-[#8B4513] rounded flex items-center justify-center text-white hover:bg-[#A0522D] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-8 h-8 bg-[#8B4513] rounded flex items-center justify-center text-white hover:bg-[#A0522D] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </a>
              <a href="#" className="w-8 h-8 bg-[#8B4513] rounded flex items-center justify-center text-white hover:bg-[#A0522D] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>

            <div className="md:text-right">
              <h3 className="text-lg font-bold mb-3">Contact Us</h3>
              <div className="flex flex-col gap-1 text-sm font-semibold">
                <a href="mailto:support@tantrafiesta.in" className="hover:underline">support@tantrafiesta.in</a>
                <a href="tel:+919992233445" className="hover:underline">+91 99922-33445</a>
              </div>
            </div>
          </div>

        </div>

        {/* Center Character Image */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[280px] sm:w-[350px] md:w-[450px] lg:w-[500px] z-20 pointer-events-none flex flex-col items-center">
          <Image
            src="/assets/distorted_gurl.png"
            alt="Cyberpunk Mascot"
            width={600}
            height={600}
            className="w-full h-auto object-contain drop-shadow-2xl"
            priority
          />
          {/* Meet Our Developers Button */}
          <Link 
            href="/developers" 
            className="absolute bottom-6 md:bottom-8 pointer-events-auto bg-[#F44383] text-white font-bold text-sm md:text-base px-6 py-2.5 rounded-full shadow-lg hover:bg-[#d8356f] hover:scale-105 transition-transform"
          >
            Meet Our Developers
          </Link>
        </div>

      </div>
    </section>
  );
}
