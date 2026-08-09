import fs from "fs";
import path from "path";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import InkDivider from "@/components/InkDivider";
import ArtistPosterSlideshow from "@/components/ArtistPosterSlideshow";
import ScheduleSection from "@/components/ScheduleSection";
import BattlesSection from "@/components/BattlesSection";
import SponsorsSection from "@/components/SponsorsSection";
import GallerySection from "@/components/GallerySection";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const IMAGE_EXT = /\.(png|jpe?g|webp|avif)$/i;

function getPosterImages() {
  const dir = path.join(process.cwd(), "public", "posters");
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => IMAGE_EXT.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => `/posters/${f}`);
  } catch {
    return [];
  }
}

export default function Home() {
  const posterImages = getPosterImages();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <ArtistPosterSlideshow images={posterImages} />
        <InkDivider />
        <ScheduleSection />
        <BattlesSection />
        <SponsorsSection />
        <InkDivider />
        <GallerySection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
