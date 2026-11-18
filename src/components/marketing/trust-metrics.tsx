"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const METRICS = [
  {
    value: "99.9%",
    label: "Context isolation",
    detail: "Separate vector namespaces. Zero shared buffers. Zero cross-reads.",
  },
  {
    value: "24/7",
    label: "Emotional availability",
    detail: "Inference stays online through late nights, early mornings, and everything unsaid.",
  },
  {
    value: "0",
    label: "Forgotten anniversaries",
    detail: "Every date is resolved, armed, and redundantly checked against three calendars.",
  },
  {
    value: "3",
    label: "Parallel relationships",
    detail: "Independent identities, memory stores, gift graphs and conversation histories.",
  },
];

export function TrustMetrics() {
  const reduce = useReducedMotion();
  return (
    <section className="border-y border-line bg-[#0a0b10]">
      <div className="container-page">
        <div className="grid divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {METRICS.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "flex flex-col gap-3 px-1 py-8 sm:px-6 lg:px-8 lg:py-10",
                index > 0 && "sm:border-l sm:border-line",
                index === 2 && "sm:border-l-0 lg:border-l",
                index === 1 && "sm:border-l",
              )}
            >
              <span className="font-mono text-[clamp(30px,3.4vw,42px)] font-medium tracking-[-0.05em] text-ink tabular-nums">
                {metric.value}
              </span>
              <div>
                <p className="text-[12px] font-medium text-ink">{metric.label}</p>
                <p className="mt-1.5 max-w-[230px] text-[11.5px] leading-relaxed text-muted">{metric.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
