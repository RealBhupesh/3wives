"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Database, Lock, ShieldAlert, ShieldCheck, Terminal } from "lucide-react";
import { createInitialState, DEMO_NOW } from "@/lib/data";
import type { WifeId } from "@/lib/types";
import { DemoShell } from "./section";
import { cn } from "@/lib/utils";

export function IsolationDemo() {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<WifeId>("sophia");
  const [attempting, setAttempting] = useState(false);
  const [denied, setDenied] = useState(false);
  const timeout = useRef<number | null>(null);
  const data = createInitialState(DEMO_NOW);
  const wife = data.wives.find((item) => item.id === selected) ?? data.wives[0];
  const memories = data.memories.filter((memory) => memory.wifeId === selected).slice(0, 3);

  useEffect(() => () => { if (timeout.current) window.clearTimeout(timeout.current); }, []);

  const attempt = () => {
    if (attempting) return;
    if (denied) {
      setDenied(false);
      return;
    }
    setAttempting(true);
    timeout.current = window.setTimeout(() => {
      setAttempting(false);
      setDenied(true);
    }, reduce ? 0 : 750);
  };

  return (
    <DemoShell label="Context isolation engine" meta="3 NAMESPACES · 0 SHARED" className="bg-[#090a0f]">
      <div className="p-4 md:p-5">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 rounded-md border border-line-strong bg-surface-2 px-3 py-2">
            <span className="flex size-6 items-center justify-center rounded-[4px] border border-white/10 bg-white/[0.03]">
              <ShieldCheck className="size-3.5 text-green" />
            </span>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-ink">Inference Router</p>
              <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-faint">identity → namespace</p>
            </div>
            <span className="ml-2 flex items-center gap-1 rounded-full bg-green/10 px-1.5 py-0.5 font-mono text-[7.5px] uppercase tracking-[0.1em] text-green">
              <span className="size-1 rounded-full bg-green" />
              enforced
            </span>
          </div>

          <div className="my-1 flex flex-col items-center" aria-hidden>
            <span className="h-4 w-px bg-gradient-to-b from-line-strong to-transparent" />
            <ArrowDown className="size-3 text-faint" />
          </div>

          <div className="grid w-full grid-cols-3 gap-2">
            {data.wives.map((item) => {
              const isActive = selected === item.id;
              const count = data.memories.filter((memory) => memory.wifeId === item.id).length * 46 + 281;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelected(item.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "group relative flex flex-col items-start rounded-md border p-2.5 text-left transition-all duration-300",
                    isActive
                      ? "border-white/20 bg-white/[0.05]"
                      : "border-line bg-white/[0.015] hover:border-line-strong hover:bg-white/[0.03]",
                  )}
                >
                  <span
                    className="absolute inset-x-3 top-0 h-px transition-opacity"
                    style={{ background: item.palette.from, opacity: isActive ? 0.9 : 0.2 }}
                  />
                  <div className="flex w-full items-center justify-between gap-1">
                    <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-faint">{item.code}</span>
                    <Lock className={cn("size-2.5", isActive ? "text-green" : "text-faint")} />
                  </div>
                  <span className="mt-1 truncate font-mono text-[9px] tracking-[-0.02em] text-ink">
                    ns.{item.id}.v2
                  </span>
                  <span className="mt-1 font-mono text-[7.5px] uppercase tracking-[0.06em] text-faint">
                    {count.toLocaleString()} vectors
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 rounded-md border border-line bg-white/[0.018] p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Database className="size-3 text-green" />
              <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-green">
                Access granted · read
              </span>
            </div>
            <span className="font-mono text-[8px] uppercase tracking-[0.08em] text-faint">
              last write 12m ago · us-east-1
            </span>
          </div>
          <div className="mt-2.5 space-y-1.5">
            {memories.map((memory) => (
              <div key={memory.id} className="flex items-start gap-2 rounded-[4px] border border-line bg-ground/60 px-2 py-1.5">
                <span
                  className="mt-1 size-1 shrink-0 rounded-full"
                  style={{ background: wife.palette.from }}
                />
                <div className="min-w-0">
                  <p className="truncate text-[10px] leading-snug text-ink/85">{memory.title}</p>
                  <p className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-faint">
                    {memory.kind} · importance {memory.importance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={attempt}
            className={cn(
              "flex h-8 items-center gap-1.5 rounded-md border px-2.5 font-mono text-[9px] uppercase tracking-[0.09em] transition-colors",
              denied
                ? "border-red/40 bg-red/10 text-red"
                : "border-line text-muted hover:border-red/30 hover:text-red",
            )}
          >
            <ShieldAlert className="size-3" />
            {attempting ? "Resolving boundary…" : denied ? "Reset probe" : "Attempt cross-context read"}
          </button>
          <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-faint">
            policy: isolation.strict
          </span>
        </div>

        <AnimatePresence>
          {(attempting || denied) && (
            <motion.div
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div
                className={cn(
                  "mt-2.5 rounded-md border p-2.5 font-mono text-[9px] leading-relaxed",
                  denied ? "border-red/30 bg-red/[0.05]" : "border-line bg-ground",
                )}
              >
                <div className="flex items-center gap-1.5 text-faint">
                  <Terminal className="size-3" />
                  <span className="uppercase tracking-[0.1em]">safety.trace</span>
                </div>
                <div className="mt-1.5 space-y-0.5">
                  <p className="text-muted">
                    <span className="text-faint">→</span> query target: ns.sophia.v2
                  </p>
                  <p className="text-muted">
                    <span className="text-faint">→</span> caller context: ns.{selected}.v2
                  </p>
                  {denied ? (
                    <>
                      <p className="text-red">✕ BLOCKED · cross_context_read_denied</p>
                      <p className="text-faint">0 rows returned · incident logged · no data emitted</p>
                    </>
                  ) : (
                    <p className="text-amber">… evaluating cryptographic namespace boundary</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-3 border-t border-line">
        {[
          { label: "Cross-reads", value: "0" },
          { label: "Isolation", value: "99.9%" },
          { label: "Encryption", value: "AES-256" },
        ].map((stat, index) => (
          <div key={stat.label} className={cn("px-3 py-2.5", index > 0 && "border-l border-line")}>
            <p className="font-mono text-[12px] tabular-nums text-ink">{stat.value}</p>
            <p className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-faint">{stat.label}</p>
          </div>
        ))}
      </div>
    </DemoShell>
  );
}
