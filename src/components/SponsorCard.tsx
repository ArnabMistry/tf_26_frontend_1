import Image from "next/image";
import styles from "./SponsorCard.module.css";

export interface SponsorData {
  id: string;
  name: string;
  logoUrl?: string;
  href?: string;
  tier?: "title" | "platinum" | "gold" | "silver" | "associate";
}

type CardVariant = "left" | "center" | "right";

/**
 * SVG shape paths — all share the same 200×216 viewBox.
 *
 * "left"   → notch cut on bottom-right corner  (left column)
 * "center" → notch cut on bottom-left corner   (middle column, offset)
 * "right"  → mirror of left via SVG transform  (right column)
 */
const LEFT_PATH =
  "M 6 0 L 194 0 Q 200 0 200 6 L 200 178 Q 200 184 194 184 L 145 184 Q 138 184 134 191 L 118 213 Q 115 216 110 216 L 6 216 Q 0 216 0 210 L 0 6 Q 0 0 6 0 Z";

const CENTER_PATH =
  "M 6 0 L 194 0 Q 200 0 200 6 L 200 210 Q 200 216 194 216 L 90 216 Q 85 216 82 213 L 66 191 Q 62 184 55 184 L 6 184 Q 0 184 0 178 L 0 6 Q 0 0 6 0 Z";

interface SponsorCardProps {
  sponsor?: SponsorData;
  variant?: CardVariant;
}

export function SponsorCard({ sponsor, variant = "left" }: SponsorCardProps) {
  const path = variant === "center" ? CENTER_PATH : LEFT_PATH;
  /* Right column mirrors the left shape horizontally */
  const svgTransform = variant === "right" ? "translate(200 0) scale(-1 1)" : undefined;

  const cardContent = (
    <div className={styles.card}>
      {/* SVG outline frame — the themed clip-shaped border */}
      <svg
        className={styles.frame}
        viewBox="0 0 200 216"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d={path}
          transform={svgTransform}
          className={styles.frameStroke}
        />
      </svg>

      {/* Logo — only rendered when a real logoUrl is provided */}
      {sponsor?.logoUrl && (
        <div className={styles.inner}>
          <Image
            src={sponsor.logoUrl}
            alt={sponsor.name}
            width={180}
            height={120}
            className={styles.logo}
          />
        </div>
      )}
    </div>
  );

  if (sponsor?.href) {
    return (
      <a
        href={sponsor.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${sponsor.name}`}
        style={{ display: "block", textDecoration: "none" }}
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
}
