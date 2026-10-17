"use client";

import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import styles from "./TeamsContent.module.css";

// ─── Types ───────────────────────────────────────────────────────────────────

type Member = {
  name: string;
  btid: string;
  position: "Lead" | "Co-lead" | string;
  image?: string;
  objectPosition?: string; // override per-photo crop; default is "center top"
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

// ─── Data ────────────────────────────────────────────────────────────────────

const BASE = "/Domain-leads-photos/";

const divisions: Division[] = [
  {
    title: "Division 1",
    subtitle: "Execution POC – Prathamesh Kale",
    domains: [
      {
        domain: "Stage",
        members: [
          { name: "Prathamesh Kale",  btid: "BT24CSE159", position: "Lead",    image: "Stage_lead_Prathamesh.jpg" },
          { name: "Darpan Jain",       btid: "BT24CSE212", position: "Co-lead", image: "STAGE_COLEAD_Darpan.jpg" },
        ],
      },
      {
        domain: "Logistics",
        members: [
          { name: "Ayush Kathal",     btid: "BT24CSD064", position: "Lead",    image: "Logistics_Lead_Keshav.jpg" },
          { name: "Kartik Magar",     btid: "BT24ECE094", position: "Co-lead", image: "Logistics_Co-Lead_Kartik.jpeg" },
          { name: "Harshal Mestri",   btid: "BT24CSE088", position: "Co-lead", image: "Logistics_Co-Lead_Harshal.jpg" },
        ],
      },
      {
        domain: "Hospitality",
        members: [
          { name: "Keshav Shukla",    btid: "BT24ECI049", position: "Lead",    image: "Hospitality_lead_keshav.jpg" },
          { name: "Hansraj Mannase",  btid: "BT24CSE116", position: "Co-lead", image: "Hospitality_CO-LEAD_HANSRAJ.jpg" },
          { name: "Gobinath M",       btid: "BT24CSH060", position: "Co-lead", image: "Hospitality-Colead-Gobinath.jpg" },
        ],
      },
      {
        domain: "EM & Operations",
        members: [
          { name: "Narasimha",              btid: "BT24ECE100", position: "Lead",    image: "EM & OPS LEAD.png" },
          { name: "Gaurav Nilesh Borikar",  btid: "BT24ECE028", position: "Co-lead", image: "EM&OPS- CO-LEAD_Gaurav.jpg" },
          { name: "Aditya Gupta",           btid: "BT24ECI026", position: "Co-lead", image: "em_co-lead_aditya_gupta.jpg" },
        ],
      },
      {
        domain: "Stalls",
        members: [
          { name: "Mohit Rathore",   btid: "BT24CSE184", position: "Lead",    image: "Stalls_Lead_Mohit.jpg" },
          { name: "Tanishq Kamble",  btid: "BT24CSE140", position: "Co-lead" },
          { name: "Yashraj Nikam",   btid: "BT24CSE151", position: "Co-lead", image: "Stalls_Co-lead_Yashraj.jpeg" },
        ],
      },
      {
        domain: "Discipline",
        members: [
          { name: "Shivam Khedkar",   btid: "BT24CSA003", position: "Lead",    image: "Discipline_Lead_Shivam.jpg" },
          { name: "Gyanish Dwivedi",  btid: "BT24CSE168", position: "Co-lead", image: "Discipline_co-lead_Gyanish.jpg" },
        ],
      },
    ],
  },
  {
    title: "Division 2",
    subtitle: "Creatives POC – Sarthak Gupta",
    domains: [
      {
        domain: "Design",
        members: [
          { name: "Sarthak Gupta",          btid: "BT24ECE087", position: "Lead",    image: "Design_lead_Sarthak.webp" },
          { name: "Pavankumar Vanacharla",   btid: "BT24CSD038", position: "Co-lead", image: "DESIGN_CO-LEAD_Pavan.jpg" },
          { name: "Rutva Gandhi",            btid: "BT24ECE068", position: "Co-lead", image: "Design_Colead_Rutva.jpg" },
        ],
      },
      {
        domain: "Decor",
        members: [
          { name: "Rhythem Gupta",      btid: "BT24ECE064", position: "Lead",    image: "Decor_Lead_Rhythem.jpg" },
          { name: "Charan Satya Nakka", btid: "BT24CSE142", position: "Co-lead", image: "Decor_Co-Lead_Charan.webp" },
          { name: "Diya Hitesh Patel",  btid: "BT24CSE176", position: "Co-lead", image: "Decor_co-lead_Diya.jpg" },
        ],
      },
      {
        domain: "Content & Anchoring",
        members: [
          { name: "Shantanu Wankhede", btid: "BT24CSE150", position: "Lead", image: "Anchoring_Lead_Shantanu.jpg" },
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
          { name: "Manu Shrivastava",  btid: "BT24CSH008", position: "Lead",              image: "Multimedia_Lead_Manu.JPG" },
          { name: "Akshit Yadav",      btid: "BT24CSE098", position: "Co-lead (Video)" },
          { name: "Dilkhush Choubey",  btid: "BT24ECE065", position: "Co-lead (Photo)",    image: "Multimedia_co-lead_Dilkhush.jpeg" },
          { name: "Suraj Pratap Singh",btid: "BT24CSH041", position: "Co-lead (Editing)",  image: "MULTIMEDIA_CO-LEAD_Suraj.jpg" },
        ],
      },
      {
        domain: "Media",
        members: [
          { name: "Pranjal Baghel", btid: "BT24CSA052", position: "Lead",    image: "Media Lead.jpg" },
          { name: "Ness Dubey",     btid: "BT24CSA053", position: "Co-lead", image: "Media Co-lead.jpg" },
        ],
      },
    ],
  },
  {
    title: "Division 3",
    subtitle: "PR POC – Pranay Ukey",
    domains: [
      {
        domain: "PR Outreach",
        members: [
          { name: "Pranay Ukey",  btid: "BT24ECI045", position: "Lead",    image: "PR_Lead_Pranav.jpg" },
          { name: "Kumar Aryan",  btid: "BT24ECI052", position: "Co-lead", image: "PR__Co-Lead_Aryan.jpg" },
        ],
      },
      {
        domain: "Marketing",
        members: [
          { name: "Abdul Malik",          btid: "BT24CSA046", position: "Lead" },
          { name: "Debapallab Das",        btid: "BT24CSA032", position: "Co-lead" },
          { name: "Sangyan Hari Pushkar",  btid: "BT24ECE128", position: "Co-lead", image: "Marketing_Co-Lead_Sangyan.jpg" },
        ],
      },
    ],
  },
];

// ─── MemberCard ───────────────────────────────────────────────────────────────

function MemberCard({ member }: { member: Member }) {
  const isLead = member.position === "Lead";
  const imageSrc = member.image
    ? member.image.startsWith("/")
      ? member.image
      : `${BASE}${encodeURIComponent(member.image)}`
    : undefined;

  return (
    <article className={styles.card}>
      <div className={`${styles.portrait} ${isLead ? styles.leadPortrait : styles.coleadPortrait}`}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 26vw, 148px"
            className={styles.photo}
            style={member.objectPosition ? { objectPosition: member.objectPosition } : undefined}
          />
        ) : (
          <div className={styles.placeholder} aria-label={`${member.name} photo unavailable`}>
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
      <p className={styles.memberId}>{member.btid}</p>
    </article>
  );
}

// ─── DomainSection ────────────────────────────────────────────────────────────

function DomainSection({ domain }: { domain: Domain }) {
  const leads   = domain.members.filter((m) => m.position === "Lead");
  const coleads = domain.members.filter((m) => m.position !== "Lead");

  return (
    <Reveal variant="rise" className={styles.domainBlock}>
      {/* Domain pill */}
      <span className={styles.domainName}>{domain.domain}</span>

      {/* Empty state */}
      {domain.members.length === 0 && (
        <p className={styles.emptyDomain}>Team coming soon</p>
      )}

      {/* Leads row */}
      {leads.length > 0 && (
        <div className={styles.leadsRow}>
          {leads.map((m) => <MemberCard key={m.btid} member={m} />)}
        </div>
      )}

      {/* Pink connector between lead row and co-lead row */}
      {leads.length > 0 && coleads.length > 0 && (
        <div className={styles.hierarchyConnector} aria-hidden="true" />
      )}

      {/* Co-leads — all in one horizontal row */}
      {coleads.length > 0 && (
        <div className={styles.coleadsRow}>
          {coleads.map((m) => <MemberCard key={m.btid} member={m} />)}
        </div>
      )}
    </Reveal>
  );
}

// ─── DivisionSection ──────────────────────────────────────────────────────────

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

      <div className={styles.domainsGrid}>
        {division.domains.map((domain) => (
          <DomainSection key={domain.domain} domain={domain} />
        ))}
      </div>
    </section>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

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

      <div className={styles.divisions}>
        {divisions.map((div, i) => (
          <DivisionSection key={div.title} division={div} index={i} />
        ))}
      </div>
    </div>
  );
}
