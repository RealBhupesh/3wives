"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import type { Commander } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/controls";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type PlanId = "monogamy" | "dual" | "triple";

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  annual: number;
  tagline: string;
  description: string;
  features: string[];
  cta: string;
  recommended?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "monogamy",
    name: "Solo",
    price: 0,
    annual: 0,
    tagline: "For one relationship, kept with care.",
    description: "A private space for one relationship, with memory, reminders and drafting.",
    features: [
      "1 isolated relationship namespace",
      "250 memory vectors",
      "Anniversary + birthday tracking",
      "Standard response latency",
      "Community support",
    ],
    cta: "Start free",
  },
  {
    id: "dual",
    name: "Duo",
    price: 19,
    annual: 15,
    tagline: "For two relationships, fully separate.",
    description: "Two isolated spaces, shared scheduling intelligence, and conflict prevention.",
    features: [
      "2 isolated namespaces",
      "5,000 memory vectors",
      "Collision prevention engine",
      "Gift intelligence",
      "Emotional state model",
      "Priority draft generation",
    ],
    cta: "Choose Duo",
  },
  {
    id: "triple",
    name: "Trio",
    price: 49,
    annual: 39,
    tagline: "For three relationships, with every safeguard.",
    description: "The complete platform. Three isolated spaces, priority support, and the incident center.",
    features: [
      "3 isolated namespaces",
      "Unlimited memory vectors (fair use)",
      "Collision prevention + resolution",
      "Incident center with damage control",
      "Gift optimizer across 3 budgets",
      "p50 inference under 300ms",
      "Dedicated isolation cluster",
    ],
    cta: "Start Trio",
    recommended: true,
  },
];

const PROVISION_STEPS = [
  "Verifying commander identity",
  "Allocating isolated namespaces",
  "Seeding vector memory stores",
  "Arming occasion protocol",
  "Calibrating conversational voice",
  "Running cross-context safety check",
];

