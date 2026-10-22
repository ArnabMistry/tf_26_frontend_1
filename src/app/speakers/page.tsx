import { pageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SpeakersContent } from "@/components/speakers/SpeakersContent";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata(
  "Speakers",
  "Meet keynote speakers, visionary pioneers, and industry leaders sharing insights at TantraFiesta 2026 at IIIT Nagpur - Vanshika Pandey, Santosh Kumar Mishra, Dr. Chandan Jha, and Ajay Suneja.",
  "/speakers",
  {
    keywords: [
      "TantraFiesta speakers",
      "keynote speakers",
      "panel guests",
      "tech talks",
      "guest lectures",
      "industry leaders",
      "Vanshika Pandey",
      "Santosh Kumar Mishra",
      "Dr. Chandan Jha",
      "Ajay Suneja",
      "IIIT Nagpur speakers",
      "TantraFiesta 2026",
    ],
  }
);

export default function SpeakersPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Speakers", path: "/speakers" },
  ]);

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "TantraFiesta 2026 - Ideas | Industry | Insights Panel",
    startDate: "2026-10-25T18:00:00+05:30",
    endDate: "2026-10-25T19:45:00+05:30",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Amphitheatre, IIIT Nagpur",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Survey No. 140,141/1 behind Br. Sheshrao Wankhade Shetkari Sahkari Soot Girni, Village - Waranga, PO - Dongargaon(Butibori)",
        addressLocality: "Nagpur",
        postalCode: "441108",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
    },
    description: "Keynote panel session featuring Vanshika Pandey, Santosh Kumar Mishra, Dr. Chandan Jha, and Ajay Suneja at TantraFiesta 2026.",
    performer: [
      {
        "@type": "Person",
        name: "Vanshika Pandey",
        jobTitle: "Senior Software Engineer & AI Developer Advocate",
      },
      {
        "@type": "Person",
        name: "Santosh Kumar Mishra",
        jobTitle: "Director of AI Innovation, Alta School of Technology",
      },
      {
        "@type": "Person",
        name: "Dr. Chandan Jha",
        jobTitle: "Associate Vice President, GeeksforGeeks",
      },
      {
        "@type": "Person",
        name: "Ajay Suneja",
        jobTitle: "Senior Software Engineer, Adidas",
      },
    ],
    organizer: {
      "@type": "Organization",
      name: "TantraFiesta, IIIT Nagpur",
      url: "https://www.tantrafiesta.in",
    },
  };

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <a href="#speakers-content" className={styles.skipLink}>
        Skip to speakers
      </a>
      <Navbar currentPath="/speakers" />
      <main id="speakers-content" className="relative flex-1">
        <SpeakersContent />
      </main>
      <Footer variant="yellow" />
    </div>
  );
}
