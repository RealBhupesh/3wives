import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className, animated = false }: { className?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" className={cn("size-7", className)}>
      <rect x="0.5" y="0.5" width="27" height="27" rx="8" fill="#0d0e14" stroke="rgba(255,255,255,0.12)" />
      <path
        d="M10.2 7.4a6.6 6.6 0 0 0 0 13.2"
        stroke="rgba(255,255,255,0.62)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M17.8 7.4a6.6 6.6 0 0 1 0 13.2"
        stroke="#ff4778"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="14" cy="14" r="2.1" fill="#ff4778" className={animated ? "animate-pulse" : undefined} />
      <circle cx="14" cy="14" r="4.4" stroke="rgba(255,71,120,0.28)" strokeWidth="0.7" />
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
    <Link href={href} className={cn("group flex items-center gap-2.5", className)} aria-label="3Wives AI home">
      <LogoMark animated />
      <span className="flex items-baseline gap-1.5">
        <span className="text-[15px] font-semibold tracking-[-0.03em] text-ink">3Wives</span>
        {!compact && (
          <span className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-accent">AI</span>
        )}
      </span>
    </Link>
  );
}
