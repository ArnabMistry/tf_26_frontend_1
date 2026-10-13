import { pageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ComingSoon } from "@/components/ComingSoon";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata(
  "Speakers",
  "Meet keynote speakers, visionary pioneers, and industry leaders sharing insights at TantraFiesta 2026 at IIIT Nagpur.",
  "/speakers",
  {
    keywords: [
      "TantraFiesta speakers",
      "keynote speakers",
      "tech talks",
      "guest lectures",
      "industry leaders",
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

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c"),
        }}
      />
      <a href="#speakers-content" className={styles.skipLink}>
        Skip to speakers
      </a>
      <Navbar currentPath="/speakers" />
      <div id="speakers-content" className="flex-1 flex flex-col justify-center">
        <ComingSoon />
      </div>
      <Footer variant="yellow" />
    </div>
  );
}
