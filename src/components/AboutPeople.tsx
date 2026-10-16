import Image from "next/image";
import styles from "./AboutPeople.module.css";

const portraits = "/assets/college%20dignitaries%20webp/";

type Person = { name: string; role: string; image?: string };

const groups: { title: string; people: Person[] }[] = [
  {
    title: "College Dignitaries",
    people: [
      { name: "Dr. Prem Lal Patel", role: "Director", image: "director.webp" },
      { name: "Dr. Mayur Parate", role: "Registrar", image: "mayur_registrar.webp" },
    ],
  },
  {
    title: "Associate Deans",
    people: [
      { name: "Dr. Tausif Diwan", role: "Academic", image: "academic dean.webp" },
      { name: "Dr. Nileshchandra Pikle", role: "Student Welfare" },
      { name: "Dr. Aatish Daryapurkar", role: "Planning & Development", image: "planning_and_developement.webp" },
      { name: "Dr. Rashmi Pandhare", role: "Research & Development", image: "research_and_dev.webp" },
    ],
  },
  {
    title: "Heads of Department",
    people: [
      { name: "Dr. Milind R. Penurkar", role: "CSE HOD", image: "cse_HOD.webp" },
      { name: "Dr. Paritosh D. Peshwe", role: "ECE HOD", image: "ece_hod.webp" },
      { name: "Dr. Chandrashekhar Sakode", role: "Basic Science HOD", image: "Bs_hod.webp" },
    ],
  },
  {
    title: "SAC Coordinator",
    people: [
      { name: "Dr. Kaushlendra Sharma", role: "SAC Coordinator", image: "kaushlendra_sac_co-ordinator.webp" },
    ],
  },
  {
    title: "SAC Co-Coordinators",
    people: [
      { name: "Dr. Rahul Semwal", role: "SAC Co-Coordinator", image: "rahul_sac_co-coordinator.webp" },
      { name: "Dr. Rajanish Kumar Singh", role: "SAC Co-Coordinator", image: "rajnish_sac_co-coordinator.webp" },
      { name: "Dr. Ujwal Sureshrao Warbhe", role: "SAC Co-Coordinator", image: "ujwal_sac_co-coordinator.webp" },
    ],
  },
  {
    title: "SAC Faculty Members",
    people: [
      { name: "Dr. Anup Kumar Rajak", role: "SAC Member", image: "anup_sac_member.webp" },
      { name: "Mr. Pravin Satyavan Bhagat", role: "SAC Member", image: "pravin_sac_member.webp" },
      { name: "Mrs. Ruchira Nitin Selote", role: "SAC Member", image: "ruchira_sac_member.webp" },
      { name: "Ms. Jaya Pathak", role: "SAC Member" },
      { name: "Ms. Rasika Ghonge", role: "SAC Member", image: "Rasika_sac_member.webp" },
      { name: "Mr. Sunil Dhole", role: "SAC Member" },
    ],
  },
];

export function AboutPeople() {
  return (
    <div className={styles.groups}>
      {groups.map((group) => (
        <section className={styles.group} key={group.title} aria-label={group.title}>
          <div className={styles.headingRow}>
            <span aria-hidden="true" />
            <h2 className="font-tantra">{group.title}</h2>
            <span aria-hidden="true" />
          </div>
          <div className={`${styles.grid} ${group.title === "College Dignitaries" ? styles.dignitariesGrid : ""}`}>
            {group.people.map((person) => (
              <article className={styles.card} key={person.name}>
                <div className={styles.portrait}>
                  {person.image ? (
                    <Image
                      src={`${portraits}${encodeURIComponent(person.image)}`}
                      alt={person.name}
                      fill
                      sizes="(max-width: 600px) 80vw, (max-width: 1024px) 42vw, 260px"
                      className={styles.photo}
                    />
                  ) : (
                    <div className={styles.placeholder} aria-label={`${person.name} portrait unavailable`}>
                      <svg viewBox="0 0 120 120" aria-hidden="true">
                        <circle cx="60" cy="42" r="22" />
                        <path d="M20 108c4-26 20-40 40-40s36 14 40 40" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3>{person.name}</h3>
                <p>{person.role}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
