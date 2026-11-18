"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  Command,
  Database,
  Download,
  Gift,
  LayoutDashboard,
  LogOut,
  Menu,
  MessagesSquare,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  Siren,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import type { Commander } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogoMark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  short: string;
  badge?: "collisions" | "incidents" | "unread" | null;
}

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Command Center", short: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/relationships", label: "Relationship Intelligence", short: "Profiles", icon: Users },
  { href: "/dashboard/conversations", label: "Conversations", short: "Threads", icon: MessagesSquare, badge: "unread" },
  { href: "/dashboard/memory", label: "Memory Vault", short: "Memory", icon: Database },
  { href: "/dashboard/calendar", label: "Calendar & Collisions", short: "Calendar", icon: CalendarDays, badge: "collisions" },
  { href: "/dashboard/gifts", label: "Gift Intelligence", short: "Gifts", icon: Gift },
  { href: "/dashboard/incidents", label: "Incident Center", short: "Incidents", icon: Siren, badge: "incidents" },
  { href: "/dashboard/settings", label: "Settings", short: "Settings", icon: Settings },
];

const PLAN_NAME: Record<Commander["plan"], string> = {
  monogamy: "Solo",
  dual: "Duo",
  triple: "Trio",
  enterprise: "Enterprise",
};

function useBadges() {
  const { state, hydrated } = useDemo();
  return useMemo(
    () => ({
      // The persisted state can differ from the prerendered seed. Keep the first
      // client render identical to the server HTML; counts appear after mount.
      collisions: hydrated ? state.collisions.filter((collision) => collision.status === "open").length : 0,
      incidents: hydrated ? state.incidents.filter((incident) => incident.status !== "resolved").length : 0,
      unread: hydrated ? state.incidents.filter((incident) => incident.status === "open").length : 0,
    }),
    [state.collisions, state.incidents, hydrated],
  );
}

function BadgeCount({ value, tone = "muted" }: { value: number; tone?: "muted" | "danger" }) {
  if (!value) return null;
  return (
    <span
      className={cn(
        "ml-auto min-w-[17px] rounded-[4px] px-1 py-px text-center font-mono text-[9px] tabular-nums leading-[13px]",
        tone === "danger" ? "bg-red/15 text-red" : "bg-ink/[0.07] text-muted",
      )}
    >
      {value}
    </span>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const badges = useBadges();
  const { state, hydrated } = useDemo();
  const planLabel = !hydrated ? "—" : PLAN_NAME[state.commander.plan];

  return (
    <nav aria-label="Dashboard" className="flex flex-col gap-0.5">
      <p className="px-2.5 pb-2 pt-1 font-mono text-[8.5px] uppercase tracking-[0.16em] text-faint">Operations</p>
      {NAV.slice(0, 7).map((item) => {
        const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
        const count = item.badge ? badges[item.badge] : 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[12px] transition-colors",
              active ? "bg-ink/[0.055] text-ink" : "text-muted hover:bg-ink/[0.025] hover:text-ink",
            )}
          >
            {active && <span className="absolute inset-y-1.5 left-0 w-[2px] rounded-full bg-accent" />}
            <item.icon className={cn("size-[14px] shrink-0", active ? "text-accent" : "text-faint group-hover:text-muted")} />
            <span className="truncate">{item.label}</span>
            <BadgeCount value={count ?? 0} tone={item.badge === "incidents" || item.badge === "collisions" ? "danger" : "muted"} />
          </Link>
        );
      })}

      <div className="my-2 h-px bg-line" />
      <p className="px-2.5 pb-2 font-mono text-[8.5px] uppercase tracking-[0.16em] text-faint">Workspace</p>
      <Link
        href="/dashboard/settings"
        onClick={onNavigate}
        aria-current={pathname === "/dashboard/settings" ? "page" : undefined}
        className={cn(
          "group relative flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[12px] transition-colors",
          pathname === "/dashboard/settings" ? "bg-ink/[0.055] text-ink" : "text-muted hover:bg-ink/[0.025] hover:text-ink",
        )}
      >
        <Settings className={cn("size-[14px] shrink-0", pathname === "/dashboard/settings" ? "text-accent" : "text-faint group-hover:text-muted")} />
        Settings
      </Link>
      <Link
        href="/"
        onClick={onNavigate}
        className="group flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[12px] text-muted transition-colors hover:bg-ink/[0.025] hover:text-ink"
      >
        <ArrowUpRight className="size-[14px] shrink-0 text-faint group-hover:text-muted" />
        Marketing site
      </Link>

      <div className="mt-4 rounded-md border border-green/15 bg-green/[0.03] p-2.5">
        <div className="flex items-center gap-1.5">
          <span className="status-dot text-green" />
          <span className="font-mono text-[8px] uppercase tracking-[0.13em] text-green">All contexts isolated</span>
        </div>
        <div className="mt-2 space-y-1 font-mono text-[8px] uppercase tracking-[0.07em] text-faint">
          <p className="flex justify-between">
            <span>Namespaces</span>
            <span className="text-muted">3 / 3</span>
          </p>
          <p className="flex justify-between">
            <span>Cross-reads</span>
            <span className="text-muted">0</span>
          </p>
          <p className="flex justify-between">
            <span>Plan</span>
            <span className="text-muted">{planLabel}</span>
          </p>
        </div>
      </div>
    </nav>
  );
}

