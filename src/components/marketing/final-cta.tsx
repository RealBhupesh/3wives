import Link from "next/link";
import { ArrowRight } from "lucide-react";

const BACKERS = ["Kestrel Partners", "Arden Ventures", "Northfield Capital", "Halcyon Fund"];

function Arcs() {
  const r = 210;
  const c = 260;
  const gap = 22;
  const arc = (start: number) => {
    const a0 = ((start + gap / 2 - 90) * Math.PI) / 180;
    const a1 = ((start + 120 - gap / 2 - 90) * Math.PI) / 180;
    return `M ${c + r * Math.cos(a0)} ${c + r * Math.sin(a0)} A ${r} ${r} 0 0 1 ${c + r * Math.cos(a1)} ${c + r * Math.sin(a1)}`;
  };
  return (
    <svg viewBox="0 0 520 520" fill="none" className="h-full w-full" aria-hidden>
      {["#f26b1d", "#6e56f8", "#0f9d8a"].map((color, i) => (
        <path key={color} d={arc(i * 120)} stroke={color} strokeWidth="44" strokeLinecap="round" />
      ))}
      <circle cx={c} cy={c} r="40" fill="#fff" />
    </svg>
  );
}

export function FinalCta() {
  return (
    <section className="container-page py-20 md:py-28">
      <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#17123a,#2a1f6e_55%,#123c46)] px-6 py-16 text-white sm:px-12 md:py-24 lg:px-16">
        <div aria-hidden className="absolute -left-32 -top-40 size-[520px] rounded-full bg-[#6e56f8]/40 blur-[110px]" />
        <div aria-hidden className="absolute -bottom-48 right-10 size-[460px] rounded-full bg-[#0f9d8a]/35 blur-[110px]" />
        <div aria-hidden className="absolute -right-24 top-1/2 hidden size-[520px] -translate-y-1/2 lg:block">
          <Arcs />
        </div>

        <div className="relative max-w-[600px]">
          <h2 className="display text-[clamp(44px,6.4vw,88px)] text-white">Give every relationship your best.</h2>
          <p className="mt-6 max-w-[440px] text-[17px] leading-[1.6] text-white/65">
            Set up in minutes. Your first relationship is free, and nothing is ever sent without your approval.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[14px] font-medium text-ink transition-colors hover:bg-white/90"
            >
              Get started
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-[14px] font-medium text-white transition-colors hover:bg-white/10"
            >
              Talk to our team
            </Link>
          </div>
          <div className="mt-14 border-t border-white/15 pt-6">
            <p className="text-[13px] text-white/50">Backed by</p>
            <p className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[14px] font-medium text-white/85">
              {BACKERS.map((b) => (
                <span key={b}>{b}</span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
