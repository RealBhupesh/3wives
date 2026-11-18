import { Hero } from "@/components/marketing/hero";
import { LogoCloud } from "@/components/marketing/logo-cloud";
import { Testimonials } from "@/components/marketing/testimonials";
import { TrustMetrics } from "@/components/marketing/trust-metrics";
import { FeaturesSection } from "@/components/marketing/features-section";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { EngineTeaser } from "@/components/marketing/engine-teaser";
import { SecuritySection } from "@/components/marketing/security-section";
import { PricingPreview } from "@/components/marketing/pricing-preview";
import { FinalCta } from "@/components/marketing/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoCloud />
      <TrustMetrics />
      <FeaturesSection />
      <DashboardPreview />
      <EngineTeaser />
      <SecuritySection />
      <Testimonials />
      <PricingPreview />
      <FinalCta />
    </>
  );
}
