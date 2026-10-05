import Image from "next/image";
import styles from "./SpeakerCard.module.css";

export interface SpeakerData {
  id: string;
  name: string;
  category: string;
  date: string;
  imageUrl: string;
}

interface SpeakerCardProps {
  speaker: SpeakerData;
}

export function SpeakerCard({ speaker }: SpeakerCardProps) {
  return (
    <article className={styles.cardWrapper} aria-label={`${speaker.name} - ${speaker.category}`}>
      <div className={styles.cardFrame}>
        {/* Top Header: Category on left, Date on right */}
        <div className={styles.cardHeader}>
          <span className={styles.category}>{speaker.category}</span>
          <span className={styles.date}>{speaker.date}</span>
        </div>

        {/* Speaker Photo */}
        <div className={styles.imageContainer}>
          <Image
            src={speaker.imageUrl}
            alt={speaker.name}
            width={340}
            height={340}
            className={styles.speakerImage}
            priority
          />
        </div>
      </div>

      {/* Name Badge / Pill overlapping bottom border */}
      <div className={styles.nameBadge} aria-hidden="true">
        <span className={styles.nameText}>{speaker.name}</span>
      </div>
    </article>
  );
}
