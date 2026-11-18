"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  BadgeCheck,
  CircleDollarSign,
  Gift as GiftIcon,
  Lock,
  PackageCheck,
  ShoppingBag,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import type { Gift, GiftStatus } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { IdentityAvatar } from "@/components/brand/identity-avatar";
import { GroupedBars } from "@/components/charts";
import { DashboardSkeleton, EmptyState, SectionCard } from "@/components/dashboard/primitives";
import { PageHeader, StatusChip } from "@/components/dashboard/chrome";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/controls";

const STATUS_META: Record<GiftStatus, { label: string; className: string }> = {
  idea: { label: "Idea", className: "border-line bg-ink/[0.02] text-faint" },
  approved: { label: "Approved", className: "border-amber/30 bg-amber/[0.07] text-amber" },
  purchased: { label: "Purchased", className: "border-green/25 bg-green/[0.07] text-green" },
};

const MATCH_COLOR = (match: number) => (match >= 93 ? "#12a26b" : match >= 85 ? "#6e56f8" : "#d98a00");

function GiftCard({
  gift,
  envelope,
  committed,
  onStatus,
}: {
  gift: Gift;
  envelope: number;
  committed: number;
  onStatus: (id: string, status: GiftStatus) => void;
}) {
  const meta = STATUS_META[gift.status];
  const exceeded = gift.status === "approved" && committed > envelope;

  return (
    <article className="rounded-md border border-line bg-ink/[0.015] p-2.5 transition-colors hover:border-line-strong">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <span className="rounded border border-line px-1.5 py-px font-mono text-[7px] uppercase tracking-[0.07em] text-faint">
            {gift.category}
          </span>
          <span className={cn("rounded border px-1.5 py-px font-mono text-[7px] uppercase tracking-[0.07em]", meta.className)}>
            {meta.label}
          </span>
        </div>
        <span className="shrink-0 font-mono text-[10px] tabular-nums text-ink">{formatCurrency(gift.price)}</span>
      </div>

      <h3 className="mt-1.5 text-[11.5px] leading-snug text-ink">{gift.name}</h3>
      <p className="mt-1 line-clamp-3 text-[9.5px] leading-relaxed text-faint">{gift.rationale}</p>

      <div className="mt-2 flex items-center gap-2">
        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-ink/[0.06]">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${gift.match}%`, background: MATCH_COLOR(gift.match) }}
          />
        </div>
        <span className="font-mono text-[8px] tabular-nums" style={{ color: MATCH_COLOR(gift.match) }}>
          {gift.match}% match
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 border-t border-line pt-2">
        <span className="truncate font-mono text-[7px] uppercase tracking-[0.05em] text-faint">{gift.occasion}</span>
        {gift.status === "idea" && (
          <Button variant="outline" size="sm" className="h-6 px-2 text-[9.5px]" onClick={() => onStatus(gift.id, "approved")}>
            <BadgeCheck />
            Approve
          </Button>
        )}
        {gift.status === "approved" && (
          <Button
            variant="accent"
            size="sm"
            className="h-6 px-2 text-[9.5px]"
            onClick={() => onStatus(gift.id, "purchased")}
          >
            <ShoppingBag />
            Purchase
          </Button>
        )}
        {gift.status === "purchased" && (
          <span className="flex items-center gap-1 font-mono text-[7.5px] uppercase tracking-[0.05em] text-green">
            <PackageCheck className="size-2.5" />
            {gift.acquiredAt ? format(new Date(gift.acquiredAt), "MMM d") : "acquired"}
          </span>
        )}
      </div>
      {exceeded && (
        <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.05em] text-amber">
          exceeds current envelope · raise ceiling or cancel approval
        </p>
      )}
    </article>
  );
}

