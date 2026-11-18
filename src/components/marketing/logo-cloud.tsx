type Glyph = "ring" | "square" | "tri" | "bars" | "half" | "plus" | "dots" | "wave";

const LOGOS: { name: string; glyph: Glyph }[] = [
  { name: "Meridian", glyph: "half" },
  { name: "Northfield", glyph: "tri" },
  { name: "Halcyon", glyph: "wave" },
  { name: "Arden", glyph: "ring" },
  { name: "Lumen Health", glyph: "plus" },
  { name: "Corvid", glyph: "square" },
  { name: "Atlas Group", glyph: "bars" },
  { name: "Kestrel", glyph: "dots" },
];

function Mark({ glyph }: { glyph: Glyph }) {
  const p = { fill: "currentColor" };
  return (
    <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
      {glyph === "ring" && <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="3" />}
      {glyph === "square" && <rect x="3" y="3" width="14" height="14" rx="3" {...p} />}
      {glyph === "tri" && <path d="M10 2 18 17H2Z" {...p} />}
      {glyph === "bars" && (
        <>
          <rect x="2" y="4" width="4" height="12" rx="1" {...p} />
          <rect x="8" y="2" width="4" height="16" rx="1" {...p} />
          <rect x="14" y="6" width="4" height="10" rx="1" {...p} />
        </>
      )}
      {glyph === "half" && <path d="M10 2a8 8 0 1 0 0 16Z" {...p} />}
      {glyph === "plus" && <path d="M7 2h6v5h5v6h-5v5H7v-5H2V7h5Z" {...p} />}
      {glyph === "dots" && (
        <>
          <circle cx="5" cy="10" r="3" {...p} />
          <circle cx="15" cy="10" r="3" {...p} />
          <circle cx="10" cy="4" r="2" {...p} />
        </>
      )}
      {glyph === "wave" && <path d="M2 12c3-5 5-5 8 0s5 5 8 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />}
    </svg>
  );
}

export function LogoCloud() {
  const row = [...LOGOS, ...LOGOS];
  return (
    <section className="pb-4 pt-20 md:pt-24" aria-label="Members work at">
      <div className="container-page">
        <p className="text-center text-[14px] text-muted">Trusted by members at more than 2,000 companies</p>
      </div>
      <div className="fade-x mt-9 overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-16 pr-16">
          {row.map((logo, i) => (
            <span
              key={i}
              aria-hidden={i >= LOGOS.length}
              className="flex items-center gap-2 whitespace-nowrap text-[21px] font-semibold tracking-[-0.03em] text-ink/40"
            >
              <Mark glyph={logo.glyph} />
              {logo.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
