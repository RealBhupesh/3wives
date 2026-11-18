"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, formatDistanceToNowStrict } from "date-fns";
import {
  ArrowUpRight,
  Check,
  CheckCheck,
  CornerDownLeft,
  Database,
  Eraser,
  Gauge,
  Loader2,
  MessagesSquare,
  RefreshCcw,
  ShieldAlert,
  Sparkles,
  Timer,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { generateResponse, STARTER_PROMPTS, EMOJI_HABITS, type GeneratedResponse } from "@/lib/inference";
import type { Message, WifeId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { IdentityAvatar } from "@/components/brand/identity-avatar";
import { StatusPill, STATUS_META } from "@/components/brand/status";
import { Ring } from "@/components/charts";
import { DashboardSkeleton, EmptyState, SectionCard } from "@/components/dashboard/primitives";
import { PageHeader, StatusChip } from "@/components/dashboard/chrome";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const WIFE_IDS: WifeId[] = ["sophia", "olivia", "isabella"];

function isWifeId(value: string | null): value is WifeId {
  return value !== null && (WIFE_IDS as string[]).includes(value);
}

const STAGES = [
  { label: "Retrieving isolated context", detail: "namespace lock · single-wife read" },
  { label: "Matching voice fingerprint", detail: "tone mirror · emoji cadence" },
  { label: "Running safety check", detail: "cross-context leakage · 0 hits" },
];

type Phase = "idle" | "running" | "ready";

function MessageBubble({ message, wifeName }: { message: Message; wifeName: string }) {
  if (message.role === "system") {
    return (
      <div className="flex justify-center py-1">
        <span className="rounded-full border border-line bg-ink/[0.02] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-faint">
          {message.text}
        </span>
      </div>
    );
  }

  const mine = message.role === "user";
  return (
    <div className={cn("flex items-end gap-2", mine && "flex-row-reverse")}>
      {!mine && (
        <span
          className="mb-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] font-mono text-[7px] text-ink"
          aria-hidden
        >
          {wifeName.slice(0, 1)}
        </span>
      )}
      <div className={cn("max-w-[86%] sm:max-w-[76%]", mine && "text-right")}>
        <div
          className={cn(
            "rounded-lg border px-3 py-2 text-left text-[12px] leading-relaxed",
            mine
              ? "rounded-br-sm border-accent/20 bg-accent/[0.08] text-ink"
              : "rounded-bl-sm border-line bg-[#ffffff] text-ink/90",
          )}
        >
          {message.text}
        </div>
        <div className={cn("mt-1 flex items-center gap-1.5 font-mono text-[7.5px] uppercase tracking-[0.06em] text-faint", mine && "justify-end")}>
          <span>{format(new Date(message.at), "HH:mm")}</span>
          {message.source === "ai" && (
            <span className="flex items-center gap-1 text-violet">
              <Sparkles className="size-2" />
              simulated
            </span>
          )}
          {mine && <CheckCheck className="size-2.5 text-faint" />}
        </div>
      </div>
    </div>
  );
}

function ThreadRail({ selected, onSelect }: { selected: WifeId; onSelect: (id: WifeId) => void }) {
  const { state } = useDemo();

  return (
    <SectionCard kicker="Active contexts" title="Threads" action={<span className="font-mono text-[8px] tabular-nums text-faint">3</span>} bodyClassName="p-1.5">
      <div className="space-y-1">
        {state.wives.map((wife) => {
          const thread = state.messages.filter((message) => message.wifeId === wife.id);
          const last = thread.at(-1);
          const active = selected === wife.id;
          return (
            <button
              key={wife.id}
              type="button"
              onClick={() => onSelect(wife.id)}
              aria-pressed={active}
              className={cn(
                "flex w-full items-start gap-2.5 rounded-md px-2 py-2 text-left transition-colors",
                active ? "bg-ink/[0.055]" : "hover:bg-ink/[0.025]",
              )}
            >
              <IdentityAvatar wife={wife} size={32} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-[11.5px] text-ink">{wife.name}</span>
                  <span className="size-1 shrink-0 rounded-full" style={{ background: STATUS_META[wife.status].color }} />
                  <span className="ml-auto shrink-0 font-mono text-[7px] uppercase tracking-[0.06em] text-faint">
                    {last ? formatDistanceToNowStrict(new Date(last.at), { addSuffix: false }) : "quiet"}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-[9.5px] leading-relaxed text-faint">
                  {last ? (
                    <>
                      <span className="font-mono text-[8px] uppercase tracking-[0.05em] text-muted">
                        {last.role === "wife" ? wife.name : last.role === "user" ? "You" : "System"}:
                      </span>{" "}
                      {last.text}
                    </>
                  ) : (
                    "No messages in this namespace."
                  )}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-1.5 border-t border-line px-2 pb-1 pt-2 font-mono text-[7.5px] uppercase leading-relaxed tracking-[0.06em] text-faint">
        Each thread reads only its own namespace. The model never sees the other two.
      </div>
    </SectionCard>
  );
}

function SimulatorPanel({
  wifeId,
  phase,
  stage,
  result,
  selectedText,
  variant,
  onUsePrompt,
  onGenerate,
  onSelectText,
  onApprove,
  onDiscard,
}: {
  wifeId: WifeId;
  phase: Phase;
  stage: number;
  result: GeneratedResponse | null;
  selectedText: string;
  variant: number;
  onUsePrompt: (prompt: string) => void;
  onGenerate: () => void;
  onSelectText: (text: string) => void;
  onApprove: () => void;
  onDiscard: () => void;
}) {
  const { state } = useDemo();
  const wife = state.wives.find((item) => item.id === wifeId) ?? state.wives[0];
  const memoryCount = state.memories.filter((memory) => memory.wifeId === wife.id).length;

  return (
    <SectionCard
      kicker="Inference preview"
      title="Predicted response"
      action={
        <span
          className={cn(
            "flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.1em]",
            phase === "running" ? "text-amber" : phase === "ready" ? "text-green" : "text-faint",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              phase === "running" ? "animate-pulse bg-amber" : phase === "ready" ? "bg-green" : "bg-faint",
            )}
          />
          {phase === "running" ? "generating" : phase === "ready" ? `variant ${variant}` : "standby"}
        </span>
      }
      bodyClassName="flex flex-col gap-3"
    >
      {phase === "idle" && (
        <>
          <div className="rounded border border-line bg-ink/[0.018] p-3">
            <p className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-violet">
              <Wand2 className="size-3" />
              voice.twin.v6
            </p>
            <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
              Write what you plan to say. The engine predicts how {wife.name} would respond, using only her memory
              namespace and her existing thread.
            </p>
            <p className="mt-2 text-[10.5px] leading-relaxed text-faint">{EMOJI_HABITS[wife.id]}</p>
          </div>
          <div>
            <p className="mb-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-faint">Try a scenario</p>
            <div className="space-y-1.5">
              {STARTER_PROMPTS[wife.id].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => onUsePrompt(prompt)}
                  className="flex w-full items-center justify-between gap-2 rounded border border-line bg-ink/[0.015] px-2.5 py-1.5 text-left text-[10.5px] text-muted transition-colors hover:border-line-strong hover:text-ink"
                >
                  <span className="truncate">“{prompt}”</span>
                  <ArrowUpRight className="size-3 shrink-0 text-faint" />
                </button>
              ))}
            </div>
          </div>
          <div className="mt-auto flex items-center gap-1.5 border-t border-line pt-2.5 font-mono text-[7.5px] uppercase tracking-[0.06em] text-faint">
            <ShieldAlert className="size-2.5 text-green" />
            memory read · {memoryCount} vectors · isolated
          </div>
        </>
      )}

      {phase === "running" && (
        <div className="space-y-3 py-2">
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.1em] text-amber">
            <Loader2 className="size-3.5 animate-spin" />
            Running local inference
          </div>
          <ol className="space-y-2">
            {STAGES.map((item, index) => (
              <li key={item.label} className="flex items-start gap-2">
                <span
                  className={cn(
                    "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
                    index < stage
                      ? "border-green/30 bg-green/[0.08]"
                      : index === stage
                        ? "border-amber/40 bg-amber/[0.08]"
                        : "border-line",
                  )}
                >
                  {index < stage ? (
                    <Check className="size-2.5 text-green" />
                  ) : index === stage ? (
                    <Loader2 className="size-2.5 animate-spin text-amber" />
                  ) : (
                    <span className="size-1 rounded-full bg-faint/40" />
                  )}
                </span>
                <div>
                  <p className={cn("text-[10.5px]", index <= stage ? "text-ink" : "text-faint")}>{item.label}</p>
                  <p className="font-mono text-[7.5px] uppercase tracking-[0.05em] text-faint">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {phase === "ready" && result && (
        <>
          <div className="rounded-md border border-accent/20 bg-accent/[0.04] p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-accent">
                <Sparkles className="size-3" />
                simulated reply · {result.intent}
              </p>
              <span className="flex shrink-0 items-center gap-1 font-mono text-[8px] tabular-nums text-faint">
                <Timer className="size-2.5" />
                {result.latencyMs}ms
              </span>
            </div>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink">“{selectedText || result.text}”</p>
          </div>

          <div className="flex items-center gap-3 rounded border border-line bg-ink/[0.015] p-2.5">
            <Ring value={result.confidence} size={58} stroke={5} color="#0f9d8a" label={`Confidence ${result.confidence} percent`}>
              <span className="font-mono text-[13px] tabular-nums text-ink">{result.confidence}%</span>
            </Ring>
            <dl className="grid flex-1 grid-cols-2 gap-x-3 gap-y-1.5">
              {[
                { label: "Style match", value: `${result.styleMatch}%` },
                { label: "Sentiment", value: result.sentiment },
                { label: "Risk", value: `${result.risk}%` },
                { label: "Intent", value: result.intent },
              ].map((item) => (
                <div key={item.label} className="flex items-baseline justify-between gap-2">
                  <dt className="font-mono text-[7.5px] uppercase tracking-[0.06em] text-faint">{item.label}</dt>
                  <dd
                    className={cn(
                      "truncate font-mono text-[9px] capitalize",
                      item.label === "Risk" && result.risk >= 50 ? "text-red" : "text-muted",
                    )}
                  >
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <p className="mb-1.5 flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-faint">
              <Database className="size-2.5" />
              Memory references
            </p>
            {result.memories.length === 0 ? (
              <p className="text-[10px] text-faint">No memory crossed the relevance threshold.</p>
            ) : (
              <ul className="space-y-1">
                {result.memories.map((memory) => (
                  <li key={memory.id} className="flex items-center gap-1.5 text-[10px] text-muted">
                    <span className="size-1 shrink-0 rounded-full bg-violet" />
                    <span className="truncate">{memory.title}</span>
                    <span className="ml-auto shrink-0 font-mono text-[7.5px] text-faint">imp {memory.importance}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-faint">Alternatives</p>
              <button
                type="button"
                onClick={onGenerate}
                className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.08em] text-muted transition-colors hover:text-ink"
              >
                <RefreshCcw className="size-2.5" />
                Regenerate
              </button>
            </div>
            <div className="space-y-1.5">
              {result.alternatives.map((alternative) => {
                const active = selectedText === alternative.text;
                return (
                  <button
                    key={alternative.label}
                    type="button"
                    onClick={() => onSelectText(alternative.text)}
                    aria-pressed={active}
                    className={cn(
                      "w-full rounded border px-2.5 py-2 text-left transition-colors",
                      active ? "border-accent/30 bg-accent/[0.05]" : "border-line bg-ink/[0.015] hover:border-line-strong",
                    )}
                  >
                    <span className={cn("font-mono text-[7.5px] uppercase tracking-[0.08em]", active ? "text-accent" : "text-faint")}>
                      {alternative.label}
                    </span>
                    <span className="mt-0.5 block text-[10.5px] leading-relaxed text-muted">{alternative.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-auto space-y-1.5 border-t border-line pt-2.5">
            <Button variant="accent" size="sm" className="w-full" onClick={onApprove}>
              <CheckCheck />
              Approve &amp; append to thread
            </Button>
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" className="flex-1" onClick={onGenerate}>
                <RefreshCcw />
                Try another
              </Button>
              <Button variant="ghost" size="sm" className="flex-1" onClick={onDiscard}>
                <Eraser />
                Discard
              </Button>
            </div>
            <p className="pt-0.5 text-center font-mono text-[7px] uppercase tracking-[0.06em] text-faint">
              Approving writes to this demo thread only. No message is sent.
            </p>
          </div>
        </>
      )}
    </SectionCard>
  );
}

function ConversationsView() {
  const { state, hydrated, addMessage, logActivity, clearThread } = useDemo();
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("wife");
  const [selected, setSelected] = useState<WifeId>(isWifeId(initial) ? initial : "sophia");
  const [input, setInput] = useState("");
  const [clearOpen, setClearOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<GeneratedResponse | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const [variant, setVariant] = useState(0);
  const timers = useRef<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wife = state.wives.find((item) => item.id === selected) ?? state.wives[0];
  const thread = useMemo(
    () =>
      state.messages
        .filter((message) => message.wifeId === wife.id)
        .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime()),
    [state.messages, wife.id],
  );

  const lastAi = [...thread].reverse().find((message) => message.source === "ai");

  useEffect(() => {
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [thread.length, wife.id]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  const resetSimulation = () => {
    clearTimers();
    setPhase("idle");
    setStage(0);
    setResult(null);
    setSelectedText("");
  };

  const select = (id: WifeId) => {
    if (id === wife.id) return;
    resetSimulation();
    setSelected(id);
    setInput("");
    setVariant(0);
    router.replace(`/dashboard/conversations?wife=${id}`, { scroll: false });
  };

  const generate = () => {
    const text = input.trim();
    if (!text) {
      toast.error("Write what you would say first.");
      return;
    }
    const nextVariant = variant + 1;
    const generated = generateResponse({
      wife,
      memories: state.memories,
      history: thread,
      text,
      variantSeed: nextVariant,
    });
    const reduced =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const stepDelay = reduced ? 50 : 280;

    clearTimers();
    setVariant(nextVariant);
    setPhase("running");
    setStage(0);
    setResult(null);
    setSelectedText("");

    timers.current = [
      window.setTimeout(() => setStage(1), stepDelay),
      window.setTimeout(() => setStage(2), stepDelay * 2),
      window.setTimeout(() => setStage(3), stepDelay * 3),
      window.setTimeout(
        () => {
          setResult(generated);
          setSelectedText(generated.text);
          setPhase("ready");
        },
        stepDelay * 3 + (reduced ? 40 : 220),
      ),
    ];
  };

  const approve = () => {
    if (!result) return;
    const commanderText = input.trim();
    if (!commanderText) {
      toast.error("The commander message is empty.");
      return;
    }
    addMessage(wife.id, { role: "user", text: commanderText, source: "user" });
    addMessage(wife.id, {
      role: "wife",
      text: selectedText || result.text,
      source: "ai",
      sentiment: result.sentiment,
      memoryRefs: result.memories.map((memory) => memory.id),
    });
    logActivity({
      wifeId: wife.id,
      kind: "message",
      title: "Simulated exchange committed",
      detail: `${wife.code} · confidence ${result.confidence}% · local thread only`,
      tone: "ok",
    });
    toast.success("Appended to the local thread. Nothing was sent externally.");
    resetSimulation();
    setInput("");
    window.setTimeout(() => textareaRef.current?.focus(), 0);
  };

  if (!hydrated) return <DashboardSkeleton />;

  return (
    <div className="space-y-4">
      <PageHeader
        kicker="Conversation simulator · no external sends"
        title="Say it here before you say it there."
        description="Each thread is a sealed namespace. Write what you intend to say, inspect the predicted reply, then decide whether it goes anywhere. It does not."
        actions={
          <>
            <StatusChip label="Drafting paused · incident 0847" tone="danger" />
            <Button variant="outline" size="sm" onClick={() => setClearOpen(true)} disabled={thread.length === 0}>
              <Eraser />
              Clear thread
            </Button>
          </>
        }
      />

      <div className="grid gap-3 xl:grid-cols-12">
        <div className="xl:col-span-3">
          <ThreadRail selected={wife.id} onSelect={select} />
        </div>

        <div className="xl:col-span-5">
          <section className="panel flex h-[560px] flex-col overflow-hidden">
            <header className="flex items-center gap-2.5 border-b border-line px-3.5 py-2.5">
              <IdentityAvatar wife={wife} size={32} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-[12px] text-ink">{wife.name}</p>
                  <StatusPill status={wife.status} className="px-1.5 py-px text-[7.5px]" showDot={false} />
                </div>
                <p className="truncate font-mono text-[7.5px] uppercase tracking-[0.06em] text-faint">
                  ns.{wife.id}.v2 · {thread.length} messages
                </p>
              </div>
              <span className="flex items-center gap-1 font-mono text-[7.5px] uppercase tracking-[0.06em] text-green">
                <span className="status-dot" />
                isolated
              </span>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3.5 py-4 slim-scroll">
              {thread.length === 0 ? (
                <EmptyState
                  icon={MessagesSquare}
                  title="No messages in this context"
                  description="The thread is empty. Use a scenario on the right, or write the first line below."
                  action={
                    <Button variant="outline" size="sm" onClick={() => setInput(STARTER_PROMPTS[wife.id][0])}>
                      Use a starter line
                    </Button>
                  }
                />
              ) : (
                thread.map((message) => <MessageBubble key={message.id} message={message} wifeName={wife.name} />)
              )}
            </div>

            <div className="border-t border-line bg-[#ffffff] p-2.5">
              <div className="rounded-md border border-line bg-ink/[0.02] focus-within:border-line-strong">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                      event.preventDefault();
                      generate();
                    }
                  }}
                  placeholder={`What would you say to ${wife.name}?`}
                  aria-label={`Message to ${wife.name}`}
                  className="min-h-[64px] border-0 bg-transparent focus-visible:ring-0"
                />
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-2 py-1.5">
                  <span className="flex items-center gap-1 font-mono text-[7.5px] uppercase tracking-[0.06em] text-faint">
                    <CornerDownLeft className="size-2.5" />⌘ + enter to simulate
                  </span>
                  <Button variant="accent" size="sm" disabled={!input.trim()} onClick={generate} className="h-7">
                    <Sparkles />
                    Generate reply
                  </Button>
                </div>
              </div>
              <p className="mt-1.5 text-center font-mono text-[7px] uppercase tracking-[0.06em] text-faint">
                Generated text is a prediction, not a message from a real person
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-3 xl:col-span-4">
          <SimulatorPanel
            key={wife.id}
            wifeId={wife.id}
            phase={phase}
            stage={stage}
            result={result}
            selectedText={selectedText}
            variant={variant}
            onUsePrompt={(prompt) => {
              setInput(prompt);
              toast.message("Scenario loaded. Generate the predicted reply when ready.");
            }}
            onGenerate={generate}
            onSelectText={setSelectedText}
            onApprove={approve}
            onDiscard={resetSimulation}
          />

          <SectionCard kicker="Last simulation" title="Thread telemetry" action={<Gauge className="size-3.5 text-faint" />}>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded border border-line bg-line">
              {[
                { label: "Messages", value: String(thread.length) },
                { label: "AI generated", value: String(thread.filter((message) => message.source === "ai").length) },
                {
                  label: "Last confidence",
                  value: lastAi ? `${Math.round(80 + (wife.health % 13))}%` : "—",
                },
                {
                  label: "Coverage",
                  value: `${state.analytics.coverage.find((item) => item.wifeId === wife.id)?.value ?? 0}%`,
                },
              ].map((item) => (
                <div key={item.label} className="bg-[#ffffff] px-2.5 py-2">
                  <p className="font-mono text-[7px] uppercase tracking-[0.06em] text-faint">{item.label}</p>
                  <p className="font-mono text-[11px] tabular-nums text-ink">{item.value}</p>
                </div>
              ))}
            </div>
            <p className="mt-2.5 font-mono text-[7.5px] uppercase leading-relaxed tracking-[0.06em] text-faint">
              {wife.code} · emotional state {wife.status} · latency target 400ms
            </p>
          </SectionCard>
        </div>
      </div>

      <p className="pb-2 text-center font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-faint">
        Fictional profiles · deterministic local model · no external integrations · nothing is sent
      </p>

      <Dialog open={clearOpen} onOpenChange={setClearOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle>Clear this thread?</DialogTitle>
          <DialogDescription>
            Every message in {wife.name}&apos;s namespace will be deleted from local storage. The memory vault is not
            affected. This cannot be undone.
          </DialogDescription>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setClearOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                clearThread(wife.id);
                resetSimulation();
                setClearOpen(false);
                toast.success(`${wife.name}'s thread cleared.`);
              }}
            >
              <Eraser />
              Clear thread
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ConversationsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <ConversationsView />
    </Suspense>
  );
}
