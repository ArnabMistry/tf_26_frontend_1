import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SponsorsGrid } from "@/components/SponsorsGrid";
import { siteConfig } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "Explore past and present sponsors, corporate partners, and technology enterprises supporting TantraFiesta 2026 at IIIT Nagpur.",
  alternates: {
    canonical: "/sponsors",
  },
  openGraph: {
    title: `Sponsors | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description:
      "Explore past and present sponsors, corporate partners, and technology enterprises supporting TantraFiesta 2026 at IIIT Nagpur.",
    url: `${siteConfig.url}/sponsors`,
  },
  twitter: {
    title: `Sponsors | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description:
      "Explore past and present sponsors, corporate partners, and technology enterprises supporting TantraFiesta 2026 at IIIT Nagpur.",
  },
};

export default function SponsorsPage() {
  return (
    <div className={styles.page}>
      <a href="#sponsors-content" className={styles.skipLink}>
        Skip to sponsors
      </a>
      <Navbar currentPath="/sponsors" />
      <SponsorsGrid />
      <Footer variant="yellow" />
    </div>
  );
}
