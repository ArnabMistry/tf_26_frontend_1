/**
 * A drawn garment mockup, used until real product photography lands.
 *
 * The point is that a black tee reads as a black tee and a white one as a
 * white one: the fabric takes the item's own colour, and the print flips
 * between light and dark ink based on how bright that colour is. So the
 * catalogue stays honest about what the buyer is choosing between even with no
 * photos in the database at all.
 */

/** Perceived brightness (ITU-R BT.601), 0–255. */
function luminance(hex: string): number {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

const isHex = (value: string | null | undefined): value is string =>
  typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);

export function TeeMockup({ colorHex, label, variant }: {
  colorHex: string | null;
  /** Rendered as the chest print — the design's short name. */
  label?: string | null;
  /** `glitch` offsets the print into cyan/magenta channels. */
  variant?: 'signature' | 'glitch';
}) {
  // Falls back to the fest navy, so an item saved without a colour still draws
  // as a garment rather than as a hole in the card.
  const fabric = isHex(colorHex) ? colorHex : '#2a1f52';
  const light = luminance(fabric) > 140;

  // Ink, seams and shadow all derive from the fabric, which is what keeps the
  // mockup legible on a near-white tee and on a near-black one alike.
  const ink = light ? '#15102b' : '#ffff1a';
  const seam = light ? 'rgba(0,0,0,0.16)' : 'rgba(255,255,255,0.18)';
  const shade = light ? 'rgba(0,0,0,0.13)' : 'rgba(0,0,0,0.38)';
  const sub = light ? 'rgba(21,16,43,0.62)' : 'rgba(255,255,255,0.62)';

  const id = (fabric + (variant ?? '')).replace(/[^a-z0-9]/gi, '');

  return (
    <svg viewBox="0 0 240 240" role="img" aria-label={`${label || 'TF 26'} t-shirt`} width="100%" height="100%">
      <defs>
        {/* Folds: a soft vertical sweep so the garment is not a flat cut-out. */}
        <linearGradient id={`fold-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={shade} />
          <stop offset="22%" stopColor="transparent" />
          <stop offset="72%" stopColor="transparent" />
          <stop offset="100%" stopColor={shade} />
        </linearGradient>
        <linearGradient id={`glow-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        {/* The print is clipped to the torso panel, so no label length can
            ever bleed off the fabric and onto the card background. */}
        <clipPath id={`print-${id}`}>
          <rect x="54" y="118" width="92" height="64" />
        </clipPath>
      </defs>

      <g transform="translate(20 14)">
        {/* Body, sleeves and collar in one silhouette. */}
        <path
          d="M78 6 L60 13 L14 38 L2 80 L38 98 L52 74 L52 218 Q52 224 58 224 L142 224 Q148 224 148 218 L148 74 L162 98 L198 80 L186 38 L140 13 L122 6 Q100 26 78 6 Z"
          fill={fabric}
          stroke={seam}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M78 6 L60 13 L14 38 L2 80 L38 98 L52 74 L52 218 Q52 224 58 224 L142 224 Q148 224 148 218 L148 74 L162 98 L198 80 L186 38 L140 13 L122 6 Q100 26 78 6 Z"
          fill={`url(#fold-${id})`}
        />
        <path
          d="M78 6 L60 13 L14 38 L2 80 L38 98 L52 74 L52 110 L148 110 L148 74 L162 98 L198 80 L186 38 L140 13 L122 6 Q100 26 78 6 Z"
          fill={`url(#glow-${id})`}
        />

        {/* Collar ribbing. */}
        <path d="M78 6 Q100 26 122 6" fill="none" stroke={seam} strokeWidth="4" strokeLinecap="round" />
        <path d="M74 9 Q100 32 126 9" fill="none" stroke={seam} strokeWidth="1.2" />

        {/* Sleeve hems and side seams. */}
        <path d="M38 98 L52 74" fill="none" stroke={seam} strokeWidth="1.2" />
        <path d="M162 98 L148 74" fill="none" stroke={seam} strokeWidth="1.2" />
        <path d="M56 218 L144 218" fill="none" stroke={seam} strokeWidth="1.2" />

        {/* The chest print. `glitch` splits it into offset colour channels. */}
        <g textAnchor="middle" fontFamily="var(--font-tantra, sans-serif)" clipPath={`url(#print-${id})`}>
          {variant === 'glitch' && (
            <>
              <text x="97.5" y="152" fontSize="31" fill="#00e5ff" opacity="0.75" letterSpacing="1">TF 26</text>
              <text x="102.5" y="152" fontSize="31" fill="#ed1686" opacity="0.75" letterSpacing="1">TF 26</text>
            </>
          )}
          <text x="100" y="152" fontSize="31" fill={ink} letterSpacing="1">TF 26</text>
          <text
            x="100"
            y="169"
            fontSize="6.5"
            fill={sub}
            letterSpacing="2.2"
            fontFamily="var(--font-futura, sans-serif)"
            fontWeight="700"
          >
            TANTRAFIESTA
          </text>
        </g>
      </g>
    </svg>
  );
}

/** Picks the print treatment from the item's slug. */
export const mockupVariant = (slug: string): 'signature' | 'glitch' =>
  /glitch/i.test(slug) ? 'glitch' : 'signature';

/** A readable ink colour for a swatch dot of this fabric. */
export const swatchBorder = (colorHex: string | null) =>
  isHex(colorHex) && luminance(colorHex) > 140 ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.45)';
