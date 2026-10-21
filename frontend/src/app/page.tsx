import {
  LandingNavbar,
  LandingHero,
  LandingFeatures,
  LandingHowItWorks,
  LandingTemplateShowcase,
  LandingPricing,
  LandingFaq,
  LandingTestimonials,
  LandingCta,
  LandingFooter,
} from '@/components/landing';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background" data-testid="landing-page-root">
      {/* 1. Navigation Header */}
      <LandingNavbar />

      <main className="flex-1 flex flex-col">
        {/* 2. Split Hero Section */}
        <LandingHero />

        {/* 3. Features Bento Section */}
        <LandingFeatures />

        {/* 4. How It Works Pipeline */}
        <LandingHowItWorks />

        {/* 5. Template Showcase */}
        <LandingTemplateShowcase />

        {/* 6. Pricing Plans */}
        <LandingPricing />

        {/* 7. Frequently Asked Questions */}
        <LandingFaq />

        {/* 8. Couple Testimonials */}
        <LandingTestimonials />

        {/* 9. Final Conversion CTA */}
        <LandingCta />
      </main>

      {/* 10. Multi-Column Footer */}
      <LandingFooter />
    </div>
  );
}
