import Navbar from "../components/Navbar";
import ContactSection from "../components/ContactSection";
import GallerySection from "../components/GallerySection";
import PricingSection from "../components/PricingSection";
import FooterSection from "@/components/FooterSection";
import HeroSection from "@/components/HeroSection";
import Hero from "@/components/Hero";
import HeroLuxury from "@/components/HeroLuxury";
import Showcase from "@/components/Showcase";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";

export default function Home() {
  return (
    <main className="min-h-screen font-poppins">
      <Navbar />
      <HeroSection />
      <Showcase />
      {/* <HeroLuxury /> */}
      {/* <Hero />  */}
      {/* <GallerySection /> */}
      <TestimonialsSection />
      <AboutSection />
      <ServicesSection />
      <PricingSection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}
