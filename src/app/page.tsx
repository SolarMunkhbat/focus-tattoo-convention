import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ArtistsSection from "@/components/ArtistsSection";
import ScheduleSection from "@/components/ScheduleSection";
import SponsorsSection from "@/components/SponsorsSection";
import GallerySection from "@/components/GallerySection";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ArtistsSection />
        <ScheduleSection />
        <SponsorsSection />
        <GallerySection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
