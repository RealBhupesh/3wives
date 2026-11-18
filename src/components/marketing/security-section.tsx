"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Fingerprint, KeyRound, LockKeyhole, ScanEye, ShieldCheck } from "lucide-react";

const LAYERS = [
  {
    label: "Identity resolver",
    detail: "Every inbound event maps to one relationship identity before retrieval.",
    status: "verified",
  },
  {
    label: "Context router",
    detail: "Routes to a single namespace. Cross-namespace reads are rejected by policy.",
    status: "enforced",
  },
  {
    label: "Isolated vector shards",
    detail: "Three separate memory stores with independent retrieval keys.",
    status: "3 / 3 online",
  },
  {
    label: "Append-only audit ledger",
    detail: "Every read, write, draft and block is written to an immutable trail.",
    status: "recording",
  },
];

export function SecuritySection() {
  const reduce = useReducedMotion();
  return (
    <section id="security" className="container-page scroll-mt-24 py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-20">
        <div>
          <p className="mono-label">Security architecture</p>
          <h2 className="heading mt-4 text-[clamp(32px,4vw,48px)]">
            Isolation is not a feature.
            <br />
            <span className="text-muted">It&apos;s the foundation.</span>
          </h2>
          <p className="mt-5 max-w-[480px] text-[14.5px] leading-[1.7] text-muted">
            Most assistants share one memory across every conversation. That is fine until the conversation is your
            life. 3Wives AI treats each relationship as a separate security domain, not a separate prompt.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              { icon: LockKeyhole, title: "Zero shared buffers", detail: "No global memory object. No common retrieval pool. Nothing to bleed." },
              { icon: KeyRound, title: "Per-context encryption keys", detail: "Each namespace is encrypted independently with rotated keys." },
              { icon: ScanEye, title: "Pre-send safety check", detail: "Every draft is scanned for cross-context entities, dates, and story conflicts." },
              { icon: Fingerprint, title: "No training on your memories", detail: "Relationship data is used for inference only. Never for model training." },
            ].map((item) => (
              <li key={item.title} className="flex gap-3">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-line bg-white/[0.025]">
                  <item.icon className="size-3.5 text-muted" />
                </span>
                <div>
                  <p className="text-[12.5px] font-medium">{item.title}</p>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-lg border border-line-strong bg-[#0a0b10]"
        >
          <div className="flex h-10 items-center justify-between border-b border-line px-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-green" />
              <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted">Trust boundary</span>
            </div>
            <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-green">verified</span>
          </div>

          <div className="relative p-4">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-40"
              style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(61,220,151,0.07), transparent 70%)" }}
            />
            <div className="relative space-y-2">
              {LAYERS.map((layer, index) => (
                <div key={layer.label}>
                  <div className="flex items-center gap-3 rounded-md border border-line bg-white/[0.018] p-3">
                    <span className="flex size-6 items-center justify-center rounded border border-line bg-ground font-mono text-[8px] text-faint">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11.5px] font-medium">{layer.label}</p>
                      <p className="mt-0.5 text-[10px] leading-snug text-muted">{layer.detail}</p>
                    </div>
                    <span className="hidden shrink-0 rounded-full border border-green/20 bg-green/[0.05] px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.08em] text-green sm:block">
                      {layer.status}
                    </span>
                  </div>
                  {index < LAYERS.length - 1 && (
                    <div className="ml-[27px] h-2 w-px bg-gradient-to-b from-line-strong to-transparent" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-line bg-line">
              {[
                { label: "Cross-context reads", value: "0" },
                { label: "Audit retention", value: "7y" },
                { label: "Encryption", value: "AES-256" },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#0b0c12] px-3 py-2.5">
                  <p className="font-mono text-[13px] tabular-nums text-ink">{stat.value}</p>
                  <p className="font-mono text-[7px] uppercase tracking-[0.08em] text-faint">{stat.label}</p>
                </div>
              ))}
            </div>

            <p className="mt-3 font-mono text-[7.5px] uppercase leading-relaxed tracking-[0.08em] text-faint">
              Architecture description for the demo environment · no external integrations · no messages are sent
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
