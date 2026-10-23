import { pageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CurrentSponsors } from "@/components/Sponsors";
import { Reveal } from "@/components/Reveal";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata(
  "Sponsors",
  "Explore the official sponsors, corporate partners, and technology enterprises supporting TantraFiesta 2026 at IIIT Nagpur.",
  "/sponsors",
  {
    keywords: [
      "TantraFiesta sponsors",
      "sponsorship partners",
      "corporate partners",
      "IIIT Nagpur sponsors",
      "brand partners",
      "TantraFiesta 2026",
    ],
  }
);

export default function SponsorsPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Sponsors", path: "/sponsors" },
  ]);

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c"),
        }}
      />
      <a href="#sponsors-content" className={styles.skipLink}>
        Skip to sponsors
      </a>
      <Navbar currentPath="/sponsors" />
      <main id="sponsors-content" className="flex-1 w-full flex flex-col items-center">
        <CurrentSponsors headingTag="h1" />
      </main>
      <Reveal variant="fade">
        <Footer />
      </Reveal>
    </div>
  );
}
