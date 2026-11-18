"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const STAGES = [
  { name: "Incoming message", code: "ingest" },
  { name: "Identity resolver", code: "identity" },
  { name: "Context router", code: "route" },
  { name: "Memory retrieval", code: "memory" },
  { name: "Emotional state", code: "emotion" },
  { name: "Response generation", code: "generate" },
  { name: "Safety check", code: "safety" },
  { name: "Preview / approval", code: "approve" },
];

export function EngineTeaser() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(3);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setActive((value) => (value + 1) % STAGES.length), 1100);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <section className="container-page py-20 md:py-28">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-[620px]">
          <p className="mono-label">Inference engine</p>
          <h2 className="heading mt-4 text-[clamp(32px,4.2vw,50px)]">
            Inside the 300 milliseconds
            <br />
            <span className="text-muted">between message and response.</span>
          </h2>
          <p className="mt-5 max-w-[520px] text-[14.5px] leading-[1.7] text-muted">
            Eight deterministic stages. A single identity. Every message is routed, grounded, scored for emotional
            context, and checked for cross-context leakage before it reaches a preview.
          </p>
        </div>
        <Link
          href="/engine"
          className="inline-flex shrink-0 items-center gap-2 rounded-md border border-line px-3.5 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-line-strong hover:text-ink"
        >
          Open interactive engine
          <ArrowUpRight className="size-3" />
        </Link>
      </div>

      <div className="relative mt-10 overflow-hidden rounded-lg border border-line-strong bg-[#0a0b10]">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="status-dot text-green" />
            <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted">Pipeline · live</span>
          </div>
          <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-faint">
            p50 286ms · safety blocks 0.7%
          </span>
        </div>

        <div className="relative p-4 md:p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{ background: "radial-gradient(50% 60% at 50% 100%, rgba(255,71,120,0.07), transparent 70%)" }}
          />
          <div className="relative grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {STAGES.map((stage, index) => {
              const isActive = active === index;
              const isDone = index < active;
              return (
                <div key={stage.name} className="relative">
                  <div
                    className={cn(
                      "relative h-full rounded-md border p-2.5 transition-all duration-500",
                      isActive
                        ? "border-accent/45 bg-accent/[0.06]"
                        : isDone
                          ? "border-green/20 bg-white/[0.02]"
                          : "border-line bg-white/[0.012]",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-faint">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "size-1 rounded-full",
                          isActive ? "bg-accent" : isDone ? "bg-green" : "bg-white/15",
                        )}
                      />
                    </div>
                    <p
                      className={cn(
                        "mt-2 text-[10px] leading-tight",
                        isActive ? "text-ink" : isDone ? "text-muted" : "text-faint",
                      )}
                    >
                      {stage.name}
                    </p>
                    <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.08em] text-faint">
                      {isActive ? "processing" : isDone ? "pass" : "queued"}
                    </p>
                  </div>
                  {index < STAGES.length - 1 && (
                    <span className="absolute -right-[7px] top-1/2 hidden size-1 -translate-y-1/2 rounded-full bg-white/15 lg:block" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-3 rounded-md border border-line bg-ground/70 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded border border-green/20 bg-green/[0.06]">
                <ShieldCheck className="size-3.5 text-green" />
              </span>
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-faint">Current stage</p>
                <p className="text-[11px] text-ink">{STAGES[active].name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-faint">namespace</p>
                <p className="font-mono text-[9px] text-muted">ns.sophia.v2</p>
              </div>
              <div className="h-6 w-px bg-line" />
              <div className="text-right">
                <p className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-faint">cross-context</p>
                <p className="font-mono text-[9px] text-green">0 reads</p>
              </div>
            </div>
          </div>

          <div className="mt-2 h-[2px] w-full overflow-hidden rounded-full bg-white/[0.05]">
            <motion.div
              className="h-full bg-accent"
              animate={{ width: `${((active + 1) / STAGES.length) * 100}%` }}
              transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
