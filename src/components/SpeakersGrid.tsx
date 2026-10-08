import { SpeakerCard, type SpeakerData } from "@/components/SpeakerCard";
import styles from "./SpeakersGrid.module.css";

const defaultSpeakers: SpeakerData[] = [
  {
    id: "1",
    name: "SANJAY ARORA",
    category: "STROKES",
    date: "23 OCT",
    imageUrl: "/assets/speakers.png",
  },
  {
    id: "2",
    name: "SANJAY ARORA",
    category: "ORATOR",
    date: "23 OCT",
    imageUrl: "/assets/speakers.png",
  },
  {
    id: "3",
    name: "SANJAY ARORA",
    category: "STROKES",
    date: "23 OCT",
    imageUrl: "/assets/speakers.png",
  },
  {
    id: "4",
    name: "SANJAY ARORA",
    category: "ORATOR",
    date: "23 OCT",
    imageUrl: "/assets/speakers.png",
  },
  {
    id: "5",
    name: "SANJAY ARORA",
    category: "STROKES",
    date: "23 OCT",
    imageUrl: "/assets/speakers.png",
  },
  {
    id: "6",
    name: "SANJAY ARORA",
    category: "ORATOR",
    date: "23 OCT",
    imageUrl: "/assets/speakers.png",
  },
];

interface SpeakersGridProps {
  speakers?: SpeakerData[];
}

export function SpeakersGrid({ speakers = defaultSpeakers }: SpeakersGridProps) {
  return (
    <main className={styles.explorer} id="speakers-content">
      {/* ── Page title toolbar ── */}
      <div className={styles.toolbar}>
        <h1 className={styles.pageTitle}>SPEAKERS</h1>
      </div>

      {/* ── 2-column speaker grid ── */}
      <section className={styles.section} aria-label="Event speakers">
        <div className={styles.grid}>
          {speakers.map((s) => (
            <SpeakerCard key={s.id} speaker={s} />
          ))}
        </div>
      </section>

    </main>
  );
}
