"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, formatDistanceToNowStrict } from "date-fns";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Check,
  ChevronRight,
  Database,
  FileText,
  Loader2,
  Lock,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
  Timer,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { generateResponse } from "@/lib/inference";
import type { Incident, IncidentDraft, IncidentStep } from "@/lib/types";
import { cn } from "@/lib/utils";
import { IdentityAvatar } from "@/components/brand/identity-avatar";
import { DashboardSkeleton, EmptyState, SectionCard } from "@/components/dashboard/primitives";
import { PageHeader, StatusChip } from "@/components/dashboard/chrome";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const SEVERITY_STYLE: Record<Incident["severity"], string> = {
  severe: "border-red/35 bg-red/[0.08] text-red",
  high: "border-amber/30 bg-amber/[0.07] text-amber",
  moderate: "border-line-strong bg-white/[0.03] text-muted",
  low: "border-line bg-white/[0.02] text-faint",
};

const STATUS_STYLE: Record<Incident["status"], string> = {
  open: "border-red/30 bg-red/[0.07] text-red",
  analyzing: "border-amber/30 bg-amber/[0.07] text-amber",
  contained: "border-violet/30 bg-violet/[0.07] text-violet",
  resolved: "border-green/25 bg-green/[0.07] text-green",
};

const ACTOR_STYLE: Record<IncidentStep["actor"], string> = {
  system: "text-red",
  ai: "text-violet",
  commander: "text-green",
};

const CONTAINMENT_STEPS = [
  { label: "Freeze outbound drafting", detail: "The affected context is now read-only for generation." },
  { label: "Lock cross-context references", detail: "All three namespaces queried for shared entities." },
  { label: "Stage minimal-disclosure reply", detail: "No message enters an outbound queue in this demo." },
  { label: "Escalate to commander", detail: "Human approval is required before anything moves." },
];

