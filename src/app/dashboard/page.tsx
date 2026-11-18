"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BellRing,
  CalendarDays,
  Circle,
  Database,
  Gauge,
  Gift,
  MessagesSquare,
  ShieldCheck,
  Siren,
  Timer,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { differenceInCalendarDays, format, formatDistanceToNowStrict } from "date-fns";
import { useDemo } from "@/lib/store";
import type { ActivityKind } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import { Donut, GroupedBars, LineChart, MiniBars, Ring } from "@/components/charts";
import { DashboardSkeleton, SectionCard, WifeCard, EmptyState } from "@/components/dashboard/primitives";
import { PageHeader, StatusChip } from "@/components/dashboard/chrome";
import { Button } from "@/components/ui/button";

const KIND_ICON: Record<ActivityKind, typeof Activity> = {
  memory: Database,
  message: MessagesSquare,
  calendar: CalendarDays,
  gift: Gift,
  alert: AlertTriangle,
  system: ShieldCheck,
};

const LIVE_POOL = [
  { wifeId: "sophia" as const, kind: "memory" as const, title: "Memory vector written", detail: "ns.sophia.v2 · importance 4 · tile pickup", tone: "ok" as const },
  { wifeId: "olivia" as const, kind: "message" as const, title: "Style match refreshed", detail: "voice.twin.v6 · 96% match · 3 candidates", tone: "ok" as const },
  { wifeId: "isabella" as const, kind: "alert" as const, title: "Emotional state re-scored", detail: "guarded · patience low · recovery staged", tone: "warn" as const },
  { wifeId: "system" as const, kind: "system" as const, title: "Isolation audit passed", detail: "3 namespaces · 0 cross-reads · ledger sealed", tone: "ok" as const },
  { wifeId: "olivia" as const, kind: "calendar" as const, title: "Commitment indexed", detail: "Florist confirm · Fri 10:00 · tentative", tone: "ok" as const },
];

function LiveClock() {
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

  return (
    <span className="font-mono text-[9px] tabular-nums tracking-[0.08em] text-faint">
      {time ?? "--:--:--"} PST
    </span>
  );
}

