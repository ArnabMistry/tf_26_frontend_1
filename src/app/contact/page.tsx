import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { siteConfig } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the TantraFiesta organizing team for partnerships, student inquiries, sponsorships, and event details.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: `Contact | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description:
      "Get in touch with the TantraFiesta organizing team for partnerships, student inquiries, sponsorships, and event details.",
    url: `${siteConfig.url}/contact`,
  },
  twitter: {
    title: `Contact | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description:
      "Get in touch with the TantraFiesta organizing team for partnerships, student inquiries, sponsorships, and event details.",
  },
};

const directions = [
  {
    title: "From Railway Station",
    icon: "🚉",
    steps: [
      "Take a cab to Sitabuldi (Panchsheel Square) and board a bus to IIIT. (Bus timings below)",
      "Take the Blue Line Metro to Sitabuldi or South Airport Metro Station and catch a bus from there.",
      "From Sitabuldi, you can also take a bus towards Butibori and get down near IIIT Nagpur highway — then take an E-Rickshaw.",
      "You can also take a cab directly to IIIT Nagpur.",
      "Book an auto.",
    ],
  },
  {
    title: "From Airport",
    icon: "✈️",
    steps: [
      "Take a bus to Butibori from South Airport Metro Station / Airport — then take an E-Rickshaw from the highway.",
      "Take a cab directly to IIIT Nagpur.",
      "Book an auto.",
    ],
  },
  {
    title: "From Sitabuldi Bus Stop",
    icon: "🚍",
    steps: [
      "From Sitabuldi (Panchsheel Square), board a bus to IIIT. (Bus timings below)",
      "Take a bus towards Butibori and get down near IIIT Nagpur highway — then take an E-Rickshaw.",
      "Take a cab directly to IIIT Nagpur.",
      "Book an auto.",
    ],
  },
  {
    title: "From Butibori",
    icon: "🛺",
    steps: [
      "Directly take an E-Rickshaw to IIIT Nagpur.",
      "Board a bus from Butibori towards Nagpur, get down near IIIT highway and take an E-Rickshaw.",
    ],
  },
];

const busTimings = [
  { nagpur: "6:55 AM", waranga: "7:55 AM" },
  { nagpur: "8:10 AM", waranga: "9:10 AM" },
  { nagpur: "9:25 AM", waranga: "10:25 AM" },
  { nagpur: "10:30 AM", waranga: "11:30 AM" },
  { nagpur: "11:10 AM", waranga: "12:10 PM" },
  { nagpur: "1:10 PM", waranga: "2:10 PM" },
  { nagpur: "1:25 PM", waranga: "2:25 PM" },
  { nagpur: "2:15 PM", waranga: "3:15 PM" },
  { nagpur: "3:40 PM", waranga: "4:40 PM" },
  { nagpur: "4:45 PM", waranga: "5:45 PM" },
  { nagpur: "5:05 PM", waranga: "6:05 PM" },
  { nagpur: "7:15 PM", waranga: "8:15 PM" },
];

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <Navbar currentPath="/contact" />
      <main className={styles.main}>
        <h1 className={`font-tantra ${styles.title}`}>Contact Us</h1>

        <section aria-label="Organizing team contacts" className={styles.contacts}>
          {/* Contact names, roles and phone numbers are placeholders from the design. */}
          {Array.from({ length: 4 }, (_, index) => (
            <article className={styles.contactCard} key={index}>
              <h2>Name</h2>
              <p className={styles.role}>X Lead</p>
              <p className={styles.phone}>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                  <path d="m6.6 10.8 2.8-2.1a1 1 0 0 0 .3-1.2L7.4 2.7a1 1 0 0 0-1.1-.5L2.8 3A1 1 0 0 0 2 4c0 9.9 8.1 18 18 18a1 1 0 0 0 1-.8l.8-3.5a1 1 0 0 0-.5-1.1l-4.8-2.3a1 1 0 0 0-1.2.3l-2.1 2.8a15.2 15.2 0 0 1-6.6-6.6Z" />
                </svg>
                +91 XXXXXXXXXX
              </p>
              <a href="mailto:tantrafiesta.marketing@iiitn.ac.in">
                tantrafiesta.marketing@iiitn.ac.in
              </a>
            </article>
          ))}
        </section>

        <section id="how-to-reach" aria-labelledby="directions-heading" className={styles.directions}>
          <h2 id="directions-heading" className={styles.sectionTitle}>How to reach IIIT Nagpur?</h2>
          <div className={styles.directionGrid}>
            {directions.map(({ title, icon, steps }) => (
              <article className={styles.infoCard} key={title}>
                <h3><span aria-hidden="true">{icon}</span> {title}</h3>
                <ul>
                  {steps.map((step) => <li key={step}>{step}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="bus-heading" className={`${styles.infoCard} ${styles.timetable}`}>
          <h2 id="bus-heading"><span aria-hidden="true">🕒</span> AC Bus Timetable (Nagpur ↔ Waranga)</h2>
          <table aria-labelledby="bus-heading">
            <caption className="sr-only">Daily AC bus service between Nagpur and Waranga. Departure times from each location.</caption>
            <thead>
              <tr><th scope="col">Serial No.</th><th scope="col">Nagpur</th><th scope="col">IIIT NAGPUR</th></tr>
            </thead>
            <tbody>
              {busTimings.map((timing, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{timing.nagpur}</td>
                  <td>{timing.waranga}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section aria-labelledby="auto-heading" className={`${styles.infoCard} ${styles.autoContact}`}>
          <h2 id="auto-heading"><span aria-hidden="true">🚖</span> Auto Contact</h2>
          <p>Mahesh – <a href="tel:+919372635739">9372635739</a></p>
          <p>(Approx. Rs. 500 – Rs. 600 from Nagpur to IIIT)</p>
        </section>
      </main>
      <Footer variant="yellow" />
    </div>
  );
}
