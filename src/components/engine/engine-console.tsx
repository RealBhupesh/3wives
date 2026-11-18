"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Check,
  ChevronRight,
  CircleDashed,
  Loader2,
  Lock,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { createInitialState, DEMO_NOW } from "@/lib/data";
import { generateResponse, type GeneratedResponse } from "@/lib/inference";
import { ENGINE_STAGES } from "@/lib/engine";
import type { WifeId } from "@/lib/types";
import { IdentityAvatar } from "@/components/brand/identity-avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type RunStatus = "idle" | "running" | "done";

export function EngineConsole() {
  const reduce = useReducedMotion();
  const data = useMemo(() => createInitialState(DEMO_NOW), []);
  const [wifeId, setWifeId] = useState<WifeId>("olivia");
  const [message, setMessage] = useState("who's jessica");
  const [status, setStatus] = useState<RunStatus>("idle");
  const [current, setCurrent] = useState(-1);
  const [selected, setSelected] = useState("safety");
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<GeneratedResponse | null>(null);
  const [approved, setApproved] = useState(false);
  const timers = useRef<number[]>([]);

  const wife = data.wives.find((item) => item.id === wifeId) ?? data.wives[0];
  const stage = ENGINE_STAGES.find((item) => item.id === selected) ?? ENGINE_STAGES[0];

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  const reset = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    setStatus("idle");
    setCurrent(-1);
    setLogs([]);
    setResult(null);
    setApproved(false);
  };

  const run = () => {
    if (status === "running") return;
    timers.current.forEach((id) => window.clearTimeout(id));
    setStatus("running");
    setCurrent(-1);
    setLogs([]);
    setResult(null);
    setApproved(false);
    setSelected(ENGINE_STAGES[0].id);

    ENGINE_STAGES.forEach((item, index) => {
      timers.current.push(
        window.setTimeout(
          () => {
            setCurrent(index);
            setSelected(item.id);
            setLogs((prev) => [...prev, item.log].slice(-8));
            if (index === ENGINE_STAGES.length - 1) {
              const generated = generateResponse({
                wife,
                memories: data.memories,
                history: [],
                text: message,
                variantSeed: 3,
              });
              setResult(generated);
              setStatus("done");
            }
          },
          reduce ? 0 : 240 + index * 430,
        ),
      );
    });
  };

  const totalMs = ENGINE_STAGES.slice(0, Math.max(current + 1, 0)).reduce((sum, item) => sum + item.latency, 0);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-[360px_1fr]">
        {/* Composer */}
        <div className="rounded-lg border border-line bg-[#ffffff]">
          <div className="flex h-10 items-center justify-between border-b border-line px-3.5">
            <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted">Request composer</span>
            <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-faint">manual</span>
          </div>
          <div className="p-3.5">
            <p className="mono-label">Route to</p>
            <div className="mt-2 grid grid-cols-3 gap-1">
              {data.wives.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setWifeId(item.id);
                    reset();
                  }}
                  aria-pressed={wifeId === item.id}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-md border py-2 transition-colors",
                    wifeId === item.id
                      ? "border-line-strong bg-ink/[0.05]"
                      : "border-line bg-transparent hover:bg-ink/[0.02]",
                  )}
                >
                  <IdentityAvatar wife={item} size={24} ring={false} />
                  <span className="text-[10px] text-muted">{item.name}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <label htmlFor="engine-message" className="mono-label">
                Incoming message
              </label>
              <span className="font-mono text-[8px] tabular-nums text-faint">{message.length}/240</span>
            </div>
            <textarea
              id="engine-message"
              value={message}
              maxLength={240}
              onChange={(event) => {
                setMessage(event.target.value);
                if (status !== "running") reset();
              }}
              rows={4}
              className="mt-2 w-full resize-none rounded-md border border-line bg-ink/[0.025] p-2.5 text-[12px] leading-relaxed text-ink placeholder:text-faint focus-visible:border-line-strong focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/40"
              placeholder="Type an incoming message…"
            />
            <div className="mt-1.5 flex flex-wrap gap-1">
              {["who's jessica", "I'll be there at 8:50.", "Dinner Friday?"].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setMessage(prompt);
                    reset();
                  }}
                  className="rounded-full border border-line px-2 py-0.5 text-[9px] text-faint transition-colors hover:border-line-strong hover:text-ink"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-1.5 rounded-md border border-line bg-ground/70 p-2.5">
              {[
                ["Namespace", `ns.${wife.id}.v2`],
                ["Channel", "Demo · normalized"],
                ["Entity candidates", wife.id === "olivia" ? "3 · ambiguity 0.07" : "1 · resolved"],
                ["Drafting policy", "Approval required"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-faint">{label}</span>
                  <span className="truncate font-mono text-[8.5px] text-muted">{value}</span>
                </div>
              ))}
            </div>

            <Button onClick={run} disabled={status === "running"} variant="accent" className="mt-4 w-full">
              {status === "running" ? (
                <>
                  <Loader2 className="animate-spin" />
                  Running stage {current + 1} / 8
                </>
              ) : status === "done" ? (
                <>
                  <RotateCcw />
                  Run again
                </>
              ) : (
                <>
                  <Play className="fill-current" />
                  Run inference
                </>
              )}
            </Button>
            <p className="mt-2 text-center font-mono text-[7.5px] uppercase tracking-[0.08em] text-faint">
              No external send · demo environment
            </p>
          </div>
        </div>

        {/* Pipeline */}
        <div className="rounded-lg border border-line bg-[#ffffff]">
          <div className="flex h-10 items-center justify-between border-b border-line px-3.5">
            <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted">Inference pipeline</span>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "font-mono text-[8px] uppercase tracking-[0.1em]",
                  status === "done" ? "text-green" : status === "running" ? "text-accent" : "text-faint",
                )}
              >
                {status === "done" ? "complete" : status === "running" ? "processing" : "awaiting request"}
              </span>
              {status === "done" && <Check className="size-3 text-green" />}
            </div>
          </div>

          <div className="p-2.5">
            <ol className="relative">
              <span aria-hidden className="absolute bottom-4 left-[19px] top-4 w-px bg-line" />
              {ENGINE_STAGES.map((item, index) => {
                const isActive = status === "running" && current === index;
                const isComplete = status === "done" || (status === "running" && index < current);
                const isSelected = selected === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setSelected(item.id)}
                      aria-current={isSelected ? "step" : undefined}
                      className={cn(
                        "relative flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors",
                        isSelected ? "bg-ink/[0.045]" : "hover:bg-ink/[0.025]",
                      )}
                    >
                      <span
                        className={cn(
                          "relative z-10 flex size-[22px] shrink-0 items-center justify-center rounded-full border font-mono text-[8px] transition-colors",
                          isActive
                            ? "border-accent/60 bg-accent/15 text-accent"
                            : isComplete
                              ? "border-green/30 bg-green/[0.08] text-green"
                              : "border-line bg-[#ffffff] text-faint",
                        )}
                      >
                        {isActive ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : isComplete ? (
                          <Check className="size-3" />
                        ) : (
                          String(index + 1).padStart(2, "0")
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={cn(
                              "truncate text-[11.5px]",
                              isActive || isSelected ? "text-ink" : "text-muted",
                            )}
                          >
                            {item.name}
                          </span>
                          <span className="shrink-0 font-mono text-[7.5px] tabular-nums uppercase tracking-[0.05em] text-faint">
                            {item.latency}ms
                          </span>
                        </div>
                        <p className="mt-0.5 truncate font-mono text-[7.5px] uppercase tracking-[0.06em] text-faint">
                          {isActive ? "processing now" : isComplete ? "pass" : item.short}
                        </p>
                      </div>
                      <ChevronRight className={cn("size-3 shrink-0", isSelected ? "text-accent" : "text-faint/50")} />
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="mt-2 flex items-center justify-between border-t border-line px-1 pt-2.5">
              <span className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-faint">
                total latency {totalMs > 0 ? `${totalMs}ms` : "—"}
              </span>
              <span className="flex items-center gap-1 font-mono text-[7.5px] uppercase tracking-[0.1em] text-green">
                <Lock className="size-2.5" />
                single namespace
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trace log */}
      <div className="overflow-hidden rounded-lg border border-line bg-[#ffffff]">
        <div className="flex h-8 items-center justify-between border-b border-line px-3.5">
          <span className="font-mono text-[8px] uppercase tracking-[0.13em] text-faint">trace.log</span>
          <span className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-faint">
            {logs.length ? `${logs.length} events` : "idle"}
          </span>
        </div>
        <div className="h-[76px] overflow-y-auto p-2.5 font-mono text-[9px] leading-[1.7] slim-scroll">
          {logs.length === 0 ? (
            <p className="text-faint">
              <span className="text-muted">$</span> engine.ready — run inference to stream the trace.
            </p>
          ) : (
            logs.map((log, index) => (
              <p key={`${log}-${index}`} className="text-muted">
                <span className="text-green">✓</span> {log}
              </p>
            ))
          )}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_400px]">
        {/* Inspector */}
        <div className="rounded-lg border border-line bg-[#ffffff] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-faint">Stage inspector</p>
              <h2 className="mt-1.5 text-[17px] font-medium tracking-[-0.02em]">{stage.name}</h2>
            </div>
            <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.08em] text-muted">
              stage {String(ENGINE_STAGES.findIndex((s) => s.id === stage.id) + 1).padStart(2, "0")} / 08
            </span>
          </div>
          <p className="mt-3 max-w-[600px] text-[12px] leading-[1.65] text-muted">{stage.description}</p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="rounded-md border border-line bg-ground/60 p-2.5">
              <p className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-faint">Model</p>
              <p className="mt-1 font-mono text-[10px] text-ink">{stage.model}</p>
            </div>
            <div className="rounded-md border border-line bg-ground/60 p-2.5">
              <p className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-faint">Latency budget</p>
              <p className="mt-1 font-mono text-[10px] text-ink">{stage.latency}ms</p>
            </div>
            <div className="rounded-md border border-line bg-ground/60 p-2.5">
              <p className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-faint">Input</p>
              <p className="mt-1 font-mono text-[9.5px] text-muted">{stage.input}</p>
            </div>
            <div className="rounded-md border border-line bg-ground/60 p-2.5">
              <p className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-faint">Output</p>
              <p className="mt-1 font-mono text-[9.5px] text-muted">{stage.output}</p>
            </div>
          </div>

          <div className="mt-2 flex items-start gap-2 rounded-md border border-green/20 bg-green/[0.035] p-2.5">
            <ShieldCheck className="mt-[1px] size-3.5 shrink-0 text-green" />
            <div>
              <p className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-green">Guard</p>
              <p className="mt-0.5 text-[10px] leading-relaxed text-muted">{stage.guard}</p>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col rounded-lg border border-line bg-[#ffffff]">
          <div className="flex h-10 items-center justify-between border-b border-line px-3.5">
            <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted">Response preview</span>
            <span className="flex items-center gap-1 font-mono text-[7.5px] uppercase tracking-[0.08em] text-faint">
              <Lock className="size-2.5" />
              no send
            </span>
          </div>

          <div className="flex-1 p-3.5">
            {status === "idle" && !result && (
              <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-3 rounded-md border border-dashed border-line text-center">
                <span className="flex size-10 items-center justify-center rounded-full border border-line bg-ink/[0.02]">
                  <CircleDashed className="size-5 text-faint" />
                </span>
                <div>
                  <p className="text-[12px] text-muted">No inference yet</p>
                  <p className="mt-1 max-w-[230px] text-[10.5px] leading-relaxed text-faint">
                    Run the pipeline to resolve the message and generate a grounded draft.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={run}>
                  <Play className="fill-current" />
                  Run inference
                </Button>
              </div>
            )}

            {status === "running" && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Loader2 className="size-3 animate-spin text-accent" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-accent">
                    generating · stage {current + 1}/8
                  </span>
                </div>
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-24 w-full" />
              </div>
            )}

            <AnimatePresence>
              {status === "done" && result && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-green">draft · verified</span>
                    <span className="font-mono text-[8px] tabular-nums text-faint">{result.latencyMs}ms total</span>
                  </div>
                  <div className="rounded-md border border-accent/25 bg-accent/[0.045] p-3">
                    <div className="flex items-center gap-2 border-b border-accent/15 pb-2">
                      <IdentityAvatar wife={wife} size={20} />
                      <span className="text-[10px] text-ink">To {wife.name}</span>
                      <span className="ml-auto font-mono text-[7.5px] uppercase tracking-[0.08em] text-accent">
                        {result.intent}
                      </span>
                    </div>
                    <p className="mt-2 text-[11.5px] leading-[1.6] text-ink">{result.text}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-accent/15 pt-2 font-mono text-[7.5px] uppercase tracking-[0.06em]">
                      <span className="text-muted">{result.confidence}% confidence</span>
                      <span className="text-green">{result.styleMatch}% style</span>
                      <span className={result.risk > 40 ? "text-red" : "text-muted"}>{result.risk}% risk</span>
                    </div>
                  </div>

                  {result.alternatives.length > 0 && (
                    <div>
                      <p className="mono-label">Alternatives</p>
                      <div className="mt-1.5 space-y-1">
                        {result.alternatives.map((alt) => (
                          <div key={alt.label} className="rounded border border-line bg-ink/[0.015] px-2 py-1.5">
                            <p className="font-mono text-[7px] uppercase tracking-[0.08em] text-faint">{alt.label}</p>
                            <p className="mt-0.5 text-[10px] leading-snug text-muted">{alt.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={approved ? "subtle" : "accent"}
                      className="flex-1"
                      onClick={() => setApproved(true)}
                      disabled={approved}
                    >
                      {approved ? (
                        <>
                          <Check />
                          Approved &amp; staged
                        </>
                      ) : (
                        <>
                          <Check />
                          Approve draft
                        </>
                      )}
                    </Button>
                    <Button size="sm" variant="outline" onClick={reset} aria-label="Discard draft">
                      <X />
                    </Button>
                  </div>
                  <p className="text-center font-mono text-[7.5px] uppercase tracking-[0.08em] text-faint">
                    staging only · no external integration
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {result && status === "done" && result.risk > 40 && (
            <div className="flex items-start gap-2 border-t border-red/20 bg-red/[0.04] p-2.5">
              <ShieldAlert className="mt-[1px] size-3.5 shrink-0 text-red" />
              <p className="text-[9.5px] leading-snug text-muted">
                Risk elevated. Review the <span className="text-red">safety check</span> stage before approval.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-lg border border-line bg-ink/[0.015] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Brain className="size-3.5 text-violet" />
          <span className="text-[10.5px] text-muted">
            This simulation runs the same deterministic stage sequence used by the dashboard, with seeded demo data.
          </span>
        </div>
        <span className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.1em] text-faint">
          <ArrowRight className="size-3" />
          <Sparkles className="size-3 text-accent" />
          3 candidates generated
        </span>
      </div>
    </div>
  );
}
