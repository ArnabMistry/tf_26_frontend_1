"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const round = (val: number) => Math.round(val * 1000) / 1000 + 0;

const generateStarPath = (points: number, rOuter: number, rInner: number) => {
  let path = '';
  const angleStep = Math.PI / points;
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = i * angleStep - Math.PI / 2;
    const x = round(r * Math.cos(a));
    const y = round(r * Math.sin(a));
    if (i === 0) path += `M ${x} ${y} `;
    else path += `L ${x} ${y} `;
  }
  path += 'Z';
  return path;
};

export function StarLoader() {
  const [isVisible, setIsVisible] = useState(true);

  // Fallback: force-dismiss after 3.5s in case onAnimationComplete
  // doesn't fire (e.g. Firefox + SVG motion.g inside <defs>/<mask>)
  useEffect(() => {
    const id = setTimeout(() => setIsVisible(false), 3500);
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
              <mask id="hole-mask">
                <rect x="-5000" y="-5000" width="10000" height="10000" fill="white" />
                <motion.g
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 40, rotate: 360 }}
                  transition={{ 
                    scale: { duration: 2.5, ease: [0.7, 0, 1, 1], delay: 0.2 }, 
                    rotate: { duration: 3.5, ease: "linear" } 
                  }}
                  onAnimationComplete={() => setIsVisible(false)}
                >
                  <path d={generateStarPath(12, 100, 50)} fill="black" />
                </motion.g>
              </mask>
            </defs>

            <g mask="url(#hole-mask)">
              {/* Outermost background color */}
              <rect x="-5000" y="-5000" width="10000" height="10000" fill="#241A4C" />
              
              <motion.g
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 40, rotate: 360 }}
                transition={{ 
                  scale: { duration: 2.8, ease: [0.7, 0, 1, 1], delay: 0.2 }, 
                  rotate: { duration: 3.5, ease: "linear" } 
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
