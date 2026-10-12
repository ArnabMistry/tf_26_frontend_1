"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const round = (val: number) => Math.round(val * 1000) / 1000 + 0;

const generateStarPath = (points: number, rOuter: number, rInner: number, rotation = 0) => {
  let path = '';
  const angleStep = Math.PI / points;
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = i * angleStep - Math.PI / 2 + rotation;
    const x = round(r * Math.cos(a));
    const y = round(r * Math.sin(a));
    if (i === 0) path += `M ${x} ${y} `;
    else path += `L ${x} ${y} `;
  }
  path += 'Z';
  return path;
};

// Match the colored stars' scale easing without transforming an SVG element
// inside the mask, which can shift the cutout in Firefox.
const scaleEase = (progress: number) => {
  let low = 0;
  let high = 1;
  for (let index = 0; index < 12; index++) {
    const t = (low + high) / 2;
    const x = 3 * (1 - t) ** 2 * t * 0.7 + 3 * (1 - t) * t ** 2 + t ** 3;
    if (x < progress) low = t;
    else high = t;
  }
  const t = (low + high) / 2;
  return 3 * (1 - t) * t ** 2 + t ** 3;
};

const maskPathFrames = Array.from({ length: 49 }, (_, index) => {
  const progress = index / 48;
  const expand = Math.min(Math.max((progress * 1.5 - 0.05) / 1.2, 0), 1);
  const scale = 40 * scaleEase(expand);
  return generateStarPath(12, 100 * scale, 50 * scale, progress * Math.PI * 2);
});

export function StarLoader() {
  const [isVisible, setIsVisible] = useState(true);

  // Fallback: force-dismiss after 1.8s if the path animation does not complete.
  useEffect(() => {
    const id = setTimeout(() => setIsVisible(false), 1800);
    return () => clearTimeout(id);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center bg-transparent"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <svg
            className="w-full h-full absolute inset-0 pointer-events-none"
            aria-hidden="true"
            viewBox="-1000 -1000 2000 2000"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <mask
                id="hole-mask"
                maskUnits="userSpaceOnUse"
                maskContentUnits="userSpaceOnUse"
                x="-5000"
                y="-5000"
                width="10000"
                height="10000"
              >
                <rect x="-5000" y="-5000" width="10000" height="10000" fill="white" />
                <motion.path
                  d={maskPathFrames[0]}
                  fill="black"
                  initial={{ d: maskPathFrames[0] }}
                  animate={{ d: maskPathFrames }}
                  transition={{ duration: 1.5, ease: "linear" }}
                  onAnimationComplete={() => setIsVisible(false)}
                />
              </mask>
            </defs>

            <g mask="url(#hole-mask)">
              {/* Outermost background color */}
              <rect x="-5000" y="-5000" width="10000" height="10000" fill="#241A4C" />
              
              <motion.g
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 40, rotate: 360 }}
                transition={{ 
                  scale: { duration: 1.2, ease: [0.7, 0, 1, 1], delay: 0.05 },
                  rotate: { duration: 1.5, ease: "linear" }
                }}
              >
                <path d={generateStarPath(12, 500, 250)} fill="#564BE3" />
                <path d={generateStarPath(12, 400, 200)} fill="#F44383" />
                <path d={generateStarPath(12, 300, 150)} fill="#107548" />
                <path d={generateStarPath(12, 200, 100)} fill="#CEF213" />
              </motion.g>
            </g>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