export default function GiftsPage() {
  const { state, hydrated, setGiftStatus, logActivity } = useDemo();
  const [envelope, setEnvelope] = useState(1800);
  const [filter, setFilter] = useState<GiftStatus | "all">("all");

  const committed = state.gifts.filter((gift) => gift.status !== "idea").reduce((sum, gift) => sum + gift.price, 0);
  const purchased = state.gifts.filter((gift) => gift.status === "purchased").reduce((sum, gift) => sum + gift.price, 0);
  const approved = state.gifts.filter((gift) => gift.status === "approved").reduce((sum, gift) => sum + gift.price, 0);
  const remaining = envelope - committed;
  const avgMatch = Math.round(state.gifts.reduce((sum, gift) => sum + gift.match, 0) / Math.max(state.gifts.length, 1));

  const historyTotals = state.giftHistory.reduce(
    (acc, point) => ({
      sophia: acc.sophia + point.sophia,
      olivia: acc.olivia + point.olivia,
      isabella: acc.isabella + point.isabella,
    }),
    { sophia: 0, olivia: 0, isabella: 0 },
  );
  const historyTotal = historyTotals.sophia + historyTotals.olivia + historyTotals.isabella;

  const suggestions = useMemo(() => {
    const pool = state.gifts.filter((gift) => gift.status === "idea").sort((a, b) => b.match - a.match);
    let budget = Math.max(remaining, 0);
    const chosen: Gift[] = [];
    for (const gift of pool) {
      if (gift.price <= budget) {
        chosen.push(gift);
        budget -= gift.price;
      }
    }
    return chosen;
  }, [state.gifts, remaining]);

  const updateStatus = (id: string, status: GiftStatus) => {
    const gift = state.gifts.find((item) => item.id === id);
    if (!gift) return;
    if (status === "purchased" && committed > envelope) {
      toast.error("Envelope exceeded. Raise the ceiling before purchasing.");
      return;
    }
    setGiftStatus(id, status);
    logActivity({
      wifeId: gift.wifeId,
      kind: "gift",
      title: status === "purchased" ? "Gift marked purchased" : "Gift approved",
      detail: `${gift.name} · ${formatCurrency(gift.price)} · demo only`,
      tone: "ok",
    });
    toast.success(
      status === "purchased"
        ? "Marked as purchased. No vendor was contacted and nothing was shipped."
        : "Approved against the envelope. Still a proposal.",
    );
  };

  const approveSuggestions = () => {
    suggestions.forEach((gift) => setGiftStatus(gift.id, "approved"));
    if (suggestions.length) {
      logActivity({
        wifeId: "system",
        kind: "gift",
        title: "Allocator batch approved",
        detail: `${suggestions.length} gifts · ${formatCurrency(suggestions.reduce((sum, gift) => sum + gift.price, 0))}`,
        tone: "ok",
      });
      toast.success(`${suggestions.length} proposals approved. Nothing was purchased.`);
    }
  };

  const visibleWives = state.wives.map((wife) => ({
    wife,
    gifts: state.gifts.filter((gift) => gift.wifeId === wife.id && (filter === "all" ? true : gift.status === filter)),
  }));
  const totalVisible = visibleWives.reduce((sum, entry) => sum + entry.gifts.length, 0);

  if (!hydrated) return <DashboardSkeleton />;

  return (
    <div className="space-y-4">
      <PageHeader
        kicker="Gift intelligence · 3 budgets"
        title="Affection, with a ceiling."
        description="Every shortlist is scored for specificity, not price. The allocator proposes; the commander approves; no vendor is ever contacted in this environment."
        actions={
          <>
            <StatusChip label={`${formatCurrency(committed)} committed`} tone={remaining < 0 ? "danger" : "muted"} />
            <Button variant="outline" size="sm" onClick={() => setEnvelope(1800)}>
              Reset envelope
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {[
          { label: "Envelope", value: formatCurrency(envelope), detail: "monthly ceiling", icon: Wallet },
          {
            label: "Committed",
            value: formatCurrency(committed),
            detail: `${formatCurrency(approved)} approved`,
            icon: CircleDollarSign,
          },
          {
            label: "Remaining",
            value: formatCurrency(remaining),
            detail: remaining < 0 ? "over envelope" : "available to allocate",
            icon: Target,
            danger: remaining < 0,
          },
          { label: "Avg match", value: `${avgMatch}%`, detail: "across all proposals", icon: TrendingUp },
        ].map((item) => (
          <div key={item.label} className="panel flex items-center gap-2.5 p-3">
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-md border",
                item.danger ? "border-red/25 bg-red/[0.07]" : "border-line bg-ink/[0.02]",
              )}
            >
              <item.icon className={cn("size-3.5", item.danger ? "text-red" : "text-faint")} />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-faint">{item.label}</p>
              <p className={cn("font-mono text-[15px] leading-tight tabular-nums", item.danger ? "text-red" : "text-ink")}>
                {item.value}
              </p>
            </div>
            <span className="ml-auto hidden text-right font-mono text-[7px] uppercase tracking-[0.04em] text-faint sm:block">
              {item.detail}
            </span>
          </div>
        ))}
      </div>

      <section className="panel p-3.5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-faint">
              <Sparkles className="size-3 text-accent" />
              Budget optimizer
            </p>
            <h2 className="mt-1 text-[14px] font-medium tracking-[-0.02em] text-ink">Allocate by match, not by guilt.</h2>
            <p className="mt-1 max-w-[560px] text-[11px] leading-relaxed text-muted">
              The allocator funds the highest-match proposals that fit the remaining envelope. Purchases above the
              ceiling are blocked at the click, not discovered at the statement.
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-faint">ceiling</p>
            <p className="font-mono text-[20px] leading-none tabular-nums text-ink">{formatCurrency(envelope)}</p>
          </div>
        </div>

        <div className="mt-3">
          <Slider
            value={[envelope]}
            min={500}
            max={3500}
            step={50}
            onValueChange={(values) => setEnvelope(values[0] ?? 1800)}
            aria-label="Monthly gift envelope"
          />
          <div className="mt-1 flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.06em] text-faint">
            <span>$500</span>
            <span className={remaining < 0 ? "text-red" : "text-green"}>
              {remaining < 0 ? `${formatCurrency(Math.abs(remaining))} over` : `${formatCurrency(remaining)} free`}
            </span>
            <span>$3,500</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 rounded border border-line bg-ink/[0.015] p-2.5">
          <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.06em] text-muted">
            <Sparkles className="size-3 text-violet" />
            {suggestions.length} of {state.gifts.filter((gift) => gift.status === "idea").length} ideas fit ·{" "}
            {formatCurrency(suggestions.reduce((sum, gift) => sum + gift.price, 0))}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto h-7 text-[10px]"
            onClick={approveSuggestions}
            disabled={suggestions.length === 0}
          >
            <BadgeCheck />
            Approve optimized set
          </Button>
        </div>
      </section>

      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <div className="flex rounded-md border border-line p-0.5">
            {(["all", "idea", "approved", "purchased"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                aria-pressed={filter === value}
                className={cn(
                  "rounded px-2 py-1 font-mono text-[8px] uppercase tracking-[0.06em] transition-colors",
                  filter === value ? "bg-ink/[0.08] text-ink" : "text-faint hover:text-muted",
                )}
              >
                {value === "all" ? "All" : STATUS_META[value].label}
              </button>
            ))}
          </div>
          <span className="font-mono text-[7.5px] uppercase tracking-[0.06em] text-faint">
            {totalVisible} proposals visible
          </span>
          <span className="ml-auto flex items-center gap-1 font-mono text-[7.5px] uppercase tracking-[0.06em] text-green">
            <Lock className="size-2.5" />
            wishlists isolated per context
          </span>
        </div>

        {totalVisible === 0 ? (
          <div className="panel p-4">
            <EmptyState
              icon={GiftIcon}
              title="No proposals in this state"
              description="Nothing matches this filter. Either everything is handled or nothing has been imagined yet."
              action={
                <Button variant="outline" size="sm" onClick={() => setFilter("all")}>
                  Show all proposals
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-3">
            {visibleWives.map(({ wife, gifts }) => (
              <section key={wife.id} className="panel overflow-hidden">
                <header className="flex items-center gap-2.5 border-b border-line px-3 py-2.5">
                  <IdentityAvatar wife={wife} size={28} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11.5px] text-ink">{wife.name}</p>
                    <p className="font-mono text-[7px] uppercase tracking-[0.06em] text-faint">
                      {formatCurrency(wife.budget)} / mo · {gifts.length} proposals
                    </p>
                  </div>
                  <span className="font-mono text-[7px] uppercase tracking-[0.05em] text-faint">ns.{wife.id}</span>
                </header>
                <div className="space-y-2 p-2.5">
                  {gifts.length === 0 ? (
                    <p className="px-1 py-6 text-center text-[10.5px] text-faint">No proposals in this state.</p>
                  ) : (
                    gifts.map((gift) => (
                      <GiftCard
                        key={gift.id}
                        gift={gift}
                        envelope={envelope}
                        committed={committed}
                        onStatus={updateStatus}
                      />
                    ))
                  )}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-3 xl:grid-cols-12">
        <SectionCard
          className="xl:col-span-7"
          kicker="Spend history · 6 months"
          title="Where the money actually went"
          action={<span className="font-mono text-[9px] tabular-nums text-muted">{formatCurrency(historyTotal)}</span>}
        >
          <GroupedBars
            labels={state.giftHistory.map((point) => point.month)}
            series={[
              { key: "sophia", label: "Sophia", color: "#f26b1d", values: state.giftHistory.map((point) => point.sophia) },
              { key: "olivia", label: "Olivia", color: "#6e56f8", values: state.giftHistory.map((point) => point.olivia) },
              { key: "isabella", label: "Isabella", color: "#0f9d8a", values: state.giftHistory.map((point) => point.isabella) },
            ]}
          />
          <div className="mt-3 grid grid-cols-4 gap-px overflow-hidden rounded border border-line bg-line">
            {[
              { label: "Total", value: formatCurrency(historyTotal) },
              { label: "Sophia", value: formatCurrency(historyTotals.sophia) },
              { label: "Olivia", value: formatCurrency(historyTotals.olivia) },
              { label: "Isabella", value: formatCurrency(historyTotals.isabella) },
            ].map((item) => (
              <div key={item.label} className="bg-[#ffffff] px-2 py-1.5">
                <p className="font-mono text-[7px] uppercase tracking-[0.06em] text-faint">{item.label}</p>
                <p className="mt-0.5 font-mono text-[9.5px] tabular-nums text-ink">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 font-mono text-[7.5px] uppercase tracking-[0.05em] text-faint">
            {formatCurrency(purchased)} currently marked purchased · demo records only
          </p>
        </SectionCard>

        <SectionCard
          className="xl:col-span-5"
          kicker="Procurement policy"
          title="Rules the allocator will not break"
          action={<GiftIcon className="size-3.5 text-accent" />}
        >
          <ul className="space-y-2.5">
            {[
              ["One silhouette per category", "Two relationships cannot receive the same visual object."],
              ["Specific over expensive", "A $95 tin that proves attention outranks a $2,400 gesture."],
              ["No apology gifts", "A purchase cannot close an emotional incident."],
              ["Budget is a hard stop", "The allocator will not authorize beyond the current envelope."],
              ["No real vendors", "Purchases are status changes in local state. Nothing ships."],
            ].map(([title, detail]) => (
              <li key={title} className="flex items-start gap-2">
                <span className="mt-1 size-1 shrink-0 rounded-full bg-accent/60" />
                <div>
                  <p className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-muted">{title}</p>
                  <p className="text-[9.5px] leading-relaxed text-faint">{detail}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between rounded border border-green/15 bg-green/[0.03] px-2.5 py-1.5 font-mono text-[7.5px] uppercase tracking-[0.05em] text-green">
            <span className="flex items-center gap-1">
              <Lock className="size-2.5" />
              wishlist isolation
            </span>
            <span>3 / 3 sealed</span>
          </div>
        </SectionCard>
      </div>

      <p className="pb-2 text-center font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-faint">
        Fictional wishlists · local approvals only · no vendors contacted · nothing purchased or shipped
      </p>
    </div>
  );
}
