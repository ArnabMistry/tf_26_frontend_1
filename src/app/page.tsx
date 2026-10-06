import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { PhotoGallery } from "@/components/PhotoGallery";
import { TagsMarquee } from "@/components/TagsMarquee";
import { Sponsors } from "@/components/Sponsors";
import { Footer } from "@/components/Footer";
import { StarLoader } from "@/components/StarLoader";

export default function Home() {
  return (
    <main className="flex-1 bg-zinc-950 text-white">
      <StarLoader />
      <Hero />
      <AboutSection />
      <PhotoGallery />
      <TagsMarquee />
      <Sponsors />
      <Footer />
    </main>
  );
}

