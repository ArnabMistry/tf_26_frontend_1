import Image from "next/image";
import styles from "./SponsorCard.module.css";

export type SponsorTier = "title" | "platinum" | "gold" | "silver" | "associate";

export interface SponsorData {
  id: string;
  name: string;
  logoUrl?: string;
  href?: string;
  tier?: SponsorTier;
}

type CardVariant = "left" | "center" | "right";

/** Word shown before "Sponsor" on the hover curtain. */
const TIER_LABEL: Record<SponsorTier, string> = {
  title: "Title",
  platinum: "Platinum",
  gold: "Gold",
  silver: "Silver",
  associate: "Associate",
};

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

/* The frame is drawn in a "-4 -4 208 224" viewBox, so the outline sits inset
   from the element box by 4 units on every side. The clip has to use that same
   mapping or the image spills past the border. */
const VIEW_PAD = 4;
const VIEW_WIDTH = 208;
const VIEW_HEIGHT = 224;

/**
 * Converts a 200×216 outline into objectBoundingBox units lined up with the
 * frame's viewBox, so the fill lands exactly inside the drawn border.
 * Handles the M/L/Q/Z commands these paths are built from.
 */
function toClipPath(path: string): string {
  const tokens = path.match(/[MLQZ]|-?\d*\.?\d+/gi) ?? [];
  const round = (n: number) => Number(n.toFixed(6));
  const out: string[] = [];

  let i = 0;
  while (i < tokens.length) {
    const command = tokens[i++].toUpperCase();
    if (command === "Z") {
      out.push("Z");
      continue;
    }
    const points: string[] = [];
    for (let pair = 0; pair < (command === "Q" ? 2 : 1); pair++) {
      const x = Number(tokens[i++]);
      const y = Number(tokens[i++]);
      points.push(
        `${round((x + VIEW_PAD) / VIEW_WIDTH)} ${round((y + VIEW_PAD) / VIEW_HEIGHT)}`
      );
    }
    out.push(command + points.join(" "));
  }

  return out.join(" ");
}

const LEFT_CLIP = toClipPath(LEFT_PATH);
const CENTER_CLIP = toClipPath(CENTER_PATH);

interface SponsorCardProps {
  sponsor?: SponsorData;
  variant?: CardVariant;
}

export function SponsorCard({ sponsor, variant = "left" }: SponsorCardProps) {
  const path = variant === "center" ? CENTER_PATH : LEFT_PATH;
  /* Right column mirrors the left shape horizontally */
  const svgTransform = variant === "right" ? "translate(200 0) scale(-1 1)" : undefined;

  const clipPath = variant === "center" ? CENTER_CLIP : LEFT_CLIP;
  /* Right column mirrors the left clip, same as the frame above */
  const clipTransform = variant === "right" ? "translate(1 0) scale(-1 1)" : undefined;

  const tierLabel = sponsor?.tier ? TIER_LABEL[sponsor.tier] : null;
  const filled = Boolean(sponsor?.logoUrl);
  /* Sponsor ids are unique within the grid, so this keeps the clipPath id
     unique without needing a client component for useId(). */
  const clipId = `sponsor-clip-${sponsor?.id ?? variant}`;

  const body = (
    <>
      {/* SVG outline frame — drawn above the fill so the border stays crisp */}
      <svg
        className={styles.frame}
        viewBox="-4 -4 208 224"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {filled && (
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
              <path d={clipPath} transform={clipTransform} />
            </clipPath>
          </defs>
        )}
        <path d={path} transform={svgTransform} className={styles.frameStroke} />
      </svg>

      {/* Fill — image, hover curtain and label all clipped to the card shape */}
      {filled && (
        <div className={styles.fill} style={{ clipPath: `url(#${clipId})` }}>
          <Image
            src={sponsor!.logoUrl!}
            alt={sponsor!.name}
            width={512}
            height={512}
            className={styles.logo}
          />

          {/* Black curtain that slides down from the top on hover/focus */}
          <span className={styles.curtain} aria-hidden="true" />

          {tierLabel && (
            <p className={styles.label}>
              <span>{tierLabel}</span>
              <span className={styles.labelAccent}>Sponsor</span>
            </p>
          )}
        </div>
      )}
    </>
  );

  if (sponsor?.href) {
    return (
      <a
        href={sponsor.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${sponsor.name}${tierLabel ? ` — ${tierLabel} sponsor` : ""}`}
        className={styles.card}
      >
        {body}
      </a>
    );
  }

  return <div className={styles.card}>{body}</div>;
}
