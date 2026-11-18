"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Clock3, Sparkles, type LucideIcon } from "lucide-react";
import { differenceInCalendarDays, format } from "date-fns";
import type { Wife } from "@/lib/types";
import { IdentityAvatar } from "@/components/brand/identity-avatar";
import { StatusPill } from "@/components/brand/status";
import { Sparkline } from "@/components/charts";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  kicker,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  kicker?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("panel flex flex-col", className)}>
      <header className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
        <div className="min-w-0">
          {kicker && <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-faint">{kicker}</p>}
          <h2 className="mt-0.5 truncate text-[12.5px] font-medium tracking-[-0.01em] text-ink">{title}</h2>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      <div className={cn("flex-1 p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

export function MetricCard({
  label,
  value,
  unit,
  delta,
  hint,
  icon: Icon,
  children,
  tone = "default",
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: number;
  hint?: string;
  icon: LucideIcon;
  children?: ReactNode;
  tone?: "default" | "danger" | "warn";
}) {
  return (
    <div className="panel flex flex-col p-3.5">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-faint">{label}</p>
        <Icon className={cn("size-3.5", tone === "danger" ? "text-red" : tone === "warn" ? "text-amber" : "text-faint")} />
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span
          className={cn(
            "font-mono text-[26px] leading-none tabular-nums tracking-[-0.05em]",
            tone === "danger" ? "text-red" : tone === "warn" ? "text-amber" : "text-ink",
          )}
        >
          {value}
        </span>
        {unit && <span className="text-[10px] text-faint">{unit}</span>}
        {typeof delta === "number" && (
          <span
            className={cn(
              "ml-auto flex items-center gap-0.5 font-mono text-[9px] tabular-nums",
              delta > 0 ? "text-green" : delta < 0 ? "text-red" : "text-faint",
            )}
          >
            {delta > 0 ? <ArrowUpRight className="size-2.5" /> : delta < 0 ? <ArrowDownRight className="size-2.5" /> : null}
            {delta > 0 ? "+" : ""}
            {delta}
          </span>
        )}
      </div>
      {children}
      {hint && <p className="mt-auto pt-2 font-mono text-[8px] uppercase tracking-[0.06em] text-faint">{hint}</p>}
    </div>
  );
}

export function WifeCard({
  wife,
  trend,
  dense = false,
}: {
  wife: Wife;
  trend: number[];
  dense?: boolean;
}) {
  const statusColor = wife.status === "stable" ? "#12a26b" : wife.status === "attention" ? "#d98a00" : "#e5383b";
  const days = differenceInCalendarDays(new Date(wife.nextDate.date), new Date());
  const lastSeen =
    wife.lastInteractionMinutes < 60
      ? `${wife.lastInteractionMinutes}m ago`
      : `${Math.round(wife.lastInteractionMinutes / 60)}h ago`;

  return (
    <article
      className={cn(
        "group panel relative overflow-hidden p-4 transition-colors hover:border-line-strong",
        wife.status === "critical" && "border-red/25",
      )}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, ${wife.palette.from}, transparent 70%)` }} />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-16 size-40 rounded-full opacity-[0.13] blur-3xl"
        style={{ background: wife.palette.from }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <IdentityAvatar wife={wife} size={44} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">{wife.code}</p>
              <StatusPill status={wife.status} showDot={false} className="px-1.5 py-px text-[8px]" />
            </div>
            <h3 className="mt-1 truncate text-[16px] font-medium tracking-[-0.02em]">{wife.name}</h3>
            <p className="truncate text-[10.5px] text-faint">{wife.tagline}</p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-[20px] leading-none tabular-nums tracking-[-0.04em]" style={{ color: statusColor }}>
            {wife.health}
            <span className="text-[10px] text-faint">%</span>
          </p>
          <p
            className={cn(
              "mt-1 inline-flex items-center gap-0.5 font-mono text-[8.5px] tabular-nums",
              wife.healthDelta >= 0 ? "text-green" : "text-red",
            )}
          >
            {wife.healthDelta >= 0 ? <ArrowUpRight className="size-2.5" /> : <ArrowDownRight className="size-2.5" />}
            {Math.abs(wife.healthDelta).toFixed(1)} this week
          </p>
        </div>
      </div>

      <div className="relative mt-3">
        <Sparkline values={trend} color={statusColor} height={30} />
      </div>

      <dl className={cn("relative mt-2 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line", dense && "hidden sm:grid")}>
        <div className="bg-[#ffffff] px-2.5 py-2">
          <dt className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-faint">Last interaction</dt>
          <dd className="mt-0.5 flex items-center gap-1 text-[10.5px] text-ink">
            <Clock3 className="size-2.5 text-faint" />
            {lastSeen}
          </dd>
        </div>
        <div className="bg-[#ffffff] px-2.5 py-2">
          <dt className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-faint">{wife.nextDate.label}</dt>
          <dd className="mt-0.5 text-[10.5px] text-ink">
            {format(new Date(wife.nextDate.date), "MMM d")}
            <span className={cn("ml-1.5 font-mono text-[8.5px]", days <= 7 ? "text-accent" : "text-faint")}>T-{days}d</span>
          </dd>
        </div>
      </dl>

      <div className="relative mt-2 flex items-center gap-1.5 rounded border border-line bg-ink/[0.018] px-2.5 py-1.5">
        <Sparkles className="size-3 shrink-0 text-violet" />
        <span className="font-mono text-[8px] uppercase tracking-[0.08em] text-faint">AI</span>
        <span className="truncate text-[10px] text-muted">{wife.activity}</span>
        <span className="ml-auto size-1.5 shrink-0 animate-pulse rounded-full bg-accent/70" />
      </div>

      <div className="relative mt-2.5 flex gap-1.5">
        <Link
          href={`/dashboard/conversations?wife=${wife.id}`}
          className="flex h-7 flex-1 items-center justify-center gap-1 rounded border border-line text-[10.5px] text-muted transition-colors hover:border-line-strong hover:text-ink"
        >
          Open thread
        </Link>
        <Link
          href={`/dashboard/relationships?wife=${wife.id}`}
          className="flex h-7 flex-1 items-center justify-center gap-1 rounded border border-line text-[10.5px] text-muted transition-colors hover:border-line-strong hover:text-ink"
        >
          Profile
        </Link>
      </div>
    </article>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-line px-4 py-12 text-center">
      <span className="flex size-9 items-center justify-center rounded-full border border-line bg-ink/[0.02]">
        <Icon className="size-4 text-faint" />
      </span>
      <div>
        <p className="text-[12.5px] text-muted">{title}</p>
        <p className="mx-auto mt-1 max-w-[320px] text-[10.5px] leading-relaxed text-faint">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-3 border-b border-line pb-6">
        <Skeleton className="h-2.5 w-24" />
        <Skeleton className="h-8 w-[320px]" />
        <Skeleton className="h-3 w-[420px] max-w-full" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((key) => (
          <div key={key} className="panel p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-11 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-2 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="ml-auto h-6 w-12" />
            </div>
            <Skeleton className="mt-4 h-8 w-full" />
            <Skeleton className="mt-3 h-16 w-full" />
          </div>
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        <Skeleton className="h-[260px] lg:col-span-2" />
        <Skeleton className="h-[260px]" />
      </div>
    </div>
  );
}
