"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Line chart                                                          */
/* ------------------------------------------------------------------ */

export interface LineSeries {
  key: string;
  label: string;
  color: string;
  values: number[];
  dashed?: boolean;
}

export function LineChart({
  labels,
  series,
  height = 240,
  domain = [40, 100],
  suffix = "%",
  className,
  compact = false,
}: {
  labels: string[];
  series: LineSeries[];
  height?: number;
  domain?: [number, number];
  suffix?: string;
  className?: string;
  compact?: boolean;
}) {
  const uid = useId().replace(/[:]/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const W = 720;
  const H = height;
  const pad = { l: compact ? 0 : 30, r: 8, t: 14, b: 24 };
  const min = domain[0];
  const max = domain[1];
  const count = labels.length;
  const xFor = (i: number) => pad.l + (i * (W - pad.l - pad.r)) / Math.max(count - 1, 1);
  const yFor = (v: number) => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b);

  const linePath = (values: number[]) =>
    values.map((v, i) => `${i === 0 ? "M" : "L"}${xFor(i).toFixed(1)} ${yFor(v).toFixed(1)}`).join(" ");

  const areaPath = (values: number[]) =>
    `${linePath(values)} L${xFor(count - 1)} ${H - pad.b} L${xFor(0)} ${H - pad.b} Z`;

  const ticks = 4;

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        aria-label={`Time series chart: ${series.map((s) => `${s.label} latest ${s.values.at(-1) ?? 0}${suffix}`).join(", ")}`}
        onPointerMove={(event) => {
          const rect = ref.current?.getBoundingClientRect();
          if (!rect) return;
          const ratio = (event.clientX - rect.left) / rect.width;
          const idx = Math.round(ratio * (count - 1));
          setHover(Math.max(0, Math.min(count - 1, idx)));
        }}
        onPointerLeave={() => setHover(null)}
        className="block touch-none"
      >
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`${uid}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.16" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {Array.from({ length: ticks + 1 }, (_, i) => {
          const value = min + ((max - min) * i) / ticks;
          const y = yFor(value);
          return (
            <g key={i}>
              <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="rgba(11,13,18,0.055)" strokeWidth="1" />
              {!compact && (
                <text x={pad.l - 8} y={y + 3} textAnchor="end" fontSize="9" fill="#8b909a" fontFamily="var(--font-geist-mono)">
                  {Math.round(value)}
                </text>
              )}
            </g>
          );
        })}

        {series.map((s) => (
          <path
            key={`area-${s.key}`}
            d={areaPath(s.values)}
            fill={`url(#${uid}-${s.key})`}
            opacity={hover === null ? 1 : 0.55}
          />
        ))}

        {series.map((s) => (
          <path
            key={s.key}
            d={linePath(s.values)}
            fill="none"
            stroke={s.color}
            strokeWidth="1.6"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={s.dashed ? "3 4" : undefined}
            opacity={0.95}
          />
        ))}

        {hover !== null && (
          <line
            x1={xFor(hover)}
            x2={xFor(hover)}
            y1={pad.t}
            y2={H - pad.b}
            stroke="rgba(11,13,18,0.2)"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
        )}

        {series.map((s) => (
          <circle
            key={`dot-${s.key}`}
            cx={xFor(count - 1)}
            cy={yFor(s.values[count - 1])}
            r="2.4"
            fill="#ffffff"
            stroke={s.color}
            strokeWidth="1.5"
          />
        ))}

        {hover !== null &&
          series.map((s) => (
            <circle key={`h-${s.key}`} cx={xFor(hover)} cy={yFor(s.values[hover])} r="3" fill={s.color} stroke="#ffffff" strokeWidth="1.5" />
          ))}

        {labels.map((label, i) =>
          i % (compact ? 4 : 2) === 0 || i === count - 1 ? (
            <text
              key={label + i}
              x={xFor(i)}
              y={H - 6}
              textAnchor={i === 0 ? "start" : i === count - 1 ? "end" : "middle"}
              fontSize="9"
              fill="#8b909a"
              fontFamily="var(--font-geist-mono)"
            >
              {label}
            </text>
          ) : null,
        )}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute top-1 z-10 min-w-[140px] -translate-x-1/2 rounded-md border border-line-strong bg-surface-2/95 p-2.5 shadow-xl backdrop-blur"
          style={{
            left: `${((pad.l + (hover * (W - pad.l - pad.r)) / Math.max(count - 1, 1)) / W) * 100}%`,
          }}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">{labels[hover]}</p>
          <div className="mt-1.5 space-y-1">
            {series.map((s) => (
              <div key={s.key} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-[11px] text-muted">
                  <span className="size-1.5 rounded-full" style={{ background: s.color }} />
                  {s.label}
                </span>
                <span className="font-mono text-[11px] tabular-nums text-ink">
                  {s.values[hover]}
                  {suffix}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sparkline                                                           */
/* ------------------------------------------------------------------ */

export function Sparkline({
  values,
  color = "#09090B",
  height = 32,
  className,
  fill = true,
}: {
  values: number[];
  color?: string;
  height?: number;
  className?: string;
  fill?: boolean;
}) {
  const uid = useId().replace(/[:]/g, "");
  const w = 120;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => [(i * w) / (values.length - 1), height - 3 - ((v - min) / span) * (height - 6)]);
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${height}`} width="100%" height={height} className={cn("block", className)} aria-hidden="true">
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={`${d} L${w} ${height} L0 ${height} Z`} fill={`url(#${uid})`} />}
      <path d={d} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Radial ring                                                         */
/* ------------------------------------------------------------------ */

export function Ring({
  value,
  size = 64,
  stroke = 4,
  color = "#09090B",
  track = "rgba(11,13,18,0.08)",
  children,
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: React.ReactNode;
  label?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }} aria-label={label}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Donut                                                               */
/* ------------------------------------------------------------------ */

export function Donut({
  segments,
  size = 148,
  stroke = 14,
  centerLabel,
  centerValue,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  stroke?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;

  const arcs = segments.map((segment, index) => {
    const dash = (segment.value / total) * circumference;
    const start = segments
      .slice(0, index)
      .reduce((sum, previous) => sum + (previous.value / total) * circumference, 0);
    return { ...segment, dash, start };
  });

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={segments.map((s) => `${s.label} ${s.value}`).join(", ")}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(11,13,18,0.05)" strokeWidth={stroke} />
        {arcs.map((segment) => (
          <circle
            key={segment.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={stroke}
            strokeDasharray={`${segment.dash - 3} ${circumference - segment.dash + 3}`}
            strokeDashoffset={-segment.start}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center">
        {centerValue && <span className="font-mono text-[20px] tabular-nums tracking-[-0.04em] text-ink">{centerValue}</span>}
        {centerLabel && <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">{centerLabel}</span>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Grouped bars                                                        */
/* ------------------------------------------------------------------ */

export function GroupedBars({
  labels,
  series,
  suffix = "",
  className,
}: {
  labels: string[];
  series: { key: string; label: string; color: string; values: number[] }[];
  suffix?: string;
  className?: string;
}) {
  const max = Math.max(...series.flatMap((s) => s.values), 1);
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className={cn("w-full", className)}>
      <div className="flex h-[132px] items-end gap-2">
        {labels.map((label, i) => (
          <div
            key={label + i}
            className="group relative flex h-full flex-1 items-end justify-center gap-[3px] rounded-sm"
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
            tabIndex={0}
            role="group"
            aria-label={`${label}: ${series.map((s) => `${s.label} $${s.values[i]}`).join(", ")}`}
          >
            {series.map((s) => (
              <div
                key={s.key}
                className="relative w-full max-w-[10px] rounded-[2px] transition-all duration-500"
                style={{
                  height: `${Math.max((s.values[i] / max) * 100, 2)}%`,
                  background: s.color,
                  opacity: hover === null || hover === i ? 0.92 : 0.34,
                }}
              />
            ))}
            {hover === i && (
              <div className="absolute -top-1 left-1/2 z-10 w-max -translate-x-1/2 rounded-sm border border-line-strong bg-surface-2 px-2 py-1 text-[10px] shadow-xl">
                <span className="font-mono tabular-nums text-ink">
                  ${series.reduce((sum, s) => sum + s.values[i], 0)}
                  {suffix}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        {labels.map((label, i) => (
          <span key={label + i} className="flex-1 text-center font-mono text-[8.5px] uppercase tracking-[0.08em] text-faint">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mini bars                                                           */
/* ------------------------------------------------------------------ */

export function MiniBars({
  values,
  labels,
  color = "#09090B",
  formatValue = (v: number) => `${v}`,
}: {
  values: number[];
  labels?: string[];
  color?: string;
  formatValue?: (value: number) => string;
}) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  return (
    <div className="flex h-[68px] items-end gap-1.5" role="img" aria-label={`Values: ${values.join(", ")}`}>
      {values.map((value, i) => {
        const height = 18 + ((value - min) / (max - min || 1)) * 82;
        const isLast = i === values.length - 1;
        return (
          <div key={i} className="group relative flex flex-1 flex-col justify-end">
            <div
              className="w-full rounded-[1.5px] transition-opacity"
              style={{
                height: `${height}%`,
                background: isLast ? color : "rgba(11,13,18,0.14)",
              }}
            />
            <span className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 rounded bg-surface-2 px-1 py-0.5 font-mono text-[9px] text-ink opacity-0 transition-opacity group-hover:opacity-100">
              {formatValue(value)}
            </span>
            {labels?.[i] && (
              <span className="mt-1.5 text-center font-mono text-[8px] uppercase text-faint">{labels[i]}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
