import { pageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { TeamsContent } from "@/components/teams/TeamsContent";

export const metadata: Metadata = pageMetadata(
  "Teams",
  "Meet the passionate team of students behind TantraFiesta 2026 — the organizers, domain leads, and co-leads making IIIT Nagpur's annual tech fest a reality.",
  "/teams",
  {
    keywords: [
      "TantraFiesta team",
      "TantraFiesta organizers",
      "IIIT Nagpur student team",
      "TantraFiesta 2026 team",
      "domain leads",
      "execution team",
      "creatives team",
    ],
  }
);

export default function TeamsPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Teams", path: "/teams" },
  ]);

  return (
    <div className="relative min-h-[100svh] flex flex-col text-white isolate bg-[#241A4C] overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c"),
        }}
      />

      {/* Fixed background layer */}
      <div
        className="fixed inset-0 -z-10 bg-[#241A4C] bg-[url(/assets/bg.webp)] bg-cover bg-center bg-no-repeat pointer-events-none"
        aria-hidden="true"
      />

      <a href="#teams-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[#FFFF1A] focus:px-4 focus:py-2 focus:text-[#241A4C] focus:font-bold">
        Skip to team
      </a>

      <Navbar currentPath="/teams" />

      <main id="teams-content" className="relative flex-1">
        <TeamsContent />
      </main>

      <div className="relative z-20">
        <Footer variant="yellow" />
      </div>
    </div>
  );
}
