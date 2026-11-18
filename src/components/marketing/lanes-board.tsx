"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type LaneId = "sophia" | "olivia" | "isabella";

const LANES: {
  id: LaneId;
  name: string;
  color: string;
  mood: string;
  sentiment: number;
  exchanges: [string, string][];
}[] = [
  {
    id: "sophia",
    name: "Sophia",
    color: "#f26b1d",
    mood: "Warm",
    sentiment: 96,
    exchanges: [
      ["Are you still coming to Mom's on Sunday?", "Wouldn't miss it. I'll bring the lemon tart she likes."],
      ["I miss you today", "Miss you more. Leaving the office early, promise."],
      ["Did you remember what Friday is?", "Our anniversary. Table's booked at Lucca, 8:00."],
    ],
  },
  {
    id: "olivia",
    name: "Olivia",
    color: "#6e56f8",
    mood: "Playful",
    sentiment: 78,
    exchanges: [
      ["You've been quiet this week…", "Sorry, crunch at work. Saturday is all yours."],
      ["Guess what I found at the market", "Not another plant. Okay fine, send a photo."],
      ["Do you even know my sister's name?", "Of course, it's Clara. How did her recital go?"],
    ],
  },
  {
    id: "isabella",
    name: "Isabella",
    color: "#0f9d8a",
    mood: "Intense",
    sentiment: 62,
    exchanges: [
      ["Who were you texting at dinner?", "My brother. The fantasy league draft again."],
      ["You promised we'd talk tonight", "I did. Calling you at 9, phone on silent."],
      ["Are we okay?", "We're more than okay. Let's do brunch tomorrow."],
    ],
  },
];

const COLLISIONS = [
  "Fri 8:00 PM double-booked → Olivia moved to Sat 7:30 PM",
  "Same necklace queued twice → second gift swapped",
  "\"Lucca\" referenced in wrong lane → draft rewritten",
];

type Packet = { key: number; lane: LaneId; incoming: string; reply: string };

const STATIC_PACKETS: Packet[] = LANES.map((lane, i) => ({
  key: i,
  lane: lane.id,
  incoming: lane.exchanges[0][0],
  reply: lane.exchanges[0][1],
}));

