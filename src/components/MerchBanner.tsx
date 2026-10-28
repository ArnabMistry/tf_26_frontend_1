import React from "react";
import Link from "next/link";
import styles from "./MerchBanner.module.css";

const MARQUEE_ITEMS = Array.from({ length: 6 });

function MarqueeMessage() {
  return (
    <span className={styles.marqueeItem}>
      <span className={styles.marqueeHighlight}>
        <span className={styles.bolt} aria-hidden="true">⚡</span> TF ’26 MERCH IS LIVE!
      </span>
      <span className={styles.marqueeSep} aria-hidden="true">✦</span>
      <span className={styles.marqueeText}>WEAR THE FEST</span>
      <span className={styles.marqueeSep} aria-hidden="true">✦</span>
      <span className={styles.marqueeText}>REP THE VIBE</span>
      <span className={styles.marqueeSep} aria-hidden="true">✦</span>
      <span className={styles.marqueeText}>GRAB YOURS NOW!</span>
      <span className={styles.bolt} aria-hidden="true">⚡</span>
    </span>
  );
}

export function MerchBanner() {
  return (
    <Link
      href="/merch"
      className={styles.marqueeBanner}
      aria-label="Merch announcement: TF '26 Merch is Live! Click to explore"
    >
      <div className={styles.marqueeTrack}>
        <div className={styles.marqueeGroup}>
          {MARQUEE_ITEMS.map((_, i) => (
            <MarqueeMessage key={i} />
          ))}
        </div>
        <div className={styles.marqueeGroup} aria-hidden="true">
          {MARQUEE_ITEMS.map((_, i) => (
            <MarqueeMessage key={`clone-${i}`} />
          ))}
        </div>
      </div>
    </Link>
  );
}
