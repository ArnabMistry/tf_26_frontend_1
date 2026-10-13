import { pageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ComingSoon } from "@/components/ComingSoon";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata("Sponsors", "Explore past and present sponsors, corporate partners, and technology enterprises supporting TantraFiesta 2026 at IIIT Nagpur.", "/sponsors");

export default function SponsorsPage() {
  return (
    <div className={styles.page}>
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
