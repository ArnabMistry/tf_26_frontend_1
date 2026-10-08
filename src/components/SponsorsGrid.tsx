import Image from "next/image";
import Link from "next/link";
import { SponsorCard, type SponsorData } from "@/components/SponsorCard";
import styles from "./SponsorsGrid.module.css";

/* ---------------------------------------------------------------------------
   Reference / placeholder sponsors — swap with real API data later.
   Add logoUrl + href once actual sponsor assets are available.
--------------------------------------------------------------------------- */
const referenceSponsor = (id: string): SponsorData => ({ id, name: `Sponsor ${id}` });

/* Demo card showing the filled-in state: logo, tier label, and the
   hover breakout. `logoUrl` points at a festival asset as a stand-in until a
   real sponsor logo is supplied. */
const demoSponsor: SponsorData = {
  id: "demo",
  name: "Demo Sponsor",
  tier: "platinum",
  logoUrl: "/developers/arnab_mistry_pic.webp",
  href: "https://example.com",
};

const defaultSponsors: SponsorData[] = [
  demoSponsor,
  ...Array.from({ length: 11 }, (_, i) => referenceSponsor(String(i + 1))),
];

/** Distributes a flat array across 3 columns in round-robin order */
function toColumns<T>(items: T[]): [T[], T[], T[]] {
  const cols: [T[], T[], T[]] = [[], [], []];
  items.forEach((item, i) => cols[i % 3].push(item));
  return cols;
}

interface SponsorsGridProps {
  /** Pass live sponsor data from API; falls back to empty placeholder frames */
  sponsors?: SponsorData[];
}

export function SponsorsGrid({ sponsors = defaultSponsors }: SponsorsGridProps) {
  const [col0, col1, col2] = toColumns(sponsors);

  return (
    <main className={styles.explorer} id="sponsors-content">
      {/* ── Page title ── */}
      <div className={styles.toolbar}>
        <h1 className={styles.pageTitle}>Sponsors</h1>
      </div>

      {/* ── 3-column staggered sponsor grid ── */}
      <section
        className={styles.section}
        aria-label="Our sponsors"
      >
        <div className={styles.grid} role="list">
          {/* Left column — left-notch shape */}
          <div className={styles.col} role="presentation">
            {col0.map((s) => (
              <div key={s.id} role="listitem">
                <SponsorCard sponsor={s} variant="left" />
              </div>
            ))}
          </div>

          {/* Center column — center-notch shape, offset downward via CSS */}
          <div className={styles.col} role="presentation">
            {col1.map((s) => (
              <div key={s.id} role="listitem">
                <SponsorCard sponsor={s} variant="center" />
              </div>
            ))}
          </div>

          {/* Right column — mirrored left-notch shape */}
          <div className={styles.col} role="presentation">
            {col2.map((s) => (
              <div key={s.id} role="listitem">
                <SponsorCard sponsor={s} variant="right" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Big TantraFiesta wordmark at the bottom ── */}
      <Link
        href="/"
        aria-label="TantraFiesta home"
        className={styles.wordmark}
      >
        <Image
          src="/assets/tf_nav.png"
          alt="TantraFiesta"
          width={4096}
          height={514}
          sizes="100vw"
          className={styles.wordmarkImage}
        />
      </Link>
    </main>
  );
}
