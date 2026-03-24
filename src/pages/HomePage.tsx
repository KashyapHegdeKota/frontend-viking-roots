import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { FeaturedProject } from "@/components/featured-project";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#1c1919] font-sans">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <FeaturedProject />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
