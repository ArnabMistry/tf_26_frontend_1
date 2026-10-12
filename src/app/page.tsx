import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { AboutContent } from "@/components/AboutContent";
import { Reveal } from "@/components/Reveal";

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

