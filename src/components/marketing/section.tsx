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
      <div className="max-w-[680px]">
        {kicker && <p className="mono-label mb-4">{kicker}</p>}
        <Tag className="heading text-[clamp(32px,4.2vw,52px)]">{title}</Tag>
        {description && (
          <p className="mt-5 max-w-[560px] text-[15px] leading-[1.7] text-muted">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function FeatureFrame({
  id,
  kicker,
  title,
  description,
  bullets,
  children,
  reverse = false,
  link,
}: {
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
    <section id={id} className="scroll-mt-24 border-t border-line py-16 md:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className={cn("lg:col-span-5", reverse && "lg:order-2")}>
          <p className="mono-label">{kicker}</p>
          <h3 className="heading mt-4 text-[clamp(28px,3vw,38px)]">{title}</h3>
          <p className="mt-4 max-w-[440px] text-[14.5px] leading-[1.7] text-muted">{description}</p>
          {bullets && (
            <ul className="mt-6 space-y-2.5">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink/80">
                  <span className="mt-[7px] size-1 shrink-0 rounded-full bg-accent" />
                  {bullet}
                </li>
              ))}
            </ul>
          )}
          {link && (
            <a
              href={link.href}
              className="mt-7 inline-flex items-center gap-1.5 border-b border-accent/30 pb-1 font-mono text-[10px] uppercase tracking-[0.13em] text-accent transition-colors hover:border-accent hover:text-ink"
            >
              {link.label}
              <span aria-hidden>↗</span>
            </a>
          )}
        </div>
        <div className={cn("lg:col-span-7", reverse && "lg:order-1")}>{children}</div>
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
        "relative overflow-hidden rounded-lg border bg-[#0a0b10]",
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
          <span className="font-mono text-[8.5px] uppercase tracking-[0.15em] text-muted">{label}</span>
        </div>
        <div className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-faint">{meta}</div>
      </div>
      {children}
    </div>
  );
}
