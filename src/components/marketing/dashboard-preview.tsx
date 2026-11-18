import Link from "next/link";
import { ArrowUpRight, Circle, MoreHorizontal } from "lucide-react";
import { createInitialState, DEMO_NOW } from "@/lib/data";
import { IdentityAvatar } from "@/components/brand/identity-avatar";
import { LineChart, Ring, Sparkline } from "@/components/charts";
import { SectionHeading } from "./section";
import { cn } from "@/lib/utils";

const NAV = ["Command Center", "Relationship Intelligence", "Conversations", "Memory Vault", "Calendar & Collisions", "Gift Intelligence", "Incident Center"];

export function DashboardPreview() {
  const data = createInitialState(DEMO_NOW);
  const series = [
    { key: "sophia", label: "Sophia", color: "#ff8fa3", values: data.analytics.stability.map((point) => point.sophia) },
    { key: "olivia", label: "Olivia", color: "#a78bfa", values: data.analytics.stability.map((point) => point.olivia) },
    { key: "isabella", label: "Isabella", color: "#ff4778", values: data.analytics.stability.map((point) => point.isabella) },
  ];

  return (
    <section className="border-y border-line bg-[#0a0b10] py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          kicker="Command center"
          title={
            <>
              One screen.
              <br />
              <span className="text-muted">Every version of your life.</span>
            </>
          }
          description="Relationship health, conversation coverage, emotional debt, gift spend, and collisions — resolved into a single operational picture."
          action={
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-[12.5px] font-medium text-ground transition-colors hover:bg-white"
            >
              Open the live demo
              <ArrowUpRight className="size-3.5" />
            </Link>
          }
        />

        <div className="mt-10 overflow-hidden rounded-xl border border-line-strong bg-ground shadow-[0_50px_120px_-60px_rgba(0,0,0,1)] md:mt-14">
          <div className="flex h-10 items-center justify-between border-b border-line px-3">
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-accent" />
              <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted">3wives OS · command center</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden font-mono text-[8px] uppercase tracking-[0.1em] text-faint sm:block">⌘K</span>
              <span className="flex items-center gap-1.5 rounded-full border border-green/20 bg-green/[0.05] px-2 py-0.5 font-mono text-[7.5px] uppercase tracking-[0.1em] text-green">
                <span className="size-1 rounded-full bg-green" />
                Operational
              </span>
            </div>
          </div>

          <div className="flex">
            <aside className="hidden w-[186px] shrink-0 flex-col border-r border-line bg-[#090a0f] p-2.5 md:flex">
              <p className="px-2 pb-2 pt-1 font-mono text-[7.5px] uppercase tracking-[0.14em] text-faint">Workspace</p>
              {NAV.map((item, index) => (
                <span
                  key={item}
                  className={cn(
                    "flex items-center gap-2 rounded px-2 py-[7px] text-[10.5px]",
                    index === 0 ? "bg-white/[0.05] text-ink" : "text-muted/70",
                  )}
                >
                  <span className={cn("size-1 rounded-full", index === 0 ? "bg-accent" : "bg-white/15")} />
                  <span className="truncate">{item}</span>
                  {item === "Incident Center" && (
                    <span className="ml-auto rounded-sm bg-red/15 px-1 font-mono text-[7px] text-red">2</span>
                  )}
                </span>
              ))}
              <div className="mt-auto rounded border border-line bg-white/[0.02] p-2">
                <p className="font-mono text-[7px] uppercase tracking-[0.1em] text-faint">Plan</p>
                <p className="mt-0.5 text-[10px] text-ink">Triple Threat</p>
                <p className="font-mono text-[7px] uppercase tracking-[0.08em] text-green">3 / 3 namespaces</p>
              </div>
            </aside>

            <div className="min-w-0 flex-1 p-3.5 md:p-5">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="text-[16px] font-medium tracking-[-0.02em] md:text-[19px]">Good evening, Commander.</p>
                  <p className="mt-0.5 text-[10.5px] text-muted">Your relationship infrastructure is operating normally.</p>
                </div>
                <span className="rounded border border-line px-2 py-1 font-mono text-[7.5px] uppercase tracking-[0.1em] text-faint">
                  Tue · 20:16 PST
                </span>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {data.wives.map((wife) => {
                  const statusColor = wife.status === "stable" ? "#3ddc97" : wife.status === "attention" ? "#f5b544" : "#ff3b4e";
                  const trend = data.analytics.stability.map((point) => point[wife.id]);
                  return (
                    <Link
                      key={wife.id}
                      href="/dashboard/relationships"
                      className="group rounded-md border border-line bg-[#0c0d13] p-3 transition-colors hover:border-line-strong"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-faint">{wife.code}</span>
                        <span className="flex items-center gap-1 font-mono text-[7.5px] uppercase tracking-[0.08em]" style={{ color: statusColor }}>
                          <span className="size-1 rounded-full" style={{ background: statusColor }} />
                          {wife.status}
                        </span>
                      </div>
                      <div className="mt-2.5 flex items-center gap-2">
                        <IdentityAvatar wife={wife} size={34} />
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-medium">{wife.name}</p>
                          <p className="truncate text-[9px] text-faint">{wife.activity}</p>
                        </div>
                        <Ring value={wife.health} size={36} stroke={2.5} color={statusColor}>
                          <span className="font-mono text-[8px] tabular-nums">{wife.health}</span>
                        </Ring>
                      </div>
                      <div className="mt-2">
                        <Sparkline values={trend} color={statusColor} height={22} />
                      </div>
                      <div className="mt-1.5 flex items-center justify-between border-t border-line pt-1.5 font-mono text-[7.5px] uppercase tracking-[0.06em] text-faint">
                        <span>last {wife.lastInteractionMinutes}m</span>
                        <span>{wife.nextDate.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-2 grid gap-2 lg:grid-cols-[1.6fr_1fr]">
                <div className="rounded-md border border-line bg-[#0c0d13] p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-faint">Relationship stability index</p>
                    <span className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-green">+2.4 this week</span>
                  </div>
                  <div className="mt-1">
                    <LineChart
                      labels={data.analytics.stability.map((point) => point.label)}
                      series={series}
                      height={150}
                      domain={[50, 100]}
                      compact
                    />
                  </div>
                  <div className="mt-1 flex gap-4">
                    {series.map((item) => (
                      <span key={item.key} className="flex items-center gap-1 font-mono text-[7.5px] uppercase tracking-[0.06em] text-faint">
                        <span className="size-1.5 rounded-full" style={{ background: item.color }} />
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-md border border-line bg-[#0c0d13] p-3">
                  <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-faint">Live operations</p>
                  <div className="mt-2 space-y-2">
                    {data.activity.slice(0, 4).map((event) => (
                      <div key={event.id} className="flex items-start gap-1.5">
                        <Circle
                          className={cn(
                            "mt-[3px] size-1.5 shrink-0 fill-current",
                            event.tone === "critical" ? "text-red" : event.tone === "warn" ? "text-amber" : "text-green",
                          )}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-[9px] leading-tight text-ink/85">{event.title}</p>
                          <p className="truncate font-mono text-[7px] uppercase tracking-[0.05em] text-faint">{event.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-line pt-2">
                    <span className="font-mono text-[7px] uppercase tracking-[0.08em] text-faint">p50 latency</span>
                    <span className="font-mono text-[8px] tabular-nums text-green">286ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-faint">
            Seeded demo data · persisted locally · no external integrations
          </p>
          <Link href="/dashboard" className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-ink">
            Explore all 8 modules
            <MoreHorizontal className="size-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
