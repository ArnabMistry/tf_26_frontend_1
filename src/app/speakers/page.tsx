import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { SpeakersGrid } from "@/components/SpeakersGrid";
import { siteConfig } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Speakers",
  description:
    "Meet keynote speakers, visionary pioneers, and industry leaders sharing insights at TantraFiesta 2026 at IIIT Nagpur.",
  alternates: {
    canonical: "/speakers",
  },
  openGraph: {
    title: `Speakers | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description:
      "Meet keynote speakers, visionary pioneers, and industry leaders sharing insights at TantraFiesta 2026 at IIIT Nagpur.",
    url: `${siteConfig.url}/speakers`,
  },
  twitter: {
    title: `Speakers | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description:
      "Meet keynote speakers, visionary pioneers, and industry leaders sharing insights at TantraFiesta 2026 at IIIT Nagpur.",
  },
};

export default function SpeakersPage() {
  return (
    <div className={styles.page}>
      <a href="#speakers-content" className={styles.skipLink}>
        Skip to speakers
      </a>
      <Navbar currentPath="/speakers" />
      <SpeakersGrid />
    </div>
  );
}
