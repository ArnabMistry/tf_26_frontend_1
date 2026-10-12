import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AboutContent } from "@/components/AboutContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | History of TF",
  description: "Learn about TantraFiesta, its history, mission, milestone editions, and student innovation at IIIT Nagpur.",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-[100svh] flex flex-col text-white isolate bg-[#241A4C] overflow-x-hidden">
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


