"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Database,
  Fingerprint,
  HeartPulse,
  Landmark,
  Lock,
  MapPin,
  Quote,
  Save,
  Sparkles,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import type { Wife, WifeId } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { IdentityAvatar } from "@/components/brand/identity-avatar";
import { StatusPill, STATUS_META } from "@/components/brand/status";
import { DashboardSkeleton, SectionCard } from "@/components/dashboard/primitives";
import { PageHeader, StatusChip } from "@/components/dashboard/chrome";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Progress } from "@/components/ui/controls";

const WIFE_IDS: WifeId[] = ["sophia", "olivia", "isabella"];

function isWifeId(value: string | null): value is WifeId {
  return value !== null && (WIFE_IDS as string[]).includes(value);
}

function toDateInput(value: string) {
  return format(new Date(value), "yyyy-MM-dd");
}

function toIso(value: string) {
  return new Date(`${value}T12:00:00`).toISOString();
}

function WifeSelector({
  wives,
  selected,
  onSelect,
}: {
  wives: Wife[];
  selected: WifeId;
  onSelect: (id: WifeId) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3" role="tablist" aria-label="Select relationship">
      {wives.map((wife) => {
        const active = wife.id === selected;
        return (
          <button
            key={wife.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(wife.id)}
            className={cn(
              "panel group flex items-center gap-3 p-3 text-left transition-colors",
              active ? "border-line-strong bg-ink/[0.04]" : "hover:border-line-strong",
            )}
          >
            <IdentityAvatar wife={wife} size={38} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-[13px] text-ink">{wife.name}</span>
                <span className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-faint">{wife.code}</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-ink/[0.06]">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${wife.health}%`,
                      background: STATUS_META[wife.status].color,
                    }}
                  />
                </span>
                <span className="font-mono text-[9px] tabular-nums" style={{ color: STATUS_META[wife.status].color }}>
                  {wife.health}%
                </span>
              </div>
            </div>
            {active && <span className="size-1.5 shrink-0 rounded-full bg-accent" />}
          </button>
        );
      })}
    </div>
  );
}

function ProfileEditor({ wife }: { wife: Wife }) {
  const { updateWife } = useDemo();
  const [name, setName] = useState(wife.name);
  const [fullName, setFullName] = useState(wife.fullName);
  const [city, setCity] = useState(wife.city);
  const [occupation, setOccupation] = useState(wife.occupation);
  const [tone, setTone] = useState(wife.tone);
  const [tagline, setTagline] = useState(wife.tagline);
  const [voice, setVoice] = useState(wife.voice);
  const [budget, setBudget] = useState(String(wife.budget));
  const [anniversary, setAnniversary] = useState(toDateInput(wife.anniversary));
  const [birthday, setBirthday] = useState(toDateInput(wife.birthday));
  const [interests, setInterests] = useState(wife.interests.join(", "));
  const [boundaries, setBoundaries] = useState(wife.boundaries.join("\n"));

  const save = () => {
    const numericBudget = Number(budget);
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    if (!Number.isFinite(numericBudget) || numericBudget < 0) {
      toast.error("Budget must be a positive number.");
      return;
    }
    updateWife(wife.id, {
      name: name.trim(),
      fullName: fullName.trim() || name.trim(),
      city: city.trim(),
      occupation: occupation.trim(),
      tone: tone.trim(),
      tagline: tagline.trim(),
      voice: voice.trim(),
      budget: numericBudget,
      anniversary: toIso(anniversary),
      birthday: toIso(birthday),
      interests: interests
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      boundaries: boundaries
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    });
    toast.success(`${name.trim()} updated. Changes are stored in this browser.`);
  };

  return (
    <SectionCard
      kicker="Profile configuration"
      title="Identity & boundaries"
      action={
        <Button variant="accent" size="sm" onClick={save}>
          <Save />
          Save profile
        </Button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`name-${wife.id}`}>Display name</Label>
          <Input id={`name-${wife.id}`} value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`fullname-${wife.id}`}>Full name</Label>
          <Input id={`fullname-${wife.id}`} value={fullName} onChange={(event) => setFullName(event.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`city-${wife.id}`}>City</Label>
          <Input id={`city-${wife.id}`} value={city} onChange={(event) => setCity(event.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`occupation-${wife.id}`}>Occupation</Label>
          <Input
            id={`occupation-${wife.id}`}
            value={occupation}
            onChange={(event) => setOccupation(event.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`tone-${wife.id}`}>Tone profile</Label>
          <Input id={`tone-${wife.id}`} value={tone} onChange={(event) => setTone(event.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`budget-${wife.id}`}>Monthly gift budget (USD)</Label>
          <Input
            id={`budget-${wife.id}`}
            type="number"
            min={0}
            step={25}
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`anniversary-${wife.id}`}>Anniversary</Label>
          <Input
            id={`anniversary-${wife.id}`}
            type="date"
            value={anniversary}
            onChange={(event) => setAnniversary(event.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`birthday-${wife.id}`}>Birthday</Label>
          <Input
            id={`birthday-${wife.id}`}
            type="date"
            value={birthday}
            onChange={(event) => setBirthday(event.target.value)}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`tagline-${wife.id}`}>Tagline</Label>
          <Input id={`tagline-${wife.id}`} value={tagline} onChange={(event) => setTagline(event.target.value)} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`interests-${wife.id}`}>Interests · comma separated</Label>
          <Textarea
            id={`interests-${wife.id}`}
            className="min-h-[64px]"
            value={interests}
            onChange={(event) => setInterests(event.target.value)}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`boundaries-${wife.id}`}>Boundaries · one per line</Label>
          <Textarea
            id={`boundaries-${wife.id}`}
            className="min-h-[92px]"
            value={boundaries}
            onChange={(event) => setBoundaries(event.target.value)}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`voice-${wife.id}`}>Voice fingerprint</Label>
          <Textarea
            id={`voice-${wife.id}`}
            className="min-h-[76px]"
            value={voice}
            onChange={(event) => setVoice(event.target.value)}
          />
        </div>
      </div>
      <p className="mt-3 border-t border-line pt-2.5 font-mono text-[8px] uppercase leading-relaxed tracking-[0.06em] text-faint">
        Edits persist locally · they never leave this browser · no external systems are updated
      </p>
    </SectionCard>
  );
}

function RelationshipsView() {
  const { state, hydrated } = useDemo();
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("wife");
  const [selected, setSelected] = useState<WifeId>(isWifeId(initial) ? initial : "sophia");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const wife = state.wives.find((item) => item.id === selected) ?? state.wives[0];

  const memories = useMemo(
    () =>
      state.memories
        .filter((memory) => memory.wifeId === wife.id)
        .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || b.importance - a.importance)
        .slice(0, 5),
    [state.memories, wife.id],
  );

  const obligations = useMemo(() => {
    return state.events
      .filter((event) => event.wifeId === wife.id && new Date(event.start).getTime() >= now - 3_600_000)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 4);
  }, [state.events, wife.id, now]);

  const coverage = state.analytics.coverage.find((item) => item.wifeId === wife.id)?.value ?? 0;
  const attention = state.analytics.attention.find((item) => item.wifeId === wife.id)?.value ?? 0;
  const debt = state.analytics.emotionalDebt.find((item) => item.wifeId === wife.id);
  const memoryCount = state.memories.filter((memory) => memory.wifeId === wife.id).length;
  const openCollisions = state.collisions.filter(
    (collision) => collision.status === "open" && (collision.wifeA === wife.id || collision.wifeB === wife.id),
  ).length;

  const select = (id: WifeId) => {
    setSelected(id);
    router.replace(`/dashboard/relationships?wife=${id}`, { scroll: false });
  };

  if (!hydrated) return <DashboardSkeleton />;

  return (
    <div className="space-y-4">
      <PageHeader
        kicker="Relationship intelligence · 3 profiles"
        title="Three people. Three separate truths."
        description="Every profile is an isolated context with its own voice model, memory namespace and commitment ledger. Edit one without touching the others."
        actions={
          <>
            <StatusChip label="Isolation enforced" />
            <Button asChild variant="outline" size="sm">
              <a href="#profile-editor">
                Edit profile
                <ArrowUpRight />
              </a>
            </Button>
          </>
        }
      />

      <WifeSelector wives={state.wives} selected={wife.id} onSelect={select} />

      <div className="grid gap-3 xl:grid-cols-12">
        <div className="space-y-3 xl:col-span-8">
          <section className="panel relative overflow-hidden p-4 md:p-5">
            <span
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full opacity-[0.16] blur-3xl"
              style={{ background: wife.palette.from }}
            />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
              <IdentityAvatar wife={wife} size={86} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">{wife.code}</span>
                  <StatusPill status={wife.status} />
                  <span className="rounded border border-line px-1.5 py-px font-mono text-[8px] uppercase tracking-[0.08em] text-faint">
                    ns.{wife.id}.v2
                  </span>
                </div>
                <h2 className="mt-2 text-[26px] font-medium leading-none tracking-[-0.04em] text-ink">{wife.name}</h2>
                <p className="mt-1 text-[12.5px] text-muted">{wife.fullName}</p>
                <p className="mt-2 flex items-center gap-3 text-[11px] text-faint">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {wife.city}
                  </span>
                  <span className="hidden items-center gap-1 sm:flex">
                    <Landmark className="size-3" />
                    {wife.occupation}
                  </span>
                </p>
                <p className="mt-3 border-l border-line-strong pl-3 text-[13px] italic leading-relaxed text-ink/85">
                  “{wife.tagline}”
                </p>
              </div>
              <div className="grid shrink-0 grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line sm:w-[184px]">
                {[
                  { label: "Stability", value: `${wife.health}%`, color: STATUS_META[wife.status].color },
                  { label: "Coverage", value: `${coverage}%`, color: "#0b0d12" },
                  { label: "Attention", value: `${attention}%`, color: "#6e56f8" },
                  { label: "Debt", value: `${debt?.value ?? 0}`, color: (debt?.value ?? 0) >= 50 ? "#e5383b" : "#d98a00" },
                ].map((metric) => (
                  <div key={metric.label} className="bg-[#ffffff] px-3 py-2">
                    <p className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-faint">{metric.label}</p>
                    <p className="mt-0.5 font-mono text-[15px] tabular-nums" style={{ color: metric.color }}>
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-4 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-3">
              {[
                { icon: Database, label: "Memory vectors", value: String(memoryCount) },
                { icon: CalendarDays, label: "Next commitments", value: String(obligations.length) },
                {
                  icon: HeartPulse,
                  label: "Open collisions",
                  value: openCollisions ? String(openCollisions) : "None",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5 bg-[#ffffff] px-3 py-2.5">
                  <item.icon className={cn("size-3.5", openCollisions && item.label === "Open collisions" ? "text-red" : "text-faint")} />
                  <div>
                    <p className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-faint">{item.label}</p>
                    <p className="font-mono text-[12px] tabular-nums text-ink">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div id="profile-editor">
            <ProfileEditor key={wife.id} wife={wife} />
          </div>
        </div>

        <div className="space-y-3 xl:col-span-4">
          <SectionCard
            kicker="Memory highlights"
            title="What the model holds"
            action={
              <span className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.08em] text-green">
                <Lock className="size-2.5" />
                isolated
              </span>
            }
            bodyClassName="p-0"
          >
            {memories.length === 0 ? (
              <p className="px-4 py-8 text-center text-[12px] text-faint">No memories recorded for this profile.</p>
            ) : (
              <ul className="divide-y divide-line">
                {memories.map((memory) => (
                  <li key={memory.id} className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          memory.importance >= 5 ? "bg-accent" : memory.importance >= 4 ? "bg-violet" : "bg-faint",
                        )}
                      />
                      <p className="truncate text-[11.5px] text-ink">{memory.title}</p>
                      {memory.pinned && <span className="ml-auto font-mono text-[7px] uppercase text-accent">pinned</span>}
                    </div>
                    <p className="mt-0.5 line-clamp-2 pl-3.5 text-[10px] leading-relaxed text-faint">{memory.detail}</p>
                  </li>
                ))}
              </ul>
            )}
            <div className="border-t border-line px-4 py-2.5">
              <a
                href={`/dashboard/memory?wife=${wife.id}`}
                className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-ink"
              >
                Open full vault
                <ArrowUpRight className="size-3" />
              </a>
            </div>
          </SectionCard>

          <SectionCard
            kicker="Next commitments"
            title="The calendar inside this context"
            action={
              <a
                href={`/dashboard/calendar?wife=${wife.id}`}
                className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-ink"
              >
                Calendar →
              </a>
            }
            bodyClassName="p-0"
          >
            {obligations.length === 0 ? (
              <p className="px-4 py-8 text-center text-[12px] text-faint">Nothing upcoming. That will not last.</p>
            ) : (
              <ul className="divide-y divide-line">
                {obligations.map((event) => (
                  <li key={event.id} className="flex items-center gap-2.5 px-4 py-2.5">
                    <span className="flex w-8 shrink-0 flex-col items-center rounded border border-line bg-ink/[0.02] py-1">
                      <span className="font-mono text-[7px] uppercase text-faint">{format(new Date(event.start), "MMM")}</span>
                      <span className="font-mono text-[11px] leading-none tabular-nums text-ink">
                        {format(new Date(event.start), "d")}
                      </span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] text-ink">{event.title}</p>
                      <p className="truncate font-mono text-[8px] uppercase tracking-[0.05em] text-faint">
                        {format(new Date(event.start), "HH:mm")} · {event.location}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard kicker="Voice twin · v6" title="Tone & delivery" action={<Fingerprint className="size-3.5 text-violet" />}>
            <div className="rounded border border-line bg-ink/[0.018] p-3">
              <Quote className="size-3 text-faint" />
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted">{wife.voice}</p>
            </div>
            <dl className="mt-3 space-y-2">
              <div>
                <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.06em]">
                  <dt className="text-faint">Tone mirroring</dt>
                  <dd className="text-muted">{state.settings.toneMirroring}%</dd>
                </div>
                <Progress className="mt-1 h-[3px]" value={state.settings.toneMirroring} />
              </div>
              <div>
                <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.06em]">
                  <dt className="text-faint">Emoji fidelity</dt>
                  <dd className="text-muted">{state.settings.emojiFidelity}%</dd>
                </div>
                <Progress className="mt-1 h-[3px]" value={state.settings.emojiFidelity} />
              </div>
            </dl>
            <div className="mt-3 flex flex-wrap gap-1.5 border-t border-line pt-3">
              {wife.interests.slice(0, 6).map((interest) => (
                <span key={interest} className="rounded-full border border-line px-2 py-0.5 text-[9.5px] text-muted">
                  {interest}
                </span>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between rounded border border-line bg-ink/[0.015] px-2.5 py-1.5">
              <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.08em] text-faint">
                <Wallet className="size-2.5" />
                gift budget
              </span>
              <span className="font-mono text-[9.5px] tabular-nums text-ink">{formatCurrency(wife.budget)} / mo</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 font-mono text-[7.5px] uppercase tracking-[0.06em] text-faint">
              <Sparkles className="size-2.5 text-violet" />
              generated text requires commander approval
            </div>
            <div className="mt-2 flex items-center gap-1.5 font-mono text-[7.5px] uppercase tracking-[0.06em] text-green">
              <Check className="size-2.5" />
              0 cross-namespace reads · audit sealed
            </div>
          </SectionCard>
        </div>
      </div>

      <p className="pb-2 text-center font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-faint">
        Fictional profiles · changes persist in local storage only · no external integrations
      </p>
    </div>
  );
}

export default function RelationshipsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <RelationshipsView />
    </Suspense>
  );
}
