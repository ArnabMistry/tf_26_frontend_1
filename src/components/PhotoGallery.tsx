"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";

const photos = [
  "https://picsum.photos/seed/pic1/400/600",
  "https://picsum.photos/seed/pic2/400/600",
  "https://picsum.photos/seed/pic3/400/600",
  "https://picsum.photos/seed/pic4/400/600",
  "https://picsum.photos/seed/pic5/400/600",
  "https://picsum.photos/seed/pic6/400/600",
  "https://picsum.photos/seed/pic7/400/600",
];

const DESKTOP_POSITIONS = [
  { x: -30, y: 7.3, rotation: -21, scale: 0.7756, zIndex: 1 },
  { x: -22, y: 4, rotation: -14, scale: 0.8498, zIndex: 2 },
  { x: -11, y: 1.3, rotation: -7, scale: 0.9346, zIndex: 3 },
  { x: 0, y: 0, rotation: 0, scale: 1, zIndex: 10 },
  { x: 11, y: 1.3, rotation: 7, scale: 0.9346, zIndex: 3 },
  { x: 22, y: 4, rotation: 14, scale: 0.8498, zIndex: 2 },
  { x: 30, y: 7.3, rotation: 21, scale: 0.7756, zIndex: 1 },
];

const TABLET_POSITIONS = [
  { x: -15, y: 7.3, rotation: -21, scale: 0.7756, zIndex: 1 },
  { x: -11, y: 4, rotation: -14, scale: 0.8498, zIndex: 2 },
  { x: -6, y: 1.3, rotation: -7, scale: 0.9346, zIndex: 3 },
  { x: 0, y: 0, rotation: 0, scale: 1, zIndex: 10 },
  { x: 6, y: 1.3, rotation: 7, scale: 0.9346, zIndex: 3 },
  { x: 11, y: 4, rotation: 14, scale: 0.8498, zIndex: 2 },
  { x: 15, y: 7.3, rotation: 21, scale: 0.7756, zIndex: 1 },
];

const MOBILE_POSITIONS = [
  { x: -8, y: 4, rotation: -21, scale: 0.7756, zIndex: 1 },
  { x: -6, y: 2.2, rotation: -14, scale: 0.8498, zIndex: 2 },
  { x: -3.5, y: 0.8, rotation: -7, scale: 0.9346, zIndex: 3 },
  { x: 0, y: 0, rotation: 0, scale: 1, zIndex: 10 },
  { x: 3.5, y: 0.8, rotation: 7, scale: 0.9346, zIndex: 3 },
  { x: 6, y: 2.2, rotation: 14, scale: 0.8498, zIndex: 2 },
  { x: 8, y: 4, rotation: 21, scale: 0.7756, zIndex: 1 },
];

export function PhotoGallery() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [screenType, setScreenType] = useState<"desktop" | "tablet" | "mobile">("desktop");

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width > 991) setScreenType("desktop");
      else if (width >= 640) setScreenType("tablet");
      else setScreenType("mobile");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const positions = 
    screenType === "desktop" ? DESKTOP_POSITIONS : 
    screenType === "tablet" ? TABLET_POSITIONS : 
    MOBILE_POSITIONS;

  return (
    <section className="relative w-full bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat py-12 sm:py-16 md:py-24 px-4 flex flex-col items-center justify-center overflow-hidden">
      <h2 className="font-tantra text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white uppercase tracking-tight text-center drop-shadow-lg mb-8 sm:mb-16 md:mb-24 relative z-20">
        PHOTO GALLERY
      </h2>
      
      <div 
        className="relative flex items-center justify-center w-full max-w-[80rem] h-[20rem] sm:h-[28rem] md:h-[36rem]"
      >
        {photos.map((src, index) => {
          const original = positions[index];
          let currentX = original.x;
          let currentY = original.y;
          let currentScale = original.scale;
          let currentZ = original.zIndex;

          if (hoveredIndex !== null) {
            if (index === hoveredIndex) {
              currentY -= 2.5; // Hovered card pops up
              currentScale *= 1.08;
              currentZ = 20;
            } else {
              const distance = index - hoveredIndex;
              const direction = distance < 0 ? -1 : 1;
              const absoluteDistance = Math.abs(distance);
              const pushAmount = absoluteDistance === 1 ? 3 : absoluteDistance === 2 ? 2 : 1;
              // On mobile, the push amount should be smaller so it doesn't break the layout
              const pushScale = screenType === "mobile" ? 0.5 : 1;
              currentX += direction * pushAmount * pushScale;
            }
          }

          return (
            <motion.div
              key={index}
              className="absolute w-[11rem] h-[19rem] sm:w-[15rem] sm:h-[26rem] md:w-[20rem] md:h-[35rem] rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3.31625rem] overflow-hidden shadow-2xl border-[4px] border-[#241A4C]/50 cursor-pointer"
              style={{ 
                transformOrigin: "50% 50%",
                zIndex: currentZ 
              }}
              initial={{
                x: 0,
                y: "10rem",
                rotate: 0,
                scale: 1,
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
                x: `${currentX}rem`,
                y: `${currentY}rem`,
                rotate: original.rotation,
                scale: currentScale,
              }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 25,
                mass: 0.8,
              }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              onClick={() => setHoveredIndex(hoveredIndex === index ? null : index)}
            >
              <Image 
                src={src} 
                alt={`Gallery photo ${index + 1}`} 
                fill
                className="object-cover pointer-events-none select-none"
                sizes="(max-width: 640px) 11rem, (max-width: 991px) 15rem, 20rem"
                draggable={false}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

