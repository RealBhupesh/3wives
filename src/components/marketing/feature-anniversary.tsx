"use client";

import { useMemo, useState } from "react";
import { differenceInCalendarDays, format } from "date-fns";
import { BellRing, CalendarHeart, Check, Gift, RefreshCw, Sparkles } from "lucide-react";
import { createInitialState, DEMO_NOW } from "@/lib/data";
import type { WifeId } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { IdentityAvatar } from "@/components/brand/identity-avatar";
import { DemoShell } from "./section";
import { cn } from "@/lib/utils";

const NOTES: Record<WifeId, string[]> = {
  sophia: [
    "Four years, and I would still choose the tile warehouse. Saturday, 7pm. I have a plan, and one of the courses is a surprise.",
    "I remembered the date before the calendar did. That should count for something. Saturday, 7pm — dress like the version of me you married.",
    "The tile was the beginning. This Saturday is the rest of it. I'll be home by six.",
  ],
  olivia: [
    "Happy birthday. I know you hate surprises that aren't planned properly. This one has a run sheet and good lighting. 8pm.",
    "You said you didn't want a fuss. I ignored you, responsibly. Be ready at 7:45.",
    "One year of you noticing everything. The least I can do is notice this. Saturday, 8pm.",
  ],
  isabella: [
    "Thursday is on the calendar, and so are you. Table by the kitchen. I'll be there at 8:50 and I mean it.",
    "I know what this date means. I'm not going to be late to the thing that matters.",
    "You asked if it matters to me. It's Thursday, 9pm, and I've already moved everything else.",
  ],
};


export function AnniversaryDemo() {
  const data = useMemo(() => createInitialState(DEMO_NOW), []);
  const [selected, setSelected] = useState<WifeId>("sophia");
  const [variant, setVariant] = useState(0);
  const [armed, setArmed] = useState<Record<string, boolean>>({});

  const wife = data.wives.find((item) => item.id === selected) ?? data.wives[0];
  const days = differenceInCalendarDays(new Date(wife.nextDate.date), DEMO_NOW);
  const gift = data.gifts.find((item) => item.wifeId === selected && item.status === "idea");

  return (
    <DemoShell label="Occasion intelligence" meta="3 TRACKED · 0 MISSED">
      <div className="grid md:grid-cols-[1fr_1.1fr]">
        <div className="border-b border-line p-3.5 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between">
            <p className="mono-label">Upcoming</p>
            <span className="text-[11.5px] text-green">synced</span>
          </div>
          <div className="mt-3 space-y-1.5">
            {data.wives.map((item) => {
              const itemDays = differenceInCalendarDays(new Date(item.nextDate.date), DEMO_NOW);
              const active = item.id === selected;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelected(item.id);
                    setVariant(0);
                  }}
                  aria-pressed={active}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-md border p-2 text-left transition-colors",
                    active ? "border-line-strong bg-ink/[0.05]" : "border-transparent hover:bg-ink/[0.025]",
                  )}
                >
                  <IdentityAvatar wife={item} size={28} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11.5px] font-medium">{item.nextDate.label}</p>
                    <p className="text-[11.5px] text-faint">
                      {format(new Date(item.nextDate.date), "MMM d")} · {item.name}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "font-mono text-[9px] tabular-nums",
                      itemDays <= 7 ? "text-accent" : "text-muted",
                    )}
                  >
                    T-{itemDays}d
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-1.5 rounded border border-dashed border-line px-2 py-1.5">
            <CalendarHeart className="size-3 text-faint" />
            <p className="font-mono text-[7.5px] leading-relaxed text-faint">
              reminders armed at T-14 / T-7 / T-1
            </p>
          </div>
        </div>

        <div className="p-3.5">
          <div className="flex items-center justify-between">
            <p className="text-[11.5px] text-faint">{wife.code} · {wife.nextDate.label}</p>
            <span className="rounded-full border border-accent/25 bg-accent/[0.07] px-1.5 py-0.5 font-mono text-[8px] tabular-nums text-accent">
              {days} days
            </span>
          </div>

          <div className="mt-3 rounded-md border border-line bg-ground/60 p-2.5">
            <div className="flex items-center gap-1.5">
              <Gift className="size-3 text-accent" />
              <p className="font-mono text-[7.5px] text-faint">Recommended</p>
              <span className="ml-auto font-mono text-[8px] text-green">{gift?.match ?? 0}% match</span>
            </div>
            <p className="mt-1.5 text-[11.5px] text-ink">{gift?.name}</p>
            <p className="mt-0.5 text-[9.5px] leading-snug text-muted">{gift?.rationale}</p>
            <p className="mt-1.5 font-mono text-[9px] tabular-nums text-muted">
              {formatCurrency(gift?.price ?? 0)} · {gift?.category}
            </p>
          </div>

          <div className="mt-2.5 rounded-md border border-line bg-ink/[0.02] p-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-[7.5px] text-faint">
                <Sparkles className="size-2.5 text-violet" />
                Drafted note
              </span>
              <button
                onClick={() => setVariant((value) => (value + 1) % 3)}
                className="flex items-center gap-1 text-[11.5px] text-faint transition-colors hover:text-ink"
              >
                <RefreshCw className="size-2.5" />
                Rewrite
              </button>
            </div>
            <p className="mt-1.5 min-h-[52px] text-[10.5px] leading-[1.6] text-ink/85">
              {NOTES[selected][variant]}
            </p>
          </div>

          <button
            onClick={() => setArmed((prev) => ({ ...prev, [wife.id]: !prev[wife.id] }))}
            className={cn(
              "mt-2.5 flex h-8 w-full items-center justify-center gap-1.5 rounded-md border font-mono text-[8.5px] uppercase tracking-[0.1em] transition-colors",
              armed[wife.id]
                ? "border-green/30 bg-green/[0.06] text-green"
                : "border-line text-muted hover:border-line-strong hover:text-ink",
            )}
          >
            {armed[wife.id] ? <Check className="size-3" /> : <BellRing className="size-3" />}
            {armed[wife.id] ? "Sequence armed · T-14 / 7 / 1" : "Arm reminder sequence"}
          </button>
        </div>
      </div>
    </DemoShell>
  );
}
