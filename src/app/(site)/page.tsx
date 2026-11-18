import { Hero } from "@/components/marketing/hero";
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
      <TrustMetrics />
      <FeaturesSection />
      <DashboardPreview />
      <EngineTeaser />
      <SecuritySection />
      <PricingPreview />
      <FinalCta />
    </>
  );
}
