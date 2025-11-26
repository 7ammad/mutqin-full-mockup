"use client";

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { TrustBar } from '@/components/landing/TrustBar';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { RoleSolutionsSection } from '@/components/landing/RoleSolutionsSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { FinalCTASection } from '@/components/landing/FinalCTASection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--system-background)] flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <TrustBar />
        <HowItWorksSection />
        <RoleSolutionsSection />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}
