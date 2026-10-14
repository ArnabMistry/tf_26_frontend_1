import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaqExplorer } from "@/components/FaqExplorer";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/seo/jsonld";
import { FAQS_DATA } from "@/data/faqs";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata(
  "Frequently Asked Questions (FAQs)",
  "Find answers to all common questions about TantraFiesta 2026 at IIIT Nagpur — registrations, hackathons, accommodation, travel, prizes, and certificates.",
  "/faqs",
  {
    keywords: [
      "TantraFiesta FAQs",
      "IIIT Nagpur tech fest questions",
      "TantraFiesta accommodation",
      "TantraFiesta hackathon rules",
      "IIIT Nagpur registration fee",
      "TantraFiesta certificates",
      "TantraFiesta prizes",
    ],
  }
);

export default function FaqsPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "FAQs", path: "/faqs" },
  ]);

  const faqSchema = faqPageJsonLd(
    FAQS_DATA.map((f) => ({
      question: f.question,
      answer: f.answer,
    }))
  );

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
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
      <a href="#faq-content" className={styles.skipLink}>
        Skip to questions
      </a>
      <Navbar currentPath="/faqs" />
      <main id="faq-content" className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>FREQUENTLY ASKED QUESTIONS</h1>
          <p className={styles.subtitle}>
            Everything you need to know about participating in TantraFiesta 2026, traveling to IIIT Nagpur, staying on campus, and competing for national glory.
          </p>
        </header>
        <FaqExplorer />
      </main>
      <Footer variant="yellow" />
    </div>
  );
}
