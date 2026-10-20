"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import styles from "./TeamsContent.module.css";

// Types

type Member = {
  name: string;
  btid?: string;
  position: "Lead" | "Co-lead" | string;
  image?: string;
  objectPosition?: string;
};

type Domain = {
  domain: string;
  members: Member[];
};

type Division = {
  title: string;
  subtitle: string;
  domains: Domain[];
};

type Secretary = {
  name?: string;
  role?: string;
  image?: string;
};

// Data

const BASE = "/Domain-leads-photos/";

const secretaries: Secretary[] = [
  { role: "General Secretary", name: "Apoorva Mundada" },
  { role: "Technical Secretary", name: "Amulya Yadav" },
];

const divisions: Division[] = [
  {
    title: "Division 1",
    subtitle: "Execution POC - Prathamesh Kale",
    domains: [
      {
        domain: "Stage",
        members: [
          { name: "Prathamesh Kale",  btid: "BT24CSE159", position: "Lead",    image: "Stage_lead_Prathamesh.webp" },
          { name: "Darpan Jain",      btid: "BT24CSE212", position: "Co-lead", image: "STAGE_COLEAD_Darpan.webp" },
        ],
      },
      {
        domain: "Logistics",
        members: [
          { name: "Ayush Kathal",   btid: "BT24CSD064", position: "Lead",    image: "Logistics_Lead_Keshav.webp" },
          { name: "Kartik Magar",   btid: "BT24ECE094", position: "Co-lead", image: "Logistics_Co-Lead_Kartik.webp" },
          { name: "Harshal Mestri", btid: "BT24CSE088", position: "Co-lead", image: "Logistics_Co-Lead_Harshal.webp" },
        ],
      },
      {
        domain: "Hospitality",
        members: [
          { name: "Keshav Shukla",   btid: "BT24ECI049", position: "Lead",    image: "Hospitality_lead_keshav.webp" },
          { name: "Hansraj Mannase", btid: "BT24CSE116", position: "Co-lead", image: "Hospitality_CO-LEAD_HANSRAJ.webp" },
          { name: "Gobinath M",      btid: "BT24CSH060", position: "Co-lead", image: "Hospitality-Colead-Gobinath.webp" },
        ],
      },
      {
        domain: "EM & Operations",
        members: [
          { name: "Narasimha",             btid: "BT24ECE100", position: "Lead",    image: "EM & OPS LEAD.webp" },
          { name: "Gaurav Nilesh Borikar", btid: "BT24ECE028", position: "Co-lead", image: "EM&OPS- CO-LEAD_Gaurav.webp" },
          { name: "Aditya Gupta",          btid: "BT24ECI026", position: "Co-lead", image: "em_co-lead_aditya_gupta.webp" },
        ],
      },
      {
        domain: "Stalls",
        members: [
          { name: "Mohit Rathore",  btid: "BT24CSE184", position: "Lead",    image: "Stalls_Lead_Mohit.webp" },
          { name: "Tanishq Kamble", btid: "BT24CSE140", position: "Co-lead" },
          { name: "Yashraj Nikam",  btid: "BT24CSE151", position: "Co-lead", image: "Stalls_Co-lead_Yashraj.webp" },
        ],
      },
      {
        domain: "Discipline",
        members: [
          { name: "Shivam Khedkar",  btid: "BT24CSA003", position: "Lead",    image: "Discipline_Lead_Shivam.webp", objectPosition: "center top" },
          { name: "Gyanish Dwivedi", btid: "BT24CSE168", position: "Co-lead", image: "Discipline_co-lead_Gyanish.webp" },
        ],
      },
    ],
  },
  {
    title: "Division 2",
    subtitle: "Creatives POC - Sarthak Gupta",
    domains: [
      {
        domain: "Design",
        members: [
          { name: "Sarthak Gupta",        btid: "BT24ECE087", position: "Lead",    image: "Design_lead_Sarthak.webp" },
          { name: "Pavankumar Vanacharla", btid: "BT24CSD038", position: "Co-lead", image: "DESIGN_CO-LEAD_Pavan.webp" },
          { name: "Rutva Gandhi",          btid: "BT24ECE068", position: "Co-lead", image: "Design_Colead_Rutva.webp" },
        ],
      },
      {
        domain: "Decor",
        members: [
          { name: "Rhythem Gupta",      btid: "BT24ECE064", position: "Lead",    image: "Decor_Lead_Rhythem.webp" },
          { name: "Charan Satya Nakka", btid: "BT24CSE142", position: "Co-lead", image: "Decor_Co-Lead_Charan.webp" },
          { name: "Diya Hitesh Patel",  btid: "BT24CSE176", position: "Co-lead", image: "Decor_co-lead_Diya.webp" },
        ],
      },
      {
        domain: "Content & Anchoring",
        members: [
          { name: "Shantanu Wankhede", btid: "BT24CSE150", position: "Lead", image: "Anchoring_Lead_Shantanu.webp" },
        ],
      },
      {
        domain: "Website",
        members: [
          { name: "Sambodhi Bhowal", btid: "BT24CSD065", position: "Lead",    image: "webdev_lead_sambodhi.webp" },
          { name: "Arnab Mistry",    btid: "BT24CSE010", position: "Co-lead", image: "webdev_co-lead_arnab_mistry.webp" },
        ],
      },
      {
        domain: "Multimedia",
        members: [
          { name: "Manu Shrivastava",   btid: "BT24CSH008", position: "Lead",              image: "Multimedia_Lead_Manu.webp" },
          { name: "Akshit Yadav",       btid: "BT24CSE098", position: "Co-lead (Video)" },
          { name: "Dilkhush Choubey",   btid: "BT24ECE065", position: "Co-lead (Photo)",   image: "Multimedia_co-lead_Dilkhush.webp" },
          { name: "Suraj Pratap Singh", btid: "BT24CSH041", position: "Co-lead (Editing)", image: "MULTIMEDIA_CO-LEAD_Suraj.webp" },
        ],
      },
      {
        domain: "Media",
        members: [
          { name: "Pranjal Baghel", btid: "BT24CSA052", position: "Lead",    image: "Media Lead.webp" },
          { name: "Ness Dubey",     btid: "BT24CSA053", position: "Co-lead", image: "Media Co-lead.webp" },
        ],
      },
    ],
  },
  {
    title: "Division 3",
    subtitle: "PR POC - Pranay Ukey",
    domains: [
      {
        domain: "PR Outreach",
        members: [
          { name: "Pranay Ukey", btid: "BT24ECI045", position: "Lead",    image: "PR_Lead_Pranav.webp" },
          { name: "Kumar Aryan", btid: "BT24ECI052", position: "Co-lead", image: "PR__Co-Lead_Aryan.webp" },
        ],
      },
      {
        domain: "Corporate",
        members: [],
      },
      {
        domain: "Marketing",
        members: [
          { name: "Abdul Malik",          btid: "BT24CSA046", position: "Lead" },
          { name: "Debapallab Das",       btid: "BT24CSA032", position: "Co-lead" },
          { name: "Sangyan Hari Pushkar", btid: "BT24ECE128", position: "Co-lead", image: "Marketing_Co-Lead_Sangyan.webp" },
        ],
      },
    ],
  },
];

