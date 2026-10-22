"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useParticipant } from "@/components/auth/ParticipantSession";
import { PortalNav } from "@/components/portal/PortalNav";
import { MobileBottomNav } from "./MobileBottomNav";

interface DropdownItem {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const primaryNav = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/speakers", label: "Speakers" },
  { href: "/merch", label: "Merch" },
];

const dropdownItems: DropdownItem[] = [
  {
    href: "/sponsors",
    label: "Sponsors",
    description: "Our partners",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform duration-200 group-hover:scale-110"
      >
        <path d="m11 17 2 2a1 1 0 0 0 1.4 0l6.6-6.6a1 1 0 0 0 0-1.4l-4-4a1 1 0 0 0-1.4 0L13 9.6" />
        <path d="m14 12 1.5-1.5" />
        <path d="M2.5 11 6.8 6.7a1 1 0 0 1 1.4 0l3 3a1 1 0 0 1 0 1.4L7 15.3a1 1 0 0 1-1.4 0L2.5 12.4a1 1 0 0 1 0-1.4Z" />
        <path d="m15.5 5.5 2.5-2.5a1 1 0 0 1 1.4 0l2.1 2.1a1 1 0 0 1 0 1.4L18.5 9.5" />
        <path d="m2 14.5 3 3" />
      </svg>
    ),
  },
  {
    href: "/teams",
    label: "Teams",
    description: "Meet the crew",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform duration-200 group-hover:scale-110"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const lastScrollY = useRef(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();
  const activePath = currentPath || pathname || "";
  const { user } = useParticipant();
  const isAdmin = user?.role === "super" || user?.role === "event_admin";

  const isItemActive = (href: string) => {
    if (href === activePath) return true;
    if (href !== "/" && activePath.startsWith(href)) return true;
    return false;
  };

  const isDropdownActive = dropdownItems.some((item) =>
    isItemActive(item.href)
  );

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down
        setIsVisible(false);
        setIsDropdownOpen(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Placeholder to preserve layout on desktop when navbar becomes fixed */}
      <div className="hidden h-[88px] md:block" />

      <nav
        aria-label="Main navigation"
        className={`relative z-30 mx-auto flex w-full items-center justify-between gap-4 px-4 min-[360px]:px-6 py-4 text-white lg:px-12 md:fixed md:left-4 md:right-4 md:top-3 md:z-50 md:w-auto md:rounded-2xl lg:left-8 lg:right-8 transition-transform duration-300 ${
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
            src="/assets/tf_logo.webp"
            alt=""
            width={48}
            height={48}
            className="h-10 w-10 object-contain"
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
        <div className="hidden items-center gap-4 text-xs font-bold uppercase tracking-wider text-white md:flex md:ml-auto lg:gap-6 lg:text-sm">
          {/* Admin link (visible only to admin users, kept directly at top level) */}
          {isAdmin && (
            <Link
              href="/admin"
              aria-current={isItemActive("/admin") ? "page" : undefined}
              className={`rounded-sm transition-colors hover:text-[#FFFF1A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffe43b] ${
                isItemActive("/admin") ? "text-[#FFFF1A]" : ""
              }`}
            >
              Admin
            </Link>
          )}

          {primaryNav.map(({ href, label }) => {
            const isActive = isItemActive(href);
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

          {/* ── More Dropdown ── */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              aria-label="More navigation links"
              className={`flex items-center gap-1.5 rounded-sm py-1 font-sans text-xs font-bold uppercase tracking-wider lg:text-sm transition-colors hover:text-[#FFFF1A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffe43b] active:scale-[0.97] cursor-pointer ${
                isDropdownActive || isDropdownOpen ? "text-[#FFFF1A]" : ""
              }`}
            >
              <span className="font-sans text-xs font-bold uppercase tracking-wider lg:text-sm">More</span>
              <motion.svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="shrink-0"
              >
                <polyline points="6 9 12 15 18 9" />
              </motion.svg>
            </button>

            {/* Dropdown panel */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute left-[calc(50%-130px)] top-[calc(100%+28px)] z-50 flex w-[260px] flex-col gap-1 rounded-2xl p-2.5 shadow-2xl before:absolute before:-top-7 before:inset-x-0 before:h-7"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(30, 22, 90, 0.98) 0%, rgba(18, 12, 58, 0.99) 100%)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    boxShadow:
                      "0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(43, 31, 94, 0.4)",
                  }}
                >
                  {dropdownItems.map(({ href, label, description, icon }) => {
                    const isActive = isItemActive(href);
                    return (
                      <Link
                        key={href}
                        href={href}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => setIsDropdownOpen(false)}
                        className={`group flex items-center gap-3.5 rounded-xl p-2.5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffe43b] active:scale-[0.98] ${
                          isActive
                            ? "border border-[#FFFF1A]/40 bg-[#FFFF1A]/10 text-white"
                            : "border border-transparent hover:bg-white/[0.08] text-white"
                        }`}
                      >
                        <div
                          className={`flex size-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 ${
                            isActive
                              ? "border-[#FFFF1A]/50 bg-[#FFFF1A]/20 text-[#FFFF1A] shadow-[0_0_12px_rgba(255,255,26,0.25)]"
                              : "border-white/10 bg-white/[0.06] text-white/70 group-hover:border-white/25 group-hover:bg-white/[0.12] group-hover:text-[#FFFF1A]"
                          }`}
                        >
                          {icon}
                        </div>
                        <div className="flex flex-col text-left">
                          <span
                            className={`text-[14px] font-bold tracking-tight normal-case transition-colors duration-200 ${
                              isActive
                                ? "text-[#FFFF1A]"
                                : "text-white group-hover:text-[#FFFF1A]"
                            }`}
                          >
                            {label}
                          </span>
                          <span
                            className={`text-[12px] font-normal normal-case transition-colors duration-200 ${
                              isActive
                                ? "text-[#FFFF1A]/80"
                                : "text-[#b4afc7] group-hover:text-white/80"
                            }`}
                          >
                            {description}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!user && (
            <Link
              href={registrationHref}
              className="whitespace-nowrap bg-[#E7137D] px-5 py-2 text-white transition-colors hover:bg-[#c60f69] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffe43b]"
              {...(registrationHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              Register Now
            </Link>
          )}
        </div>
        <PortalNav />
      </nav>

      {/* ── Mobile bottom navigation ── */}
      <MobileBottomNav
        isAdmin={isAdmin}
        isLoggedIn={!!user}
        currentPath={currentPath}
        registrationHref={registrationHref}
      />
    </>
  );
}
