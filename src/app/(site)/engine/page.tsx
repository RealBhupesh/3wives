import type { Metadata } from "next";
import { EngineConsole } from "@/components/engine/engine-console";

export const metadata: Metadata = {
  title: "Inference Engine",
  description:
    "Eight deterministic stages between an incoming message and a response: identity resolution, isolated retrieval, emotional analysis, generation, and a cross-context safety check.",
};

const STATS = [
  { label: "p50 latency", value: "286ms" },
  { label: "p95 latency", value: "412ms" },
  { label: "Inferences / min", value: "4.2k" },
  { label: "Safety blocks", value: "0.7%" },
];

export default function EnginePage() {
  return (
    <div className="pt-16">
      <section className="relative overflow-hidden border-b border-line pb-12 pt-16 md:pb-16 md:pt-20">
        <div aria-hidden className="absolute inset-0 grid-bg opacity-50" />
        <div aria-hidden className="aurora pointer-events-none absolute inset-x-0 top-0 h-[700px]" />
        <div className="container-page relative">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[700px]">
              <div className="flex items-center gap-2">
                <span className="status-dot text-green" />
                <span className="text-[11.5px] text-green">Engine operational</span>
                <span className="text-[11.5px] text-faint">/ v2.4.1</span>
              </div>
              <h1 className="heading mt-5 text-[clamp(40px,5.6vw,68px)]">
                Eight stages.
                <br />
                One identity.
                <br />
                <span className="text-muted">Zero leakage.</span>
              </h1>
              <p className="mt-5 max-w-[560px] text-[15px] leading-[1.7] text-muted">
                The inference engine is a deterministic pipeline, not a prompt. Every message is resolved to one
                relationship, grounded in one namespace, and checked for cross-context exposure before you ever see a
                draft.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4 lg:grid-cols-2">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="font-mono text-[20px] tabular-nums tracking-[-0.04em] text-ink">{stat.value}</p>
                  <p className="mt-0.5 text-[11.5px] text-faint">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-8 md:py-12">
        <EngineConsole />
      </section>

      <section className="container-page pb-20 md:pb-28">
        <div className="grid gap-3 border-t border-line pt-12 md:grid-cols-3">
          {[
            {
              title: "Deterministic routing",
              body: "The same message always resolves to the same relationship and namespace. No sampling in the routing layer.",
            },
            {
              title: "Blocking safety checks",
              body: "Cross-context violations stop the pipeline. The safety layer is not a warning appended to a draft.",
            },
            {
              title: "Human approval only",
              body: "The pipeline ends at a preview. There are no external messaging integrations and no automatic sends.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-md border border-line bg-ink/[0.015] p-5">
              <p className="text-[13px] font-medium">{item.title}</p>
              <p className="mt-2 text-[11.5px] leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
