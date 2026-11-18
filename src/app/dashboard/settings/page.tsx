"use client";

import { useMemo, useState } from "react";
import {
  BellRing,
  Database,
  Download,
  Fingerprint,
  HardDrive,
  Lock,
  RotateCcw,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { DashboardSkeleton, SectionCard } from "@/components/dashboard/primitives";
import { PageHeader, StatusChip } from "@/components/dashboard/chrome";
import { Button } from "@/components/ui/button";
import { Input, Label, NativeSelect } from "@/components/ui/input";
import { Slider, Switch } from "@/components/ui/controls";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Commander, Settings } from "@/lib/types";

const PLAN_LABEL: Record<Commander["plan"], string> = {
  monogamy: "Solo · $0",
  dual: "Duo · $19",
  triple: "Trio · $49",
  enterprise: "Enterprise · contact sales",
};

const TIMEZONES = [
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "Europe/London",
  "Europe/Madrid",
  "Asia/Tokyo",
];

function CommanderForm({ commander, greeting }: { commander: Commander; greeting: string }) {
  const { updateCommander, updateSettings } = useDemo();
  const [name, setName] = useState(commander.name);
  const [email, setEmail] = useState(commander.email);
  const [plan, setPlan] = useState<Commander["plan"]>(commander.plan);
  const [timezone, setTimezone] = useState(commander.timezone);
  const [greetingDraft, setGreetingDraft] = useState(greeting);

  const save = () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required.");
      return;
    }
    updateCommander({
      name: name.trim(),
      email: email.trim(),
      plan,
      timezone,
    });
    updateSettings({ greeting: greetingDraft.trim() || "Good evening, Commander." });
    toast.success("Commander profile saved to this browser.");
  };

  return (
    <SectionCard
      kicker="Commander identity"
      title="The only person who approves anything"
      action={
        <Button variant="accent" size="sm" onClick={save}>
          <Save />
          Save profile
        </Button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="cmd-name">Name</Label>
          <Input id="cmd-name" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cmd-email">Email</Label>
          <Input id="cmd-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cmd-plan">Plan</Label>
          <NativeSelect id="cmd-plan" value={plan} onChange={(event) => setPlan(event.target.value as Commander["plan"])}>
            {(Object.keys(PLAN_LABEL) as Commander["plan"][]).map((value) => (
              <option key={value} value={value}>
                {PLAN_LABEL[value]}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cmd-timezone">Timezone</Label>
          <NativeSelect id="cmd-timezone" value={timezone} onChange={(event) => setTimezone(event.target.value)}>
            {TIMEZONES.map((value) => (
              <option key={value} value={value}>
                {value.replace("_", " ")}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="cmd-greeting">Command center greeting</Label>
          <Input
            id="cmd-greeting"
            value={greetingDraft}
            onChange={(event) => setGreetingDraft(event.target.value)}
            placeholder="Good evening, Commander."
          />
        </div>
      </div>
      <p className="mt-3 border-t border-line pt-2.5 font-mono text-[8px] uppercase leading-relaxed tracking-[0.06em] text-faint">
        Profile changes persist locally · no account is created · no email is sent
      </p>
    </SectionCard>
  );
}

function EngineTuning() {
  const { state, updateSettings } = useDemo();
  const { settings } = state;

  const rows: Array<{
    key: keyof Pick<Settings, "toneMirroring" | "emojiFidelity" | "latencyTarget">;
    label: string;
    description: string;
    min: number;
    max: number;
    step: number;
    format: (value: number) => string;
  }> = [
    {
      key: "toneMirroring",
      label: "Tone mirroring",
      description: "How closely generated text follows the stored voice fingerprint.",
      min: 50,
      max: 100,
      step: 1,
      format: (value) => `${value}%`,
    },
    {
      key: "emojiFidelity",
      label: "Emoji fidelity",
      description: "Permitted reliance on each context's observed emoji habits.",
      min: 0,
      max: 100,
      step: 1,
      format: (value) => `${value}%`,
    },
    {
      key: "latencyTarget",
      label: "Latency target",
      description: "Internal target for local inference. Exceeding it raises an operational warning.",
      min: 200,
      max: 900,
      step: 25,
      format: (value) => `${value}ms`,
    },
  ];

  return (
    <SectionCard kicker="Voice engine" title="Tuning, not pretending" action={<SlidersHorizontal className="size-3.5 text-faint" />}>
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.key}>
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <p className="text-[11.5px] text-ink">{row.label}</p>
                <p className="mt-0.5 text-[9.5px] leading-relaxed text-faint">{row.description}</p>
              </div>
              <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted">{row.format(settings[row.key])}</span>
            </div>
            <Slider
              className="mt-2"
              value={[settings[row.key]]}
              min={row.min}
              max={row.max}
              step={row.step}
              onValueChange={(values) => updateSettings({ [row.key]: values[0] ?? settings[row.key] })}
              aria-label={row.label}
            />
          </div>
        ))}
      </div>
      <p className="mt-3 border-t border-line pt-2.5 font-mono text-[8px] uppercase leading-relaxed tracking-[0.06em] text-faint">
        Adjustments apply immediately and are stored locally
      </p>
    </SectionCard>
  );
}

function BehaviorToggles() {
  const { state, updateSettings } = useDemo();
  const { settings } = state;

  const toggles: Array<{
    key: keyof Pick<Settings, "autoDraft" | "collisionAlerts" | "emotionalAlerts" | "giftAlerts">;
    label: string;
    description: string;
  }> = [
    {
      key: "autoDraft",
      label: "Prepare drafts automatically",
      description: "Inference may prepare a reply before it is requested. Sending always requires approval.",
    },
    {
      key: "collisionAlerts",
      label: "Collision alerts",
      description: "Raise an incident when two contexts claim the same hour.",
    },
    {
      key: "emotionalAlerts",
      label: "Emotional threshold alerts",
      description: "Surface a recovery protocol when emotional debt crosses 50.",
    },
    {
      key: "giftAlerts",
      label: "Gift procurement alerts",
      description: "Warn before a purchase would exceed the current envelope.",
    },
  ];

  return (
    <SectionCard kicker="Behavior" title="What the system may do on its own" action={<BellRing className="size-3.5 text-faint" />}>
      <ul className="divide-y divide-line">
        {toggles.map((toggle) => (
          <li key={toggle.key} className="flex items-start justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="text-[11.5px] text-ink">{toggle.label}</p>
              <p className="mt-0.5 text-[9.5px] leading-relaxed text-faint">{toggle.description}</p>
            </div>
            <Switch
              checked={settings[toggle.key]}
              onCheckedChange={(checked) => updateSettings({ [toggle.key]: checked })}
              aria-label={toggle.label}
            />
          </li>
        ))}
        <li className="flex items-start justify-between gap-4 py-2.5">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[11.5px] text-ink">
              Strict context isolation
              <Lock className="size-2.5 text-green" />
            </p>
            <p className="mt-0.5 text-[9.5px] leading-relaxed text-faint">
              Cross-namespace reads are blocked below the model. This control is not optional in any plan.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded border border-green/20 bg-green/[0.04] px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.06em] text-green">
              enforced
            </span>
            <Switch checked disabled aria-label="Strict context isolation is enforced" />
          </div>
        </li>
      </ul>
    </SectionCard>
  );
}

export default function SettingsPage() {
  const { state, hydrated, exportDemo, resetDemo } = useDemo();
  const [resetOpen, setResetOpen] = useState(false);

  const storage = useMemo(() => {
    const bytes = new Blob([JSON.stringify(state)]).size;
    return { bytes, kb: (bytes / 1024).toFixed(1), percent: Math.min((bytes / (5 * 1024 * 1024)) * 100, 100) };
  }, [state]);

  const download = () => {
    const blob = new Blob([exportDemo()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `3wives-demo-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Demo state exported. The file stays on this device.");
  };

  if (!hydrated) return <DashboardSkeleton />;

  return (
    <div className="space-y-4">
      <PageHeader
        kicker="Settings · local workspace"
        title="The commander's controls."
        description="Identity, inference posture and data ownership. Nothing here creates an account, contacts a server, or changes a real relationship."
        actions={
          <>
            <StatusChip label="Local storage only" />
            <Button variant="outline" size="sm" onClick={download}>
              <Download />
              Export JSON
            </Button>
            <Button variant="dangerOutline" size="sm" onClick={() => setResetOpen(true)}>
              <RotateCcw />
              Reset demo
            </Button>
          </>
        }
      />

      <div className="grid gap-3 xl:grid-cols-12">
        <div className="space-y-3 xl:col-span-8">
          <CommanderForm key={state.startedAt} commander={state.commander} greeting={state.settings.greeting} />
          <EngineTuning />
          <BehaviorToggles />
        </div>

        <div className="space-y-3 xl:col-span-4">
          <SectionCard kicker="Workspace" title="What is actually running" action={<UserRound className="size-3.5 text-faint" />}>
            <div className="flex items-center gap-2.5 rounded border border-line bg-ink/[0.02] p-2.5">
              <span className="flex size-9 items-center justify-center rounded-full border border-accent/25 bg-accent/[0.08] font-mono text-[11px] text-accent">
                CM
              </span>
              <div className="min-w-0">
                <p className="truncate text-[11.5px] text-ink">{state.commander.name}</p>
                <p className="truncate font-mono text-[8px] uppercase tracking-[0.06em] text-faint">{state.commander.email}</p>
              </div>
            </div>
            <dl className="mt-2.5 space-y-1.5">
              {[
                ["Plan", PLAN_LABEL[state.commander.plan]],
                ["Contexts", "3 / 3 online"],
                ["Timezone", state.commander.timezone],
                ["Members", "1 commander"],
                ["Model", "voice.twin.v6"],
                ["Demo version", `v2.4.1 · state ${state.version}`],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 font-mono text-[8px] uppercase tracking-[0.05em]">
                  <dt className="text-faint">{label}</dt>
                  <dd className="truncate text-right text-muted">{value}</dd>
                </div>
              ))}
            </dl>
          </SectionCard>

          <SectionCard kicker="Data ownership" title="Local, portable, disposable" action={<HardDrive className="size-3.5 text-faint" />}>
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-[7.5px] uppercase tracking-[0.06em] text-faint">browser storage used</p>
              <p className="font-mono text-[10px] tabular-nums text-ink">{storage.kb} KB</p>
            </div>
            <div className="mt-1.5 h-[4px] overflow-hidden rounded-full bg-ink/[0.06]">
              <div
                className="h-full rounded-full bg-accent transition-all duration-700"
                style={{ width: `${Math.max(storage.percent, 1.5)}%` }}
              />
            </div>
            <p className="mt-1.5 font-mono text-[7px] uppercase tracking-[0.05em] text-faint">
              {storage.percent.toFixed(1)}% of a nominal 5 MB budget · no server copy exists
            </p>
            <div className="mt-3 grid gap-1.5">
              <Button variant="outline" size="sm" className="justify-start" onClick={download}>
                <Download />
                Download the full state as JSON
              </Button>
              <Button variant="ghost" size="sm" className="justify-start text-red hover:text-red" onClick={() => setResetOpen(true)}>
                <Trash2 />
                Delete local state and reseed
              </Button>
            </div>
          </SectionCard>

          <SectionCard kicker="Disclosure" title="What this is not" action={<ShieldCheck className="size-3.5 text-green" />}>
            <ul className="space-y-2">
              {[
                "The three profiles are fictional and generated for demonstration.",
                "No external messaging, calendar, payment or gift service is connected.",
                "No message is sent anywhere. Approvals only change local state.",
                "The inference model is deterministic and runs in this browser.",
                "The portraits are code-drawn identity prints, not photographs.",
                "No account, subscription or payment method is created.",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <span className="mt-1 size-1 shrink-0 rounded-full bg-green/70" />
                  <span className="text-[9.5px] leading-relaxed text-muted">{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-2.5 font-mono text-[7px] uppercase leading-relaxed tracking-[0.05em] text-faint">
              <Sparkles className="size-2.5 text-violet" />
              a demonstration of relationship infrastructure, not a service
            </div>
          </SectionCard>

          <div className="rounded-md border border-line bg-ink/[0.015] p-3">
            <p className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.08em] text-faint">
              <Fingerprint className="size-3" />
              isolation attestation
            </p>
            <p className="mt-1.5 font-mono text-[7.5px] uppercase leading-relaxed tracking-[0.05em] text-muted">
              3 namespaces · 0 cross-reads · 0 external writes · audit ledger sealed
            </p>
            <p className="mt-1 flex items-center gap-1 font-mono text-[7px] uppercase tracking-[0.05em] text-green">
              <Database className="size-2.5" />
              last local write on every change
            </p>
          </div>
        </div>
      </div>

      <p className="pb-2 text-center font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-faint">
        Demonstration environment · fictional profiles · local persistence · no external integrations
      </p>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle className={cn("flex items-center gap-2")}>
            <RotateCcw className="size-4 text-red" />
            Reset the demonstration?
          </DialogTitle>
          <DialogDescription>
            Profiles, threads, memories, calendar edits, gift approvals and incident timelines return to their seeded
            state. The data in this browser is deleted. Nothing outside this browser is affected.
          </DialogDescription>
          <div className="rounded-md border border-amber/20 bg-amber/[0.04] p-2.5 font-mono text-[8px] uppercase leading-relaxed tracking-[0.06em] text-amber">
            This cannot be undone · export first if you want a copy
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <Button variant="ghost" onClick={() => setResetOpen(false)}>
              Cancel
            </Button>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => {
                  download();
                  setResetOpen(false);
                }}
              >
                <Download />
                Export first
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  resetDemo();
                  setResetOpen(false);
                  toast.success("Demo state deleted and reseeded.");
                }}
              >
                <Trash2 />
                Reset everything
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
