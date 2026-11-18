import { cn } from "@/lib/utils";

/**
 * Flat illustrated portraits drawn in SVG, so the marketing site can show
 * people without stock photography.
 */

type HairStyle = "long" | "bob" | "bun" | "curly" | "short" | "wave";

export interface PortraitSpec {
  bg: [string, string];
  skin: string;
  hair: string;
  top: string;
  style: HairStyle;
}

export const PORTRAITS: Record<string, PortraitSpec> = {
  sophia: { bg: ["#ffb98a", "#f26b1d"], skin: "#f3c6a5", hair: "#5a3420", top: "#fff4ea", style: "wave" },
  olivia: { bg: ["#b9adff", "#6e56f8"], skin: "#e9b892", hair: "#1f1a2e", top: "#2b2550", style: "bob" },
  isabella: { bg: ["#86e3cf", "#0f9d8a"], skin: "#c98e6a", hair: "#2a1710", top: "#f2fffb", style: "curly" },
  m1: { bg: ["#c7d2fe", "#818cf8"], skin: "#eac3a2", hair: "#2b2118", top: "#1e1b4b", style: "short" },
  m2: { bg: ["#fde68a", "#f59e0b"], skin: "#b97a56", hair: "#16110d", top: "#ffffff", style: "bun" },
  m3: { bg: ["#a7f3d0", "#10b981"], skin: "#f1cfb4", hair: "#a0522d", top: "#064e3b", style: "long" },
  m4: { bg: ["#fecdd3", "#fb7185"], skin: "#8d5a3f", hair: "#0f0b0a", top: "#fff1f2", style: "short" },
  m5: { bg: ["#bae6fd", "#38bdf8"], skin: "#f5d0b5", hair: "#d4a373", top: "#0c4a6e", style: "bob" },
  m6: { bg: ["#ddd6fe", "#a78bfa"], skin: "#d9a07b", hair: "#3b2a20", top: "#ffffff", style: "wave" },
};

function Hair({ style, color, back }: { style: HairStyle; color: string; back?: boolean }) {
  if (back) {
    switch (style) {
      case "long":
        return <path d="M38 50 C36 26 84 26 82 50 L86 96 C72 102 48 102 34 96 Z" fill={color} />;
      case "wave":
        return <path d="M37 52 C33 24 87 24 83 52 C88 66 90 82 84 94 C70 100 50 100 36 94 C30 82 32 66 37 52 Z" fill={color} />;
      case "bob":
        return <path d="M38 50 C36 25 84 25 82 50 L84 74 C70 80 50 80 36 74 Z" fill={color} />;
      case "curly":
        return (
          <g fill={color}>
            {[
              [40, 40], [50, 30], [62, 28], [74, 32], [82, 44], [84, 58], [80, 72], [40, 72], [36, 58],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={11} />
            ))}
          </g>
        );
      default:
        return null;
    }
  }
  switch (style) {
    case "short":
      return <path d="M42 46 C40 28 80 26 79 46 C74 38 64 35 56 37 C50 38 46 42 42 46 Z" fill={color} />;
    case "bun":
      return (
        <g fill={color}>
          <circle cx="60" cy="24" r="9" />
          <path d="M42 48 C40 28 80 28 78 48 C72 40 50 38 42 48 Z" />
        </g>
      );
    case "bob":
      return <path d="M42 50 C42 30 78 30 78 50 C70 40 54 38 42 50 Z" fill={color} />;
    case "wave":
      return <path d="M42 50 C44 30 78 28 79 48 C72 38 60 36 52 42 C48 45 45 48 42 50 Z" fill={color} />;
    case "long":
      return <path d="M42 48 C42 30 78 30 78 48 C68 38 54 37 42 48 Z" fill={color} />;
    case "curly":
      return null;
  }
}

export function Portrait({
  spec,
  size = 64,
  className,
  rounded = "full",
}: {
  spec: PortraitSpec | keyof typeof PORTRAITS;
  size?: number | string;
  className?: string;
  rounded?: "full" | "xl";
}) {
  const p = typeof spec === "string" ? PORTRAITS[spec] : spec;
  const id = `pt-${p.bg.join("").replace(/#/g, "")}-${p.style}`;
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      aria-hidden="true"
      className={cn("shrink-0", rounded === "full" ? "rounded-full" : "rounded-[22%]", className)}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.bg[0]} />
          <stop offset="100%" stopColor={p.bg[1]} />
        </linearGradient>
      </defs>
      <rect width="120" height="120" fill={`url(#${id})`} />
      <circle cx="96" cy="22" r="26" fill="#ffffff" opacity="0.16" />
      <Hair style={p.style} color={p.hair} back />
      <path d="M16 124 C20 96 40 86 60 86 C80 86 100 96 104 124 Z" fill={p.top} />
      <path d="M52 68 h16 v14 c0 5 -16 5 -16 0 Z" fill={p.skin} />
      <path d="M52 76 c5 4 11 4 16 0 v4 c-5 4 -11 4 -16 0 Z" fill="#000" opacity="0.08" />
      <ellipse cx="60" cy="52" rx="17.5" ry="20" fill={p.skin} />
      <Hair style={p.style} color={p.hair} />
      <circle cx="53.5" cy="54" r="1.6" fill="#1a1414" />
      <circle cx="66.5" cy="54" r="1.6" fill="#1a1414" />
      <path d="M55.5 62.5 c2.6 2.2 6.4 2.2 9 0" stroke="#7a3b2e" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <circle cx="50" cy="60" r="3" fill="#ff7a7a" opacity="0.18" />
      <circle cx="70" cy="60" r="3" fill="#ff7a7a" opacity="0.18" />
    </svg>
  );
}

/** A small white card that floats over a mockup, used around hero and feature visuals. */
export function FloatCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/70 bg-white/90 p-3 shadow-[0_1px_2px_rgba(9,9,11,0.06),0_18px_40px_-18px_rgba(40,30,120,0.35)] backdrop-blur-md",
        className,
      )}
    >
      {children}
    </div>
  );
}