// ─── Row In-View Hook ─────────────────────────────────────────────────────────

function useRowInView(options?: { rootMargin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: options?.rootMargin ?? "250px 0px",
        threshold: 0.01,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.rootMargin]);

  return { ref, isInView };
}

// MemberCard

function MemberCard({ member, shouldLoad = false }: { member: Member; shouldLoad?: boolean }) {
  const [imgError, setImgError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const isLead = member.position === "Lead";

  const imageSrc =
    shouldLoad && member.image && !imgError
      ? `${BASE}${encodeURIComponent(member.image)}`
      : null;

  return (
    <article className={styles.card}>
      <div
        className={`${styles.portrait} ${isLead ? styles.leadPortrait : styles.coleadPortrait}`}
        aria-label={`${member.name} photo`}
      >
        {imageSrc ? (
          <>
            {!isLoaded && (
              <div className={styles.placeholder} aria-hidden="true">
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <circle cx="60" cy="42" r="22" />
                  <path d="M20 108c4-26 20-40 40-40s36 14 40 40" />
                </svg>
              </div>
            )}
            <Image
              src={imageSrc}
              alt={`${member.name} - ${member.position}`}
              fill
              sizes="(max-width: 680px) 24vw, 132px"
              className={`${styles.photo} ${isLoaded ? styles.photoLoaded : styles.photoLoading}`}
              style={member.objectPosition ? { objectPosition: member.objectPosition } : undefined}
              onLoad={() => setIsLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        ) : (
          <div className={styles.placeholder}>
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="42" r="22" />
              <path d="M20 108c4-26 20-40 40-40s36 14 40 40" />
            </svg>
          </div>
        )}
        <span className={`${styles.badge} ${isLead ? styles.leadBadge : styles.coleadBadge}`}>
          {member.position}
        </span>
      </div>
      <h4 className={styles.memberName}>{member.name}</h4>
    </article>
  );
}

// SecretaryCard

function SecretaryCard({
  secretary,
  index,
  shouldLoad = false,
}: {
  secretary: Secretary;
  index: number;
  shouldLoad?: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageSrc = shouldLoad && secretary.image ? secretary.image : null;

  return (
    <article className={`${styles.card} ${styles.secretaryCard}`} id={`secretary-card-${index}`}>
      <div className={`${styles.portrait} ${styles.secretaryPortrait}`}>
        {imageSrc ? (
          <>
            {!isLoaded && (
              <div className={styles.placeholder} aria-hidden="true">
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <circle cx="60" cy="42" r="22" />
                  <path d="M20 108c4-26 20-40 40-40s36 14 40 40" />
                </svg>
              </div>
            )}
            <Image
              src={imageSrc}
              alt={secretary.name ?? "Secretary"}
              fill
              sizes="(max-width: 680px) 28vw, 160px"
              className={`${styles.photo} ${isLoaded ? styles.photoLoaded : styles.photoLoading}`}
              onLoad={() => setIsLoaded(true)}
            />
          </>
        ) : (
          <div className={styles.placeholder}>
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="42" r="22" />
              <path d="M20 108c4-26 20-40 40-40s36 14 40 40" />
            </svg>
          </div>
        )}
        <span className={`${styles.badge} ${styles.secretaryBadge}`}>
          {secretary.role ?? "Secretary"}
        </span>
      </div>
      <h4 className={styles.memberName}>{secretary.name}</h4>
    </article>
  );
}

// SecretariesSection — loads only when in view

function SecretariesSection() {
  const { ref, isInView } = useRowInView({ rootMargin: "250px 0px" });

  return (
    <Reveal variant="rise" className={styles.secretariesSection}>
      <div className={styles.divisionTitleRow} style={{ marginBottom: "1.5rem" }}>
        <span className={styles.divisionLine} aria-hidden="true" />
        <h2 className={styles.sectionLabel}>Secretaries</h2>
        <span className={styles.divisionLine} aria-hidden="true" />
      </div>
      <div ref={ref} className={styles.secretariesRow}>
        {secretaries.map((sec, i) => (
          <SecretaryCard key={i} secretary={sec} index={i} shouldLoad={isInView} />
        ))}
      </div>
    </Reveal>
  );
}

// DomainBlock — centered heading + all members centered side-by-side (loads row images when scrolled into view)

function DomainBlock({ domain }: { domain: Domain }) {
  const { ref, isInView } = useRowInView({ rootMargin: "250px 0px" });
  const leads   = domain.members.filter((m) => m.position === "Lead");
  const coleads = domain.members.filter((m) => m.position !== "Lead");
  const hasBoth = leads.length > 0 && coleads.length > 0;

  return (
    <Reveal variant="rise" className={styles.domainBlock}>
      {/* Domain name — centered heading */}
      <h3 className={styles.domainName}>{domain.domain}</h3>

      {/* Members: lead(s) | divider | co-lead(s), all centered */}
      {domain.members.length === 0 ? (
        <p className={styles.emptyDomain}>Team coming soon</p>
      ) : (
        <div ref={ref} className={styles.membersRow}>
          {leads.map((m) => (
            <MemberCard key={m.btid ?? m.name} member={m} shouldLoad={isInView} />
          ))}
          {hasBoth && <div className={styles.memberDivider} aria-hidden="true" />}
          {coleads.map((m) => (
            <MemberCard key={m.btid ?? m.name} member={m} shouldLoad={isInView} />
          ))}
        </div>
      )}
    </Reveal>
  );
}

// DivisionSection

function DivisionSection({ division, index }: { division: Division; index: number }) {
  return (
    <section className={styles.divisionSection} aria-labelledby={`div-heading-${index}`}>
      <Reveal variant="scale" animateOnMount={index === 0}>
        <div className={styles.divisionHeader}>
          <div className={styles.divisionTitleRow}>
            <span className={styles.divisionLine} aria-hidden="true" />
            <h2 id={`div-heading-${index}`} className={styles.divisionTitle}>
              {division.title}
            </h2>
            <span className={styles.divisionLine} aria-hidden="true" />
          </div>
          <p className={styles.divisionSubtitle}>{division.subtitle}</p>
        </div>
      </Reveal>

      <div className={styles.domainsStack}>
        {division.domains.map((domain) => (
          <DomainBlock key={domain.domain} domain={domain} />
        ))}
      </div>
    </section>
  );
}

// Main export

export function TeamsContent() {
  return (
    <div className={styles.wrapper}>
      <Reveal variant="scale" animateOnMount className={styles.pageHeading}>
        <header>
          <h1 className="font-tantra text-7xl uppercase leading-none tracking-wide text-white sm:text-8xl md:text-9xl">
            Teams
          </h1>
          <p className={styles.pageSubheading}>
            The minds and muscle behind TantraFiesta 2026
          </p>
        </header>
      </Reveal>

      {/* Secretaries */}
      <SecretariesSection />

      {/* Divisions */}
      <div className={styles.divisions}>
        {divisions.map((div, i) => (
          <DivisionSection key={div.title} division={div} index={i} />
        ))}
      </div>
    </div>
  );
}