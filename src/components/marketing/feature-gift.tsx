"use client";

import { useMemo, useState } from "react";
import { Gauge, Sparkles, TriangleAlert } from "lucide-react";
import { createInitialState, DEMO_NOW } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Slider } from "@/components/ui/controls";
import { DemoShell } from "./section";

export function GiftDemo() {
  const data = useMemo(() => createInitialState(DEMO_NOW), []);
  const [budget, setBudget] = useState(900);
  const allocation = Math.floor(budget / 3);

  const recommendations = data.wives.map((wife) => {
    const options = data.gifts
      .filter((gift) => gift.wifeId === wife.id && gift.status === "idea")
      .sort((a, b) => b.match - a.match);
    const affordable = options.find((gift) => gift.price <= allocation);
    return { wife, gift: affordable ?? null, all: options };
  });

  const spend = recommendations.reduce((sum, item) => sum + (item.gift?.price ?? 0), 0);

  return (
    <DemoShell label="Gift recommendation agent" meta="BUDGET OPTIMIZER">
      <div className="p-3.5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[7.5px] text-faint">Monthly allocation</p>
            <p className="mt-0.5 font-mono text-[17px] tabular-nums tracking-[-0.04em] text-ink">
              {formatCurrency(budget)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[7.5px] text-faint">Optimized spend</p>
            <p className="mt-0.5 font-mono text-[13px] tabular-nums text-green">{formatCurrency(spend)}</p>
          </div>
        </div>

        <Slider
          value={[budget]}
          onValueChange={(value) => setBudget(value[0])}
          min={150}
          max={1800}
          step={50}
          className="mt-3"
          aria-label="Monthly gift budget"
        />
        <div className="mt-1.5 flex justify-between font-mono text-[7.5px] text-faint">
          <span>$150</span>
          <span>{formatCurrency(allocation)} per relationship</span>
          <span>$1,800</span>
        </div>

        <div className="mt-3 space-y-1.5">
          {recommendations.map(({ wife, gift, all }) => (
            <div
              key={wife.id}
              className="flex items-center gap-2.5 rounded-md border border-line bg-ink/[0.018] px-2.5 py-2"
            >
              <span className="size-1.5 shrink-0 rounded-full" style={{ background: wife.palette.from }} />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[7.5px] text-faint">
                  {wife.code} · {wife.name}
                </p>
                {gift ? (
                  <p className="truncate text-[10.5px] text-ink/85">{gift.name}</p>
                ) : (
                  <p className="flex items-center gap-1 text-[10px] text-amber">
                    <TriangleAlert className="size-2.5" />
                    No allocation — lowest option {formatCurrency(all[all.length - 1]?.price ?? 0)}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] tabular-nums text-ink">
                  {gift ? formatCurrency(gift.price) : "—"}
                </p>
                <p className="font-mono text-[7.5px] text-green">
                  {gift ? `${gift.match}% match` : "deferred"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-start gap-1.5 rounded border border-line bg-ground/50 px-2 py-1.5">
          <Sparkles className="mt-[1px] size-2.5 shrink-0 text-violet" />
          <p className="font-mono text-[7.5px] leading-relaxed tracking-[0.04em] text-faint">
            Three wishlists evaluated against one budget. Duplicate silhouettes removed before procurement.
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-line pt-2">
          <span className="flex items-center gap-1 text-[11.5px] text-faint">
            <Gauge className="size-3" />
            remaining {formatCurrency(Math.max(budget - spend, 0))}
          </span>
          <span className="text-[11.5px] text-green">0 duplicates</span>
        </div>
      </div>
    </DemoShell>
  );
}
