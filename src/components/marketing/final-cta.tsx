import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAMESPACES = [
  { label: "ns.sophia.v2", status: "online", detail: "742 vectors · anniversary armed" },
  { label: "ns.olivia.v2", status: "online", detail: "918 vectors · birthday T-8d" },
  { label: "ns.isabella.v2", status: "online", detail: "758 vectors · recovery staged" },
];

export function FinalCta() {
  return (
    <section className="container-page pb-20 pt-20 md:pb-28 md:pt-24">
      <div className="relative overflow-hidden rounded-xl border border-line-strong bg-[#0b0a10]">
        <div aria-hidden className="absolute inset-0 grid-bg opacity-50" />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-1/2 h-[420px] w-[620px] -translate-y-1/2 rounded-full opacity-70 blur-[110px]"
          style={{ background: "radial-gradient(circle, rgba(255,71,120,0.22), transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 top-0 h-[320px] w-[420px] rounded-full opacity-60 blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)" }}
        />

        <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:p-14">
          <div>
            <p className="mono-label">Get started</p>
            <h2 className="heading mt-4 text-[clamp(34px,4.4vw,54px)]">
              Provision the version
              <br />
              of you that <span className="text-gradient">never forgets.</span>
            </h2>
            <p className="mt-5 max-w-[440px] text-[14px] leading-[1.7] text-muted">
              Three isolated namespaces, one inference engine, and a command center that tells you the truth before
              dinner does.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="accent" size="lg" className="group">
                <Link href="/pricing">
                  Initialize your empire
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard">Open command center</Link>
              </Button>
            </div>
            <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[8.5px] uppercase tracking-[0.1em] text-faint">
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-3 text-green" />
                99.9% isolation
              </span>
              <span>No card required</span>
              <span>Demo data only</span>
            </p>
          </div>

          <div className="relative rounded-lg border border-line bg-ground/80 p-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-faint">Provisioning preview</p>
              <span className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.1em] text-green">
                <span className="status-dot" />
                ready
              </span>
            </div>
            <div className="mt-3 space-y-1.5">
              {NAMESPACES.map((namespace, index) => (
                <div
                  key={namespace.label}
                  className="flex items-center gap-2.5 rounded-md border border-line bg-white/[0.018] px-2.5 py-2"
                  style={{ opacity: 1 - index * 0.08 }}
                >
                  <span className="flex size-5 items-center justify-center rounded border border-green/20 bg-green/[0.06]">
                    <Check className="size-2.5 text-green" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[9px] tracking-[-0.01em] text-ink">{namespace.label}</p>
                    <p className="truncate font-mono text-[7.5px] uppercase tracking-[0.05em] text-faint">
                      {namespace.detail}
                    </p>
                  </div>
                  <span className="font-mono text-[7px] uppercase tracking-[0.08em] text-green">{namespace.status}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5">
              <span className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-faint">Cross-context reads</span>
              <span className="font-mono text-[10px] tabular-nums text-green">0</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
