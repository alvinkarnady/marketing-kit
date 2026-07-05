import Navbar from "../components/Navbar";
import ContactSection from "../components/ContactSection";
import PricingSection from "../components/PricingSection";
import FooterSection from "@/components/FooterSection";
import HeroSection from "@/components/HeroSection";
import Showcase from "@/components/Showcase";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import SectionErrorBoundary from "@/components/SectionErrorBoundary";

export default function Home() {
  return (
    <main className="min-h-screen font-poppins overflow-x-hidden">
      <Navbar />
      <SectionErrorBoundary>
        <HeroSection />
      </SectionErrorBoundary>
      <SectionErrorBoundary>
        <Showcase />
      </SectionErrorBoundary>
      <SectionErrorBoundary>
        <TestimonialsSection />
      </SectionErrorBoundary>
      <AboutSection />
      <SectionErrorBoundary>
        <ServicesSection />
      </SectionErrorBoundary>
      <SectionErrorBoundary>
        <PricingSection />
      </SectionErrorBoundary>
      <ContactSection />
      <FooterSection />
    </main>
  );
}
