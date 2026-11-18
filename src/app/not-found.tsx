import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Context not found",
  description: "This route does not exist in any namespace.",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ground px-6 py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 size-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />
      </div>

      <div className="relative flex w-full max-w-md flex-col items-center text-center">
        <Logo />

        <p className="mt-10 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
          <span className="status-dot" />
          route resolution · failed
        </p>

        <p className="mt-4 font-mono text-[clamp(64px,16vw,112px)] leading-none tracking-[-0.06em] text-ink">404</p>

        <h1 className="mt-4 text-[clamp(22px,4vw,30px)] font-medium leading-tight tracking-[-0.03em] text-ink">
          This context does not exist.
        </h1>
        <p className="mt-3 max-w-[360px] text-[13px] leading-relaxed text-muted">
          The route you requested is not present in any namespace. Nothing has been leaked. Nothing has been forgotten.
        </p>

        <div className="mt-7 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-line-strong bg-white/[0.02] px-4 text-[13px] text-ink transition-colors hover:bg-white/[0.06]"
          >
            <ArrowLeft className="size-3.5" />
            Return to site
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-accent px-4 text-[13px] font-medium text-[#190409] transition-colors hover:bg-[#ff628b]"
          >
            Command center
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <p className="mt-9 flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-faint">
          <ShieldCheck className="size-3 text-green" />
          3 contexts intact · isolation enforced
        </p>
      </div>
    </main>
  );
}
