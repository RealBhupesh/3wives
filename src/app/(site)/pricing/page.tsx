import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Minus, ShieldCheck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PricingCards, PricingFinePrint } from "@/components/marketing/pricing-cards";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Solo is free. Duo is $19/month. Trio is $49/month. Relationship infrastructure priced per identity, with full context isolation on every plan.",
};

const COMPARISON: Array<{ label: string; values: [string, string, string, string] }> = [
  { label: "Relationship namespaces", values: ["1", "2", "3", "4+"] },
  { label: "Memory vectors", values: ["250", "5,000", "Unlimited*", "Custom"] },
  { label: "Conversational twin", values: ["Basic", "Full", "Full + callbacks", "Custom voice model"] },
  { label: "Context isolation", values: ["Standard", "Strict", "Strict + audit", "Dedicated cluster"] },
  { label: "Collision prevention", values: ["—", "Detect", "Detect + resolve", "Custom policy"] },
  { label: "Gift intelligence", values: ["—", "Basic", "Optimizer", "Custom"] },
  { label: "Emotional state model", values: ["—", "Included", "Included + recovery", "Custom"] },
  { label: "Incident center", values: ["—", "—", "Included", "24/7 ops team"] },
  { label: "p50 inference latency", values: ["600ms", "400ms", "286ms", "Custom SLA"] },
  { label: "Support", values: ["Community", "Email", "Priority", "Dedicated"] },
];

const FAQS = [
  {
    question: "Is this a real product?",
    answer:
      "This is a demonstration environment for a relationship orchestration architecture. Profiles, conversations, calendars, and incidents are fictional. There are no external messaging integrations, and no messages are ever sent. All demo data is stored locally in your browser.",
  },
  {
    question: "What does context isolation actually mean?",
    answer:
      "Each relationship is assigned a separate memory namespace with its own encryption key and retrieval scope. The inference engine can read exactly one namespace per request. Cross-namespace reads are rejected by policy before retrieval — not filtered out of the prompt afterward.",
  },
  {
    question: "How does collision prevention work?",
    answer:
      "The scheduler reads all three calendars plus travel buffers and committed plans. When two commitments overlap, it ranks resolutions by social cost, moves the lower-risk commitment, and drafts a plausible explanation for that context only. You approve or discard it.",
  },
  {
    question: "Are my memories used to train models?",
    answer:
      "No. Relationship data is used for inference only. In this demo, no data leaves the browser at all. In a production deployment, isolation and retention would be enforced per namespace with an append-only audit log.",
  },
  {
    question: "Can I manage four or more relationships?",
    answer:
      "Yes — on the enterprise tier. Custom identity routing, additional namespaces, a private isolation cluster, and a dedicated relationship operations team are available. Contact sales with your current namespace count and damage surface.",
  },
  {
    question: "What happens if two contexts do overlap?",
    answer:
      "The incident center freezes outbound drafting, resolves the entity graph, and produces ranked responses with confidence and exposure scores. Every action is written to an immutable timeline. Human approval is required at every stage.",
  },
  {
    question: "Do I have to pay to try the command center?",
    answer:
      "No. The demo environment is fully functional with seeded data and requires no payment method. Selecting a plan simulates provisioning and opens the command center.",
  },
];

const INCLUDED = [
  "99.9% context isolation",
  "Per-namespace encryption",
  "Append-only audit trail",
  "Human approval required",
  "No training on memories",
];

export default function PricingPage() {
  return (
    <div className="pt-16">
      <section className="relative overflow-hidden border-b border-line pb-14 pt-16 md:pb-20 md:pt-20">
        <div aria-hidden className="absolute inset-0 grid-bg opacity-50" />
        <div aria-hidden className="aurora pointer-events-none absolute inset-x-0 top-0 h-[700px]" />
        <div className="container-page relative">
          <div className="max-w-[760px]">
            <div className="flex items-center gap-2">
              <span className="status-dot text-green" />
              <span className="text-[11.5px] text-green">Pricing · demonstration</span>
            </div>
            <h1 className="heading mt-5 text-[clamp(42px,6vw,72px)]">
              Relationship infrastructure.
              <br />
              <span className="text-muted">Priced per identity.</span>
            </h1>
            <p className="mt-6 max-w-[560px] text-[15px] leading-[1.7] text-muted">
              Every version of your life gets its own namespace, memory store, and voice model. Choose the number of
              identities. Isolation is included on all of them.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {INCLUDED.map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-[11.5px] text-faint">
                <ShieldCheck className="size-3 text-green" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-12 md:py-16" id="plans">
        <PricingCards />
        <PricingFinePrint />
        <p className="mt-2 text-[11.5px] text-faint">
          *Unlimited vectors subject to fair use. An average three-relationship deployment holds 2,400–4,000 vectors.
        </p>
      </section>

      <section className="border-y border-line bg-[#ffffff] py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mono-label">Comparison</p>
              <h2 className="heading mt-3 text-[clamp(28px,3.6vw,40px)]">Every difference, documented.</h2>
            </div>
            <p className="max-w-[320px] text-[12px] leading-relaxed text-muted">
              Enterprise adds custom identity routing, private deployment, and a dedicated operations team.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-lg border border-line">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <caption className="sr-only">Plan comparison</caption>
              <thead>
                <tr className="border-b border-line bg-ink/[0.02]">
                  <th scope="col" className="px-4 py-3 text-[11.5px] text-faint">
                    Capability
                  </th>
                  {["Solo", "Duo", "Trio", "Enterprise"].map((plan, index) => (
                    <th
                      key={plan}
                      scope="col"
                      className={`px-4 py-3 text-[11px] font-medium ${index === 2 ? "text-accent" : "text-ink"}`}
                    >
                      {plan}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.label} className="border-b border-line last:border-0 hover:bg-ink/[0.015]">
                    <th scope="row" className="px-4 py-3 text-[11.5px] font-normal text-muted">
                      {row.label}
                    </th>
                    {row.values.map((value, index) => (
                      <td key={`${row.label}-${index}`} className="px-4 py-3">
                        {value === "—" ? (
                          <Minus className="size-3 text-faint/60" aria-label="Not included" />
                        ) : value === "Included" || value === "Detect" ? (
                          <span className="flex items-center gap-1.5 text-[11px] text-muted">
                            <Check className="size-3 text-green" />
                            {value}
                          </span>
                        ) : (
                          <span className={`text-[11px] ${index === 2 ? "text-ink" : "text-muted"}`}>{value}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.4fr]">
          <div>
            <p className="mono-label">Questions</p>
            <h2 className="heading mt-3 text-[clamp(28px,3.6vw,40px)]">
              Reasonable concerns,
              <br />
              <span className="text-muted">answered plainly.</span>
            </h2>
            <p className="mt-4 max-w-[360px] text-[13px] leading-relaxed text-muted">
              If your question is not here, the incident center has a form for that too.
            </p>
            <Link
              href="/dashboard/incidents"
              className="mt-5 inline-flex items-center gap-1.5 border-b border-line pb-1 text-[11.5px] text-muted transition-colors hover:border-line-strong hover:text-ink"
            >
              Open incident center
              <ArrowRight className="size-3" />
            </Link>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, index) => (
              <AccordionItem key={faq.question} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <FinalCta />
    </div>
  );
}
