"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

interface MobileBottomNavProps {
  currentPath?: string;
  registrationHref?: string;
}

const primaryItems = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
];

const expandedItems = [
  { href: "/sponsors", label: "Sponsors" },
  { href: "/speakers", label: "Speakers" },
];

export function MobileBottomNav({
  currentPath,
  registrationHref = "/register",
}: MobileBottomNavProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-[900] md:hidden"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* Expanded items popover — grows upward from the + button */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", damping: 24, stiffness: 300, mass: 0.8 }}
            className="absolute right-4 bottom-[calc(100%+12px)] flex flex-col items-end justify-center gap-5 rounded-2xl px-6 py-5 shadow-2xl"
            style={{
              background:
                "linear-gradient(to top, rgba(26, 18, 80, 0.98), rgba(26, 18, 80, 0.90))",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              transformOrigin: "bottom right",
            }}
          >
            {expandedItems.map((item, i) => {
              const isActive = currentPath === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: isExpanded ? i * 0.05 : 0 }}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className="block rounded-sm px-1 py-1 text-sm font-bold uppercase tracking-wider transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffe43b]"
                    style={{
                      color: isActive ? "#FFFF1A" : "#e0dce8",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.color = "#FFFF1A";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.color = "#e0dce8";
                    }}
                    onClick={() => setIsExpanded(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main bottom bar */}
      <div
        className="flex items-center justify-between gap-1 px-4 py-2.5"
        style={{
          background:
            "linear-gradient(to top, rgba(26, 18, 80, 0.98), rgba(26, 18, 80, 0.92))",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Register Now CTA */}
        <Link
          href={registrationHref}
          onClick={() => setIsExpanded(false)}
          className="shrink-0 rounded-lg bg-[#E7137D] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-[#c60f69] hover:shadow-lg hover:shadow-[#E7137D]/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffe43b] active:scale-[0.97]"
        >
          Register Now
        </Link>

        {/* ABOUT Link */}
        <Link
          href={primaryItems[0].href}
          aria-current={currentPath === primaryItems[0].href ? "page" : undefined}
          className="shrink-0 rounded-sm px-1 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffe43b] min-[360px]:text-xs"
          style={{
            color: currentPath === primaryItems[0].href ? "#FFFF1A" : "#e0dce8",
          }}
          onMouseEnter={(e) => {
            if (currentPath !== primaryItems[0].href) e.currentTarget.style.color = "#FFFF1A";
          }}
          onMouseLeave={(e) => {
            if (currentPath !== primaryItems[0].href) e.currentTarget.style.color = "#e0dce8";
          }}
          onClick={() => setIsExpanded(false)}
        >
          {primaryItems[0].label}
        </Link>

        {/* EVENTS Link */}
        <Link
          href={primaryItems[1].href}
          aria-current={currentPath === primaryItems[1].href ? "page" : undefined}
          className="shrink-0 rounded-sm px-1 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffe43b] min-[360px]:text-xs"
          style={{
            color: currentPath === primaryItems[1].href ? "#FFFF1A" : "#e0dce8",
          }}
          onMouseEnter={(e) => {
            if (currentPath !== primaryItems[1].href) e.currentTarget.style.color = "#FFFF1A";
          }}
          onMouseLeave={(e) => {
            if (currentPath !== primaryItems[1].href) e.currentTarget.style.color = "#e0dce8";
          }}
          onClick={() => setIsExpanded(false)}
        >
          {primaryItems[1].label}
        </Link>

        {/* Plus / Close button */}
        <motion.button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-label={isExpanded ? "Close navigation" : "Open navigation"}
          aria-expanded={isExpanded}
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-white transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffe43b]"
          style={{
            background: "linear-gradient(135deg, rgba(43, 31, 94, 0.95), rgba(26, 18, 80, 0.95))",
            border: "1px solid rgba(231, 19, 125, 0.4)",
            boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 0 10px rgba(231, 19, 125, 0.2)",
          }}
          whileHover={{
            scale: 1.05,
            boxShadow: "inset 0 1px 2px rgba(255, 255, 255, 0.2), 0 0 14px rgba(231, 19, 125, 0.45)",
            borderColor: "rgba(231, 19, 125, 0.6)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{ rotate: isExpanded ? 45 : 0 }}
            transition={{ type: "spring", damping: 18, stiffness: 250 }}
          >
            <line x1="8" y1="2.5" x2="8" y2="13.5" />
            <line x1="2.5" y1="8" x2="13.5" y2="8" />
          </motion.svg>
        </motion.button>
      </div>
    </nav>
  );
}
