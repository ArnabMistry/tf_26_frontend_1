import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { AboutContent } from "@/components/AboutContent";
import { Reveal } from "@/components/Reveal";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "TantraFiesta 2026 | IIIT Nagpur Tech Fest" },
  description:
    "TantraFiesta 2026 is IIIT Nagpur’s annual national technical festival. Explore this year’s events, competitions, workshops, hackathons, and festival highlights.",
  keywords: [
    "TantraFiesta 2026",
    "IIIT Nagpur",
    "technical festival",
    "annual tech fest",
    "hackathons",
    "coding competitions",
    "robotics challenges",
    "national tech fest",
    "engineering competitions",
  ],
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.fullName,
    title: "TantraFiesta 2026 | IIIT Nagpur Tech Fest",
    description:
      "TantraFiesta 2026 is IIIT Nagpur’s annual national technical festival. Explore this year’s events, competitions, workshops, hackathons, and festival highlights.",
    url: siteConfig.url,
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: "TantraFiesta 2026 at IIIT Nagpur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TantraFiesta 2026 | IIIT Nagpur Tech Fest",
    description:
      "TantraFiesta 2026 is IIIT Nagpur’s annual national technical festival. Explore this year’s events, competitions, workshops, hackathons, and festival highlights.",
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
    creator: "@tantrafiesta",
    site: "@tantrafiesta",
  },
};

// PHOTO GALLERY: Uncomment this import and the matching JSX below to restore the section.
// const PhotoGallery = dynamic(() => import("@/components/PhotoGallery").then(m => m.PhotoGallery), {
//   loading: () => <section aria-label="Photo Gallery" className="min-h-[400px] flex items-center justify-center text-zinc-500 py-16">Loading gallery…</section>,
// });
const TagsMarquee = dynamic(() => import("@/components/TagsMarquee").then(m => m.TagsMarquee));
const Sponsors = dynamic(() => import("@/components/Sponsors").then(m => m.Sponsors), {
  loading: () => <section aria-label="Sponsors" className="min-h-[300px] flex items-center justify-center text-zinc-500 py-12">Loading partners…</section>,
});
const Footer = dynamic(() => import("@/components/Footer").then(m => m.Footer));

export default function Home() {
  return (
    <main className="flex-1 bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat bg-fixed text-white">
      <Hero />
      <AboutSection />
      <TagsMarquee />
      {/* PHOTO GALLERY: Temporarily disabled. Uncomment the component import above and render <PhotoGallery /> here to restore it. */}
      <section className="relative isolate w-full overflow-hidden">
        <AboutContent />
      </section>
      <Sponsors />
      <Reveal variant="fade"><Footer /></Reveal>
    </main>
  );
}

