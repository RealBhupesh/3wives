import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { OperationalDot } from "@/components/brand/status";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Command Center", href: "/dashboard" },
      { label: "Inference Engine", href: "/engine" },
      { label: "Relationship Intelligence", href: "/dashboard/relationships" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Intelligence",
    links: [
      { label: "Context Isolation", href: "/#isolation" },
      { label: "Memory Vault", href: "/dashboard/memory" },
      { label: "Collision Prevention", href: "/#collision" },
      { label: "Emotional Layer", href: "/#emotional" },
    ],
  },
  {
    title: "Security",
    links: [
      { label: "Isolation Architecture", href: "/#security" },
      { label: "Safety Check", href: "/#collision" },
      { label: "Incident Center", href: "/dashboard/incidents" },
      { label: "Threat Model", href: "/#security" },
    ],
  },
  {
    title: "Pricing",
    links: [
      { label: "Monogamy", href: "/pricing#monogamy" },
      { label: "Dual Core", href: "/pricing#dual" },
      { label: "Triple Threat", href: "/pricing#triple" },
      { label: "Enterprise", href: "/pricing#enterprise" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ground">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-64 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(255,71,120,0.18), transparent 70%)" }}
      />
      <div className="container-page relative">
        <div className="grid gap-12 py-16 lg:grid-cols-[1.4fr_2fr] lg:py-20">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark />
              <span className="text-[17px] font-semibold tracking-[-0.03em]">3Wives AI</span>
            </div>
            <p className="mt-6 max-w-[330px] text-[22px] leading-[1.25] tracking-[-0.02em] text-ink">
              Love is complicated.
              <br />
              <span className="text-muted">Infrastructure shouldn&apos;t be.</span>
            </p>
            <div className="mt-8">
              <OperationalDot label="All 3 relationships operational" />
            </div>
            <p className="mt-3 font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.12em] text-faint">
              Uptime 99.99% · p50 latency 286ms
              <br />
              Namespaces 3 · Cross-context reads 0
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="mono-label">{column.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-1 text-[12.5px] text-muted transition-colors hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-faint">
            © 2026 3Wives AI, Inc. A demonstration environment. Fictional profiles, conversations
            and calendars. No external messaging integrations, no messages are sent.
          </p>
          <div className="flex items-center gap-5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-faint">
            <Link href="/pricing" className="transition-colors hover:text-ink">
              Terms
            </Link>
            <Link href="/pricing" className="transition-colors hover:text-ink">
              Privacy
            </Link>
            <a
              href="mailto:sales@3wives.ai?subject=Enterprise%20relationship%20infrastructure"
              className="inline-flex items-center gap-1 transition-colors hover:text-ink"
            >
              Contact
              <ArrowUpRight className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
