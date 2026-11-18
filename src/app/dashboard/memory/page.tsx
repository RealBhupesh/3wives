"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import {
  Database,
  Fingerprint,
  Lock,
  Plus,
  Search,
  SearchX,
  ShieldCheck,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import type { Memory, MemoryKind, WifeId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { IdentityAvatar } from "@/components/brand/identity-avatar";
import { DashboardSkeleton, EmptyState, SectionCard } from "@/components/dashboard/primitives";
import { PageHeader, StatusChip } from "@/components/dashboard/chrome";
import { Button } from "@/components/ui/button";
import { Input, Label, NativeSelect, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/controls";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const WIFE_IDS: WifeId[] = ["sophia", "olivia", "isabella"];

const KIND_META: Record<MemoryKind, { label: string; className: string; bar: string }> = {
  preference: { label: "Preference", className: "border-violet/25 bg-violet/[0.07] text-violet", bar: "bg-violet" },
  milestone: { label: "Milestone", className: "border-accent/25 bg-accent/[0.07] text-accent", bar: "bg-accent" },
  sensitive: { label: "Sensitive", className: "border-red/25 bg-red/[0.07] text-red", bar: "bg-red" },
  logistics: { label: "Logistics", className: "border-[#5b8def]/25 bg-[#5b8def]/[0.07] text-[#8fb2ff]", bar: "bg-[#5b8def]" },
  gift: { label: "Gift", className: "border-green/25 bg-green/[0.07] text-green", bar: "bg-green" },
};

function isWifeId(value: string | null): value is WifeId {
  return value !== null && (WIFE_IDS as string[]).includes(value);
}

function ImportanceMeter({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Importance ${value} of 5`}>
      {[1, 2, 3, 4, 5].map((step) => (
        <span
          key={step}
          className={cn(
            "h-[9px] w-[2.5px] rounded-full",
            step <= value
              ? value >= 5
                ? "bg-accent"
                : value >= 4
                  ? "bg-violet"
                  : "bg-muted"
              : "bg-white/[0.08]",
          )}
        />
      ))}
    </span>
  );
}

function AddMemoryDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { addMemory, logActivity } = useDemo();
  const [wifeId, setWifeId] = useState<WifeId>("sophia");
  const [kind, setKind] = useState<MemoryKind>("preference");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [importance, setImportance] = useState("3");
  const [pinned, setPinned] = useState(false);

  const reset = () => {
    setWifeId("sophia");
    setKind("preference");
    setTitle("");
    setDetail("");
    setImportance("3");
    setPinned(false);
  };

  const submit = () => {
    if (!title.trim() || !detail.trim()) {
      toast.error("A title and detail are required.");
      return;
    }
    addMemory({
      wifeId,
      kind,
      title: title.trim(),
      detail: detail.trim(),
      importance: Number(importance) as Memory["importance"],
      source: "manual",
      pinned,
    });
    logActivity({
      wifeId,
      kind: "memory",
      title: "Manual memory committed",
      detail: `${title.trim()} · importance ${importance}`,
      tone: "ok",
    });
    toast.success("Vector written to the local namespace.");
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogTitle>Write a memory vector</DialogTitle>
        <DialogDescription>
          Manual entries are stored exactly as written. The model treats pinned vectors as non-negotiable context.
        </DialogDescription>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="mem-wife">Namespace</Label>
            <NativeSelect id="mem-wife" value={wifeId} onChange={(event) => setWifeId(event.target.value as WifeId)}>
              {WIFE_IDS.map((id) => (
                <option key={id} value={id}>
                  ns.{id}.v2
                </option>
              ))}
            </NativeSelect>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mem-kind">Classification</Label>
            <NativeSelect id="mem-kind" value={kind} onChange={(event) => setKind(event.target.value as MemoryKind)}>
              {(Object.keys(KIND_META) as MemoryKind[]).map((value) => (
                <option key={value} value={value}>
                  {KIND_META[value].label}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="mem-title">Title</Label>
            <Input
              id="mem-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="The detail you are not allowed to forget"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="mem-detail">Detail</Label>
            <Textarea
              id="mem-detail"
              value={detail}
              onChange={(event) => setDetail(event.target.value)}
              placeholder="What happened, what it means, and how it should change behavior."
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mem-importance">Importance</Label>
            <NativeSelect
              id="mem-importance"
              value={importance}
              onChange={(event) => setImportance(event.target.value)}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value} · {value === 5 ? "critical" : value === 4 ? "high" : value === 3 ? "standard" : "low"}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div className="flex items-end">
            <label className="flex w-full items-center justify-between rounded-md border border-line bg-white/[0.02] px-3 py-2">
              <span className="flex items-center gap-1.5 text-[11px] text-muted">
                <Star className="size-3 text-accent" />
                Pin to context
              </span>
              <Switch checked={pinned} onCheckedChange={setPinned} aria-label="Pin memory" />
            </label>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="accent" onClick={submit}>
            <Plus />
            Write vector
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MemoryVaultView() {
  const { state, hydrated, removeMemory } = useDemo();
  const params = useSearchParams();
  const initial = params.get("wife");
  const [query, setQuery] = useState("");
  const [wifeFilter, setWifeFilter] = useState<WifeId | "all">(isWifeId(initial) ? initial : "all");
  const [kindFilter, setKindFilter] = useState<MemoryKind | "all">("all");
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Memory | null>(null);

  const wifeMap = useMemo(() => Object.fromEntries(state.wives.map((wife) => [wife.id, wife])), [state.wives]);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    return state.memories
      .filter((memory) => (wifeFilter === "all" ? true : memory.wifeId === wifeFilter))
      .filter((memory) => (kindFilter === "all" ? true : memory.kind === kindFilter))
      .filter((memory) =>
        value ? `${memory.title} ${memory.detail} ${memory.kind}`.toLowerCase().includes(value) : true,
      )
      .sort(
        (a, b) =>
          Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) ||
          b.importance - a.importance ||
          new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime(),
      );
  }, [state.memories, wifeFilter, kindFilter, query]);

  const filteredOut = filtered.length !== state.memories.length;
  const clearFilters = () => {
    setQuery("");
    setWifeFilter("all");
    setKindFilter("all");
  };

  if (!hydrated) return <DashboardSkeleton />;

  return (
    <div className="space-y-4">
      <PageHeader
        kicker="Memory vault · 3 sealed namespaces"
        title="Nothing is forgotten. Nothing is shared."
        description="Every remembered detail lives in exactly one namespace. Retrieval is scoped at the storage layer, so a cross-context question returns nothing rather than the wrong thing."
        actions={
          <>
            <StatusChip label={`${state.memories.length} vectors · 0 cross-reads`} />
            <Button variant="accent" size="sm" onClick={() => setAddOpen(true)}>
              <Plus />
              Add memory
            </Button>
          </>
        }
      />

      <div className="grid gap-2 sm:grid-cols-3">
        {state.wives.map((wife) => {
          const memories = state.memories.filter((memory) => memory.wifeId === wife.id);
          const pinned = memories.filter((memory) => memory.pinned).length;
          const last = memories
            .map((memory) => new Date(memory.lastAccessed).getTime())
            .sort((a, b) => b - a)[0];
          return (
            <div key={wife.id} className="panel relative overflow-hidden p-3">
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: `linear-gradient(90deg, ${wife.palette.from}, transparent 75%)` }}
              />
              <div className="flex items-center gap-2.5">
                <IdentityAvatar wife={wife} size={30} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11.5px] text-ink">
                    {wife.name} <span className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-faint">{wife.code}</span>
                  </p>
                  <p className="font-mono text-[7.5px] uppercase tracking-[0.06em] text-faint">ns.{wife.id}.v2</p>
                </div>
                <Lock className="size-3 text-green" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-3">
                <span className="font-mono text-[18px] leading-none tabular-nums text-ink">{memories.length}</span>
                <span className="font-mono text-[7.5px] uppercase tracking-[0.06em] text-faint">vectors</span>
                <span className="ml-auto font-mono text-[8px] tabular-nums text-muted">{pinned} pinned</span>
              </div>
              <p className="mt-1.5 font-mono text-[7.5px] uppercase tracking-[0.05em] text-faint">
                last write {last ? formatDistanceToNowStrict(new Date(last), { addSuffix: true }) : "never"}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 xl:grid-cols-12">
        <div className="space-y-3 xl:col-span-8">
          <section className="panel">
            <div className="flex flex-col gap-2.5 border-b border-line p-3 md:flex-row md:items-center">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-faint" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search titles, details, classifications…"
                  aria-label="Search memory vault"
                  className="h-8 pl-8 text-[12px]"
                />
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <div className="flex rounded-md border border-line p-0.5">
                  {(["all", ...WIFE_IDS] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setWifeFilter(value)}
                      aria-pressed={wifeFilter === value}
                      className={cn(
                        "rounded px-2 py-1 font-mono text-[8px] uppercase tracking-[0.06em] transition-colors",
                        wifeFilter === value ? "bg-white/[0.08] text-ink" : "text-faint hover:text-muted",
                      )}
                    >
                      {value === "all" ? "All" : wifeMap[value]?.name ?? value}
                    </button>
                  ))}
                </div>
                <NativeSelect
                  value={kindFilter}
                  onChange={(event) => setKindFilter(event.target.value as MemoryKind | "all")}
                  aria-label="Filter by classification"
                  className="h-8 w-[132px] text-[11px]"
                >
                  <option value="all">All classes</option>
                  {(Object.keys(KIND_META) as MemoryKind[]).map((value) => (
                    <option key={value} value={value}>
                      {KIND_META[value].label}
                    </option>
                  ))}
                </NativeSelect>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-line px-3 py-1.5 font-mono text-[7.5px] uppercase tracking-[0.08em] text-faint">
              <span>
                {filtered.length} of {state.memories.length} vectors
              </span>
              <span className="flex items-center gap-1 text-green">
                <ShieldCheck className="size-2.5" />
                read scope · {wifeFilter === "all" ? "union denied" : `ns.${wifeFilter}.v2`}
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  icon={SearchX}
                  title="No vectors match the query"
                  description="Nothing in the vault matches these filters. The absence itself is informative."
                  action={
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  }
                />
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {filtered.map((memory) => {
                  const wife = wifeMap[memory.wifeId];
                  const meta = KIND_META[memory.kind];
                  return (
                    <li key={memory.id} className="group px-3 py-2.5 transition-colors hover:bg-white/[0.015]">
                      <div className="flex items-start gap-2.5">
                        <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded border border-line bg-white/[0.02]">
                          <ImportanceMeter value={memory.importance} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="truncate text-[12px] text-ink">{memory.title}</p>
                            {memory.pinned && (
                              <Star className="size-2.5 shrink-0 fill-accent/20 text-accent" aria-label="Pinned" />
                            )}
                            <span className={cn("rounded border px-1.5 py-px font-mono text-[7px] uppercase tracking-[0.06em]", meta.className)}>
                              {meta.label}
                            </span>
                            <span className="font-mono text-[7px] uppercase tracking-[0.05em] text-faint">{memory.source}</span>
                          </div>
                          <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted">{memory.detail}</p>
                          <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.05em] text-faint">
                            {wife?.name} · {memory.namespace} · accessed{" "}
                            {formatDistanceToNowStrict(new Date(memory.lastAccessed), { addSuffix: true })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="iconSm"
                          aria-label={`Delete memory: ${memory.title}`}
                          className="text-faint opacity-100 transition-opacity hover:text-red md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                          onClick={() => setDeleteTarget(memory)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {filteredOut && (
            <p className="font-mono text-[8px] uppercase tracking-[0.06em] text-faint">
              Filtered view · the vault itself is unchanged · {state.memories.length - filtered.length} vectors hidden
            </p>
          )}
        </div>

        <div className="space-y-3 xl:col-span-4">
          <SectionCard kicker="Isolation matrix" title="Who can read what" action={<Fingerprint className="size-3.5 text-green" />}>
            <div className="overflow-hidden rounded border border-line">
              <div className="grid grid-cols-4 gap-px bg-line">
                <div className="bg-[#0b0c12] px-2 py-1.5 font-mono text-[7px] uppercase tracking-[0.06em] text-faint">
                  reader ↓
                </div>
                {state.wives.map((wife) => (
                  <div key={wife.id} className="bg-[#0b0c12] px-1.5 py-1.5 text-center font-mono text-[7px] uppercase tracking-[0.04em] text-faint">
                    {wife.name.slice(0, 3)}
                  </div>
                ))}
                {state.wives.map((reader) => (
                  <div key={`row-${reader.id}`} className="contents">
                    <div className="bg-[#0b0c12] px-2 py-2 font-mono text-[7px] uppercase tracking-[0.04em] text-muted">
                      {reader.name.slice(0, 3)}
                    </div>
                    {state.wives.map((owner) => {
                      const self = reader.id === owner.id;
                      return (
                        <div
                          key={`${reader.id}-${owner.id}`}
                          className={cn(
                            "flex items-center justify-center py-2 font-mono text-[8px]",
                            self ? "bg-green/[0.06] text-green" : "bg-red/[0.025] text-faint",
                          )}
                        >
                          {self ? "self" : <Lock className="size-2.5 text-red/50" />}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-2.5 font-mono text-[7.5px] uppercase leading-relaxed tracking-[0.05em] text-faint">
              Off-diagonal cells are blocked at the storage layer. There is no prompt-level override.
            </p>
            <div className="mt-3 space-y-1.5 border-t border-line pt-2.5">
              {[
                ["Cross-context reads", "0"],
                ["Namespaces online", "3 / 3"],
                ["Audit ledger", "sealed"],
                ["Training on memory", "disabled"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.05em]">
                  <span className="text-faint">{label}</span>
                  <span className={value === "0" || value === "sealed" ? "text-green" : "text-muted"}>{value}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard kicker="Classification" title="Vector distribution">
            <div className="space-y-2">
              {(Object.keys(KIND_META) as MemoryKind[]).map((kind) => {
                const count = state.memories.filter((memory) => memory.kind === kind).length;
                const percentage = Math.round((count / Math.max(state.memories.length, 1)) * 100);
                return (
                  <div key={kind}>
                    <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.05em]">
                      <span className="text-muted">{KIND_META[kind].label}</span>
                      <span className="tabular-nums text-faint">
                        {count} · {percentage}%
                      </span>
                    </div>
                    <div className="mt-1 h-[3px] overflow-hidden rounded-full bg-white/[0.06]">
                      <div className={cn("h-full rounded-full", KIND_META[kind].bar)} style={{ width: `${Math.max(percentage, 2)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 border-t border-line pt-2.5 text-[10px] leading-relaxed text-faint">
              Sensitive vectors are excluded from generated small talk, regardless of relevance score.
            </p>
          </SectionCard>

          <div className="rounded-md border border-line bg-white/[0.015] p-3">
            <p className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-faint">
              <Database className="size-3" />
              storage layer
            </p>
            <p className="mt-1.5 font-mono text-[8px] uppercase leading-relaxed tracking-[0.05em] text-muted">
              local browser storage · AES not claimed · demo data only
            </p>
          </div>
        </div>
      </div>

      <p className="pb-2 text-center font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-faint">
        Fictional memories · persisted locally · no external systems · deleting a vector does not notify anyone
      </p>

      <AddMemoryDialog open={addOpen} onOpenChange={setAddOpen} />

      <Dialog open={deleteTarget !== null} onOpenChange={(value) => !value && setDeleteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogTitle>Delete this vector?</DialogTitle>
          <DialogDescription>
            “{deleteTarget?.title}” will be removed from {deleteTarget ? `ns.${deleteTarget.wifeId}.v2` : "its namespace"}.
            The model will no longer reference it in generated responses.
          </DialogDescription>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Keep it
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteTarget) {
                  removeMemory(deleteTarget.id);
                  toast.success("Vector deleted from the local namespace.");
                }
                setDeleteTarget(null);
              }}
            >
              <Trash2 />
              Delete vector
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function MemoryPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <MemoryVaultView />
    </Suspense>
  );
}
