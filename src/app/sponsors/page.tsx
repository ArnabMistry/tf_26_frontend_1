import { pageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ComingSoon } from "@/components/ComingSoon";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata(
  "Sponsors",
  "Explore past and present sponsors, corporate partners, and technology enterprises supporting TantraFiesta 2026 at IIIT Nagpur.",
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
      <div id="sponsors-content" className="flex-1 flex flex-col justify-center">
        <ComingSoon />
      </div>
      <Footer variant="yellow" />
    </div>
  );
}
