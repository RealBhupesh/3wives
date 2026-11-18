"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  Clock3,
  MapPin,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import type { CalendarEvent, Collision, EventKind, WifeId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DashboardSkeleton, EmptyState, SectionCard } from "@/components/dashboard/primitives";
import { PageHeader, StatusChip } from "@/components/dashboard/chrome";
import { Button } from "@/components/ui/button";
import { Input, Label, NativeSelect, Textarea } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const KIND_LABEL: Record<EventKind, string> = {
  date: "Date",
  call: "Call",
  family: "Family",
  travel: "Travel",
  obligation: "Obligation",
};

const KIND_CHIP: Record<WifeId, string> = {
  sophia: "border-[#ff8fa3]/30 bg-[#ff8fa3]/[0.09] text-[#ffc3cd]",
  olivia: "border-[#a78bfa]/30 bg-[#a78bfa]/[0.09] text-[#cec0ff]",
  isabella: "border-[#ff4778]/30 bg-[#ff4778]/[0.09] text-[#ffa0b5]",
};

const SEVERITY_META: Record<Collision["severity"], { label: string; className: string }> = {
  critical: { label: "Critical", className: "border-red/35 bg-red/[0.07] text-red" },
  high: { label: "High", className: "border-amber/30 bg-amber/[0.07] text-amber" },
  moderate: { label: "Moderate", className: "border-line bg-white/[0.02] text-muted" },
};

function eventOnDay(event: CalendarEvent, day: Date) {
  return isSameDay(new Date(event.start), day);
}

