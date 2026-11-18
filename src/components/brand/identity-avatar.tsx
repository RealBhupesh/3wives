import { cn, initials, seeded } from "@/lib/utils";
import type { Wife } from "@/lib/types";

interface IdentityAvatarProps {
  wife: Pick<Wife, "id" | "name" | "palette">;
  size?: number;
  className?: string;
  ring?: boolean;
}

/**
 * A deterministic "identity print" avatar: a unique voiceprint per relationship,
 * with the monogram at the centre. No external image dependency.
 */
export function IdentityAvatar({ wife, size = 40, className, ring = true }: IdentityAvatarProps) {
  const uid = `av-${wife.id}`;
  const paths = Array.from({ length: 5 }, (_, i) => {
    const radius = 24 + i * 8;
    const wobble = 2.2 + seeded(wife.id, i) * 3.4;
    const points = Array.from({ length: 48 }, (_, p) => {
      const angle = (p / 48) * Math.PI * 2;
      const r = radius + Math.sin(angle * (3 + i) + seeded(wife.id, i + 10) * 6) * wobble;
      return [60 + Math.cos(angle) * r, 60 + Math.sin(angle) * r] as const;
    });
    return `M${points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")} Z`;
  });

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-2",
        ring && "ring-1 ring-ink/12",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 120" width={size} height={size} className="absolute inset-0">
        <defs>
          <radialGradient id={`${uid}-glow`} cx="34%" cy="28%" r="80%">
            <stop offset="0%" stopColor={wife.palette.from} stopOpacity="1" />
            <stop offset="58%" stopColor={wife.palette.to} stopOpacity="0.9" />
            <stop offset="100%" stopColor={wife.palette.to} stopOpacity="1" />
          </radialGradient>
          <linearGradient id={`${uid}-line`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <rect width="120" height="120" fill="#ffffff" />
        <circle cx="60" cy="60" r="72" fill={`url(#${uid}-glow)`} />
        <g fill="none" stroke={`url(#${uid}-line)`} strokeWidth="0.6">
          {paths.map((d, i) => (
            <path key={i} d={d} opacity={0.55 - i * 0.06} />
          ))}
        </g>
        <circle cx="60" cy="60" r="17" fill="#ffffff" fillOpacity="0.16" stroke="rgba(255,255,255,0.45)" strokeWidth="0.7" />
        <text
          x="60"
          y="60"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#ffffff"
          fontSize={size > 64 ? 15 : 18}
          fontFamily="var(--font-geist), sans-serif"
          fontWeight="500"
          letterSpacing="0.4"
        >
          {initials(wife.name)}
        </text>
      </svg>
    </span>
  );
}
