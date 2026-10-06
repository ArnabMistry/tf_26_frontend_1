"use client";

import Image from "next/image";

const navigation = [
  { label: "About" },
  { label: "Sponsors" },
  { label: "Events" },
  { label: "Speakers" },
];

interface NavbarProps {
  variant?: "default" | "events";
  currentPath?: string;
  registrationHref?: string;
}

export function Navbar({}: NavbarProps = {}) {
  return (
    <nav
      aria-label="Main navigation (disabled for teaser)"
      className="relative z-30 mx-auto flex w-full items-center justify-between gap-4 px-6 py-4 text-white lg:px-12 select-none"
    >
      {/* ── Logo (Disabled / Non-clickable) ── */}
      <div
        aria-label="TantraFiesta home"
        className="flex shrink-0 items-center gap-3 rounded-sm cursor-default"
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
          className="hidden h-6 w-auto object-contain sm:block md:h-7"
        />
      </div>

      {/* ── Desktop links (Disabled buttons — no hrefs, cannot be bypassed) ── */}
      <div className="hidden items-center gap-6 text-sm font-bold uppercase tracking-wider text-white md:flex">
        {navigation.map(({ label }) => (
          <button
            key={label}
            type="button"
            disabled
            aria-disabled="true"
            tabIndex={-1}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="cursor-not-allowed opacity-50 transition-none select-none text-white/70 hover:text-white/70"
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          disabled
          aria-disabled="true"
          tabIndex={-1}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="whitespace-nowrap bg-[#E7137D]/50 px-5 py-2 text-white/70 cursor-not-allowed select-none transition-none"
        >
          Register Now
        </button>
      </div>

      {/* ── Mobile menu button (Disabled — clicking does nothing) ── */}
      <div className="relative md:hidden">
        <button
          type="button"
          disabled
          aria-disabled="true"
          aria-label="Navigation disabled"
          tabIndex={-1}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="flex size-11 cursor-not-allowed items-center justify-center rounded-full border-2 border-[#ff2485]/30 bg-[#ff2485]/10 text-white/50 opacity-60"
        >
          {/* Hamburger icon */}
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
