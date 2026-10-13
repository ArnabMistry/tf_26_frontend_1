"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ThemeTeaser.module.css";

export function ThemeTeaser({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);

  const keepOpen = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const show = useCallback(() => {
    keepOpen();
    const bounds = trigger.current?.getBoundingClientRect();
    if (!bounds) return;
    const width = Math.min(280, window.innerWidth - 24);
    setPosition({
      left: Math.max(12, Math.min(bounds.left + bounds.width / 2 - width / 2, window.innerWidth - width - 12)),
      top: bounds.top >= 172 ? bounds.top - 160 : Math.min(bounds.bottom + 10, window.innerHeight - 162),
    });
  }, [keepOpen]);

  const hideSoon = useCallback(() => {
    keepOpen();
    timer.current = setTimeout(() => setPosition(null), 140);
  }, [keepOpen]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  useEffect(() => {
    const artwork = new window.Image();
    artwork.src = "/assets/theme-shush.webp";
  }, []);

  useEffect(() => {
    if (!position) return;
    const dismiss = () => setPosition(null);
    const follow = () => {
      const bounds = trigger.current?.getBoundingClientRect();
      if (!bounds || bounds.bottom < 0 || bounds.top > window.innerHeight) dismiss();
      else show();
    };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") dismiss(); };
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!trigger.current?.contains(target) && !popup.current?.contains(target)) dismiss();
    };
    window.addEventListener("scroll", follow, true);
    window.addEventListener("resize", dismiss);
    document.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("scroll", follow, true);
      window.removeEventListener("resize", dismiss);
      document.removeEventListener("keydown", escape);
      document.removeEventListener("pointerdown", outside);
    };
  }, [position, show]);

  return <>
    <button ref={trigger} type="button" className={`${styles.trigger} ${compact ? styles.compactTrigger : ""} ${className}`}
      aria-label="wait for the reveal 😶" title="wait for the reveal 😶" aria-describedby={position ? id : undefined}
      onMouseEnter={show} onMouseLeave={hideSoon} onFocus={show} onBlur={hideSoon} onClick={show}>
      <span aria-hidden="true" className={`${styles.secret} ${compact ? styles.compact : ""}`} />
      <span className="sr-only">wait for the reveal 😶</span>
    </button>
    {position && createPortal(
      <span ref={popup} id={id} role="tooltip" className={styles.popup} style={position}
        onMouseEnter={keepOpen} onMouseLeave={hideSoon}>
        <Image src="/assets/theme-shush.webp" alt="" width={108} height={130} unoptimized loading="eager" className={styles.mascot} />
        <span className={styles.message}>will be<br />revealed soon</span>
      </span>, document.body,
    )}
  </>;
}
