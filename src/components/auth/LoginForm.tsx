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
    <div className="w-full max-w-[700px]">
      <form onSubmit={handleSubmit} className="w-full">
        {/* Unified Yellow Card Shell: Matches Register card size and height identically */}
        <div className="relative w-full h-[355px] sm:h-[370px] md:h-[385px] flex flex-col justify-between">
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
          <div className="px-6 sm:px-8 md:px-9 pt-5 sm:pt-6 space-y-4 sm:space-y-5 md:space-y-6">
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
                className="w-full h-10.5 sm:h-11 md:h-12 px-3.5 sm:px-4 rounded-lg bg-[#FFFF1A] border-2 border-[#E7137D] text-black font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#E7137D]/50 transition-all placeholder:text-black/50"
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
                className="w-full h-10.5 sm:h-11 md:h-12 px-3.5 sm:px-4 rounded-lg bg-[#FFFF1A] border-2 border-[#E7137D] text-black font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#E7137D]/50 transition-all placeholder:text-black/75 placeholder:text-[9.5px] min-[360px]:placeholder:text-[10.5px] sm:placeholder:text-xs placeholder:font-bold placeholder:tracking-wider"
              />
            </div>
          </div>

          {/* Action Buttons Row: sits below the right shelf with zero overlapping yellow card */}
          <div className="pb-2.5 sm:pb-3 md:pb-3.5 pl-4 sm:pl-6 pr-0 flex items-center justify-between">
            {/* Pink Primary Button: nestled into lower yellow tongue with 3D bottom bevel */}
            <div className="relative w-[42%] sm:w-[43%] h-11 sm:h-12 md:h-12.5 shrink-0">
              {/* 3D Bottom Shadow */}
              <div className="absolute inset-0 translate-y-[5px] pointer-events-none">
                <svg
                  viewBox="0 0 300 50"
                  preserveAspectRatio="none"
                  className="w-full h-full fill-[#730E40]"
                  aria-hidden="true"
                >
                  <path d="M 0 10 Q 0 0 10 0 L 275 0 Q 293 0 289 10 L 276 40 Q 271 50 257 50 L 10 50 Q 0 50 0 40 Z" />
                </svg>
              </div>

              {/* Button Face */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full h-full text-white font-extrabold tracking-wider text-[11px] min-[360px]:text-xs sm:text-sm md:text-base uppercase flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-150 active:translate-y-1 hover:brightness-105 disabled:opacity-70 cursor-pointer"
                style={{ fontFamily: "var(--font-futura)" }}
              >
                <svg
                  viewBox="0 0 300 50"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full fill-[#E7137D] pointer-events-none drop-shadow-sm"
                  aria-hidden="true"
                >
                  <path d="M 0 10 Q 0 0 10 0 L 278 0 Q 296 0 292 10 L 279 40 Q 274 50 260 50 L 10 50 Q 0 50 0 40 Z" />
                </svg>
                <span className="relative z-10 pl-1">{isLoading ? "..." : "CONTINUE"}</span>
                <svg
                  className="relative z-10 w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-white shrink-0 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </button>
            </div>

            {/* Google OAuth Button: sits in cutout notch with rounded mirrored slant shape */}
            <div className="relative w-[55%] sm:w-[54%] h-11 sm:h-12 md:h-12.5 shrink-0 translate-y-2 sm:translate-y-2.5">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="group relative w-full h-full flex items-center justify-center cursor-pointer transition-transform duration-150 active:scale-[0.99]"
              >
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md"
                  viewBox="0 0 360 50"
                  preserveAspectRatio="none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 50 2 L 348 2 Q 358 2 358 12 L 358 38 Q 358 48 348 48 L 32 48 Q 16 48 21 38 L 33 12 Q 38 2 50 2 Z"
                    fill="#181135"
                    stroke="#E7137D"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    className="transition-colors duration-150 group-hover:fill-[#22184b] group-hover:stroke-[#fa2773]"
                  />
                </svg>
                <span
                  className="relative z-10 text-white font-extrabold text-[10px] min-[380px]:text-xs min-[440px]:text-sm sm:text-sm md:text-base uppercase tracking-wider pl-4 sm:pl-5 pr-1.5 sm:pr-2 transition-colors group-hover:text-pink-100"
                  style={{ fontFamily: "var(--font-futura)" }}
                >
                  CONTINUE WITH GOOGLE
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Switch Link below the card */}
      <div
        className="mt-3.5 sm:mt-4 text-[11px] sm:text-xs md:text-sm uppercase tracking-wider text-[#A49FBD] font-bold text-left"
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

