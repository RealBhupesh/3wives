"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, ArrowRight, Check, MapPin, RotateCcw } from "lucide-react";
import { DemoShell } from "./section";
import { cn } from "@/lib/utils";

type Phase = "idle" | "resolving" | "resolved";

const STEPS = [
  "Overlap confirmed: 150 minutes",
  "Travel buffer insufficient: 12m of 45m",
  "Secondary commitment moved +24h",
  "Plausible reason staged · not sent",
];

export function CollisionDemo() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  const resolve = () => {
    if (phase === "resolving") return;
    setPhase("resolving");
    setStep(0);
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = STEPS.map((_, index) =>
      window.setTimeout(
        () => {
          setStep(index + 1);
          if (index === STEPS.length - 1) setPhase("resolved");
        },
        reduce ? 0 : (index + 1) * 520,
      ),
    );
  };

  return (
    <DemoShell label="Collision prevention engine" meta="SEV 1 · ACTION REQUIRED" tone="danger" className="relative">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-700",
          phase === "resolved" ? "opacity-0" : "opacity-100",
        )}
        style={{ background: "radial-gradient(60% 50% at 50% 0%, rgba(229,56,59,0.12), transparent 70%)" }}
      />

      <div className="relative p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex size-7 items-center justify-center rounded-md border border-red/30 bg-red/10">
              <AlertTriangle className="size-3.5 text-red" />
            </span>
            <div>
              <p className="text-[11.5px] font-medium text-red">
                {phase === "resolved" ? "Collision resolved" : "Collision detected"}
              </p>
              <p className="mt-0.5 text-[11px] text-muted">
                {phase === "resolved"
                  ? "Calendar normalized. Both relationships remain isolated."
                  : "Two dinner commitments overlap by 150 minutes."}
              </p>
            </div>
          </div>
          <span className="rounded border border-red/25 bg-red/[0.07] px-1.5 py-0.5 text-[11.5px] text-red">
            {phase === "resolved" ? "Contained" : "Severity 1"}
          </span>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <EventCard
            code="WIFE 01"
            name="Sophia"
            title="Anniversary dinner"
            time="20:00 — 23:00"
            where="Le Fantôme"
            color="#f26b1d"
            resolved={false}
            moved={false}
          />
          <div className={cn("flex items-center justify-center gap-2 py-1 sm:flex-col", phase === "resolved" ? "text-green" : "text-red")}>
            <span className="hidden h-px w-6 bg-current opacity-40 sm:block" />
            <span className="text-[11.5px]">
              {phase === "resolved" ? "0m" : "150m"}
            </span>
            <ArrowRight className="size-3 sm:rotate-90" />
          </div>
          <EventCard
            code="WIFE 02"
            name="Olivia"
            title="Drinks with Priya"
            time={phase === "resolved" ? "24h later · 20:30" : "20:30 — 22:30"}
            where="Bar Part Time"
            color="#6e56f8"
            resolved={phase === "resolved"}
            moved={phase === "resolved"}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-line bg-line">
          {[
            { label: "Exposure risk", value: phase === "resolved" ? "0%" : "94%", danger: phase !== "resolved" },
            { label: "Overlap", value: phase === "resolved" ? "0 min" : "150 min", danger: phase !== "resolved" },
            { label: "Social cost", value: phase === "resolved" ? "low" : "high", danger: phase !== "resolved" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#ffffff] px-3 py-2">
              <p
                className={cn(
                  "font-mono text-[13px] tabular-nums",
                  stat.danger ? "text-red" : "text-green",
                )}
              >
                {stat.value}
              </p>
              <p className="font-mono text-[7.5px] text-faint">{stat.label}</p>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {phase === "resolving" && (
            <motion.div
              key="resolving"
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-1.5 rounded-md border border-line bg-ground/80 p-3">
                {STEPS.slice(0, step).map((line, index) => (
                  <motion.div
                    key={line}
                    initial={reduce ? false : { opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 font-mono text-[9px] text-muted"
                  >
                    <Check className="size-2.5 text-green" />
                    {line}
                    <span className="ml-auto text-[7.5px] text-faint">
                      {index === STEPS.length - 1 && step === STEPS.length ? "done" : "ok"}
                    </span>
                  </motion.div>
                ))}
                {step === 0 && <p className="font-mono text-[9px] text-amber">Computing social cost surface…</p>}
              </div>
            </motion.div>
          )}

          {phase === "resolved" && (
            <motion.div
              key="resolved"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 rounded-md border border-green/25 bg-green/[0.05] p-3"
            >
              <div className="flex items-center gap-2">
                <Check className="size-3.5 text-green" />
                <p className="text-[11px] text-ink">Zero collisions. Both contexts remain isolated.</p>
              </div>
              <p className="mt-1 text-[11.5px] leading-relaxed text-faint">
                Olivia received a reschedule note · Sophia&apos;s reservation untouched · no cross-context reference
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={phase === "resolved" ? () => setPhase("idle") : resolve}
            disabled={phase === "resolving"}
            className={cn(
              "flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md text-[11.5px] font-medium transition-colors disabled:opacity-60",
              phase === "resolved"
                ? "border border-line text-muted hover:text-ink"
                : "bg-ink text-ground hover:bg-ink/85",
            )}
          >
            {phase === "resolved" ? (
              <>
                <RotateCcw className="size-3" />
                Replay simulation
              </>
            ) : phase === "resolving" ? (
              "Resolving…"
            ) : (
              "Run autonomous resolution"
            )}
          </button>
          <span className="hidden text-[11.5px] text-faint sm:block">
            no messages sent
          </span>
        </div>
      </div>
    </DemoShell>
  );
}

function EventCard({
  code,
  name,
  title,
  time,
  where,
  color,
  resolved,
  moved,
}: {
  code: string;
  name: string;
  title: string;
  time: string;
  where: string;
  color: string;
  resolved: boolean;
  moved: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border bg-[#ffffff] p-3 transition-colors duration-500",
        resolved ? "border-green/25" : "border-red/20",
      )}
    >
      <span className="absolute inset-y-0 left-0 w-[2px]" style={{ background: resolved ? "#12a26b" : color }} />
      <div className="flex items-center justify-between">
        <span className="font-mono text-[7.5px] text-faint">{code}</span>
        <span className={cn("font-mono text-[7.5px]", resolved ? "text-green" : "text-red")}>
          {resolved ? "rescheduled" : "locked"}
        </span>
      </div>
      <p className="mt-1.5 text-[12px] font-medium">{title}</p>
      <p className={cn("mt-0.5 font-mono text-[9.5px] tabular-nums", moved ? "text-green" : "text-muted")}>{time}</p>
      <p className="mt-1.5 flex items-center gap-1 text-[9px] text-faint">
        <MapPin className="size-2.5" />
        {where}
      </p>
      <p className="mt-2 font-mono text-[7.5px] text-faint">{name}</p>
    </div>
  );
}