function AddEventDialog({
  open,
  onOpenChange,
  initialDate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate: string;
}) {
  const { state, addEvent, logActivity } = useDemo();
  const [wifeId, setWifeId] = useState<WifeId>("sophia");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState("19:00");
  const [duration, setDuration] = useState("120");
  const [kind, setKind] = useState<EventKind>("date");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const submit = () => {
    if (!title.trim() || !location.trim()) {
      toast.error("A title and location are required.");
      return;
    }
    const start = new Date(`${date}T${time}:00`);
    if (Number.isNaN(start.getTime())) {
      toast.error("That date and time could not be parsed.");
      return;
    }
    addEvent({
      wifeId,
      title: title.trim(),
      start: start.toISOString(),
      durationMins: Number(duration),
      kind,
      location: location.trim(),
      notes: notes.trim() || undefined,
      status: "confirmed",
    });
    logActivity({
      wifeId,
      kind: "calendar",
      title: "Commitment added",
      detail: `${title.trim()} · ${format(start, "EEE MMM d, HH:mm")}`,
      tone: "ok",
    });
    toast.success("Commitment indexed. Collision scan ran automatically.");
    onOpenChange(false);
  };

  const wife = state.wives.find((item) => item.id === wifeId) ?? state.wives[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogTitle>Add a commitment</DialogTitle>
        <DialogDescription>
          It is written to {wife.name}&apos;s namespace first, then checked against the other two. Collisions are
          surfaced, never silently resolved.
        </DialogDescription>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="evt-wife">Relationship</Label>
            <NativeSelect id="evt-wife" value={wifeId} onChange={(event) => setWifeId(event.target.value as WifeId)}>
              {state.wives.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.code} · {item.name}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="evt-kind">Type</Label>
            <NativeSelect id="evt-kind" value={kind} onChange={(event) => setKind(event.target.value as EventKind)}>
              {(Object.keys(KIND_LABEL) as EventKind[]).map((value) => (
                <option key={value} value={value}>
                  {KIND_LABEL[value]}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="evt-title">Title</Label>
            <Input
              id="evt-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Dinner, anniversary, family obligation…"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="evt-date">Date</Label>
            <Input id="evt-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="evt-time">Time</Label>
            <Input id="evt-time" type="time" value={time} onChange={(event) => setTime(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="evt-duration">Duration</Label>
            <NativeSelect
              id="evt-duration"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
            >
              {[30, 45, 60, 90, 120, 150, 180].map((value) => (
                <option key={value} value={value}>
                  {value} minutes
                </option>
              ))}
            </NativeSelect>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="evt-location">Location</Label>
            <Input
              id="evt-location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Where the story takes place"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="evt-notes">Notes · optional</Label>
            <Textarea
              id="evt-notes"
              className="min-h-[70px]"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Anything the model should not forget."
            />
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="accent" onClick={submit}>
            <CalendarPlus />
            Add commitment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CalendarGrid({
  month,
  events,
  collisions,
  onSelectDay,
}: {
  month: Date;
  events: CalendarEvent[];
  collisions: Collision[];
  onSelectDay: (day: Date) => void;
}) {
  const { state } = useDemo();
  const wifeMap = useMemo(() => Object.fromEntries(state.wives.map((wife) => [wife.id, wife])), [state.wives]);
  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(month), { weekStartsOn: 0 }),
        end: endOfWeek(endOfMonth(month), { weekStartsOn: 0 }),
      }),
    [month],
  );

  const collisionEvents = new Set(
    collisions.filter((collision) => collision.status === "open").flatMap((collision) => [collision.eventA, collision.eventB]),
  );

  return (
    <div className="overflow-hidden rounded-md border border-line">
      <div className="grid grid-cols-7 border-b border-line bg-[#0a0b10]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
          <div key={label} className="px-1 py-1.5 text-center font-mono text-[7.5px] uppercase tracking-[0.1em] text-faint">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-line">
        {days.map((day) => {
          const dayEvents = events
            .filter((event) => eventOnDay(event, day))
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
          const outside = !isSameMonth(day, month);
          const flagged = dayEvents.some((event) => collisionEvents.has(event.id));
          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDay(day)}
              aria-label={`Preview ${format(day, "EEEE, MMMM d")}, ${dayEvents.length} commitments`}
              className={cn(
                "group flex min-h-[72px] flex-col items-stretch gap-1 bg-[#0a0b10] px-1 py-1 text-left transition-colors hover:bg-[#0e0f16] sm:min-h-[96px] sm:px-1.5 md:min-h-[108px]",
                outside && "opacity-40",
              )}
            >
              <div className="flex items-center justify-between px-0.5">
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full font-mono text-[9px] tabular-nums",
                    isToday(day)
                      ? "bg-accent font-medium text-[#190409]"
                      : "text-muted group-hover:text-ink",
                  )}
                >
                  {format(day, "d")}
                </span>
                {flagged ? (
                  <AlertTriangle className="size-2.5 text-red" aria-label="Collision on this day" />
                ) : (
                  dayEvents.length > 0 && (
                    <span className="font-mono text-[6.5px] uppercase tracking-[0.04em] text-faint">
                      {dayEvents.length}
                    </span>
                  )
                )}
              </div>

              <div className="hidden flex-1 flex-col gap-0.5 sm:flex">
                {dayEvents.slice(0, 2).map((event) => {
                  const wife = wifeMap[event.wifeId];
                  return (
                    <span
                      key={event.id}
                      className={cn(
                        "truncate rounded border px-1 py-[2px] text-[8px] leading-tight",
                        flagged && collisionEvents.has(event.id) ? "border-red/35 bg-red/[0.08] text-red" : KIND_CHIP[event.wifeId],
                      )}
                      style={{ borderLeftColor: wife?.palette.from, borderLeftWidth: 2 }}
                    >
                      {format(new Date(event.start), "HH:mm")} {event.title}
                    </span>
                  );
                })}
                {dayEvents.length > 2 && (
                  <span className="px-1 font-mono text-[6.5px] uppercase tracking-[0.04em] text-faint">
                    +{dayEvents.length - 2} more
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-0.5 px-0.5 sm:hidden">
                {dayEvents.slice(0, 4).map((event) => (
                  <span
                    key={event.id}
                    className="size-1 rounded-full"
                    style={{ background: wifeMap[event.wifeId]?.palette.from }}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CalendarView() {
  const { state, hydrated, resolveCollision, removeEvent } = useDemo();
  const params = useSearchParams();
  const focus = params.get("collision");
  const initialWife = params.get("wife");
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addDate, setAddDate] = useState(() => format(new Date(), "yyyy-MM-dd"));

  const wifeMap = useMemo(() => Object.fromEntries(state.wives.map((wife) => [wife.id, wife])), [state.wives]);
  const openCollisions = state.collisions.filter((collision) => collision.status === "open");
  const monthEvents = state.events.filter((event) => isSameMonth(new Date(event.start), month));
  const upcoming = useMemo(() => {
    const now = new Date();
    return state.events
      .filter((event) => new Date(event.start).getTime() >= now.getTime() - 3_600_000)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }, [state.events]);

  const eventById = (id: string) => state.events.find((event) => event.id === id);
  const dayEvents = selectedDay ? state.events.filter((event) => eventOnDay(event, selectedDay)) : [];

  const openAdd = (date?: Date) => {
    setAddDate(format(date ?? new Date(), "yyyy-MM-dd"));
    setAddOpen(true);
  };

  const filteredWife = initialWife === "sophia" || initialWife === "olivia" || initialWife === "isabella" ? initialWife : null;
  const focusCollision = openCollisions.find((collision) => collision.id === focus);

  if (!hydrated) return <DashboardSkeleton />;

  return (
    <div className="space-y-4">
      <PageHeader
        kicker="Calendar & collisions · single timeline, three contexts"
        title="The calendar is the tell."
        description="Every commitment is indexed against the other two namespaces before it is confirmed. When two truths occupy the same hour, the system stops pretending."
        actions={
          <>
            <StatusChip
              label={openCollisions.length ? `${openCollisions.length} open collisions` : "Calendar normalized"}
              tone={openCollisions.length ? "danger" : "ok"}
            />
            <Button variant="accent" size="sm" onClick={() => openAdd()}>
              <Plus />
              Add commitment
            </Button>
          </>
        }
      />

      {filteredWife && (
        <div className="flex items-center gap-2 rounded-md border border-line bg-white/[0.02] px-3 py-2">
          <span className="size-1.5 rounded-full" style={{ background: wifeMap[filteredWife]?.palette.from }} />
          <p className="font-mono text-[8.5px] uppercase tracking-[0.08em] text-muted">
            Linked context · {wifeMap[filteredWife]?.name} · all commitments still visible
          </p>
          <span className="ml-auto font-mono text-[7.5px] uppercase tracking-[0.06em] text-faint">
            calendar is a shared surface, not shared memory
          </span>
        </div>
      )}

      <div className="grid gap-3 xl:grid-cols-12">
        <div className="space-y-3 xl:col-span-8">
          <section className="panel">
            <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2.5">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="iconSm"
                  aria-label="Previous month"
                  onClick={() => setMonth((value) => subMonths(value, 1))}
                >
                  <ArrowLeft />
                </Button>
                <Button
                  variant="ghost"
                  size="iconSm"
                  aria-label="Next month"
                  onClick={() => setMonth((value) => addMonths(value, 1))}
                >
                  <ArrowRight />
                </Button>
              </div>
              <h2 className="text-[14px] font-medium tracking-[-0.02em] text-ink">{format(month, "MMMM yyyy")}</h2>
              <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[7.5px] uppercase tracking-[0.08em] text-faint">
                {monthEvents.length} commitments
              </span>
              <div className="ml-auto flex items-center gap-2">
                <span className="hidden items-center gap-2 sm:flex">
                  {state.wives.map((wife) => (
                    <span key={wife.id} className="flex items-center gap-1 font-mono text-[7.5px] uppercase tracking-[0.05em] text-faint">
                      <span className="size-1.5 rounded-full" style={{ background: wife.palette.from }} />
                      {wife.name}
                    </span>
                  ))}
                </span>
                <Button variant="outline" size="sm" onClick={() => setMonth(startOfMonth(new Date()))}>
                  Today
                </Button>
              </div>
            </div>

            <div className="p-2 sm:p-3">
              <CalendarGrid month={month} events={state.events} collisions={state.collisions} onSelectDay={setSelectedDay} />
              {monthEvents.length === 0 && (
                <div className="mt-3">
                  <EmptyState
                    icon={CalendarDays}
                    title="No commitments this month"
                    description="The calendar is empty. This is either discipline or a warning sign."
                    action={
                      <Button variant="outline" size="sm" onClick={() => openAdd(month)}>
                        Schedule something
                      </Button>
                    }
                  />
                </div>
              )}
            </div>
          </section>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "This month",
                value: String(monthEvents.length),
                detail: `${monthEvents.filter((event) => event.status === "confirmed").length} confirmed`,
                icon: CalendarDays,
              },
              {
                label: "Open collisions",
                value: String(openCollisions.length).padStart(2, "0"),
                detail: openCollisions.length ? "resolution required" : "none",
                icon: AlertTriangle,
                danger: openCollisions.length > 0,
              },
              {
                label: "Next 30 days",
                value: String(upcoming.length),
                detail: "across 3 contexts",
                icon: Clock3,
              },
            ].map((item) => (
              <div key={item.label} className="panel flex items-center gap-3 p-3">
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-md border",
                    item.danger ? "border-red/25 bg-red/[0.07]" : "border-line bg-white/[0.02]",
                  )}
                >
                  <item.icon className={cn("size-3.5", item.danger ? "text-red" : "text-faint")} />
                </span>
                <div>
                  <p className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-faint">{item.label}</p>
                  <p className={cn("font-mono text-[16px] leading-tight tabular-nums", item.danger ? "text-red" : "text-ink")}>
                    {item.value}
                  </p>
                </div>
                <span className="ml-auto text-right font-mono text-[7px] uppercase tracking-[0.04em] text-faint">
                  {item.detail}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 xl:col-span-4">
          <SectionCard
            kicker="Collision console"
            title="Unresolvable overlaps"
            action={
              <span className={cn("font-mono text-[8px] uppercase tracking-[0.08em]", openCollisions.length ? "text-red" : "text-green")}>
                {openCollisions.length ? "action required" : "clear"}
              </span>
            }
            bodyClassName="space-y-2.5"
          >
            {openCollisions.length === 0 ? (
              <EmptyState
                icon={ShieldCheck}
                title="No open collisions"
                description="Every overlapping commitment has been resolved. The calendar is internally consistent."
              />
            ) : (
              openCollisions.map((collision) => {
                const eventA = eventById(collision.eventA);
                const eventB = eventById(collision.eventB);
                const wifeA = wifeMap[collision.wifeA];
                const wifeB = wifeMap[collision.wifeB];
                const meta = SEVERITY_META[collision.severity];
                const highlighted = focusCollision?.id === collision.id;
                return (
                  <article
                    key={collision.id}
                    className={cn(
                      "rounded-md border p-2.5",
                      highlighted ? "border-accent/40 bg-accent/[0.03]" : "border-line bg-white/[0.015]",
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={cn("rounded border px-1.5 py-px font-mono text-[7px] uppercase tracking-[0.08em]", meta.className)}>
                        {meta.label}
                      </span>
                      <span className="font-mono text-[7px] uppercase tracking-[0.06em] text-faint">
                        {collision.overlapMins} min overlap
                      </span>
                      {highlighted && (
                        <span className="ml-auto rounded border border-accent/30 bg-accent/[0.08] px-1 font-mono text-[6.5px] uppercase tracking-[0.06em] text-accent">
                          linked
                        </span>
                      )}
                    </div>
                    <div className="mt-2 space-y-1.5">
                      {[eventA, eventB].map((event, index) => {
                        if (!event) return null;
                        const wife = index === 0 ? wifeA : wifeB;
                        return (
                          <div key={event.id} className="flex items-start gap-1.5">
                            <span
                              className="mt-1 size-1.5 shrink-0 rounded-full"
                              style={{ background: wife?.palette.from }}
                            />
                            <div className="min-w-0">
                              <p className="truncate text-[10.5px] text-ink">{event.title}</p>
                              <p className="font-mono text-[7px] uppercase tracking-[0.04em] text-faint">
                                {wife?.name} · {format(new Date(event.start), "EEE MMM d, HH:mm")}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-2.5 flex gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 flex-1 text-[10px]"
                        onClick={() => {
                          resolveCollision(collision.id, "reschedule");
                          toast.success("Secondary commitment moved 24 hours. No one was notified.");
                        }}
                      >
                        Reschedule
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 flex-1 text-[10px] text-red hover:text-red"
                        onClick={() => {
                          resolveCollision(collision.id, "cancel");
                          toast.success("Secondary commitment declined. Apology drafted, not sent.");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </article>
                );
              })
            )}
          </SectionCard>

          <SectionCard kicker="Upcoming" title="Next five commitments" bodyClassName="p-0">
            {upcoming.length === 0 ? (
              <div className="p-4">
                <EmptyState icon={CalendarDays} title="Nothing ahead" description="An empty calendar is a temporary state." />
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {upcoming.slice(0, 5).map((event) => {
                  const wife = wifeMap[event.wifeId];
                  return (
                    <li key={event.id} className="flex items-center gap-2.5 px-3 py-2">
                      <span className="flex w-8 shrink-0 flex-col items-center rounded border border-line bg-white/[0.02] py-1">
                        <span className="font-mono text-[6.5px] uppercase text-faint">{format(new Date(event.start), "MMM")}</span>
                        <span className="font-mono text-[11px] leading-none tabular-nums text-ink">
                          {format(new Date(event.start), "d")}
                        </span>
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10.5px] text-ink">{event.title}</p>
                        <p className="truncate font-mono text-[7px] uppercase tracking-[0.04em] text-faint">
                          {wife?.name} · {format(new Date(event.start), "HH:mm")} · {event.location}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </SectionCard>

          <SectionCard kicker="Policy" title="Collision handling" bodyClassName="space-y-2">
            {[
              ["Detection", "Runs on every write, across all three namespaces."],
              ["Severity", "Derived from overlap minutes and relationship state."],
              ["Resolution", "Commander-only. The system never cancels on its own."],
              ["Notification", "None. No external message is ever produced by this demo."],
            ].map(([label, detail]) => (
              <div key={label} className="flex items-start gap-2">
                <span className="mt-1 size-1 shrink-0 rounded-full bg-accent/60" />
                <div>
                  <p className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-muted">{label}</p>
                  <p className="text-[9.5px] leading-relaxed text-faint">{detail}</p>
                </div>
              </div>
            ))}
          </SectionCard>
        </div>
      </div>

      <p className="pb-2 text-center font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-faint">
        Fictional commitments · local calendar only · no invitations sent · no external calendars connected
      </p>

      <AddEventDialog
        key={`${addDate}-${String(addOpen)}`}
        open={addOpen}
        onOpenChange={setAddOpen}
        initialDate={addDate}
      />

      <Dialog open={selectedDay !== null} onOpenChange={(value) => !value && setSelectedDay(null)}>
        <DialogContent className="max-w-lg">
          <DialogTitle>{selectedDay ? format(selectedDay, "EEEE, MMMM d") : "Day"}</DialogTitle>
          <DialogDescription>
            {dayEvents.length === 0
              ? "Nothing is scheduled in any context. The absence is not suspicious yet."
              : `${dayEvents.length} commitment${dayEvents.length === 1 ? "" : "s"} across the three namespaces.`}
          </DialogDescription>

          {dayEvents.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="Nothing on this day"
              description="Add a commitment or close the panel. There is no penalty for an empty evening."
              action={
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => {
                    openAdd(selectedDay ?? undefined);
                    setSelectedDay(null);
                  }}
                >
                  <Plus />
                  Add commitment
                </Button>
              }
            />
          ) : (
            <ul className="max-h-[320px] space-y-2 overflow-y-auto slim-scroll">
              {dayEvents.map((event) => {
                const wife = wifeMap[event.wifeId];
                return (
                  <li key={event.id} className="rounded-md border border-line bg-white/[0.015] p-2.5">
                    <div className="flex items-start gap-2">
                      <span className="mt-1 size-2 shrink-0 rounded-full" style={{ background: wife?.palette.from }} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-[11.5px] text-ink">{event.title}</p>
                          <span className={cn("shrink-0 rounded border px-1 py-px font-mono text-[6.5px] uppercase tracking-[0.06em]", KIND_CHIP[event.wifeId])}>
                            {wife?.name}
                          </span>
                        </div>
                        <p className="mt-0.5 flex flex-wrap items-center gap-2 font-mono text-[7.5px] uppercase tracking-[0.04em] text-faint">
                          <span className="flex items-center gap-1">
                            <Clock3 className="size-2.5" />
                            {format(new Date(event.start), "HH:mm")} · {event.durationMins}m
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-2.5" />
                            {event.location}
                          </span>
                          <span className="text-muted">{KIND_LABEL[event.kind]}</span>
                        </p>
                        {event.notes && <p className="mt-1 text-[9.5px] leading-relaxed text-muted">{event.notes}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="iconSm"
                        aria-label={`Delete ${event.title}`}
                        className="text-faint hover:text-red"
                        onClick={() => {
                          removeEvent(event.id);
                          toast.success("Commitment removed from the local calendar.");
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="flex flex-col-reverse gap-2 border-t border-line pt-3 sm:flex-row sm:justify-between">
            <Button variant="subtle" size="sm" onClick={() => setSelectedDay(null)}>
              <X />
              Close
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={() => {
                openAdd(selectedDay ?? undefined);
                setSelectedDay(null);
              }}
            >
              <Plus />
              Add on this day
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CalendarPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <CalendarView />
    </Suspense>
  );
}
