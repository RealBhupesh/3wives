"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Activity, ArrowUpRight, ShieldCheck, Zap } from "lucide-react";
import { createWives, DEMO_NOW } from "@/lib/data";
import { IdentityAvatar } from "@/components/brand/identity-avatar";
import { LogoMark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const FEED = [
  { code: "WIFE 01", name: "Sophia", text: "Anniversary remembered", state: "T-14d" },
  { code: "WIFE 02", name: "Olivia", text: "Good morning message drafted", state: "STAGED" },
  { code: "WIFE 03", name: "Isabella", text: "Dinner reservation secured", state: "21:00" },
  { code: "ENGINE", name: "Core", text: "All systems synchronized", state: "LIVE" },
];

function LiveTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "America/Los_Angeles",
        }).format(new Date()),
      );
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="font-mono text-[9.5px] tabular-nums tracking-[0.12em] text-faint">{time ?? "--:--:--"} PST</span>;
}

export function RelationshipMesh({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const wives = useMemo(() => createWives(DEMO_NOW), []);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setActive((value) => (value + 1) % FEED.length), 3800);
    return () => window.clearInterval(id);
  }, [reduce]);

  const nodePositions = [
    { left: "21%", top: "20%" },
    { left: "79%", top: "26%" },
    { left: "50%", top: "78%" },
  ];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className={cn("relative overflow-hidden rounded-xl border border-line-strong bg-[#ffffff]/90", className)}
    >
      <div className="flex h-11 items-center justify-between border-b border-line px-4">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(17,118,110,0.5)]" />
          <span className="text-[11.5px] text-muted">Relationship Mesh</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 text-[11.5px] text-faint sm:flex">
            <ShieldCheck className="size-3 text-green" />
            3 isolated namespaces
          </span>
          <LiveTime />
        </div>
      </div>

      <div className="relative h-[510px] overflow-hidden md:h-[560px]">
        <div className="absolute inset-0 grid-bg opacity-70" aria-hidden />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(45% 45% at 50% 43%, rgba(17,118,110,0.10), transparent 70%), radial-gradient(35% 35% at 78% 30%, rgba(79,70,200,0.10), transparent 78%)",
          }}
        />

        {/* Desktop mesh */}
        <div className="absolute inset-0 hidden md:block">
          <svg viewBox="0 0 720 560" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
            <defs>
              <linearGradient id="mesh-line" x1="0" y1="0" x2="720" y2="560" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0f9d8a" stopOpacity="0.42" />
                <stop offset="0.5" stopColor="#6e56f8" stopOpacity="0.24" />
                <stop offset="1" stopColor="#0f9d8a" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path d="M150 155 C 220 190, 270 210, 336 244" stroke="url(#mesh-line)" strokeWidth="1" className="animated-dash" />
            <path d="M570 178 C 505 200, 455 218, 386 244" stroke="url(#mesh-line)" strokeWidth="1" className="animated-dash" />
            <path d="M360 420 C 360 380, 360 340, 360 300" stroke="url(#mesh-line)" strokeWidth="1" className="animated-dash" />

            {!reduce && (
              <>
                <circle r="2.4" fill="#0f9d8a">
                  <animateMotion dur="4.2s" repeatCount="indefinite" path="M150 155 C 220 190, 270 210, 336 244" begin="0s" />
                  <animate attributeName="opacity" values="0;1;1;0" dur="4.2s" repeatCount="indefinite" begin="0s" />
                </circle>
                <circle r="2" fill="#6e56f8">
                  <animateMotion dur="5s" repeatCount="indefinite" path="M570 178 C 505 200, 455 218, 386 244" begin="1.1s" />
                  <animate attributeName="opacity" values="0;1;1;0" dur="5s" repeatCount="indefinite" begin="1.1s" />
                </circle>
                <circle r="2" fill="#0f9d8a">
                  <animateMotion dur="4.6s" repeatCount="indefinite" path="M360 420 C 360 380, 360 340, 360 300" begin="0.6s" />
                  <animate attributeName="opacity" values="0;1;1;0" dur="4.6s" repeatCount="indefinite" begin="0.6s" />
                </circle>
                <circle r="1.6" fill="#12a26b">
                  <animateMotion dur="6s" repeatCount="indefinite" path="M360 300 C 360 340, 360 380, 360 420" begin="2.2s" />
                  <animate attributeName="opacity" values="0;0.8;0.8;0" dur="6s" repeatCount="indefinite" begin="2.2s" />
                </circle>
              </>
            )}
          </svg>

          {/* Core */}
          <div className="absolute left-1/2 top-[43%] -translate-x-1/2 -translate-y-1/2">
            <div className="relative flex size-[132px] items-center justify-center">
              <div
                className="absolute inset-0 rounded-full opacity-70 blur-2xl"
                style={{ background: "radial-gradient(circle, rgba(17,118,110,0.32), rgba(79,70,200,0.16) 55%, transparent 72%)" }}
              />
              <motion.div
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{ duration: 32, ease: "linear", repeat: Infinity }}
                className="absolute inset-0 rounded-full border border-dashed border-ink/15"
              />
              <div className="absolute inset-[16px] rounded-full border border-ink/[0.08]" />
              <div className="absolute inset-[30px] rounded-full border border-accent/25" />
              <div className="relative flex size-[62px] items-center justify-center rounded-full border border-ink/15 bg-[#ffffff] shadow-[inset_0_1px_0_rgba(11,13,18,0.08)]">
                <LogoMark className="size-8" animated />
              </div>
              <span className="absolute -bottom-3 rounded-full border border-line bg-ground px-2 py-0.5 text-[11.5px] text-faint">
                Core inference
              </span>
            </div>
          </div>

          {/* Node cards */}
          {wives.map((wife, index) => (
            <div
              key={wife.id}
              className="absolute w-[186px] -translate-x-1/2 -translate-y-1/2"
              style={nodePositions[index]}
            >
              <div className="rounded-md border border-line bg-[#ffffff]/95 p-3 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.16)]">
                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] text-faint">{wife.code}</span>
                  <span
                    className="size-1.5 rounded-full"
                    style={{ background: wife.status === "critical" ? "#e5383b" : wife.status === "attention" ? "#d98a00" : "#12a26b" }}
                  />
                </div>
                <div className="mt-2 flex items-center gap-2.5">
                  <IdentityAvatar wife={wife} size={34} />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium tracking-[-0.01em]">{wife.name}</p>
                    <p className="truncate text-[10px] text-faint">{wife.tone.split(" · ")[0]}</p>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center justify-between border-t border-line pt-2">
                  <span className="truncate text-[9.5px] text-muted">{wife.activity}</span>
                  <span className="ml-2 font-mono text-[9px] tabular-nums text-green">{wife.health}%</span>
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-line bg-ground/70 px-2.5 py-1">
            <span className="status-dot text-green" />
            <span className="text-[11.5px] text-green">All systems synchronized</span>
          </div>
          <div className="absolute bottom-4 right-4 text-[11.5px] text-faint">
            mesh.v2.4.1
          </div>
        </div>

        {/* Mobile mesh */}
        <div className="relative flex h-full flex-col justify-between p-4 md:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-full border border-accent/30 bg-accent/5">
                <LogoMark className="size-5" />
              </div>
              <div>
                <p className="text-[11.5px] text-faint">Core inference</p>
                <p className="text-[12px]">All systems synchronized</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-[11.5px] text-green">
              <span className="status-dot" />
              Live
            </span>
          </div>

          <div className="relative my-3 flex-1">
            <div className="absolute left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-accent/40 via-violet/30 to-accent/20" />
            <div className="flex h-full flex-col justify-between gap-2">
              {wives.map((wife, index) => (
                <div key={wife.id} className="relative flex items-center gap-3 rounded-md border border-line bg-[#ffffff]/90 p-2.5">
                  <span
                    className="absolute -left-[2px] size-1.5 rounded-full"
                    style={{ background: ["#f26b1d", "#6e56f8", "#0f9d8a"][index] }}
                  />
                  <IdentityAvatar wife={wife} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[12px] font-medium">{wife.name}</p>
                      <span className="text-[11.5px] text-faint">{wife.code}</span>
                    </div>
                    <p className="mt-0.5 truncate text-[10px] text-muted">
                      {FEED[index].text}
                    </p>
                  </div>
                  <span className="font-mono text-[9.5px] tabular-nums text-green">{wife.health}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-line bg-ink/[0.02] p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] text-faint">Engine</span>
              <span className="text-[11.5px] text-green">Healthy</span>
            </div>
            <p className="mt-1 text-[10.5px] leading-relaxed text-muted">
              3 contexts isolated · 2,418 vectors · 0 cross-reads
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
        {FEED.map((item, index) => (
          <button
            key={item.code}
            type="button"
            onClick={() => setActive(index)}
            aria-pressed={active === index}
            className={cn(
              "relative border-line p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent/60",
              index !== 0 && "border-l",
              index < 2 ? "border-b lg:border-b-0" : "",
              index === 2 && "lg:border-l",
              active === index ? "bg-ink/[0.03]" : "hover:bg-ink/[0.02]",
            )}
          >
            {active === index && (
              <motion.span
                layoutId="mesh-feed-active"
                className="absolute inset-x-3 top-0 h-px bg-accent"
                transition={{ duration: 0.3 }}
              />
            )}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11.5px] text-faint">{item.code === "ENGINE" ? "CORE" : item.code}</span>
              <span className="text-[11.5px] text-green">{item.state}</span>
            </div>
            <p className="mt-1 truncate text-[11px] text-ink/90">{item.text}</p>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export function MeshLegend() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
      {[
        { icon: Zap, label: "p50 inference 286ms" },
        { icon: ShieldCheck, label: "Zero cross-context reads" },
        { icon: Activity, label: "Live memory indexing" },
      ].map(({ icon: Icon, label }) => (
        <span key={label} className="flex items-center gap-1.5 text-[11.5px] text-faint">
          <Icon className="size-3 text-muted" />
          {label}
        </span>
      ))}
      <a
        href="/engine"
        className="ml-auto flex items-center gap-1 text-[11.5px] text-accent transition-colors hover:text-ink"
      >
        Inspect engine
        <ArrowUpRight className="size-3" />
      </a>
    </div>
  );
}
