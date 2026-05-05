import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { FeaturedProject } from "@/components/featured-project";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans">
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