export function DashboardChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, exportDemo, resetDemo } = useDemo();
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const badges = useBadges();

  const current = NAV.find((item) => (item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)));

  const download = () => {
    const blob = new Blob([exportDemo()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `3wives-demo-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Demo state exported.");
  };

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      setPaletteOpen((value) => !value);
    }
  });

  useEffect(() => {
    const handler = (event: KeyboardEvent) => onKeyDown(event);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-ground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[238px] flex-col border-r border-line bg-[#ffffff] px-3 py-4 lg:flex">
        <Link href="/dashboard" className="flex items-center gap-2.5 px-2" aria-label="3Wives AI command center">
          <LogoMark />
          <span className="flex flex-col">
            <span className="flex items-baseline gap-1.5">
              <span className="text-[14px] font-semibold tracking-[-0.03em] text-ink">3Wives</span>
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-accent">AI</span>
            </span>
            <span className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-faint">Command center</span>
          </span>
        </Link>

        <div className="mt-4 flex items-center gap-2 rounded-md border border-line bg-ink/[0.02] px-2.5 py-2">
          <span className="flex size-6 items-center justify-center rounded-full border border-accent/25 bg-accent/[0.08] font-mono text-[9px] text-accent">
            CM
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] text-ink">Commander&apos;s workspace</p>
            <p className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-faint">Triple namespace</p>
          </div>
          <ChevronDown className="size-3 text-faint" />
        </div>

        <div className="mt-4 flex-1 overflow-y-auto slim-scroll">
          <SidebarNav />
        </div>

        <div className="mt-3 border-t border-line pt-3">
          <Link href="/pricing" className="flex items-center justify-between rounded-md px-2.5 py-2 text-[11.5px] text-muted transition-colors hover:bg-ink/[0.03] hover:text-ink">
            <span className="flex items-center gap-2">
              <Sparkles className="size-3.5 text-accent" />
              Upgrade infrastructure
            </span>
            <ArrowUpRight className="size-3" />
          </Link>
          <p className="px-2.5 pt-2 font-mono text-[7.5px] uppercase leading-relaxed tracking-[0.1em] text-faint">
            v2.4.1 · demo environment
            <br />
            No external integrations
          </p>
        </div>
      </aside>

      <div className="lg:pl-[238px]">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-ground/85 px-3 backdrop-blur-xl md:px-5">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[286px] bg-[#ffffff] px-3 py-4">
              <SheetTitle>Dashboard navigation</SheetTitle>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-2">
                <LogoMark />
                <span className="text-[14px] font-semibold tracking-[-0.03em]">3Wives AI</span>
              </Link>
              <div className="mt-5 flex-1 overflow-y-auto slim-scroll">
                <SidebarNav onNavigate={() => setMenuOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden items-center gap-2 text-[12px] md:flex">
            <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">Workspace</span>
            <span className="text-faint">/</span>
            <span className="text-ink">{current?.label ?? "Command Center"}</span>
          </div>

          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="ml-auto flex h-8 min-w-0 items-center gap-2 rounded-md border border-line bg-ink/[0.02] px-2.5 text-[11.5px] text-faint transition-colors hover:border-line-strong hover:text-muted md:w-[260px]"
          >
            <Search className="size-3.5 shrink-0" />
            <span className="truncate">Search or jump to…</span>
            <span className="ml-auto hidden items-center gap-0.5 rounded border border-line px-1 py-px font-mono text-[8px] text-faint sm:flex">
              <Command className="size-2.5" />K
            </span>
          </button>

          <div className="flex items-center gap-1">
            <span className="mr-1 hidden items-center gap-1.5 rounded-full border border-green/20 bg-green/[0.04] px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-green sm:flex">
              <span className="size-1 rounded-full bg-green" />
              Operational
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label={`Notifications (${badges.incidents} open)`}
                  className="relative flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-ink/[0.05] hover:text-ink"
                >
                  <Bell className="size-4" />
                  {badges.incidents > 0 && (
                    <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-red ring-2 ring-ground" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px]">
                <div className="flex items-center justify-between px-2.5 py-1.5">
                  <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">Notifications</p>
                  <span className="font-mono text-[8px] text-red">{badges.incidents} open</span>
                </div>
                <DropdownMenuSeparator />
                {state.activity.slice(0, 6).map((event) => (
                  <DropdownMenuItem key={event.id} asChild>
                    <Link href={event.kind === "alert" ? "/dashboard/incidents" : "/dashboard"} className="flex items-start gap-2 py-2">
                      <span
                        className={cn(
                          "mt-[5px] size-1.5 shrink-0 rounded-full",
                          event.tone === "critical" ? "bg-red" : event.tone === "warn" ? "bg-amber" : "bg-green",
                        )}
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-[11.5px] text-ink">{event.title}</span>
                        <span className="mt-0.5 block truncate font-mono text-[8px] uppercase tracking-[0.06em] text-faint">
                          {event.detail}
                        </span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/incidents" className="justify-center font-mono text-[8.5px] uppercase tracking-[0.12em] text-accent">
                    Open incident center
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-md py-1 pl-1 pr-1.5 transition-colors hover:bg-ink/[0.05]"
                  aria-label="Commander menu"
                >
                  <span className="flex size-7 items-center justify-center rounded-full border border-accent/25 bg-accent/[0.08] font-mono text-[9px] text-accent">
                    CM
                  </span>
                  <ChevronDown className="hidden size-3 text-faint sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[230px]">
                <DropdownMenuLabel>Commander</DropdownMenuLabel>
                <div className="px-2.5 pb-2">
                  <p className="truncate text-[11.5px] text-ink">{state.commander.email}</p>
                  <Badge variant="accent" className="mt-1.5">
                    {PLAN_NAME[state.commander.plan]}
                  </Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="size-3.5 text-faint" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={download}>
                  <Download className="size-3.5 text-faint" />
                  Export demo data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    window.setTimeout(() => setResetOpen(true), 0);
                  }}
                  className="text-red focus:text-red"
                >
                  <RotateCcw className="size-3.5" />
                  Reset demo data
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <LogOut className="size-3.5 text-faint" />
                    Exit to site
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-[1440px] px-4 py-6 md:px-6 md:py-8 lg:px-8">
          {children}
        </main>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} onExport={download} onReset={() => setResetOpen(true)} />
      <ResetDialog open={resetOpen} onOpenChange={setResetOpen} onConfirm={resetDemo} />
    </div>
  );
}

function CommandPalette({
  open,
  onOpenChange,
  onExport,
  onReset,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: () => void;
  onReset: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const commands = useMemo(
    () => [
      ...NAV.map((item) => ({
        id: item.href,
        label: item.label,
        hint: item.short,
        icon: item.icon,
        run: () => router.push(item.href),
      })),
      {
        id: "action-incident",
        label: "Review open incidents",
        hint: "Action",
        icon: Siren,
        run: () => router.push("/dashboard/incidents"),
      },
      {
        id: "action-draft",
        label: "Generate a response",
        hint: "Action",
        icon: MessagesSquare,
        run: () => router.push("/dashboard/conversations"),
      },
      { id: "action-export", label: "Export demo data", hint: "Action", icon: Download, run: onExport },
      { id: "action-reset", label: "Reset demo data", hint: "Action", icon: RotateCcw, run: onReset },
      { id: "action-site", label: "Open marketing site", hint: "Navigate", icon: ArrowUpRight, run: () => router.push("/") },
    ],
    [router, onExport, onReset],
  );

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return commands;
    return commands.filter((command) => `${command.label} ${command.hint}`.toLowerCase().includes(value));
  }, [commands, query]);

  const active = Math.min(cursor, Math.max(filtered.length - 1, 0));

  const choose = (index: number) => {
    const command = filtered[index];
    if (!command) return;
    onOpenChange(false);
    setQuery("");
    command.run();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) setQuery("");
      }}
    >
      <DialogContent className="max-w-[520px] gap-0 overflow-hidden p-0" hideClose>
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <div className="flex items-center gap-2.5 border-b border-line px-3.5 py-3">
          <Search className="size-4 shrink-0 text-faint" />
          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCursor(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setCursor((value) => Math.min(value + 1, filtered.length - 1));
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setCursor((value) => Math.max(value - 1, 0));
              }
              if (event.key === "Enter") {
                event.preventDefault();
                choose(active);
              }
            }}
            placeholder="Search modules and actions…"
            aria-label="Search modules and actions"
            className="h-7 flex-1 bg-transparent text-[13px] text-ink placeholder:text-faint focus:outline-none"
          />
          <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.08em] text-faint">esc</span>
        </div>
        <div className="max-h-[360px] overflow-y-auto p-1.5 slim-scroll">
          {filtered.length === 0 ? (
            <p className="px-3 py-8 text-center text-[12px] text-faint">No matching module or action.</p>
          ) : (
            filtered.map((command, index) => (
              <button
                key={command.id}
                type="button"
                onClick={() => choose(index)}
                onPointerEnter={() => setCursor(index)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors",
                  index === active ? "bg-ink/[0.06] text-ink" : "text-muted",
                )}
              >
                <command.icon className="size-3.5 shrink-0 text-faint" />
                <span className="flex-1 truncate text-[12px]">{command.label}</span>
                <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-faint">{command.hint}</span>
                {index === active && <span className="font-mono text-[8px] text-accent">↵</span>}
              </button>
            ))
          )}
        </div>
        <div className="flex items-center justify-between border-t border-line px-3.5 py-2 font-mono text-[8px] uppercase tracking-[0.08em] text-faint">
          <span>↑↓ navigate · ↵ select</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="size-2.5 text-green" />
            isolated workspace
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ResetDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogTitle>Reset demonstration data</DialogTitle>
        <p className="text-[13px] leading-relaxed text-muted">
          This restores the seeded profiles, conversations, memories, calendar, gifts and incidents. Any edits made in
          this browser will be discarded.
        </p>
        <div className="rounded-md border border-amber/20 bg-amber/[0.04] p-2.5 font-mono text-[9px] uppercase leading-relaxed tracking-[0.06em] text-amber">
          Local storage only · no external systems affected
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
              toast.success("Demo data restored to its seeded state.");
            }}
          >
            <RotateCcw />
            Reset data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PageHeader({
  kicker,
  title,
  description,
  actions,
}: {
  kicker?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-end md:justify-between md:pb-6">
      <div className="min-w-0">
        {kicker && <p className="mono-label">{kicker}</p>}
        <h1 className="mt-2 text-[clamp(24px,3vw,32px)] font-medium leading-tight tracking-[-0.03em] text-ink">{title}</h1>
        {description && <p className="mt-2 max-w-[620px] text-[12.5px] leading-relaxed text-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatusChip({ label, tone = "ok" }: { label: string; tone?: "ok" | "warn" | "danger" | "muted" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.1em]",
        tone === "ok" && "border-green/20 bg-green/[0.05] text-green",
        tone === "warn" && "border-amber/25 bg-amber/[0.06] text-amber",
        tone === "danger" && "border-red/30 bg-red/[0.07] text-red",
        tone === "muted" && "border-line bg-ink/[0.02] text-faint",
      )}
    >
      {tone === "ok" && <Check className="size-2.5" />}
      {label}
    </span>
  );
}
