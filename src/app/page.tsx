import { Header } from '@/components/Header';
import { LandingHero } from '@/app/_components/landing/LandingHero';
import { LandingActivitiesPreview } from '@/app/_components/landing/LandingActivitiesPreview';
import { LandingWhatIs } from '@/app/_components/landing/LandingWhatIs';
import { LandingHowItWorks } from '@/app/_components/landing/LandingHowItWorks';
import { LandingWhoWeServe } from '@/app/_components/landing/LandingWhoWeServe';
import { LandingWhyItMatters } from '@/app/_components/landing/LandingWhyItMatters';
import { LandingDemoFaq } from '@/app/_components/landing/LandingDemoFaq';
import { LandingFooter } from '@/app/_components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--system-background)] flex flex-col relative">
      <Header />
      <main className="flex-1 relative">
        <LandingHero />
        <div className="relative z-10">
          <LandingActivitiesPreview />
          <LandingWhatIs />
          <LandingHowItWorks />
          <LandingWhoWeServe />
          <LandingWhyItMatters />
          <LandingDemoFaq />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
