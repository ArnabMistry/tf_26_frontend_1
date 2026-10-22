import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ItineraryContent } from "@/components/itinerary/ItineraryContent";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = pageMetadata(
  "Itinerary",
  "Master 4-day schedule and event timeline for TantraFiesta 2026 at IIIT Nagpur — Official Launch, Hackathons, Robotics, Conclaves, and Grand Finale.",
  "/itinerary",
  {
    keywords: [
      "TantraFiesta itinerary",
      "TantraFiesta schedule",
      "TantraFiesta 2026 dates",
      "IIIT Nagpur tech fest schedule",
      "hackathon schedule",
      "robowars schedule",
      "festival timeline",
      "TantraFiesta 2026",
    ],
  }
);

export default function ItineraryPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Itinerary", path: "/itinerary" },
  ]);

  return (
    <div className="relative min-h-[100svh] flex flex-col text-white isolate bg-[#241A4C] overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c"),
        }}
      />
      <div
        className="fixed inset-0 -z-10 bg-[#241A4C] bg-[url(/assets/bg.webp)] bg-cover bg-center bg-no-repeat pointer-events-none"
        aria-hidden="true"
      />
      <a
        href="#itinerary-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[#FFFF1A] focus:px-4 focus:py-2 focus:text-[#241A4C] focus:font-bold"
      >
        Skip to itinerary
      </a>
      <Navbar currentPath="/itinerary" />
      <main id="itinerary-content" className="relative flex-1">
        <ItineraryContent />
      </main>
      <div className="relative z-20">
        <Footer variant="yellow" />
      </div>
    </div>
  );
}