function ProvisionDialog({
  plan,
  open,
  onOpenChange,
}: {
  plan: Plan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {/* Re-mounts on every opening so the sequence always starts clean. */}
        {plan ? <ProvisionRunner key={`${plan.id}-${String(open)}`} plan={plan} onClose={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  );
}

function ProvisionRunner({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers = PROVISION_STEPS.map((_, index) =>
      window.setTimeout(() => {
        setStep(index + 1);
        if (index === PROVISION_STEPS.length - 1) setDone(true);
      }, 380 + index * 420),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Sparkles className="size-4 text-accent" />
          {done ? "Workspace provisioned" : `Provisioning ${plan.name}`}
        </DialogTitle>
        <DialogDescription>
          {done
            ? "Three isolated contexts are online. The demo environment is ready for inspection."
            : "This takes about four seconds in production. In this demo, it is simulated."}
        </DialogDescription>
      </DialogHeader>

      <div className="rounded-md border border-line bg-ground p-3">
        <div className="flex items-center justify-between text-[11.5px]">
          <span className="text-faint">Provisioning sequence</span>
          <span className="tabular-nums text-muted">{Math.round((step / PROVISION_STEPS.length) * 100)}%</span>
        </div>
        <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-ink/[0.07]">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${(step / PROVISION_STEPS.length) * 100}%` }}
          />
        </div>
        <div className="mt-3 space-y-1.5">
          {PROVISION_STEPS.map((label, index) => (
            <div key={label} className="flex items-center gap-2 font-mono text-[9px]">
              {index < step ? (
                <Check className="size-2.5 text-green" />
              ) : index === step ? (
                <Loader2 className="size-2.5 animate-spin text-accent" />
              ) : (
                <span className="size-2.5 rounded-full border border-line" />
              )}
              <span className={index < step ? "text-muted" : index === step ? "text-ink" : "text-faint"}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {done ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="accent" className="flex-1">
            <Link href="/dashboard" onClick={onClose}>
              Enter command center
              <ArrowRight />
            </Link>
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      ) : (
        <p className="text-[11.5px] text-faint">
          No payment method required · demo data only
        </p>
      )}
    </>
  );
}

export function PricingCards({ compact = false }: { compact?: boolean }) {
  const { updateCommander } = useDemo();
  const [annual, setAnnual] = useState(false);
  const [selected, setSelected] = useState<Plan | null>(null);
  const [open, setOpen] = useState(false);

  const choose = (plan: Plan) => {
    setSelected(plan);
    updateCommander({ plan: plan.id as Commander["plan"] });
    setOpen(true);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Switch checked={annual} onCheckedChange={setAnnual} aria-label="Bill annually" />
          <span className="text-[12px] text-muted">Annual billing</span>
          <span className="rounded-full border border-green/25 bg-green/[0.06] px-1.5 py-0.5 text-[11.5px] text-green">
            Save 20%
          </span>
        </div>
        <p className="text-[11.5px] text-faint">
          Prices in USD · demo environment · no charge
        </p>
      </div>

      <div className={cn("mt-6 grid gap-3 lg:grid-cols-3", compact && "lg:gap-4")}>
        {PLANS.map((plan) => {
          const price = annual ? plan.annual : plan.price;
          return (
            <div
              key={plan.id}
              id={plan.id}
              className={cn(
                "relative flex scroll-mt-24 flex-col overflow-hidden rounded-lg border p-5",
                plan.recommended
                  ? "border-accent/35 bg-accent/[0.025]"
                  : "border-line bg-[#ffffff]",
              )}
            >
              {plan.recommended && (
                <>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-70"
                    style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(17,118,110,0.18), transparent 70%)" }}
                  />
                  <span className="absolute right-4 top-4 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[11.5px] text-accent">
                    Most chosen
                  </span>
                </>
              )}
              <div className="relative">
                <p className="text-[11.5px] text-faint">{plan.name}</p>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-mono text-[38px] font-medium tracking-[-0.06em] tabular-nums text-ink">
                    ${price}
                  </span>
                  <span className="text-[12px] text-faint">/month</span>
                </div>
                <p className="mt-1 text-[11.5px] text-faint">
                  {annual
                    ? plan.price === 0
                      ? "Free forever"
                      : `$${price * 12} billed annually`
                    : plan.price === 0
                      ? "No card required"
                      : "Billed monthly"}
                </p>
                <p className="mt-4 text-[13px] leading-snug text-ink">{plan.tagline}</p>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted">{plan.description}</p>

                <Button
                  onClick={() => choose(plan)}
                  variant={plan.recommended ? "accent" : "subtle"}
                  className="mt-5 w-full"
                >
                  {plan.cta}
                  <ArrowRight />
                </Button>

                <ul className="mt-5 space-y-2 border-t border-line pt-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-[11.5px] leading-snug text-muted">
                      <Check className="mt-[2px] size-3 shrink-0 text-green" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-col items-start justify-between gap-3 rounded-lg border border-line bg-ink/[0.015] px-5 py-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[13px] font-medium">4+ wives? Contact sales.</p>
          <p className="mt-0.5 text-[11.5px] text-muted">
            Custom identity routing, private isolation clusters, and a dedicated relationship operations team.
          </p>
        </div>
        <a
          href="mailto:enterprise@3wives.ai?subject=Enterprise%20relationship%20infrastructure"
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-line-strong px-3 py-1.5 text-[11.5px] text-ink transition-colors hover:bg-ink/[0.05]"
        >
          Contact sales
          <ArrowRight className="size-3" />
        </a>
      </div>

      <ProvisionDialog plan={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}

export function PricingFinePrint() {
  return (
    <p className="mt-6 text-[11.5px] leading-relaxed text-faint">
      All plans include 99.9% context isolation · no external messaging integrations · no messages are sent ·
      cancel anytime · this is a demonstration environment
    </p>
  );
}

export function provisionToast() {
  toast.info("Demo environment — no billing occurs.");
}
