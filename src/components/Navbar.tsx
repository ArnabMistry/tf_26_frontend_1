"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useParticipant } from "@/components/auth/ParticipantSession";
import { PortalNav } from "@/components/portal/PortalNav";

const navigation = [
  { href: "/admin", label: "Admin" },
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const { user } = useParticipant();
  const isAdmin = user?.role === "super" || user?.role === "event_admin";

  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) return;
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  // Handle escape key and body scroll lock for mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Placeholder to preserve layout on desktop when navbar becomes fixed */}
      <div className="hidden h-[88px] md:block" />

      <nav
        aria-label="Main navigation"
        className={`sticky top-0 z-40 mx-auto flex w-full items-center justify-between gap-3 px-4 min-[360px]:px-6 py-3.5 text-white transition-transform duration-300 md:fixed md:left-4 md:right-4 md:top-3 md:z-50 md:w-auto md:rounded-2xl lg:left-8 lg:right-8 lg:px-12 ${
          isVisible || isMobileMenuOpen ? "translate-y-0" : "-translate-y-full md:-translate-y-[150%]"
        }`}
      >
        {/* Background styling for both desktop and mobile */}
        <div
          className="absolute inset-0 -z-10 shadow-2xl shadow-black/50 md:rounded-2xl"
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
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex shrink-0 items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#ffe43b]"
        >
          <Image
            src="/assets/tf_logo.webp"
            alt=""
            width={48}
            height={48}
            className="h-9 w-9 min-[360px]:h-10 min-[360px]:w-10 object-contain"
          />
          <Image
            src="/assets/tf_nav.webp"
            alt="TantraFiesta"
            width={320}
            height={40}
            className="hidden h-6 w-auto object-contain xl:block lg:h-7"
          />
        </Link>

        {/* ── Desktop links ── */}
        <div className="hidden items-center gap-3 text-xs font-bold uppercase tracking-wider text-white md:flex md:ml-auto lg:gap-4 lg:text-sm">
          {navigation
            .filter(({ href }) => href !== "/admin" || isAdmin)
            .map(({ href, label }) => {
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
          {!user && (
            <Link
              href={registrationHref}
              className="whitespace-nowrap bg-[#E7137D] px-5 py-2 text-white transition-colors hover:bg-[#c60f69] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffe43b]"
            >
              Register Now
            </Link>
          )}
        </div>

        {/* ── Right side controls: PortalNav + Mobile Menu Button ── */}
        <div className={`flex items-center gap-2 ${!user ? "md:hidden" : ""}`}>
          <PortalNav />

          {/* Mobile menu toggle button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffe43b] md:hidden active:scale-95"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {isMobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* ── Mobile menu overlay & dropdown layout ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
              className="fixed inset-x-3 top-[68px] z-50 flex max-h-[calc(100svh-84px)] flex-col overflow-y-auto rounded-2xl border border-white/15 p-4 shadow-2xl md:hidden"
              style={{
                background:
                  "linear-gradient(180deg, rgba(30, 20, 90, 0.98) 0%, rgba(18, 12, 58, 0.99) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              {/* Navigation items */}
              <div className="flex flex-col gap-1.5">
                {navigation
                  .filter(({ href }) => href !== "/admin" || isAdmin)
                  .map(({ href, label }) => {
                    const isActive = currentPath === href;
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                          isActive
                            ? "border border-[#FFFF1A]/40 bg-[#FFFF1A]/15 text-[#FFFF1A]"
                            : "text-[#e0dce8] hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span>{label}</span>
                        {isActive && (
                          <span className="h-2 w-2 rounded-full bg-[#FFFF1A] shadow-[0_0_8px_#FFFF1A]" />
                        )}
                      </Link>
                    );
                  })}
              </div>

              <div className="my-3 h-px w-full bg-white/10" />

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                {user ? (
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#ffe43b] px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-[#241A4C] transition-all hover:brightness-105 active:scale-[0.98]"
                  >
                    My Portal
                  </Link>
                ) : (
                  <>
                    <Link
                      href={registrationHref}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#E7137D] px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#c60f69] active:scale-[0.98]"
                    >
                      Register Now
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-[#e0dce8] transition-colors hover:bg-white/10 hover:text-white"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
