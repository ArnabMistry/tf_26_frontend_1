import Link from "next/link";
import type { EventListing } from "@/lib/events";
import styles from "./EventCard.module.css";

interface EventCardProps {
  event: EventListing;
  variant?: "left" | "right" | "center";
  onRegister?: (event: EventListing) => void;
}

const wingShape = "M16 0H590Q606 0 606 16V221Q606 237 590 237H337Q321 237 310 250L283 282Q275 292 263 292H16Q0 292 0 276V16Q0 0 16 0Z";
const centerShape = "M64 0H624Q640 0 650 13L681 51Q688 60 688 71V302Q688 318 672 318H16Q0 318 0 302V71Q0 60 7 51L38 13Q48 0 64 0Z";

export function EventCard({ event, variant = "left", onRegister }: EventCardProps) {
  const centered = variant === "center";
  const destination = event.registrationUrl || event.href;
  const actionLabel = event.href && !event.registrationUrl ? "View Event" : "Register Now";
  const actionContent = <>{actionLabel}<span aria-hidden="true">↗</span></>;

  return (
    <article className={`${styles.card} ${styles[variant]}`} aria-label={event.name}>
      <svg className={styles.shape} aria-hidden="true" viewBox={centered ? "0 0 688 318" : "0 0 606 292"} preserveAspectRatio="none">
        <path d={centered ? centerShape : wingShape} transform={variant === "right" ? "translate(606 0) scale(-1 1)" : undefined} />
      </svg>
      <div className={styles.content}>
        <div className={styles.heading}>
          <h3 className={styles.title}>{event.name}</h3>
          {!centered && event.prize && <p className={styles.prize}><span className="sr-only">Prize pool: </span>{event.prize}</p>}
        </div>
        <p className={styles.description}>{event.description}</p>
        {centered && event.prize && <p className={styles.prize}><span className="sr-only">Prize pool: </span>{event.prize}</p>}
        <div className={styles.actionRow}>
          {destination ? (
            <Link href={destination} className={styles.action} aria-label={`${actionLabel} — ${event.name}`}>
              {actionContent}
            </Link>
          ) : (
            <button type="button" className={styles.action} onClick={() => onRegister?.(event)} aria-label={`Register for ${event.name}`} disabled={!onRegister}>
              {actionContent}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
