"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import styles from "./Reveal.module.css";

type RevealProps = {
  children: ReactNode;
  className?: string;
  variant?: "rise" | "scale" | "left" | "right" | "fade" | "split" | "stagger" | "sponsor-left" | "sponsor-right";
  delay?: number;
  animateOnMount?: boolean;
};

export function Reveal({ children, className = "", variant = "rise", delay = 0, animateOnMount = false }: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (
      !element ||
      !('IntersectionObserver' in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Keep above-the-fold content visible on the first paint and in the HTML.
    if (element.getBoundingClientRect().top < window.innerHeight * 0.88) {
      if (animateOnMount) element.dataset.state = "revealed";
      return;
    }

    element.dataset.state = "pending";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.state = "revealed";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      element.dataset.state = "visible";
    };
  }, [animateOnMount]);

  return (
    <div
      ref={elementRef}
      className={`${styles.reveal} ${className}`}
      data-variant={variant}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      data-state="visible"
      onFocusCapture={(event) => {
        event.currentTarget.dataset.state = "revealed";
      }}
    >
      {children}
    </div>
  );
}
