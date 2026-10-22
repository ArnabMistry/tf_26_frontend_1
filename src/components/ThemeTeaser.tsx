"use client";

import styles from "./ThemeTeaser.module.css";

export function ThemeTeaser({
  compact = false,
  className = "",
  children,
}: {
  compact?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const displayText = children ?? (compact ? "ANANTA" : "ANANTA: Surpassing the Possible");

  return (
    <span className={`${styles.trigger} ${compact ? styles.compactTrigger : ""} ${className}`}>
      <span className={`${styles.secret} ${compact ? styles.compact : ""}`}>
        {displayText}
      </span>
    </span>
  );
}
