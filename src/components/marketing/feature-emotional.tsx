"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Brain, TriangleAlert } from "lucide-react";
import type { WifeId } from "@/lib/types";
import { DemoShell } from "./section";
import { cn } from "@/lib/utils";

type Mood = "guarded" | "neutral" | "open";

const WIVES: { id: WifeId; name: string; color: string }[] = [
  { id: "sophia", name: "Sophia", color: "#f26b1d" },
  { id: "olivia", name: "Olivia", color: "#6e56f8" },
  { id: "isabella", name: "Isabella", color: "#0f9d8a" },
];

const VECTORS: Record<WifeId, Record<Mood, { warmth: number; patience: number; openness: number }>> = {
  sophia: {
    guarded: { warmth: 58, patience: 44, openness: 32 },
    neutral: { warmth: 78, patience: 72, openness: 66 },
    open: { warmth: 92, patience: 86, openness: 88 },
  },
  olivia: {
    guarded: { warmth: 62, patience: 28, openness: 41 },
    neutral: { warmth: 81, patience: 54, openness: 69 },
    open: { warmth: 95, patience: 77, openness: 93 },
  },
  isabella: {
    guarded: { warmth: 45, patience: 22, openness: 18 },
    neutral: { warmth: 70, patience: 48, openness: 52 },
    open: { warmth: 96, patience: 74, openness: 90 },
  },
};

const ADVICE: Record<WifeId, Record<Mood, { do: string; avoid: string }>> = {
  sophia: {
    guarded: {
      do: "Name the thing you noticed in one sentence. Then stop talking.",
      avoid: "Asking 'what's wrong' twice. She heard you the first time.",
    },
    neutral: {
      do: "Bring the specific detail she mentioned three days ago. Precision reads as care.",
      avoid: "Grand declarations. She will ask what you want.",
    },
    open: {
      do: "Ask the follow-up question. She has been waiting to be asked.",
      avoid: "Filling the silence. It is doing work.",
    },
  },
  olivia: {
    guarded: {
      do: "Answer directly. No preamble, no 'just'.",
      avoid: "Over-explaining. Every extra clause is a new thread.",
    },
    neutral: {
      do: "Be specific about the plan. Send the address before she asks.",
      avoid: "Vague promises about Friday. She has a spreadsheet.",
    },
    open: {
      do: "Match her energy and let her win one round.",
      avoid: "Turning the joke into a serious conversation too early.",
    },
  },
  isabella: {
    guarded: {
      do: "Show up early. Specificity is the apology.",
      avoid: "Explaining your calendar. She asked about the relationship.",
    },
    neutral: {
      do: "Say the thing plainly, then stay in the room.",
      avoid: "Using work as the reason for distance.",
    },
    open: {
      do: "Let her feed you. Ask about the menu, then about her.",
      avoid: "Making a joke out of the thing she just shared.",
    },
  },
};

export function EmotionalDemo() {
  const reduce = useReducedMotion();
  const [wifeId, setWifeId] = useState<WifeId>("isabella");
  const [mood, setMood] = useState<Mood>("guarded");
  const wife = WIVES.find((item) => item.id === wifeId) ?? WIVES[0];
  const vector = VECTORS[wifeId][mood];
  const advice = ADVICE[wifeId][mood];

  return (
    <DemoShell label="Emotional intelligence" meta="STATE MODEL v2">
      <div className="p-3.5">
        <div className="flex gap-1">
          {WIVES.map((item) => (
            <button
              key={item.id}
              onClick={() => setWifeId(item.id)}
              aria-pressed={wifeId === item.id}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded border py-1.5 text-[10px] transition-colors",
                wifeId === item.id
                  ? "border-line-strong bg-ink/[0.05] text-ink"
                  : "border-transparent text-faint hover:text-ink",
              )}
            >
              <span className="size-1.5 rounded-full" style={{ background: item.color }} />
              {item.name}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-[7.5px] text-faint">Simulated state</span>
          <div className="flex gap-1">
            {(["guarded", "neutral", "open"] as Mood[]).map((item) => (
              <button
                key={item}
                onClick={() => setMood(item)}
                aria-pressed={mood === item}
                className={cn(
                  "rounded-full px-1.5 py-0.5 font-mono text-[7.5px] uppercase tracking-[0.08em] transition-colors",
                  mood === item ? "bg-ink/[0.08] text-ink" : "text-faint hover:text-muted",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 space-y-2.5">
          {[
            { label: "Warmth", value: vector.warmth },
            { label: "Patience", value: vector.patience },
            { label: "Openness", value: vector.openness },
          ].map((bar) => (
            <div key={bar.label}>
              <div className="flex items-center justify-between text-[11.5px]">
                <span className="text-faint">{bar.label}</span>
                <span className="tabular-nums text-muted">{bar.value}</span>
              </div>
              <div className="mt-1 h-[3px] w-full overflow-hidden rounded-full bg-ink/[0.06]">
                <motion.div
                  animate={{ width: `${bar.value}%` }}
                  transition={reduce ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full"
                  style={{ background: bar.value < 40 ? "#e5383b" : bar.value < 70 ? "#d98a00" : "#12a26b" }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-md border border-line bg-ground/60 p-2.5">
          <div className="flex items-center gap-1.5">
            <Brain className="size-3 text-violet" />
            <p className="font-mono text-[7.5px] text-faint">Recommended approach</p>
          </div>
          <p className="mt-1.5 text-[10.5px] leading-[1.6] text-ink/85">{advice.do}</p>
          <p className="mt-1.5 flex items-start gap-1.5 text-[9.5px] leading-snug text-red/80">
            <TriangleAlert className="mt-[1px] size-2.5 shrink-0" />
            {advice.avoid}
          </p>
        </div>

        <div className="mt-2.5 flex items-center justify-between border-t border-line pt-2 font-mono text-[7.5px] text-faint">
          <span>namespace ns.{wife.id}.v2</span>
          <span className="text-green">no bleed</span>
        </div>
      </div>
    </DemoShell>
  );
}
