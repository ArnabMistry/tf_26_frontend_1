"use client";

import React from "react";
import { motion } from "motion/react";

export function ComingSoon() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[65vh] w-full px-4">
      <motion.h1
        className="font-tantra text-6xl sm:text-7xl md:text-[100px] lg:text-[120px] text-[#FFFF1A] uppercase tracking-widest text-center leading-none drop-shadow-md z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          textShadow: [
            "0px 0px 10px rgba(255, 255, 26, 0.2)",
            "0px 0px 40px rgba(255, 255, 26, 0.7)",
            "0px 0px 10px rgba(255, 255, 26, 0.2)",
          ],
        }}
        transition={{
          opacity: { duration: 1, ease: "easeOut" },
          scale: { duration: 1, ease: "easeOut" },
          textShadow: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        COMING SOON
      </motion.h1>
    </div>
  );
}
