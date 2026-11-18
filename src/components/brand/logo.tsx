import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Three arcs around one centre: three relationships, one person,
 * separated by deliberate gaps so they never touch.
 */
export function LogoMark({
  className,
  tone = "color",
}: {
  className?: string;
  tone?: "color" | "ink" | "white";
  animated?: boolean;
}) {
  const r = 9.5;
  const c = 14;
  const gap = 26; // degrees of air between arcs
  const arc = (start: number) => {
    const a0 = ((start + gap / 2 - 90) * Math.PI) / 180;
    const a1 = ((start + 120 - gap / 2 - 90) * Math.PI) / 180;
    return `M ${c + r * Math.cos(a0)} ${c + r * Math.sin(a0)} A ${r} ${r} 0 0 1 ${c + r * Math.cos(a1)} ${c + r * Math.sin(a1)}`;
  };
  const colors =
    tone === "color" ? ["#f26b1d", "#6e56f8", "#0f9d8a"] : tone === "white" ? ["#fff", "#fff", "#fff"] : ["#09090b", "#09090b", "#09090b"];
  const dot = tone === "white" ? "#fff" : "#09090b";
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" className={cn("size-7", className)}>
      {[0, 120, 240].map((s, i) => (
        <path key={s} d={arc(s)} stroke={colors[i]} strokeWidth="3" strokeLinecap="round" />
      ))}
      <circle cx={c} cy={c} r="2.6" fill={dot} />
    </svg>
  );
}

export function Logo({
  className,
  href = "/",
  compact = false,
}: {
  className?: string;
  href?: string;
  compact?: boolean;
}) {
  return (
    <Link href={href} className={cn("group flex items-center gap-2", className)} aria-label="3Wives home">
      <LogoMark className={compact ? "size-6" : "size-7"} />
      <span
        className={cn(
          "font-[family-name:var(--font-display)] font-medium tracking-[-0.03em] text-ink",
          compact ? "text-[19px]" : "text-[22px]",
        )}
      >
        3Wives
      </span>
    </Link>
  );
}
