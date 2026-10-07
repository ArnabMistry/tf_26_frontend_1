"use client";

import React, { useState } from "react";
import Link from "next/link";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Login feature will be connected to authentication backend.");
    }, 600);
  };

  const handleGoogleLogin = () => {
    alert("Google OAuth will be connected to authentication backend.");
  };

  return (
    <div className="w-full max-w-[620px]">
      <form onSubmit={handleSubmit} className="w-full">
        {/* Unified Yellow Card Shell: Matches Register card size and height identically */}
        <div className="relative w-full h-[345px] sm:h-[355px] flex flex-col justify-between">
          {/* Continuous SVG Background: Exact Figma Contour with shelf at 81.2% (y=334) */}
          <svg
            viewBox="0 0 853 411"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full -z-10 pointer-events-none drop-shadow-2xl"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 16 0
                 L 837 0
                 Q 853 0 853 16
                 L 853 318
                 Q 853 334 837 334
                 L 462 334
                 C 445 334 436 345 425 358
                 L 403 386
                 C 394 398 386 410 373 410
                 L 16 410
                 Q 0 410 0 394
                 L 0 16
                 Q 0 0 16 0
                 Z"
              fill="#FFFF1A"
            />
          </svg>

          {/* Form Fields inside Yellow Card: Spaced to match Register card proportions */}
          <div className="px-5 sm:px-7 md:px-8 pt-5 sm:pt-6 space-y-4 sm:space-y-5">
            {/* EMAIL */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-black font-extrabold text-[11px] sm:text-xs md:text-sm tracking-wider uppercase mb-1 sm:mb-1.5"
                style={{ fontFamily: "var(--font-futura)" }}
              >
                EMAIL
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-lg bg-[#FFFF1A] border-2 border-[#E7137D] text-black font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#E7137D]/50 transition-all placeholder:text-black/50"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-black font-extrabold text-[11px] sm:text-xs md:text-sm tracking-wider uppercase mb-1 sm:mb-1.5"
                style={{ fontFamily: "var(--font-futura)" }}
              >
                PASSWORD
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                required
                minLength={6}
                autoComplete="current-password"
                placeholder="(MINIMUM 6 CHARACTERS)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-lg bg-[#FFFF1A] border-2 border-[#E7137D] text-black font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#E7137D]/50 transition-all placeholder:text-black/75 placeholder:text-[9.5px] min-[360px]:placeholder:text-[10.5px] sm:placeholder:text-xs placeholder:font-bold placeholder:tracking-wider"
              />
            </div>
          </div>

          {/* Action Buttons Row: sits below the right shelf with zero overlapping yellow card */}
          <div className="pb-3.5 sm:pb-4 pl-3.5 sm:pl-5 pr-0 flex items-center justify-between">
            {/* Pink Primary Button: nestled into lower yellow tongue with 3D bottom bevel */}
            <div className="relative w-[40%] sm:w-[42%] h-11 sm:h-12 shrink-0">
              <div
                className="absolute inset-0 bg-[#730E40] rounded-l-md"
                style={{
                  clipPath: "polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)",
                  transform: "translateY(5px)",
                }}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full h-full bg-[#E7137D] text-white font-extrabold tracking-wider text-[11px] min-[360px]:text-xs sm:text-sm md:text-base uppercase flex items-center justify-center gap-1 sm:gap-2 rounded-l-md transition-all duration-150 hover:brightness-105 active:translate-y-1 disabled:opacity-70 cursor-pointer"
                style={{
                  fontFamily: "var(--font-futura)",
                  clipPath: "polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)",
                }}
              >
                <span>{isLoading ? "..." : "CONTINUE"}</span>
                <span className="text-sm sm:text-base md:text-lg leading-none">↗</span>
              </button>
            </div>

            {/* Google OAuth Button: sits in cutout notch flush with right edge with pink border on all edges */}
            <div
              className="relative w-[54%] sm:w-[53%] h-11 sm:h-12 bg-[#E7137D] rounded-r-lg p-[2px] shrink-0"
              style={{
                clipPath: "polygon(14px 0, 100% 0, 100% 100%, 0 100%)",
              }}
            >
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full h-full bg-[#181135] text-white font-bold text-[8px] min-[360px]:text-[9px] min-[420px]:text-[10.5px] sm:text-xs md:text-sm uppercase tracking-tight sm:tracking-wider flex items-center justify-center transition-colors duration-150 hover:bg-[#22184b] cursor-pointer rounded-r-[6px] px-1 sm:px-2"
                style={{
                  fontFamily: "var(--font-futura)",
                  clipPath: "polygon(13px 0, 100% 0, 100% 100%, 0 100%)",
                }}
              >
                <span>CONTINUE WITH GOOGLE</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Switch Link below the card */}
      <div
        className="mt-4 sm:mt-5 text-[11px] sm:text-xs md:text-sm uppercase tracking-wider text-[#A49FBD] font-bold text-left"
        style={{ fontFamily: "var(--font-futura)" }}
      >
        <span>DON&apos;T HAVE AN ACCOUNT? </span>
        <Link
          href="/register"
          className="text-[#E7137D] hover:underline underline-offset-4 ml-1 font-extrabold transition-colors hover:text-[#fa2773]"
        >
          REGISTER HERE
        </Link>
      </div>
    </div>
  );
}