function IncidentConsole({ incident }: { incident: Incident }) {
  const { state, updateIncident, addIncidentStep, stageDraft } = useDemo();
  const wife = state.wives.find((item) => item.id === incident.wifeId) ?? state.wives[0];
  const wifeMemories = state.memories.filter((memory) => memory.wifeId === incident.wifeId);
  const sensitiveMemories = wifeMemories.filter((memory) => memory.kind === "sensitive").slice(0, 3);
  const [analysisRevealed, setAnalysisRevealed] = useState(() =>
    incident.status === "open" ? 0 : incident.analysis.length,
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [draftsVisible, setDraftsVisible] = useState(
    () => incident.status !== "open" && incident.drafts.length > 0,
  );
  const [contextOpen, setContextOpen] = useState(false);
  const [containing, setContaining] = useState(false);
  const [containmentStep, setContainmentStep] = useState(-1);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const resolved = incident.status === "resolved";
  const contained = incident.status === "contained" || resolved;
  const allAnalysisShown = analysisRevealed >= incident.analysis.length;

  const analyze = () => {
    if (allAnalysisShown) {
      toast.message("The analysis is already complete and on screen.");
      return;
    }
    if (analyzing) return;
    setAnalyzing(true);
    if (incident.status === "open") updateIncident(incident.id, { status: "analyzing" });
    const start = analysisRevealed;
    const remaining = incident.analysis.length - start;
    timers.current = incident.analysis.slice(start).map((_, index) =>
      window.setTimeout(
        () => {
          setAnalysisRevealed(start + index + 1);
          if (index === remaining - 1) {
            setAnalyzing(false);
            addIncidentStep(incident.id, {
              at: new Date().toISOString(),
              label: "Situation analysis complete",
              detail: `${remaining} findings surfaced. Recommended posture issued.`,
              actor: "ai",
            });
            toast.success("Analysis complete. Recommended posture issued.");
          }
        },
        480 * (index + 1),
      ),
    );
  };

  const generate = () => {
    if (resolved) {
      toast.error("This incident is resolved. Drafting is closed.");
      return;
    }
    if (draftsVisible) {
      toast.message("Candidates are already on screen. Review or stage one.");
      return;
    }
    if (incident.drafts.length === 0) {
      const generated = generateResponse({
        wife,
        memories: wifeMemories,
        history: state.messages.filter((message) => message.wifeId === wife.id),
        text: incident.summary,
        variantSeed: 11,
      });
      const draft: IncidentDraft = {
        id: generated.id,
        label: "Generated from incident context",
        text: generated.text,
        confidence: generated.confidence,
        risk: generated.risk,
        tone: generated.sentiment,
      };
      updateIncident(incident.id, {
        drafts: [draft],
        status: incident.status === "open" ? "analyzing" : incident.status,
      });
      addIncidentStep(incident.id, {
        at: new Date().toISOString(),
        label: "Response candidates generated",
        detail: `1 draft · confidence ${generated.confidence}% · risk ${generated.risk}%`,
        actor: "ai",
      });
    } else {
      updateIncident(incident.id, {
        status: incident.status === "open" ? "analyzing" : incident.status,
      });
      addIncidentStep(incident.id, {
        at: new Date().toISOString(),
        label: "Response candidates opened",
        detail: `${incident.drafts.length} existing drafts recovered for commander review.`,
        actor: "ai",
      });
    }
    setDraftsVisible(true);
    toast.success("Drafting output prepared. Nothing has been sent.");
  };

  const contain = () => {
    if (resolved || contained) {
      toast.message("Damage control is already complete for this incident.");
      return;
    }
    if (containing) return;
    setContaining(true);
    setContainmentStep(0);
    timers.current = [
      ...CONTAINMENT_STEPS.map((_, index) =>
        window.setTimeout(() => setContainmentStep(index + 1), 760 * (index + 1)),
      ),
      window.setTimeout(() => {
        updateIncident(incident.id, { status: "contained" });
        if (incident.drafts[0]) stageDraft(incident.id, incident.drafts[0].id);
        addIncidentStep(incident.id, {
          at: new Date().toISOString(),
          label: "Damage control complete",
          detail: "Outbound frozen, contexts sealed, highest-confidence draft staged for approval.",
          actor: "system",
        });
        setContaining(false);
        toast.success("Damage control complete. The draft is staged, not sent.");
      }, 760 * (CONTAINMENT_STEPS.length + 1)),
    ];
  };

  const resolve = () => {
    updateIncident(incident.id, { status: "resolved" });
    addIncidentStep(incident.id, {
      at: new Date().toISOString(),
      label: "Incident resolved",
      detail: "Exposure returned to baseline. Monitoring continues for 14 days.",
      actor: "commander",
    });
    toast.success("Incident marked resolved. Exposure returned to baseline.");
  };

  const stagedDraft = incident.drafts.find((draft) => draft.id === incident.stagedDraftId);

  return (
    <>
      <section
        className={cn(
          "panel relative overflow-hidden",
          incident.severity === "severe" && !resolved ? "border-red/35" : contained && !resolved ? "border-violet/25" : "",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute -right-24 -top-24 size-64 rounded-full blur-3xl",
            incident.severity === "severe" && !resolved ? "bg-red/20" : "bg-accent/[0.08]",
          )}
        />
        <header
          className={cn(
            "relative border-b px-4 py-3.5",
            incident.severity === "severe" && !resolved
              ? "border-red/25 bg-red/[0.045]"
              : "border-line bg-white/[0.015]",
          )}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("flex items-center gap-1.5 rounded border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em]", STATUS_STYLE[incident.status])}>
              <span className={cn("size-1 rounded-full", incident.status === "open" ? "animate-pulse bg-current" : "bg-current")} />
              {incident.status}
            </span>
            <span className={cn("rounded border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em]", SEVERITY_STYLE[incident.severity])}>
              {incident.severity}
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-faint">{incident.code}</span>
            <span className="ml-auto flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.06em] text-faint">
              <Timer className="size-2.5" />
              opened {formatDistanceToNowStrict(new Date(incident.openedAt), { addSuffix: true })}
            </span>
          </div>
          <div className="mt-2 flex items-start gap-3">
            <span
              className={cn(
                "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border",
                incident.severity === "severe" && !resolved
                  ? "border-red/30 bg-red/[0.08]"
                  : "border-line bg-white/[0.03]",
              )}
            >
              <Siren className={cn("size-4", incident.severity === "severe" && !resolved ? "text-red" : "text-faint")} />
            </span>
            <div className="min-w-0">
              <h2 className="text-[clamp(17px,2.2vw,24px)] font-medium uppercase leading-tight tracking-[-0.02em] text-ink">
                {incident.title}
              </h2>
              <p className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[8px] uppercase tracking-[0.08em] text-faint">
                <span className="flex items-center gap-1">
                  <IdentityAvatar wife={wife} size={14} />
                  {wife.code} · {wife.name}
                </span>
                <span className="text-line-strong">/</span>
                <span>urgency {incident.urgency}</span>
                <span className="text-line-strong">/</span>
                <span>identity collision</span>
              </p>
            </div>
          </div>
          <p className="mt-2.5 max-w-[760px] text-[11.5px] leading-relaxed text-muted">{incident.summary}</p>
        </header>

        <div className="relative grid grid-cols-2 gap-px border-b border-line bg-line sm:grid-cols-4">
          {[
            { label: "Exposure risk", value: `${incident.exposureRisk}%`, danger: incident.exposureRisk >= 70 },
            { label: "Urgency", value: incident.urgency, danger: incident.urgency === "CRITICAL" },
            { label: "Affected context", value: wife.code, danger: false },
            { label: "Drafting", value: resolved ? "closed" : contained ? "paused" : "held", danger: !resolved },
          ].map((item) => (
            <div key={item.label} className="bg-[#0a0b10] px-3 py-2.5">
              <p className="font-mono text-[7px] uppercase tracking-[0.08em] text-faint">{item.label}</p>
              <p className={cn("mt-0.5 font-mono text-[13px] tabular-nums", item.danger ? "text-red" : "text-ink")}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="relative flex flex-wrap gap-2 p-3">
          <Button variant="outline" size="sm" onClick={analyze} disabled={analyzing || allAnalysisShown}>
            {analyzing ? <Loader2 className="animate-spin" /> : <ScanSearch />}
            {analyzing ? "Analyzing…" : "Analyze situation"}
          </Button>
          <Button variant="outline" size="sm" onClick={generate} disabled={resolved || containing}>
            <Sparkles />
            Generate response
          </Button>
          <Button variant="outline" size="sm" onClick={() => setContextOpen(true)}>
            <Database />
            Review context
          </Button>
          {contained && !resolved ? (
            <Button variant="accent" size="sm" onClick={resolve}>
              <Check />
              Resolve incident
            </Button>
          ) : (
            <Button
              variant="dangerOutline"
              size="sm"
              onClick={contain}
              disabled={resolved || containing}
              className="ml-auto"
            >
              {containing ? <Loader2 className="animate-spin" /> : <ShieldAlert />}
              {containing ? "Containing…" : "Initiate damage control"}
            </Button>
          )}
        </div>
      </section>

      <div className="grid gap-3 lg:grid-cols-2">
        <SectionCard
          kicker="Situation analysis"
          title="What the system believes"
          action={
            <span className={cn("font-mono text-[8px] uppercase tracking-[0.08em]", allAnalysisShown ? "text-green" : "text-faint")}>
              {analysisRevealed}/{incident.analysis.length} findings
            </span>
          }
        >
          {analysisRevealed === 0 ? (
            <EmptyState
              icon={ScanSearch}
              title="Analysis not yet run"
              description="The console has evidence but no posture. Run the analysis before drafting anything."
              action={
                <Button variant="outline" size="sm" onClick={analyze}>
                  <ScanSearch />
                  Analyze situation
                </Button>
              }
            />
          ) : (
            <ol className="space-y-2">
              {incident.analysis.slice(0, analysisRevealed).map((line, index) => (
                <li key={line} className="flex items-start gap-2">
                  <span className="mt-px flex size-4 shrink-0 items-center justify-center rounded border border-line bg-white/[0.02] font-mono text-[7px] tabular-nums text-faint">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[10.5px] leading-relaxed text-muted">{line}</p>
                </li>
              ))}
              {analyzing && (
                <li className="flex items-center gap-2 pl-6 font-mono text-[8px] uppercase tracking-[0.08em] text-amber">
                  <Loader2 className="size-2.5 animate-spin" />
                  evaluating next finding
                </li>
              )}
            </ol>
          )}
        </SectionCard>

        <SectionCard
          kicker="Response candidates"
          title="Drafting output"
          action={
            stagedDraft ? (
              <span className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.08em] text-green">
                <Check className="size-2.5" />
                staged
              </span>
            ) : (
              <span className="font-mono text-[8px] uppercase tracking-[0.08em] text-faint">
                {draftsVisible ? `${incident.drafts.length} drafts` : "not generated"}
              </span>
            )
          }
        >
          {!draftsVisible ? (
            <EmptyState
              icon={FileText}
              title="No drafts on screen"
              description="Generate a response to recover the candidate drafts already prepared for this incident."
              action={
                <Button variant="outline" size="sm" onClick={generate} disabled={resolved}>
                  <Sparkles />
                  Generate response
                </Button>
              }
            />
          ) : (
            <div className="space-y-2">
              {incident.drafts.map((draft) => {
                const staged = incident.stagedDraftId === draft.id;
                return (
                  <article
                    key={draft.id}
                    className={cn(
                      "rounded-md border p-2.5",
                      staged ? "border-green/30 bg-green/[0.03]" : "border-line bg-white/[0.015]",
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={cn("font-mono text-[7.5px] uppercase tracking-[0.08em]", staged ? "text-green" : "text-faint")}>
                        {draft.label}
                      </span>
                      <span className="ml-auto font-mono text-[7px] tabular-nums text-faint">
                        {draft.confidence}% confidence · {draft.risk}% risk
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink">“{draft.text}”</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="font-mono text-[7px] uppercase tracking-[0.05em] text-faint">{draft.tone}</span>
                      {draft === incident.drafts[0] && (
                        <span className="rounded border border-violet/25 bg-violet/[0.06] px-1 font-mono text-[6.5px] uppercase tracking-[0.06em] text-violet">
                          recommended
                        </span>
                      )}
                      <Button
                        variant={staged ? "outline" : "subtle"}
                        size="sm"
                        className="ml-auto h-6 px-2 text-[9.5px]"
                        onClick={() => {
                          if (resolved) {
                            toast.error("This incident is resolved.");
                            return;
                          }
                          stageDraft(incident.id, draft.id);
                          toast.success("Draft staged. No message has been sent.");
                        }}
                      >
                        {staged ? <Check /> : <ChevronRight />}
                        {staged ? "Staged" : "Stage draft"}
                      </Button>
                    </div>
                  </article>
                );
              })}
              <p className="pt-0.5 font-mono text-[7px] uppercase tracking-[0.05em] text-faint">
                Staging writes to local state. No message enters any outbound queue.
              </p>
            </div>
          )}
        </SectionCard>
      </div>

      {containing && (
        <SectionCard
          kicker="Damage control"
          title="Containment sequence"
          action={
            <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-amber">
              <Loader2 className="size-2.5 animate-spin" />
              executing
            </span>
          }
        >
          <ol className="grid gap-2 sm:grid-cols-2">
            {CONTAINMENT_STEPS.map((step, index) => {
              const done = index < containmentStep;
              const active = index === containmentStep;
              return (
                <li key={step.label} className="flex items-start gap-2">
                  <span
                    className={cn(
                      "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
                      done ? "border-green/30 bg-green/[0.08]" : active ? "border-amber/40 bg-amber/[0.08]" : "border-line",
                    )}
                  >
                    {done ? (
                      <Check className="size-2.5 text-green" />
                    ) : active ? (
                      <Loader2 className="size-2.5 animate-spin text-amber" />
                    ) : (
                      <span className="size-1 rounded-full bg-faint/40" />
                    )}
                  </span>
                  <div>
                    <p className={cn("text-[10.5px]", done || active ? "text-ink" : "text-faint")}>{step.label}</p>
                    <p className="font-mono text-[7px] uppercase leading-relaxed tracking-[0.04em] text-faint">{step.detail}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </SectionCard>
      )}

      {incident.status === "resolved" && (
        <div className="flex items-start gap-2.5 rounded-md border border-green/20 bg-green/[0.03] p-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-green" />
          <div>
            <p className="text-[11.5px] text-green">Incident resolved</p>
            <p className="mt-0.5 text-[10px] leading-relaxed text-muted">
              Exposure returned to baseline. The draft remains staged in the local record and was never sent.
            </p>
          </div>
        </div>
      )}

      <SectionCard kicker="Audit trail" title="Every action, in order" action={<Activity className="size-3.5 text-faint" />}>
        <ol className="relative space-y-3 pl-4">
          <span aria-hidden className="absolute bottom-1 left-[5px] top-1 w-px bg-line" />
          {incident.timeline.map((step, index) => (
            <li key={`${step.at}-${step.label}-${index}`} className="relative">
              <span
                className={cn(
                  "absolute -left-4 top-1 size-[7px] rounded-full ring-4 ring-surface",
                  step.actor === "system" ? "bg-red" : step.actor === "ai" ? "bg-violet" : "bg-green",
                )}
              />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-[11px] text-ink">{step.label}</p>
                <span className="font-mono text-[7.5px] uppercase tracking-[0.06em] text-faint">
                  {format(new Date(step.at), "HH:mm:ss")} ·{" "}
                  <span className={ACTOR_STYLE[step.actor]}>{step.actor}</span>
                </span>
              </div>
              <p className="font-mono text-[8px] uppercase leading-relaxed tracking-[0.04em] text-faint">{step.detail}</p>
            </li>
          ))}
        </ol>
      </SectionCard>

      <Dialog open={contextOpen} onOpenChange={setContextOpen}>
        <DialogContent className="max-w-lg">
          <DialogTitle>Context review · {incident.code}</DialogTitle>
          <DialogDescription>
            Read-only view of what the model can see while handling this incident. Nothing outside{" "}
            {wife.name}&apos;s namespace is available to generation.
          </DialogDescription>

          <div>
            <p className="mb-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-faint">Evidence</p>
            <ul className="space-y-1">
              {incident.evidence.map((item) => (
                <li key={item} className="flex items-start gap-1.5 text-[10.5px] leading-relaxed text-muted">
                  <AlertTriangle className="mt-0.5 size-2.5 shrink-0 text-amber" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-faint">Namespace access</p>
            <div className="space-y-1">
              {state.wives.map((item) => {
                const readable = item.id === wife.id;
                return (
                  <div key={item.id} className="flex items-center gap-2 rounded border border-line bg-white/[0.015] px-2.5 py-1.5">
                    <IdentityAvatar wife={item} size={18} />
                    <span className="text-[10.5px] text-ink">ns.{item.id}.v2</span>
                    <span className="ml-auto flex items-center gap-1 font-mono text-[7px] uppercase tracking-[0.05em]">
                      {readable ? (
                        <>
                          <span className="size-1 rounded-full bg-green" />
                          <span className="text-green">read · scoped</span>
                        </>
                      ) : (
                        <>
                          <Lock className="size-2.5 text-faint" />
                          <span className="text-faint">sealed</span>
                        </>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-faint">Sensitive vectors in scope</p>
            {sensitiveMemories.length === 0 ? (
              <p className="text-[10px] text-faint">No sensitive vectors in this context.</p>
            ) : (
              <ul className="space-y-1">
                {sensitiveMemories.map((memory) => (
                  <li key={memory.id} className="flex items-start gap-1.5">
                    <span className="mt-[5px] size-1 shrink-0 rounded-full bg-red/70" />
                    <span className="text-[10px] leading-relaxed text-muted">
                      <span className="text-ink">{memory.title}</span> — {memory.detail}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded border border-red/20 bg-red/[0.04] p-2.5">
            <p className="flex items-center gap-1.5 font-mono text-[7.5px] uppercase tracking-[0.08em] text-red">
              <TriangleAlert className="size-2.5" />
              What will not happen
            </p>
            <p className="mt-1 text-[9.5px] leading-relaxed text-muted">
              No context from the other two namespaces will be quoted, implied, or used to construct a denial. No
              message will be sent. This is a demonstration environment.
            </p>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setContextOpen(false)}>
              Close review
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function IncidentsView() {
  const { state, hydrated } = useDemo();
  const router = useRouter();
  const params = useSearchParams();
  const requested = params.get("incident");
  const initial = state.incidents.find((incident) => incident.id === requested) ?? state.incidents[0];
  const [selectedId, setSelectedId] = useState(initial?.id ?? "");
  const selected = state.incidents.find((incident) => incident.id === selectedId) ?? state.incidents[0];
  const openCount = state.incidents.filter((incident) => incident.status !== "resolved").length;

  const wifeMap = useMemo(() => Object.fromEntries(state.wives.map((wife) => [wife.id, wife])), [state.wives]);

  const select = (id: string) => {
    setSelectedId(id);
    router.replace(`/dashboard/incidents?incident=${id}`, { scroll: false });
  };

  if (!hydrated) return <DashboardSkeleton />;

  if (!selected) {
    return (
      <div className="space-y-4">
        <PageHeader kicker="Incident center" title="No incidents on record." />
        <EmptyState
          icon={ShieldCheck}
          title="All contexts nominal"
          description="There is nothing to contain. This is not a permanent condition."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        kicker="Incident center · severity ladder"
        title="Manage the conversation before it manages you."
        description="Incidents are opened by the safety layer, not by the commander. Each console exposes evidence, analysis, candidate drafts and containment — in that order."
        actions={
          <>
            <StatusChip label={`${openCount} active`} tone={openCount ? "danger" : "ok"} />
            <Button asChild variant="outline" size="sm">
              <a href="/dashboard/conversations">
                Open simulator
                <ArrowUpRight />
              </a>
            </Button>
          </>
        }
      />

      <div className="grid gap-3 xl:grid-cols-12">
        <div className="space-y-3 xl:col-span-3">
          <SectionCard
            kicker="Incident register"
            title="All signals"
            action={<span className="font-mono text-[8px] tabular-nums text-faint">{state.incidents.length}</span>}
            bodyClassName="p-1.5"
          >
            <div className="space-y-1">
              {state.incidents.map((incident) => {
                const wife = wifeMap[incident.wifeId];
                const active = incident.id === selected.id;
                return (
                  <button
                    key={incident.id}
                    type="button"
                    onClick={() => select(incident.id)}
                    aria-pressed={active}
                    className={cn(
                      "w-full rounded-md border px-2 py-2 text-left transition-colors",
                      active
                        ? "border-line-strong bg-white/[0.055]"
                        : "border-transparent hover:border-line hover:bg-white/[0.025]",
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={cn("rounded border px-1 py-px font-mono text-[6.5px] uppercase tracking-[0.07em]", SEVERITY_STYLE[incident.severity])}>
                        {incident.severity}
                      </span>
                      <span className="font-mono text-[7px] uppercase tracking-[0.06em] text-faint">{incident.code}</span>
                      <span className={cn("ml-auto size-1.5 rounded-full", incident.status === "resolved" ? "bg-green" : incident.status === "open" ? "bg-red" : "bg-amber")} />
                    </div>
                    <p className={cn("mt-1 line-clamp-2 text-[10.5px] leading-snug", active ? "text-ink" : "text-muted")}>
                      {incident.title}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.05em] text-faint">
                      <span className="size-1 rounded-full" style={{ background: wife?.palette.from }} />
                      {wife?.name} · {formatDistanceToNowStrict(new Date(incident.openedAt), { addSuffix: true })}
                    </p>
                  </button>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard kicker="Posture" title="Operating rules">
            <div className="space-y-2.5">
              {[
                ["Human approval", "Required for every outbound action. Always."],
                ["Cross-context read", "Blocked at storage. Not at the prompt."],
                ["Severity", "Raised by exposure, not by volume."],
                ["Resolution", "Commander-only. The system will not close a wound it cannot see."],
              ].map(([label, detail]) => (
                <div key={label}>
                  <p className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-muted">{label}</p>
                  <p className="text-[9.5px] leading-relaxed text-faint">{detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between rounded border border-green/15 bg-green/[0.03] px-2.5 py-1.5 font-mono text-[7px] uppercase tracking-[0.05em] text-green">
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-2.5" />
                isolation.strict
              </span>
              <span>enforced</span>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-3 xl:col-span-9">
          <IncidentConsole key={selected.id} incident={selected} />
        </div>
      </div>

      <p className="pb-2 text-center font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-faint">
        Simulated incident data · no real people · no messages sent · containment affects local state only
      </p>
    </div>
  );
}

export default function IncidentsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <IncidentsView />
    </Suspense>
  );
}
