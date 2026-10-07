"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import type { EventDetail as EventDetailData } from "@/lib/eventDetails";
import styles from "./EventDetail.module.css";

const TABS = [
  { id: "descriptions", label: "Descriptions" },
  { id: "stages", label: "Stages & Timeline" },
  { id: "rules", label: "Rules & Regulations" },
  { id: "contact", label: "Contact Organizers" },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface EventDetailProps {
  event: EventDetailData;
}

export function EventDetail({ event }: EventDetailProps) {
  const [activeTab, setActiveTab] = useState<TabId>("descriptions");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const baseId = useId();

  const tabId = (id: TabId) => `${baseId}-tab-${id}`;
  const panelId = (id: TabId) => `${baseId}-panel-${id}`;

  // Roving focus: ← / → move between tabs, Home / End jump to the ends.
  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const lastIndex = TABS.length - 1;
    let nextIndex: number | null = null;

    if (e.key === "ArrowRight") nextIndex = index === lastIndex ? 0 : index + 1;
    else if (e.key === "ArrowLeft") nextIndex = index === 0 ? lastIndex : index - 1;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = lastIndex;

    if (nextIndex === null) return;
    e.preventDefault();
    const nextTab = TABS[nextIndex].id;
    setActiveTab(nextTab);
    tabRefs.current[nextTab]?.focus();
  }

  return (
    <main id="event-content" className={styles.detail}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{event.name}</h1>
          <p className={styles.club}>
            <span className="sr-only">Organized by </span>
            <Link href={`/clubs/${event.club.slug}`} className={styles.clubLink}>
              {event.club.name}
            </Link>
          </p>
        </div>
        <ClubMark name={event.club.name} />
      </header>

      <div className={styles.tabs} role="tablist" aria-label={`${event.name} information`}>
        {TABS.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={tabId(tab.id)}
            ref={(node) => {
              tabRefs.current[tab.id] = node;
            }}
            aria-selected={activeTab === tab.id}
            aria-controls={panelId(tab.id)}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className={styles.tab}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Every panel stays in the DOM so the full event copy remains indexable. */}
      <section
        role="tabpanel"
        id={panelId("descriptions")}
        aria-labelledby={tabId("descriptions")}
        hidden={activeTab !== "descriptions"}
        tabIndex={0}
        className={styles.panel}
      >
        <div className={styles.panelGrid}>
          <div className={styles.panelMain}>
            {event.description ? (
              <p className={styles.description}>{event.description}</p>
            ) : (
              <Tba
                title="Details coming soon"
                text={`${event.club.name} is still putting together the brief for ${event.name}. Check back shortly.`}
              />
            )}
            <PrizeBox event={event} />
          </div>
          <Poster event={event} />
        </div>
      </section>

      <section
        role="tabpanel"
        id={panelId("stages")}
        aria-labelledby={tabId("stages")}
        hidden={activeTab !== "stages"}
        tabIndex={0}
        className={styles.panel}
      >
        <h2 className={styles.sectionHeading}>Stages &amp; Timeline</h2>
        {event.stages.length > 0 ? (
          <ol className={styles.stageList}>
            {event.stages.map((stage) => (
              <li key={stage.name} className={styles.stage}>
                <h3 className={styles.stageName}>{stage.name}</h3>
                {stage.when && <p className={styles.stageWhen}>{stage.when}</p>}
                {stage.detail && <p className={styles.stageDetail}>{stage.detail}</p>}
              </li>
            ))}
          </ol>
        ) : (
          <Tba
            title="Timeline coming soon"
            text={`${event.club.name} is finalising the round structure and schedule for ${event.name}. Check back shortly.`}
          />
        )}
      </section>

      <section
        role="tabpanel"
        id={panelId("rules")}
        aria-labelledby={tabId("rules")}
        hidden={activeTab !== "rules"}
        tabIndex={0}
        className={styles.panel}
      >
        <h2 className={styles.sectionHeading}>Rules &amp; Regulations</h2>
        {event.rules.length > 0 ? (
          <ul className={styles.ruleList}>
            {event.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        ) : (
          <Tba
            title="Rulebook coming soon"
            text={`The official rulebook for ${event.name} will be published here before registrations close.`}
          />
        )}
      </section>

      <section
        role="tabpanel"
        id={panelId("contact")}
        aria-labelledby={tabId("contact")}
        hidden={activeTab !== "contact"}
        tabIndex={0}
        className={styles.panel}
      >
        <h2 className={styles.sectionHeading}>Contact Organizers</h2>
        {event.organizers.length > 0 ? (
          <ul className={styles.organizerList}>
            {event.organizers.map((organizer) => (
              <li key={organizer.name} className={styles.organizer}>
                <p className={styles.organizerName}>{organizer.name}</p>
                {organizer.role && <p className={styles.organizerRole}>{organizer.role}</p>}
                {organizer.phone && (
                  <a href={`tel:${organizer.phone.replace(/\s+/g, "")}`} className={styles.organizerContact}>
                    {organizer.phone}
                  </a>
                )}
                {organizer.email && (
                  <a href={`mailto:${organizer.email}`} className={styles.organizerContact}>
                    {organizer.email}
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <Tba
            title="Organizer contacts coming soon"
            text={
              <>
                Point of contact details for {event.name} have not been published yet. Reach{" "}
                <Link href={`/clubs/${event.club.slug}`} className={styles.organizerContact}>
                  {event.club.name}
                </Link>{" "}
                through the club page in the meantime.
              </>
            }
          />
        )}
      </section>
    </main>
  );
}

function Poster({ event }: { event: EventDetailData }) {
  return (
    <div className={styles.poster}>
      {event.poster ? (
        <Image
          src={event.poster}
          alt={`${event.name} poster`}
          width={586}
          height={742}
          className={styles.posterImage}
        />
      ) : (
        <div className={`${styles.posterImage} ${styles.posterFallback}`}>
          <p className={styles.posterFallbackName}>{event.name}</p>
          <p className={styles.posterFallbackNote}>Poster coming soon</p>
        </div>
      )}
    </div>
  );
}

function PrizeBox({ event }: { event: EventDetailData }) {
  // The ₹ is styled separately, so drop one if the source value already carries it.
  const prizePool = (event.prizePool ?? "XX,XXX").replace(/^\s*₹\s*/, "");

  return (
    <div className={styles.prizeBox}>
      <div className={styles.prizeSummary}>
        <TrophyIcon />
        <p className={styles.prizePool}>
          <span className="sr-only">Total prize pool: </span>
          <span className={styles.rupee}>₹</span>
          {prizePool}
        </p>
      </div>

      <ul className={styles.prizeList}>
        {event.prizes.map((prize) => (
          <li key={prize.position} className={styles.prizeRow}>
            <MedalIcon position={prize.position} />
            <span>
              <span className="sr-only">{ordinal(prize.position)} place: </span>
              {prize.amount ?? "XX,XXX"}
            </span>
          </li>
        ))}
      </ul>

      {event.registrationUrl ? (
        <Link
          href={event.registrationUrl}
          className={styles.register}
          aria-label={`Register now for ${event.name}`}
        >
          Register Now <span aria-hidden="true">↗</span>
        </Link>
      ) : (
        <button
          type="button"
          className={styles.register}
          disabled
          title={`Registrations for ${event.name} have not opened yet`}
        >
          Register Now <span aria-hidden="true">↗</span>
        </button>
      )}
    </div>
  );
}

function Tba({ title, text }: { title: string; text: React.ReactNode }) {
  return (
    <div className={styles.tba}>
      <p className={styles.tbaTitle}>{title}</p>
      <p className={styles.tbaText}>{text}</p>
    </div>
  );
}

/** Brand monogram standing in until per-club logo assets are supplied. */
function ClubMark({ name }: { name: string }) {
  return (
    <svg
      className={styles.mark}
      viewBox="0 0 120 120"
      role="img"
      aria-label={`${name} logo`}
    >
      <defs>
        <linearGradient id="club-mark-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff5aa5" />
          <stop offset="55%" stopColor="#e7137d" />
          <stop offset="100%" stopColor="#8d1bb3" />
        </linearGradient>
      </defs>
      <path
        d="M60 4 108 32v56L60 116 12 88V32Z"
        fill="url(#club-mark-gradient)"
      />
      <text
        x="60"
        y="60"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#fff"
        fontFamily="var(--font-tantra)"
        fontSize="58"
      >
        {name.charAt(0).toUpperCase()}
      </text>
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg className={styles.trophy} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 3V2H6v1H2v3a5 5 0 0 0 4.3 4.95A6 6 0 0 0 11 14.92V18H8a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2h-3v-3.08a6 6 0 0 0 4.7-3.97A5 5 0 0 0 22 6V3Zm-14 3V5h2v3.83A3 3 0 0 1 4 6m16 0a3 3 0 0 1-2 2.83V5h2Z" />
    </svg>
  );
}

function MedalIcon({ position }: { position: number }) {
  return (
    <svg className={styles.medal} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.5 1h3l3.2 7h-3Z" fill="#c9c4e4" />
      <path d="M16.5 1h-3l-3.2 7h3Z" fill="#9a93c7" />
      <circle cx="12" cy="15.5" r="7" fill="#e9e6f6" />
      <circle cx="12" cy="15.5" r="5.3" fill="#b9b2dd" />
      <text
        x="12"
        y="15.9"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#241a4c"
        fontSize="7"
        fontWeight="700"
        fontFamily="var(--font-futura)"
      >
        {position}
      </text>
    </svg>
  );
}

function ordinal(n: number): string {
  const suffix = n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
  return `${n}${suffix}`;
}
