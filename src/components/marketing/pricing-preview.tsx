import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "./section";
import { PricingCards, PricingFinePrint } from "./pricing-cards";

export function PricingPreview() {
  return (
    <section id="pricing" className="border-y border-line bg-[#0a0b10] py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          kicker="Pricing"
          title={
            <>
              Three plans.
              <br />
              <span className="text-muted">One commander.</span>
            </>
          }
          description="Relationship infrastructure is priced per identity, not per message. Every plan includes full context isolation."
          action={
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-md border border-line px-3.5 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-line-strong hover:text-ink"
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
