"use client";

import React, { useState } from "react";
import Link from "next/link";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    college: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Registration submitted! Connecting to backend registration endpoint.");
    }, 600);
  };

  const handleGoogleRegister = () => {
    alert("Google OAuth will be connected to authentication backend.");
  };

  return (
    <div className="w-full max-w-[700px]">
      <form onSubmit={handleSubmit} className="w-full">
        {/* Unified Yellow Card Shell: Matches Login card size and height identically */}
        <div className="relative w-full min-h-[355px] sm:min-h-[370px] md:min-h-[385px] h-auto flex flex-col justify-between">
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

          {/* Form Fields: 2-Column Grid */}
          <div className="px-4 min-[360px]:px-6 sm:px-8 md:px-9 pt-4 sm:pt-5 md:pt-6 grid grid-cols-2 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-3.5 sm:gap-y-4.5 md:gap-y-5.5">
            {/* FIRST NAME */}
            <div className="min-w-0">
              <label
                htmlFor="register-first-name"
                className="block text-black font-extrabold text-[10px] min-[360px]:text-xs sm:text-xs md:text-sm tracking-wider uppercase mb-1 sm:mb-1.5 truncate"
                style={{ fontFamily: "var(--font-futura)" }}
              >
                FIRST NAME
              </label>
              <input
                id="register-first-name"
                type="text"
                name="firstName"
                required
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full min-w-0 h-8.5 sm:h-9.5 md:h-10 px-3 sm:px-3.5 rounded-lg bg-[#FFFF1A] border-2 border-[#E7137D] text-black font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E7137D]/50 transition-all placeholder:text-black/50"
              />
            </div>

            {/* LAST NAME */}
            <div className="min-w-0">
              <label
                htmlFor="register-last-name"
                className="block text-black font-extrabold text-[10px] min-[360px]:text-xs sm:text-xs md:text-sm tracking-wider uppercase mb-1 sm:mb-1.5 truncate"
                style={{ fontFamily: "var(--font-futura)" }}
              >
                LAST NAME
              </label>
              <input
                id="register-last-name"
                type="text"
                name="lastName"
                required
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full min-w-0 h-8.5 sm:h-9.5 md:h-10 px-3 sm:px-3.5 rounded-lg bg-[#FFFF1A] border-2 border-[#E7137D] text-black font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E7137D]/50 transition-all placeholder:text-black/50"
              />
            </div>

            {/* EMAIL */}
            <div className="min-w-0">
              <label
                htmlFor="register-email"
                className="block text-black font-extrabold text-[10px] min-[360px]:text-xs sm:text-xs md:text-sm tracking-wider uppercase mb-1 sm:mb-1.5 truncate"
                style={{ fontFamily: "var(--font-futura)" }}
              >
                EMAIL
              </label>
              <input
                id="register-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full min-w-0 h-8.5 sm:h-9.5 md:h-10 px-3 sm:px-3.5 rounded-lg bg-[#FFFF1A] border-2 border-[#E7137D] text-black font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E7137D]/50 transition-all placeholder:text-black/50"
              />
            </div>

            {/* PASSWORD */}
            <div className="min-w-0">
              <label
                htmlFor="register-password"
                className="block text-black font-extrabold text-[10px] min-[360px]:text-xs sm:text-xs md:text-sm tracking-wider uppercase mb-1 sm:mb-1.5 truncate"
                style={{ fontFamily: "var(--font-futura)" }}
              >
                PASSWORD
              </label>
              <input
                id="register-password"
                type="password"
                name="password"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="(MINIMUM 6 CHARACTERS)"
                value={formData.password}
                onChange={handleChange}
                className="w-full min-w-0 h-8.5 sm:h-9.5 md:h-10 px-3 sm:px-3.5 rounded-lg bg-[#FFFF1A] border-2 border-[#E7137D] text-black font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E7137D]/50 transition-all placeholder:text-black/75 placeholder:text-[9px] min-[360px]:placeholder:text-[10px] sm:placeholder:text-[11px] placeholder:font-bold placeholder:tracking-wider"
              />
            </div>

            {/* COLLEGE / UNIVERSITY */}
            <div className="min-w-0">
              <label
                htmlFor="register-college"
                className="block text-black font-extrabold text-[9.5px] min-[360px]:text-[11px] sm:text-xs md:text-sm tracking-wider uppercase mb-1 sm:mb-1.5 truncate"
                style={{ fontFamily: "var(--font-futura)" }}
              >
                COLLEGE / UNIVERSITY
              </label>
              <input
                id="register-college"
                type="text"
                name="college"
                required
                value={formData.college}
                onChange={handleChange}
                className="w-full min-w-0 h-8.5 sm:h-9.5 md:h-10 px-3 sm:px-3.5 rounded-lg bg-[#FFFF1A] border-2 border-[#E7137D] text-black font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E7137D]/50 transition-all placeholder:text-black/50"
              />
            </div>

            {/* PHONE NUMBER */}
            <div className="min-w-0">
              <label
                htmlFor="register-phone"
                className="block text-black font-extrabold text-[10px] min-[360px]:text-xs sm:text-xs md:text-sm tracking-wider uppercase mb-1 sm:mb-1.5 truncate"
                style={{ fontFamily: "var(--font-futura)" }}
              >
                PHONE NUMBER
              </label>
              <input
                id="register-phone"
                type="tel"
                name="phone"
                required
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full min-w-0 h-8.5 sm:h-9.5 md:h-10 px-3 sm:px-3.5 rounded-lg bg-[#FFFF1A] border-2 border-[#E7137D] text-black font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E7137D]/50 transition-all placeholder:text-black/50"
              />
            </div>
          </div>

          {/* Action Button Row: Pink Register button in lower left, open notch on right */}
          <div className="pb-2.5 sm:pb-3 md:pb-3.5 pl-3 sm:pl-6 pr-0 flex items-center justify-between mt-auto pt-3">
            {/* Pink Primary Button with 3D bottom bevel */}
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
                <span className="relative z-10 pl-1">{isLoading ? "..." : "REGISTER"}</span>
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
                onClick={handleGoogleRegister}
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
        <span>ALREADY HAVE AN ACCOUNT? </span>
        <Link
          href="/login"
          className="text-[#E7137D] hover:underline underline-offset-4 ml-1 font-extrabold transition-colors hover:text-[#fa2773]"
        >
          LOGIN
        </Link>
      </div>
    </div>
  );
}

