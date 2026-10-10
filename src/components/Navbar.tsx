"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MobileBottomNav } from "./MobileBottomNav";

const navigation = [
  { href: "/about", label: "About" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/events", label: "Events" },
  { href: "/speakers", label: "Speakers" },
];

interface NavbarProps {
  variant?: "default" | "events";
  currentPath?: string;
  registrationHref?: string;
}

export function Navbar({
  currentPath,
  registrationHref = "/register",
}: NavbarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If at the top, always show
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Placeholder to preserve layout on desktop when navbar becomes fixed */}
      <div className="hidden h-[72px] md:block" />

      <nav
        aria-label="Main navigation"
        className={`relative z-30 mx-auto flex w-full items-center justify-between gap-4 px-4 min-[360px]:px-6 py-4 text-white lg:px-12 md:fixed md:left-0 md:right-0 md:top-0 md:z-50 md:w-full md:rounded-2xl transition-transform duration-300 ${
          isVisible ? "md:translate-y-0" : "md:-translate-y-[150%]"
        }`}
      >
        {/* Desktop/Tablet Background (Hidden on mobile) */}
        <div
          className="absolute inset-0 -z-10 hidden rounded-2xl shadow-2xl shadow-black/50 md:block"
          style={{
            background:
              "linear-gradient(to top, rgba(26, 18, 80, 0.98), rgba(26, 18, 80, 0.92))",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        />

        {/* ── Logo ── */}
        <Link
          href="/"
          aria-label="TantraFiesta home"
          className="flex shrink-0 items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#ffe43b]"
        >
          <Image
            src="/assets/tf_logo.png"
            alt=""
            width={48}
            height={48}
            className="h-10 w-10 object-contain"
          />
          <Image
            src="/assets/tf_nav.png"
            alt="TantraFiesta"
            width={320}
            height={40}
            className="hidden h-6 w-auto object-contain sm:block lg:h-7"
          />
        </Link>

        {/* ── Desktop links ── */}
        <div className="hidden items-center gap-3 text-xs font-bold uppercase tracking-wider text-white md:flex lg:gap-6 lg:text-sm">
          {navigation.map(({ href, label }) => {
            const isActive = currentPath === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-sm transition-colors hover:text-[#FFFF1A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffe43b] ${
                  isActive ? "text-[#FFFF1A]" : ""
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href={registrationHref}
            className="whitespace-nowrap bg-[#E7137D] px-5 py-2 text-white transition-colors hover:bg-[#c60f69] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffe43b]"
          >
            Register Now
          </Link>
        </div>
      </nav>

      {/* ── Mobile bottom navigation (replaces old hamburger) ── */}
      <MobileBottomNav
        currentPath={currentPath}
        registrationHref={registrationHref}
      />
    </>
  );
}

