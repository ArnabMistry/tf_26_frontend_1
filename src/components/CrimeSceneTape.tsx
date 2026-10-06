import React from "react";

interface CrimeSceneTapeProps {
  text?: string;
  angle?: number;
  direction?: "normal" | "reverse";
  speed?: string;
  className?: string;
  fontSize?: string;
  py?: string;
  position?: "absolute" | "relative";
}

export function CrimeSceneTape({
  text = "CONFIDENTIAL",
  angle = 0,
  direction = "normal",
  speed = "35s",
  className = "",
  fontSize = "text-xl md:text-3xl",
  py = "py-2 md:py-2.5",
  position = "absolute",
}: CrimeSceneTapeProps) {
  const repeatCount = 30;

  return (
    <div
      className={`${position} left-1/2 w-[125vw] max-w-none select-none pointer-events-none z-20 shadow-2xl drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] ${className}`}
      style={{
        transform: `translateX(-50%) rotate(${angle}deg)`,
      }}
    >
      <div className={`bg-[#FFE500] border-y-[3px] border-black ${py} overflow-hidden flex flex-col justify-between`}>
        {/* Repeating marquee track */}
        <div className="flex w-full whitespace-nowrap overflow-hidden">
          <div
            className={`flex gap-8 md:gap-12 text-black font-tantra uppercase tracking-tight shrink-0 ${
              direction === "reverse" ? "animate-marquee-reverse" : "animate-marquee"
            }`}
            style={{
              fontFamily: '"TantraFont", Impact, sans-serif',
              animationDuration: speed,
            }}
          >
            {Array.from({ length: repeatCount }).map((_, i) => (
              <span key={i} className={`flex items-center gap-6 ${fontSize}`}>
                <span>{text}</span>
                <span className="font-mono text-lg md:text-2xl opacity-75">///</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StaticCrimeSceneTape({
  text = "CONFIDENTIAL",
  angle = 0,
  className = "",
  fontSize = "text-xl md:text-3xl",
}: {
  text?: string;
  angle?: number;
  className?: string;
  fontSize?: string;
}) {
  return (
    <div
      className={`absolute left-1/2 w-[140%] -translate-x-1/2 select-none pointer-events-none z-30 shadow-2xl drop-shadow-[0_8px_14px_rgba(0,0,0,0.6)] ${className}`}
      style={{
        transform: `translateX(-50%) rotate(${angle}deg)`,
      }}
    >
      <div className="bg-[#FFE500] border-y-[3px] border-black py-2 md:py-2.5 px-4 overflow-hidden whitespace-nowrap flex items-center justify-center">
        <div className="flex items-center gap-8 text-black font-tantra uppercase tracking-tight">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className={`flex items-center gap-6 shrink-0 ${fontSize}`}>
              <span>{text}</span>
              <span className="font-mono text-lg md:text-2xl opacity-60">///</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
