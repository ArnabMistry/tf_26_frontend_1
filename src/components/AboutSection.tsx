import React from "react";
import Image from "next/image";
import { HoverTilt } from "./HoverTilt";
import { Reveal } from "./Reveal";
import { ThemeTeaser } from "./ThemeTeaser";

export function AboutSection({ compactTop = false }: { compactTop?: boolean }) {
  return (
    <section className={`relative w-full ${compactTop ? "pt-4 pb-12 md:pb-20" : "py-12 md:py-20 px-4 sm:px-6 lg:px-12"} text-black overflow-hidden`}>
      <div className={`${compactTop ? "max-w-[1120px] px-4 sm:px-6" : "max-w-5xl"} mx-auto flex flex-col gap-8 md:gap-14`}>
        
        {/* About TantraFiesta Card */}
        <Reveal variant="scale" className="relative bg-[#FFFF1A] rounded-2xl md:rounded-[28px] p-6 sm:p-8 md:p-12 lg:min-h-[530px] shadow-2xl border-2 border-black/10">
          {/* Character Illustration */}
          <HoverTilt className="hidden lg:flex absolute right-[-15%] top-1/2 -translate-y-1/2 h-[118%] pointer-events-auto z-20 items-center justify-center" rotationIntensity={8} scaleIntensity={1.03}>
            <Image
              src="/assets/gurl.webp"
              alt="TantraFiesta Mascot"
              width={600}
              height={733}
              className="h-full w-auto object-contain drop-shadow-xl select-none pointer-events-none"
              loading="lazy"
            />
          </HoverTilt>

          <div className="relative z-10 lg:max-w-[66%]">
            <h2 className="font-tantra text-3xl sm:text-5xl md:text-6xl text-black uppercase tracking-tight mb-6">
              ABOUT TANTRAFIESTA
            </h2>

            <div className="space-y-4 text-black text-sm sm:text-base md:text-lg font-medium leading-relaxed">
              <p>
                TantraFiesta is the National-Level Annual Technical Fest of the Indian Institute of Information Technology, Nagpur. It is conceived as a platform where technology is explored beyond the classroom—through experimentation, problem-solving, and original thinking.
              </p>
              <p>
                The fest brings together students with different technical interests and encourages them to question established approaches, work with emerging ideas, and apply knowledge in meaningful ways. With every edition, TantraFiesta reflects the evolving nature of technology while staying rooted in its core purpose: to promote technical curiosity, creativity, and a culture of building beyond the obvious.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Theme Card */}
        <Reveal variant="right" className="relative bg-[#FFFF1A] rounded-2xl md:rounded-[28px] p-6 sm:p-8 md:p-12 lg:min-h-[480px] shadow-2xl border-2 border-black/10">
          <div className="relative z-10">
            <p className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-widest text-black/70 mb-1">
              THEME
            </p>
            <h2 className="font-tantra text-3xl sm:text-5xl md:text-6xl text-black uppercase tracking-tight mb-6">
              {/* THEME REVEAL: Replace this silhouette with the official theme copy. */}
              <ThemeTeaser />
            </h2>

            <div className="space-y-4 text-black text-sm sm:text-base md:text-lg font-medium leading-relaxed">
              <p>
                TantraFiesta 2026 introduces {/* THEME REVEAL: Replace this silhouette with the official theme copy. */}<span className="font-bold"><ThemeTeaser /></span>—a theme inspired by the idea of the infinite and technology’s ability to continually redefine its own limits.
              </p>
              <p>
                Its visual identity takes shape through <span className="font-bold">Indian Maximalism</span>, where the richness of Indian aesthetics is reinterpreted through a contemporary technological lens. Bold contrasts, intricate forms, layered compositions, and expressive details create a language that feels distinctly Indian yet futuristic.
              </p>
              <p>
                {/* THEME REVEAL: Replace this compact silhouette with the official theme name. */}<span className="font-bold"><ThemeTeaser compact /></span> represents a mindset where boundaries are not endpoints, but starting points for what can exist next.
              </p>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
