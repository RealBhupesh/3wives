import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SectionHeading({
  kicker,
  title,
  description,
  className,
  action,
  as: Tag = "h2",
}: {
  kicker?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  action?: ReactNode;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-[820px]">
        {kicker && <p className="mono-label mb-5"><span className="triad" aria-hidden><i /><i /><i /></span>{kicker}</p>}
        <Tag className="heading text-[clamp(38px,5.4vw,72px)]">{title}</Tag>
        {description && (
          <p className="mt-6 max-w-[560px] text-[17px] leading-[1.6] text-muted">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

const TONE_DOT = {
  sophia: "bg-[#f26b1d]",
  olivia: "bg-[#6e56f8]",
  isabella: "bg-[#0f9d8a]",
  danger: "bg-red",
} as const;

export function FeatureFrame({
  id,
  kicker,
  title,
  description,
  bullets,
  children,
  reverse = false,
  link,
  tone = "olivia",
}: {
  tone?: "sophia" | "olivia" | "isabella" | "danger";
  id?: string;
  kicker: string;
  title: string;
  description: string;
  bullets?: string[];
  children: ReactNode;
  reverse?: boolean;
  link?: { href: string; label: string };
}) {
  return (
    <section id={id} className="scroll-mt-24 py-14 md:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className={cn("lg:col-span-5", reverse && "lg:order-2")}>
          <p className="mono-label">{kicker}</p>
          <h3 className="heading mt-5 text-[clamp(32px,3.6vw,48px)]">{title}</h3>
          <p className="mt-5 max-w-[460px] text-[16px] leading-[1.65] text-muted">{description}</p>
          {bullets && (
            <ul className="mt-6 space-y-2.5">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5 text-[14.5px] leading-relaxed text-ink/80">
                  <span className={cn("mt-[3px] flex size-5 shrink-0 items-center justify-center rounded-full text-white", TONE_DOT[tone])}>
                    <svg viewBox="0 0 12 12" className="size-3" aria-hidden><path d="M2.5 6.2 5 8.5 9.5 3.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          )}
          {link && (
            <a
              href={link.href}
              className="mt-7 inline-flex items-center gap-1.5 border-b border-ink/25 pb-0.5 text-[14px] font-medium text-ink transition-colors hover:border-ink"
            >
              {link.label}
              <span aria-hidden>↗</span>
            </a>
          )}
        </div>
        <div className={cn("lg:col-span-7", reverse && "lg:order-1")}>
          <div className={cn("stage", `stage-${tone}`)}>
            <div className="relative shadow-[0_24px_60px_-28px_rgba(30,20,90,0.35)]">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DemoShell({
  label,
  meta,
  children,
  className,
  tone = "default",
}: {
  label: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
  tone?: "default" | "danger" | "accent";
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-[#ffffff]",
        tone === "danger" ? "border-red/25" : tone === "accent" ? "border-accent/20" : "border-line",
        className,
      )}
    >
      <div className="flex h-9 items-center justify-between border-b border-line px-3.5">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "size-1.5 rounded-full",
              tone === "danger" ? "bg-red" : tone === "accent" ? "bg-accent" : "bg-green",
            )}
          />
          <span className="text-[11.5px] text-muted">{label}</span>
        </div>
        <div className="text-[11.5px] text-faint">{meta}</div>
      </div>
      {children}
    </div>
  );
}