function LiveTimeline() {
  const { state } = useDemo();
  const [events, setEvents] = useState(() => state.activity.slice(0, 7));
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      const template = LIVE_POOL[cursor % LIVE_POOL.length];
      setCursor((value) => value + 1);
      setEvents((current) =>
        [
          {
            id: `live-${Date.now()}`,
            at: new Date().toISOString(),
            ...template,
          },
          ...current,
        ].slice(0, 9),
      );
    }, 7000);
    return () => window.clearInterval(id);
  }, [cursor]);

  return (
    <ol className="relative space-y-3.5 pl-4">
      <span aria-hidden className="absolute bottom-1 left-[5px] top-1 w-px bg-line" />
      {events.map((event, index) => {
        const Icon = KIND_ICON[event.kind] ?? Circle;
        return (
          <li key={event.id} className="relative">
            <span
              className={cn(
                "absolute -left-4 top-1 size-[7px] rounded-full ring-4 ring-surface",
                event.tone === "critical" ? "bg-red" : event.tone === "warn" ? "bg-amber" : "bg-green",
              )}
            />
            <div className={cn("flex items-start gap-2", index === 0 && "animate-[fade-in_.35s_ease-out]")}>
              <Icon className="mt-0.5 size-3 shrink-0 text-faint" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-[11px] text-ink/90">{event.title}</p>
                  <span className="shrink-0 font-mono text-[8px] tabular-nums text-faint">
                    {formatDistanceToNowStrict(new Date(event.at), { addSuffix: false })}
                  </span>
                </div>
                <p className="truncate font-mono text-[8px] uppercase tracking-[0.05em] text-faint">{event.detail}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function CommandCenterPage() {
  const { state, hydrated } = useDemo();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const stabilitySeries = useMemo(
    () => [
      { key: "sophia", label: "Sophia", color: "#ff8fa3", values: state.analytics.stability.map((point) => point.sophia) },
      { key: "olivia", label: "Olivia", color: "#a78bfa", values: state.analytics.stability.map((point) => point.olivia) },
      { key: "isabella", label: "Isabella", color: "#ff4778", values: state.analytics.stability.map((point) => point.isabella) },
    ],
    [state.analytics.stability],
  );

  const wifeMap = useMemo(() => Object.fromEntries(state.wives.map((wife) => [wife.id, wife])), [state.wives]);

  const obligations = useMemo(
    () =>
      [...state.events]
        .filter((event) => new Date(event.start).getTime() >= now - 60 * 60 * 1000)
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
        .slice(0, 5),
    [state.events, now],
  );

  const openCollisions = state.collisions.filter((collision) => collision.status === "open");
  const openIncidents = state.incidents.filter((incident) => incident.status !== "resolved");

  const giftTotals = useMemo(() => {
    const totals = state.giftHistory.reduce(
      (acc, point) => ({
        sophia: acc.sophia + point.sophia,
        olivia: acc.olivia + point.olivia,
        isabella: acc.isabella + point.isabella,
      }),
      { sophia: 0, olivia: 0, isabella: 0 },
    );
    return { ...totals, all: totals.sophia + totals.olivia + totals.isabella };
  }, [state.giftHistory]);

  const latency = state.analytics.latency;
  const p50 = [...latency].sort((a, b) => a - b)[Math.floor(latency.length / 2)];
  const p95 = [...latency].sort((a, b) => a - b)[Math.floor(latency.length * 0.95)] ?? latency.at(-1) ?? 0;
  const avgCoverage = Math.round(state.analytics.coverage.reduce((sum, item) => sum + item.value, 0) / 3);
  const attentionTotal = state.analytics.attention.reduce((sum, item) => sum + item.value, 0);
  const attentionHours = ((attentionTotal / 100) * 18.4).toFixed(1);

  if (!hydrated) return <DashboardSkeleton />;

  return (
    <div className="space-y-4">
      <PageHeader
        kicker="Command center · 3 namespaces"
        title={state.settings.greeting}
        description="Your relationship infrastructure is operating normally."
        actions={
          <>
            <span className="mr-1 hidden items-center gap-2 md:flex">
              <LiveClock />
            </span>
            <Button asChild variant="dangerOutline" size="sm">
              <Link href="/dashboard/incidents">
                <Siren />
                {openIncidents.length} open incident{openIncidents.length === 1 ? "" : "s"}
              </Link>
            </Button>
            <Button asChild variant="accent" size="sm">
              <Link href="/dashboard/conversations">
                <MessagesSquare />
                Open conversations
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Context isolation", value: "99.9%", detail: "0 cross-context reads", tone: "ok" as const, icon: ShieldCheck },
          { label: "Namespaces", value: "3 / 3", detail: "encrypted · rotated", tone: "ok" as const, icon: Database },
          {
            label: "Open collisions",
            value: String(openCollisions.length).padStart(2, "0"),
            detail: openCollisions.length ? "resolution required" : "calendar normalized",
            tone: openCollisions.length ? ("danger" as const) : ("ok" as const),
            icon: CalendarDays,
          },
          { label: "p50 inference", value: `${p50}ms`, detail: "target 400ms", tone: "ok" as const, icon: Zap },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3 bg-[#0a0b10] px-4 py-3">
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-md border",
                item.tone === "danger" ? "border-red/25 bg-red/[0.07]" : "border-line bg-white/[0.02]",
              )}
            >
              <item.icon className={cn("size-3.5", item.tone === "danger" ? "text-red" : "text-green")} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[7.5px] uppercase tracking-[0.11em] text-faint">{item.label}</p>
              <p
                className={cn(
                  "mt-0.5 font-mono text-[16px] tabular-nums leading-tight tracking-[-0.03em]",
                  item.tone === "danger" ? "text-red" : "text-ink",
                )}
              >
                {item.value}
              </p>
            </div>
            <span className="hidden shrink-0 font-mono text-[7.5px] uppercase tracking-[0.06em] text-faint sm:block">
              {item.detail}
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {state.wives.map((wife) => (
          <WifeCard
            key={wife.id}
            wife={wife}
            trend={state.analytics.stability.map((point) => point[wife.id])}
          />
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <SectionCard
          className="lg:col-span-8"
          kicker="14-day trend"
          title="Relationship stability index"
          action={
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-1 font-mono text-[8px] uppercase tracking-[0.08em] text-green sm:flex">
                <TrendingUp className="size-2.5" />
                composite +2.4
              </span>
              <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.08em] text-faint">
                14d
              </span>
            </div>
          }
          bodyClassName="px-2 pb-2 pt-3"
        >
          <LineChart
            labels={state.analytics.stability.map((point) => point.label)}
            series={stabilitySeries}
            height={220}
            domain={[50, 100]}
          />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-2 pb-2">
            {stabilitySeries.map((item) => (
              <span key={item.key} className="flex items-center gap-1.5 font-mono text-[8.5px] uppercase tracking-[0.07em] text-faint">
                <span className="size-1.5 rounded-full" style={{ background: item.color }} />
                {item.label}
                <span className="tabular-nums text-muted">{item.values.at(-1)}%</span>
              </span>
            ))}
            <span className="ml-auto hidden font-mono text-[8px] uppercase tracking-[0.06em] text-faint sm:block">
              threshold 70% · below triggers recovery
            </span>
          </div>
        </SectionCard>

        <SectionCard
          className="lg:col-span-4"
          kicker="Attention allocation"
          title="Where the hours went"
          action={<span className="font-mono text-[8px] uppercase tracking-[0.08em] text-faint">7d</span>}
          bodyClassName="flex flex-col items-center gap-4 p-4"
        >
          <Donut
            size={158}
            stroke={14}
            centerValue={`${attentionHours}h`}
            centerLabel="committed"
            segments={state.analytics.attention.map((item) => ({
              label: wifeMap[item.wifeId]?.name ?? item.wifeId,
              value: item.value,
              color: wifeMap[item.wifeId]?.palette.from ?? "#ff4778",
            }))}
          />
          <div className="w-full space-y-2">
            {state.analytics.attention.map((item) => {
              const wife = wifeMap[item.wifeId];
              return (
                <div key={item.wifeId}>
                  <div className="flex items-center justify-between font-mono text-[8.5px] uppercase tracking-[0.06em]">
                    <span className="flex items-center gap-1.5 text-muted">
                      <span className="size-1.5 rounded-full" style={{ background: wife?.palette.from }} />
                      {wife?.name}
                    </span>
                    <span className="tabular-nums text-faint">
                      {item.value}% · {((item.value / 100) * 18.4).toFixed(1)}h
                    </span>
                  </div>
                  <div className="mt-1 h-[3px] overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.value}%`, background: wife?.palette.from }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="w-full border-t border-line pt-2 font-mono text-[8px] uppercase leading-relaxed tracking-[0.06em] text-faint">
            Balance deviation 6.4% · within policy
          </p>
        </SectionCard>
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <SectionCard
          className="lg:col-span-4"
          kicker="Emotional debt"
          title="Unresolved emotional load"
          action={<Gauge className="size-3.5 text-faint" />}
        >
          <div className="space-y-4">
            {state.analytics.emotionalDebt.map((item) => {
              const wife = wifeMap[item.wifeId];
              const high = item.value >= 50;
              return (
                <div key={item.wifeId}>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] text-ink">
                      <span className="size-1.5 rounded-full" style={{ background: wife?.palette.from }} />
                      {wife?.name}
                    </span>
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex items-center gap-0.5 font-mono text-[8.5px] tabular-nums",
                          item.trend > 0 ? "text-red" : "text-green",
                        )}
                      >
                        {item.trend > 0 ? <TrendingUp className="size-2.5" /> : <TrendingDown className="size-2.5" />}
                        {item.trend > 0 ? "+" : ""}
                        {item.trend}
                      </span>
                      <span className={cn("font-mono text-[12px] tabular-nums", high ? "text-red" : "text-muted")}>
                        {item.value}
                      </span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-[5px] overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${item.value}%`,
                        background: high ? "#ff3b4e" : item.value >= 25 ? "#f5b544" : "#3ddc97",
                      }}
                    />
                  </div>
                  <p className="mt-1 font-mono text-[7.5px] uppercase tracking-[0.06em] text-faint">
                    {high ? "recovery protocol prepared" : item.value >= 25 ? "monitoring · nudge scheduled" : "within tolerance"}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-2.5">
            <span className="font-mono text-[8px] uppercase tracking-[0.08em] text-faint">threshold</span>
            <span className="font-mono text-[8.5px] text-amber">50 / 100 · isabella above</span>
          </div>
        </SectionCard>

        <SectionCard
          className="lg:col-span-4"
          kicker="Security posture"
          title="Context leakage risk"
          action={<StatusChip label="Nominal" />}
        >
          <div className="flex items-center gap-4">
            <Ring value={Math.max(state.analytics.leakage, 0.4)} size={94} stroke={6} color="#3ddc97" label="Context leakage risk 0.4 percent">
              <span className="font-mono text-[17px] tabular-nums tracking-[-0.04em] text-green">{state.analytics.leakage}%</span>
              <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-faint">risk</span>
            </Ring>
            <div className="min-w-0 flex-1 space-y-1.5">
              {[
                ["Cross-context reads", "0"],
                ["Identity ambiguities", "0 open"],
                ["Safety blocks", "7d · 3"],
                ["Audit ledger", "sealed"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-2 font-mono text-[8.5px] uppercase tracking-[0.05em]">
                  <span className="truncate text-faint">{label}</span>
                  <span className="shrink-0 text-muted">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-1.5 rounded border border-green/15 bg-green/[0.03] p-2.5 font-mono text-[8px] leading-relaxed tracking-[0.04em]">
            <p className="flex items-center gap-1.5 text-green">
              <ShieldCheck className="size-3" />
              isolation.strict · enforced
            </p>
            <p className="text-faint">last policy evaluation 41s ago · 0 violations</p>
          </div>
          <Link
            href="/dashboard/memory"
            className="mt-3 flex items-center justify-between border-t border-line pt-2.5 font-mono text-[8px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-ink"
          >
            Inspect memory vault
            <ArrowUpRight className="size-3" />
          </Link>
        </SectionCard>

        <SectionCard
          className="lg:col-span-4"
          kicker="Responsiveness"
          title="Coverage & latency"
          action={<Timer className="size-3.5 text-faint" />}
        >
          <div className="space-y-2.5">
            {state.analytics.coverage.map((item) => {
              const wife = wifeMap[item.wifeId];
              return (
                <div key={item.wifeId}>
                  <div className="flex items-center justify-between font-mono text-[8.5px] uppercase tracking-[0.06em]">
                    <span className="flex items-center gap-1.5 text-muted">
                      <span className="size-1.5 rounded-full" style={{ background: wife?.palette.from }} />
                      {wife?.name}
                    </span>
                    <span className="tabular-nums text-faint">{item.value}%</span>
                  </div>
                  <div className="mt-1 h-[3px] rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.value}%`, background: item.value < 70 ? "#f5b544" : wife?.palette.from }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-baseline justify-between border-t border-line pt-2.5">
            <span className="font-mono text-[8px] uppercase tracking-[0.08em] text-faint">conversation coverage</span>
            <span className="font-mono text-[13px] tabular-nums text-ink">{avgCoverage}%</span>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.06em]">
              <span className="text-faint">latency · last 14 inferences</span>
              <span className="text-green">p50 {p50}ms</span>
            </div>
            <MiniBars values={latency} labels={["", "", "", "", "", "", "", "", "", "", "", "", "", ""]} formatValue={(value) => `${value}ms`} />
            <div className="flex justify-between font-mono text-[8px] uppercase tracking-[0.06em] text-faint">
              <span>p95 {p95}ms</span>
              <span>target 400ms</span>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <SectionCard
          className="lg:col-span-5"
          kicker="Next 5 commitments"
          title="Upcoming obligations"
          action={
            <Link href="/dashboard/calendar" className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-ink">
              Calendar →
            </Link>
          }
          bodyClassName="p-0"
        >
          {obligations.length === 0 ? (
            <div className="p-4">
              <EmptyState icon={CalendarDays} title="No obligations scheduled" description="The calendar is clear. This will not last." />
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {obligations.map((event) => {
                const wife = wifeMap[event.wifeId];
                const date = new Date(event.start);
                const days = differenceInCalendarDays(date, new Date());
                const collision = openCollisions.some(
                  (item) => item.eventA === event.id || item.eventB === event.id,
                );
                return (
                  <li key={event.id} className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/[0.015]">
                    <div className="flex w-9 shrink-0 flex-col items-center rounded border border-line bg-white/[0.02] py-1">
                      <span className="font-mono text-[7px] uppercase tracking-[0.08em] text-faint">{format(date, "MMM")}</span>
                      <span className="font-mono text-[13px] leading-none tabular-nums text-ink">{format(date, "d")}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 truncate text-[11.5px] text-ink">
                        {event.title}
                        {collision && <AlertTriangle className="size-2.5 shrink-0 text-red" />}
                      </p>
                      <p className="truncate font-mono text-[8px] uppercase tracking-[0.05em] text-faint">
                        {wife?.code} · {format(date, "HH:mm")} · {event.location}
                      </p>
                    </div>
                    <span className={cn("shrink-0 font-mono text-[8.5px] tabular-nums", collision ? "text-red" : days <= 2 ? "text-accent" : "text-faint")}>
                      T-{days}d
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          className="lg:col-span-4"
          kicker="Gift intelligence"
          title="Gift spend · last 6 months"
          action={<Gift className="size-3.5 text-faint" />}
        >
          <GroupedBars
            labels={state.giftHistory.map((point) => point.month)}
            series={[
              { key: "sophia", label: "Sophia", color: "#ff8fa3", values: state.giftHistory.map((point) => point.sophia) },
              { key: "olivia", label: "Olivia", color: "#a78bfa", values: state.giftHistory.map((point) => point.olivia) },
              { key: "isabella", label: "Isabella", color: "#ff4778", values: state.giftHistory.map((point) => point.isabella) },
            ]}
          />
          <div className="mt-3 grid grid-cols-4 gap-px overflow-hidden rounded border border-line bg-line">
            {[
              { label: "Total", value: formatCurrency(giftTotals.all) },
              { label: "Sophia", value: formatCurrency(giftTotals.sophia) },
              { label: "Olivia", value: formatCurrency(giftTotals.olivia) },
              { label: "Isabella", value: formatCurrency(giftTotals.isabella) },
            ].map((item) => (
              <div key={item.label} className="bg-[#0b0c12] px-2 py-1.5">
                <p className="font-mono text-[7px] uppercase tracking-[0.06em] text-faint">{item.label}</p>
                <p className="mt-0.5 font-mono text-[9.5px] tabular-nums text-ink">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-2.5 flex items-center justify-between border-t border-line pt-2 font-mono text-[8px] uppercase tracking-[0.06em] text-faint">
            <span>duplicate silhouettes</span>
            <span className="text-green">0 detected</span>
          </div>
        </SectionCard>

        <SectionCard
          className="lg:col-span-3"
          kicker="Throughput"
          title="Inference volume"
          action={<Activity className="size-3.5 text-faint" />}
        >
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-[26px] leading-none tabular-nums tracking-[-0.05em] text-ink">258</span>
            <span className="text-[10px] text-faint">/ day</span>
            <span className="ml-auto flex items-center gap-0.5 font-mono text-[9px] text-green">
              <TrendingUp className="size-2.5" />
              +9.4%
            </span>
          </div>
          <div className="mt-3">
            <MiniBars values={state.analytics.inferenceVolume} formatValue={(value) => `${value}`} />
          </div>
          <dl className="mt-3 space-y-1.5 border-t border-line pt-2.5 font-mono text-[8.5px] uppercase tracking-[0.05em]">
            <div className="flex justify-between">
              <dt className="text-faint">style match</dt>
              <dd className="text-muted">{state.settings.toneMirroring}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-faint">emoji fidelity</dt>
              <dd className="text-muted">{state.settings.emojiFidelity}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-faint">approval required</dt>
              <dd className="text-green">always</dd>
            </div>
          </dl>
        </SectionCard>
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <SectionCard
          className="lg:col-span-8"
          kicker="Live operations"
          title="Event timeline"
          action={
            <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-green">
              <span className="status-dot" />
              streaming
            </span>
          }
        >
          <LiveTimeline />
        </SectionCard>

        <SectionCard className="lg:col-span-4" kicker="Guardrails" title="System integrity" bodyClassName="p-4">
          <ul className="space-y-2.5">
            {[
              ["Strict isolation", "Cross-namespace reads blocked", true],
              ["Human approval", "No automatic sends", true],
              ["Audit ledger", "Every action recorded", true],
              ["Memory training", "Disabled · inference only", true],
              ["External messaging", "Not connected · demo", false],
            ].map(([label, detail, positive]) => (
              <li key={String(label)} className="flex items-start gap-2.5">
                <span
                  className={cn(
                    "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
                    positive ? "border-green/25 bg-green/[0.06]" : "border-line bg-white/[0.02]",
                  )}
                >
                  {positive ? <ShieldCheck className="size-2.5 text-green" /> : <BellRing className="size-2.5 text-faint" />}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] text-ink/90">{label}</p>
                  <p className="font-mono text-[8px] uppercase tracking-[0.05em] text-faint">{detail}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between rounded border border-line bg-white/[0.015] px-2.5 py-1.5">
            <span className="font-mono text-[8px] uppercase tracking-[0.08em] text-faint">model</span>
            <span className="font-mono text-[8.5px] text-muted">voice.twin.v6</span>
          </div>
        </SectionCard>
      </div>

      <p className="pb-2 text-center font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-faint">
        Demonstration environment · seeded fictional data · persisted locally · no external integrations · no messages are sent
      </p>
    </div>
  );
}
