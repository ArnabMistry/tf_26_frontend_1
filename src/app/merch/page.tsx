import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MerchStore } from "@/components/merch/MerchStore";
import styles from "./page.module.css";

/**
 * The TF 26 merch drop.
 *
 * Deliberately unlisted: it is a real public page, but it is linked from no
 * navigation and left out of the sitemap, so it is reached by sharing the URL.
 * Adding it to `src/components/Navbar.tsx` and `src/app/sitemap.ts` is all it
 * would take to surface it later.
 */
export const metadata: Metadata = pageMetadata(
  "TF 26 Merch",
  "The official TantraFiesta 2026 merchandise drop — limited-run tees and hoodies, paid for online and collected on campus.",
  "/merch",
  {
    keywords: [
      "TantraFiesta merch",
      "TF 26 merchandise",
      "TantraFiesta 2026 t-shirt",
      "IIIT Nagpur fest merchandise",
      "tech fest hoodie",
    ],
  }
);

export default function MerchPage() {
  return (
    <div className={styles.page}>
      <a href="#merch-content" className={styles.skipLink}>
        Skip to the merch
      </a>
      <Navbar currentPath="/merch" />

      <main id="merch-content" className={styles.main}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Limited drop · TantraFiesta 2026</span>
          <h1 className={styles.title}>TF 26 MERCH</h1>
          <p className={styles.subtitle}>
            Wear the fest. A single limited run, printed once — pay online, collect it on campus with your Fest ID.
          </p>
        </header>

        <MerchStore />
      </main>

      <Footer />
    </div>
  );
}
