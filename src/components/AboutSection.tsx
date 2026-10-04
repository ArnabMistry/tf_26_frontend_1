import React from "react";
import Image from "next/image";

export function AboutSection() {
  return (
    <section className="relative w-full bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat py-12 md:py-20 px-4 sm:px-6 lg:px-12 text-black overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col gap-8 md:gap-10">
        
        {/* About TantraFiesta Card */}
        <div className="relative bg-[#FFFF1A] rounded-2xl md:rounded-[28px] p-6 sm:p-8 md:p-12 shadow-2xl border-2 border-black/10">
          {/* Character Illustration */}
          <div className="hidden lg:block absolute -right-6 -top-12 xl:-right-10 xl:-top-16 w-80 xl:w-96 pointer-events-none z-20">
            <Image
              src="/assets/gurl.png"
              alt="TantraFiesta Mascot"
              width={450}
              height={550}
              className="w-full h-auto object-contain drop-shadow-xl"
              priority
            />
          </div>

          <div className="relative z-10 lg:max-w-[65%] xl:max-w-[70%]">
            <h2 className="font-tantra text-3xl sm:text-5xl md:text-6xl text-black uppercase tracking-tight mb-6">
              ABOUT TANTRAFIESTA
            </h2>

            <div className="space-y-4 text-black text-sm sm:text-base md:text-lg font-medium leading-relaxed">
              <p>
                TantraFiesta 2025 marked the 10th edition of IIIT Nagpur&apos;s annual technical fest, carrying the theme <span className="font-bold">&ldquo;Dark Matter Eclipse: Exploring the Unexplored.&rdquo;</span> Inspired by the mysteries of the universe, the edition celebrated the spirit of venturing beyond the known — exploring new possibilities in technology, innovation, design, engineering and creativity.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-black/20">
              <h3 className="font-tantra text-2xl sm:text-3xl text-black uppercase mb-4">
                Highlights of TF 2025
              </h3>
              <p className="text-black text-sm sm:text-base md:text-lg font-medium leading-relaxed mb-6">
                With 25 technical and creative competitions spanning coding, artificial intelligence, robotics, cybersecurity, design, gaming, electronics and innovation, TantraFiesta 2025 brought together different domains of technology under one platform.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm md:text-base">
                <div className="bg-black/5 p-3.5 rounded-xl border border-black/10">
                  <span className="font-bold text-black block mb-1">Genathon 3.0</span>
                  <span className="text-black/80">Major innovation challenge solving problems through creative technology.</span>
                </div>
                <div className="bg-black/5 p-3.5 rounded-xl border border-black/10">
                  <span className="font-bold text-black block mb-1">RoboWars</span>
                  <span className="text-black/80">Combat robots head-to-head in battles combining engineering and strategy.</span>
                </div>
                <div className="bg-black/5 p-3.5 rounded-xl border border-black/10">
                  <span className="font-bold text-black block mb-1">Claude Solvathon</span>
                  <span className="text-black/80">Two-stage AI challenge applying artificial intelligence under pressure.</span>
                </div>
                <div className="bg-black/5 p-3.5 rounded-xl border border-black/10">
                  <span className="font-bold text-black block mb-1">Last Man Standing 3.0</span>
                  <span className="text-black/80">High-energy coding face-off with the unpredictable &ldquo;Roulette of Fate&rdquo;.</span>
                </div>
                <div className="bg-black/5 p-3.5 rounded-xl border border-black/10">
                  <span className="font-bold text-black block mb-1">CodeDuelz &amp; Algorithmia</span>
                  <span className="text-black/80">Engaging coding duels and ICPC-style algorithmic problems.</span>
                </div>
                <div className="bg-black/5 p-3.5 rounded-xl border border-black/10">
                  <span className="font-bold text-black block mb-1">EnigmaXplore 3.0</span>
                  <span className="text-black/80">Live Capture The Flag cybersecurity competition.</span>
                </div>
                <div className="bg-black/5 p-3.5 rounded-xl border border-black/10 sm:col-span-2">
                  <span className="font-bold text-black block mb-1">Render Riot &amp; Design-A-thon</span>
                  <span className="text-black/80">Platforms for 3D creators, digital artists, and user-centred design solutions.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Card */}
        <div className="relative bg-[#FFFF1A] rounded-2xl md:rounded-[28px] p-6 sm:p-8 md:p-12 shadow-2xl border-2 border-black/10">
          <h2 className="font-tantra text-3xl sm:text-5xl md:text-6xl text-black uppercase tracking-tight mb-6">
            THEME
          </h2>

          <div className="space-y-4 text-black text-sm sm:text-base md:text-lg font-medium leading-relaxed">
            <p className="text-lg sm:text-xl md:text-2xl font-bold">
              Theme: Dark Matter Eclipse — Exploring the Unexplored
            </p>
            <p>
              The idea behind Dark Matter Eclipse was simple: some of the most powerful ideas begin where our understanding ends. Just as dark matter represents the unseen forces shaping the universe, TF 2025 encouraged participants to question conventions, experiment with emerging technologies and discover solutions beyond familiar boundaries.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
