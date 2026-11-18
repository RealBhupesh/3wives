"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, RefreshCw, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { createInitialState, DEMO_NOW } from "@/lib/data";
import { generateResponse } from "@/lib/inference";
import type { WifeId } from "@/lib/types";
import { IdentityAvatar } from "@/components/brand/identity-avatar";
import { DemoShell } from "./section";
import { cn } from "@/lib/utils";

const INCOMING: Record<WifeId, string> = {
  sophia: "Come home before nine and I'll pretend I haven't been negotiating with a tile for two hours.",
  olivia: "who's jessica",
  isabella: "Thursday matters to me. I need to know it matters to you.",
};

const GENERIC: Record<WifeId, string> = {
  sophia: "I'm sorry to hear that. Let me know if there's anything I can do to help.",
  olivia: "I'm not sure what you mean. Could you clarify what you're asking?",
  isabella: "I understand. I will be there on Thursday. Let me know if you need anything.",
};

export function TwinDemo() {
  const reduce = useReducedMotion();
  const [wifeId, setWifeId] = useState<WifeId>("sophia");
  const [mode, setMode] = useState<"twin" | "generic">("twin");
  const [seed, setSeed] = useState(0);
  const [thinking, setThinking] = useState(false);
  const data = useMemo(() => createInitialState(DEMO_NOW), []);
  const wife = data.wives.find((item) => item.id === wifeId) ?? data.wives[0];

  const generated = useMemo(
    () =>
      generateResponse({
        wife,
        memories: data.memories,
        history: [],
        text: INCOMING[wifeId],
        variantSeed: seed,
      }),
    [wife, wifeId, data.memories, seed],
  );

  const draft = mode === "twin" ? generated.text : GENERIC[wifeId];
  const styleMatch = mode === "twin" ? generated.styleMatch : 41;
  const confidence = mode === "twin" ? generated.confidence : 52;

  const regenerate = () => {
    if (thinking) return;
    setThinking(true);
    window.setTimeout(() => {
      setSeed((value) => value + 1);
      setThinking(false);
    }, reduce ? 0 : 620);
  };

  return (
    <DemoShell label="Conversational twin" meta="PREVIEW ONLY" tone="accent" className="shadow-[0_30px_90px_-50px_rgba(17,118,110,0.4)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-3.5 py-2.5">
        <div className="flex gap-1" role="tablist" aria-label="Relationship thread">
          {data.wives.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={wifeId === item.id}
              onClick={() => setWifeId(item.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] transition-colors",
                wifeId === item.id
                  ? "border-line-strong bg-ink/[0.06] text-ink"
                  : "border-transparent text-faint hover:text-ink",
              )}
            >
              <span className="size-1.5 rounded-full" style={{ background: item.palette.from }} />
              {item.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11.5px] text-faint">Voice</span>
          <div className="flex rounded-full border border-line p-0.5">
            {(["twin", "generic"] as const).map((value) => (
              <button
                key={value}
                onClick={() => setMode(value)}
                aria-pressed={mode === value}
                className={cn(
                  "rounded-full px-2.5 py-1 font-mono text-[8.5px] uppercase tracking-[0.1em] transition-colors",
                  mode === value ? "bg-ink/[0.08] text-ink" : "text-faint hover:text-ink",
                )}
              >
                {value === "twin" ? "Your twin" : "Generic"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-[1fr_220px]">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
            <IdentityAvatar wife={wife} size={32} />
            <div className="min-w-0">
              <p className="text-[12.5px] font-medium">{wife.name}</p>
              <p className="text-[11.5px] text-green">Drafting in your voice</p>
            </div>
            <span className="ml-auto text-[11.5px] text-faint">20:16</span>
          </div>

          <div className="flex min-h-[240px] flex-col gap-3 p-4">
            <div className="flex items-start gap-2">
              <IdentityAvatar wife={wife} size={22} />
              <div className="max-w-[290px] rounded-lg rounded-tl-sm border border-line bg-ink/[0.035] px-3 py-2 text-[12px] leading-relaxed text-ink/90">
                {INCOMING[wifeId]}
              </div>
            </div>

            <div className="mt-1 flex justify-end">
              <div className="w-full max-w-[330px] rounded-lg rounded-tr-sm border border-accent/25 bg-accent/[0.055] p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11.5px] text-accent">
                    {mode === "twin" ? "Your twin · draft" : "Generic model"}
                  </span>
                  <span className="font-mono text-[8px] tabular-nums text-faint">{confidence}% confidence</span>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={`${mode}-${wifeId}-${seed}`}
                    initial={reduce ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "mt-2 text-[12.5px] leading-[1.65]",
                      thinking && "blur-[1.5px] opacity-40",
                      mode === "generic" ? "text-muted" : "text-ink",
                    )}
                  >
                    {thinking ? "Composing…" : draft}
                  </motion.p>
                </AnimatePresence>
                <div className="mt-2.5 flex items-center gap-2 border-t border-ink/[0.06] pt-2">
                  <span className="flex items-center gap-1 text-[11.5px] text-faint">
                    <Sparkles className="size-2.5 text-accent" />
                    {styleMatch}% style
                  </span>
                  <span className="text-[11.5px] text-faint">
                    {generated.latencyMs}ms
                  </span>
                  <span className="ml-auto flex items-center gap-1 text-[11.5px] text-green">
                    <Check className="size-2.5" />
                    Safety pass
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-line px-4 py-3">
            <button
              onClick={regenerate}
              className="flex h-8 items-center gap-1.5 rounded-md border border-line px-2.5 text-[11px] text-muted transition-colors hover:border-line-strong hover:text-ink"
            >
              <RefreshCw className={cn("size-3", thinking && "animate-spin")} />
              Regenerate
            </button>
            <button
              onClick={() => toast.success("Draft staged in the demo. No message is sent.")}
              className="flex h-8 items-center gap-1.5 rounded-md border border-accent/30 bg-accent/10 px-2.5 text-[11px] text-accent transition-colors hover:bg-accent/15"
            >
              <Send className="size-3" />
              Stage draft
            </button>
            <span className="ml-auto hidden text-[11.5px] text-faint sm:block">
              No external send
            </span>
          </div>
        </div>

        <div className="hidden border-l border-line p-3.5 sm:block">
          <p className="mono-label">Style fingerprint</p>
          <div className="mt-3 space-y-2.5">
            {[
              { label: "Vocabulary", value: mode === "twin" ? 94 : 38 },
              { label: "Rhythm", value: mode === "twin" ? 96 : 44 },
              { label: "Emoji habits", value: mode === "twin" ? (wife.id === "olivia" ? 92 : 8) : 12 },
              { label: "Callbacks", value: mode === "twin" ? 91 : 9 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-[11.5px]">
                  <span className="text-faint">{item.label}</span>
                  <span className="tabular-nums text-muted">{item.value}</span>
                </div>
                <div className="mt-1 h-[2px] w-full bg-ink/[0.06]">
                  <div
                    className="h-full bg-accent transition-all duration-700"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="mono-label mt-5">Memory refs</p>
          <div className="mt-2 flex flex-col gap-1.5">
            {(mode === "twin" ? generated.memories : []).slice(0, 3).map((memory) => (
              <div key={memory.id} className="rounded border border-line bg-ink/[0.02] px-2 py-1.5">
                <p className="text-[9.5px] leading-snug text-ink/80">{memory.title}</p>
                <p className="mt-0.5 font-mono text-[7.5px] text-faint">
                  {memory.kind} · {memory.namespace}
                </p>
              </div>
            ))}
            {mode === "generic" && (
              <p className="rounded border border-dashed border-line px-2 py-3 text-center text-[9.5px] text-faint">
                No memory context in use.
              </p>
            )}
          </div>

          <div className="mt-4 rounded-md border border-green/20 bg-green/[0.04] p-2">
            <p className="font-mono text-[7.5px] text-green">Isolation</p>
            <p className="mt-1 text-[9.5px] leading-relaxed text-muted">
              Only ns.{wife.id}.v2 was read. 0 references crossed.
            </p>
          </div>
        </div>
      </div>
    </DemoShell>
  );
}
