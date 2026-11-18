import { cn } from "@/lib/utils";
import type { RelationshipStatus } from "@/lib/types";

export const STATUS_META: Record<
  RelationshipStatus,
  { label: string; color: string; text: string; border: string; bg: string }
> = {
  stable: {
    label: "Stable",
    color: "#12a26b",
    text: "text-green",
    border: "border-green/25",
    bg: "bg-green/[0.08]",
  },
  attention: {
    label: "Needs attention",
    color: "#d98a00",
    text: "text-amber",
    border: "border-amber/25",
    bg: "bg-amber/[0.08]",
  },
  critical: {
    label: "Critical",
    color: "#e5383b",
    text: "text-red",
    border: "border-red/30",
    bg: "bg-red/[0.09]",
  },
};

export function StatusPill({
  status,
  className,
  showDot = true,
}: {
  status: RelationshipStatus;
  className?: string;
  showDot?: boolean;
}) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.12em]",
        meta.border,
        meta.bg,
        meta.text,
        className,
      )}
    >
      {showDot && <span className="size-1 rounded-full bg-current" />}
      {meta.label}
    </span>
  );
}

export function OperationalDot({ label = "All systems operational" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-green">
      <span className="status-dot" />
      {label}
    </span>
  );
}

export function LiveClock({ className }: { className?: string }) {
  return (
    <span className={cn("font-mono text-[10px] tabular-nums tracking-[0.08em] text-faint", className)}>
      LIVE
    </span>
  );
}