export function LanesBoard() {
  const reduce = useReducedMotion();
  const [packets, setPackets] = useState<Packet[]>([]);
  const [collision, setCollision] = useState<string | null>(null);
  const [handled, setHandled] = useState(18_402_311);
  const counter = useRef(0);

  useEffect(() => {
    if (reduce) return;
    const spawn = () => {
      const n = counter.current++;
      const lane = LANES[n % 3];
      const [incoming, reply] = lane.exchanges[Math.floor(n / 3) % lane.exchanges.length];
      setPackets((prev) => [...prev.slice(-8), { key: n, lane: lane.id, incoming, reply }]);
      setHandled((h) => h + 1 + (n % 4));
    };
    spawn();
    const t = window.setInterval(spawn, 1900);
    let c = 0;
    const ct = window.setInterval(() => {
      setCollision(COLLISIONS[c++ % COLLISIONS.length]);
      window.setTimeout(() => setCollision(null), 3400);
    }, 9000);
    return () => {
      window.clearInterval(t);
      window.clearInterval(ct);
    };
  }, [reduce]);

  return (
    <div className="shadow-float relative overflow-hidden rounded-[20px] bg-white">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-ink/10" />
            <span className="size-2.5 rounded-full bg-ink/10" />
            <span className="size-2.5 rounded-full bg-ink/10" />
          </div>
          <span className="text-[12.5px] font-medium text-ink">Live routing</span>
          <span className="hidden text-[12.5px] text-faint sm:inline">3 lanes, 1 router, 0 shared memory</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-muted">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-green/60" />
            <span className="relative size-2 rounded-full bg-green" />
          </span>
          <span className="tabular font-mono text-[11.5px] text-ink">{handled.toLocaleString("en-US")}</span>
          <span className="hidden sm:inline">messages handled</span>
        </div>
      </div>

      {/* Lanes */}
      <div className="relative">
        {/* Router column */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-px -translate-x-1/2 bg-ink/10 md:left-[54%]" />
        <div className="pointer-events-none absolute left-1/2 top-2 z-20 -translate-x-1/2 md:left-[54%]">
          <span className="flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[10.5px] font-medium text-white">
            <ShieldCheck className="size-3" />
            Router
          </span>
        </div>

        {LANES.map((lane) => (
          <div key={lane.id} className="relative flex h-[92px] items-center border-b border-line last:border-b-0 sm:h-[104px]">
            <div className="relative z-20 flex h-full w-[92px] shrink-0 flex-col justify-center gap-1 border-r border-line bg-white px-3 sm:w-[148px] sm:px-5">
              <span className="flex items-center gap-2">
                <span className="h-5 w-1 rounded-full" style={{ background: lane.color }} />
                <span className="font-[family-name:var(--font-display)] text-[16px] font-semibold tracking-[-0.03em] sm:text-[18px]">
                  {lane.name}
                </span>
              </span>
              <span className="hidden pl-3 text-[11.5px] text-muted sm:block">
                {lane.mood} · <span className="tabular text-ink">{lane.sentiment}</span>
              </span>
            </div>

            <div className="relative h-full flex-1 overflow-hidden">
              <div
                aria-hidden
                className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
                style={{ background: `repeating-linear-gradient(90deg, ${lane.color}55 0 6px, transparent 6px 12px)` }}
              />
              <AnimatePresence>
                {(reduce ? STATIC_PACKETS : packets)
                  .filter((p) => p.lane === lane.id)
                  .map((p) => (
                    <PacketPair key={p.key} packet={p} color={lane.color} reduce={!!reduce} />
                  ))}
              </AnimatePresence>
            </div>
          </div>
        ))}

        <AnimatePresence>
          {collision && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-3 left-1/2 z-30 flex max-w-[92%] -translate-x-1/2 items-center gap-2 rounded-full border border-amber/30 bg-white px-3 py-1.5 shadow-[0_8px_24px_-12px_rgba(9,9,11,0.3)] md:left-[54%]"
            >
              <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-amber text-white">
                <Check className="size-2.5" strokeWidth={3} />
              </span>
              <span className="truncate text-[11.5px] text-ink">
                <span className="font-medium">Collision averted.</span> <span className="text-muted">{collision}</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PacketPair({ packet, color, reduce }: { packet: Packet; color: string; reduce: boolean }) {
  if (reduce) {
    return (
      <>
        <Bubble className="left-[4%]" text={packet.incoming} color={color} incoming />
        <Bubble className="left-[58%]" text={packet.reply} color={color} />
      </>
    );
  }
  return (
    <>
      <motion.div
        className="absolute top-1/2 -translate-y-1/2"
        initial={{ left: "-38%", opacity: 0 }}
        animate={{ left: ["-38%", "8%", "30%"], opacity: [0, 1, 0] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 5.2, times: [0, 0.55, 1], ease: "linear" }}
      >
        <Bubble text={packet.incoming} color={color} incoming />
      </motion.div>
      <motion.div
        className="absolute top-1/2 -translate-y-1/2"
        initial={{ left: "50%", opacity: 0 }}
        animate={{ left: ["52%", "70%", "112%"], opacity: [0, 1, 1] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 6, delay: 3.6, times: [0, 0.3, 1], ease: "linear" }}
      >
        <Bubble text={packet.reply} color={color} />
      </motion.div>
    </>
  );
}

function Bubble({ text, color, incoming, className }: { text: string; color: string; incoming?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "w-[170px] rounded-2xl px-3 py-2 text-[11.5px] leading-snug sm:w-[220px] sm:text-[12.5px]",
        incoming ? "rounded-bl-md border border-line bg-white text-ink shadow-[0_4px_14px_-8px_rgba(9,9,11,0.25)]" : "rounded-br-md text-white",
        className,
        className && "absolute top-1/2 -translate-y-1/2",
      )}
      style={incoming ? undefined : { background: color }}
    >
      {text}
    </div>
  );
}
