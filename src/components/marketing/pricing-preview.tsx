import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "./section";
import { PricingCards, PricingFinePrint } from "./pricing-cards";

export function PricingPreview() {
  return (
    <section id="pricing" className="border-t border-line py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          kicker="Pricing"
          title={
            <>
              Simple pricing,
              <br />
              <span className="text-muted">per relationship.</span>
            </>
          }
          description="Relationship infrastructure is priced per identity, not per message. Every plan includes full context isolation."
          action={
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-md border border-line px-3.5 py-2 text-[11.5px] text-muted transition-colors hover:border-line-strong hover:text-ink"
            >
              Compare plans
              <ArrowRight className="size-3" />
            </Link>
          }
        />
        <div className="mt-10 md:mt-14">
          <PricingCards compact />
          <PricingFinePrint />
        </div>
      </div>
    </section>
  );
}
