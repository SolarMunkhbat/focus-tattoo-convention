import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import InkDivider from "@/components/InkDivider";
import ArtistsSection from "@/components/ArtistsSection";
import ScheduleSection from "@/components/ScheduleSection";
import BattlesSection from "@/components/BattlesSection";
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
        <Marquee />
        <ArtistsSection />
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
