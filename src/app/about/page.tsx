import { pageMetadata } from "@/lib/seo/metadata";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AboutContent } from "@/components/AboutContent";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata(
  "About",
  "Discover TantraFiesta 2026, IIIT Nagpur’s annual national technical festival, and the ideas, team, and student innovation behind it.",
  "/about",
  {
    keywords: [
      "About TantraFiesta",
      "TantraFiesta 2026",
      "IIIT Nagpur tech fest history",
      "technical festival central india",
      "student innovation",
      "annual tech fest",
    ],
  }
);

export default function AboutPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);

  return (
    <div className="relative min-h-[100svh] flex flex-col text-white isolate bg-[#241A4C] overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c"),
        }}
      />
      {/* Semantic H1 for heading hierarchy */}
      <h1 className="sr-only">About TantraFiesta 2026 — IIIT Nagpur</h1>

      {/* Fixed background layer covering viewport */}
      <div
        className="fixed inset-0 -z-10 bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat pointer-events-none"
        aria-hidden="true"
      />

      <Navbar currentPath="/about" />
      <AboutContent />

      {/* === FOOTER === */}
      <div className="relative z-20">
        <Footer variant="yellow" />
      </div>
    </div>
  );
}
