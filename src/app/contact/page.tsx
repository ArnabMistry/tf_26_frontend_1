import { pageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata("Contact", "Get in touch with the TantraFiesta organizing team for partnerships, student inquiries, sponsorships, and event details.", "/contact");

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
          {/* TODO: Replace with real coordinator details before launch */}
          <p className="text-zinc-400 text-sm col-span-full">
            Coordinator contact details will be published shortly. For urgent queries, reach us at{" "}
            <a href="mailto:support@tantrafiesta.in" className="underline hover:text-white transition-colors">
              support@tantrafiesta.in
            </a>{" "}
            or call{" "}
            <a href="tel:+918604551326" className="underline hover:text-white transition-colors">
              +91 86045 51326
            </a>.
          </p>
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
