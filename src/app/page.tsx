import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { AboutContent } from "@/components/AboutContent";

const PhotoGallery = dynamic(() => import("@/components/PhotoGallery").then(m => m.PhotoGallery), {
  loading: () => <section aria-label="Photo Gallery" className="min-h-[400px] flex items-center justify-center text-zinc-500 py-16">Loading gallery…</section>,
});
const TagsMarquee = dynamic(() => import("@/components/TagsMarquee").then(m => m.TagsMarquee));
const Sponsors = dynamic(() => import("@/components/Sponsors").then(m => m.Sponsors), {
  loading: () => <section aria-label="Sponsors" className="min-h-[300px] flex items-center justify-center text-zinc-500 py-12">Loading partners…</section>,
});
const Footer = dynamic(() => import("@/components/Footer").then(m => m.Footer));

export default function Home() {
  return (
    <main className="flex-1 bg-zinc-950 text-white">
      <Hero />
      <AboutSection />
      <PhotoGallery />
      <TagsMarquee />
      <section
        className="relative isolate w-full overflow-hidden"
        style={{
          backgroundColor: "#241A4C",
          backgroundImage: "url('/assets/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <AboutContent />
      </section>
      <Sponsors />
      <Footer />
    </main>
  );
}

