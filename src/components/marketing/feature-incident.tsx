"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertOctagon, Check, FileSearch, MessageSquareText, ShieldAlert } from "lucide-react";
import { createInitialState, DEMO_NOW } from "@/lib/data";
import { Ring } from "@/components/charts";
import { DemoShell } from "./section";
import { cn } from "@/lib/utils";

type Phase = "idle" | "analyzing" | "analyzed" | "drafted";

export function IncidentDemo() {
  const reduce = useReducedMotion();
  const data = createInitialState(DEMO_NOW);
  const incident = data.incidents[0];
  const [phase, setPhase] = useState<Phase>("idle");
  const [visibleLines, setVisibleLines] = useState(0);
  const [draft, setDraft] = useState(0);
  const [staged, setStaged] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  const analyze = () => {
    if (phase === "analyzing") return;
    setPhase("analyzing");
    setVisibleLines(0);
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = incident.analysis.slice(0, 3).map((_, index) =>
      window.setTimeout(
        () => {
          setVisibleLines(index + 1);
          if (index === 2) setPhase("analyzed");
        },
        reduce ? 0 : (index + 1) * 420,
      ),
    );
  };

  const generate = () => {
    setPhase("drafted");
    setStaged(false);
    setDraft(0);
  };

  return (
    <DemoShell label="Emergency response protocol" meta="INCIDENT INC-0847" tone="danger" className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{ background: "radial-gradient(70% 50% at 20% 0%, rgba(229,56,59,0.10), transparent 70%)" }}
      />
      <div className="relative p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex size-7 items-center justify-center rounded-md border border-red/30 bg-red/10">
              <AlertOctagon className="size-3.5 text-red" />
            </span>
            <div>
              <p className="text-[11.5px] text-red">Severity · serious</p>
              <p className="mt-0.5 max-w-[280px] text-[12px] font-medium leading-snug">
                Wife 02 has asked about Wife 01.
              </p>
              <p className="mt-1 text-[11.5px] text-faint">
                opened 42m ago · outbound paused
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Ring value={incident.exposureRisk} size={52} stroke={3.5} color="#e5383b" label="Context exposure risk 94 percent">
              <span className="font-mono text-[10px] tabular-nums text-red">{incident.exposureRisk}%</span>
            </Ring>
            <div>
              <p className="font-mono text-[7.5px] text-faint">Exposure risk</p>
              <p className="font-mono text-[7.5px] text-red">Urgency high</p>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-md border border-line bg-[#ffffff] p-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[7.5px] text-faint">Inbound · 20:14</span>
            <span className="font-mono text-[7.5px] text-red">risk query</span>
          </div>
          <p className="mt-1 text-[12px] text-ink">“who&apos;s jessica”</p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-faint">
            3 candidate entities · 1 cross-context match · safety check failed
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={analyze}
            className={cn(
              "flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-[10.5px] transition-colors",
              phase === "idle" || phase === "analyzing"
                ? "border-ink/15 bg-ink/[0.05] text-ink hover:bg-ink/[0.08]"
                : "border-green/25 bg-green/[0.05] text-green",
            )}
          >
            <FileSearch className="size-3" />
            {phase === "analyzing" ? "Analyzing…" : phase === "idle" ? "Analyze situation" : "Analysis complete"}
          </button>
          <button
            onClick={generate}
            className="flex h-8 items-center gap-1.5 rounded-md border border-red/30 bg-red/10 px-2.5 text-[10.5px] text-red transition-colors hover:bg-red/15"
          >
            <MessageSquareText className="size-3" />
            Generate response
          </button>
        </div>

        <AnimatePresence>
          {phase !== "idle" && (
            <motion.div
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-md border border-line bg-ground/80 p-2.5">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="size-3 text-amber" />
                  <span className="font-mono text-[7.5px] text-faint">Inference analysis</span>
                </div>
                <div className="mt-1.5 space-y-1">
                  {incident.analysis.slice(0, Math.max(visibleLines, phase === "analyzed" || phase === "drafted" ? 3 : 0)).map((line) => (
                    <motion.p
                      key={line}
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[9.5px] leading-[1.55] text-muted"
                    >
                      <span className="text-faint">· </span>
                      {line}
                    </motion.p>
                  ))}
                  {phase === "analyzing" && <p className="font-mono text-[8px] text-amber">resolving entity graph…</p>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {phase === "drafted" && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2.5 rounded-md border border-accent/25 bg-accent/[0.04] p-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {incident.drafts.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setDraft(index);
                      setStaged(false);
                    }}
                    className={cn(
                      "rounded-full px-1.5 py-0.5 font-mono text-[7.5px] uppercase tracking-[0.08em] transition-colors",
                      draft === index ? "bg-ink/[0.09] text-ink" : "text-faint hover:text-muted",
                    )}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <span className="font-mono text-[8px] tabular-nums text-faint">
                {incident.drafts[draft].confidence}% confidence · risk {incident.drafts[draft].risk}%
              </span>
            </div>
            <p className="mt-1.5 text-[10.5px] leading-[1.6] text-ink/90">{incident.drafts[draft].text}</p>
            <button
              onClick={() => setStaged(true)}
              className={cn(
                "mt-2 flex h-7 w-full items-center justify-center gap-1.5 rounded border font-mono text-[8px] uppercase tracking-[0.1em] transition-colors",
                staged
                  ? "border-green/25 bg-green/[0.05] text-green"
                  : "border-line text-muted hover:border-line-strong hover:text-ink",
              )}
            >
              {staged ? <Check className="size-2.5" /> : null}
              {staged ? "Staged for approval · nothing sent" : "Stage response"}
            </button>
          </motion.div>
        )}
      </div>
    </DemoShell>
  );
}
