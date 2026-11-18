"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { addDays, addHours } from "date-fns";
import { createInitialState, DEMO_NOW } from "./data";
import type {
  ActivityEvent,
  CalendarEvent,
  Commander,
  DemoState,
  GiftStatus,
  Incident,
  IncidentStep,
  Memory,
  Message,
  Settings,
  Wife,
  WifeId,
} from "./types";

const STORAGE_KEY = "3wives.demo.v1";

type NewMessage = Pick<Message, "role" | "text" | "source"> & Partial<Pick<Message, "sentiment" | "memoryRefs">>;
type NewMemory = Omit<Memory, "id" | "namespace" | "lastAccessed"> &
  Partial<Pick<Memory, "namespace" | "lastAccessed">>;
type NewEvent = Omit<CalendarEvent, "id" | "status"> & Partial<Pick<CalendarEvent, "status">>;
type NewActivity = Omit<ActivityEvent, "id" | "at"> & Partial<Pick<ActivityEvent, "at">>;

interface DemoContextValue {
  state: DemoState;
  hydrated: boolean;
  updateWife: (id: WifeId, patch: Partial<Wife>) => void;
  updateCommander: (patch: Partial<Commander>) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  addMessage: (wifeId: WifeId, message: NewMessage) => Message;
  clearThread: (wifeId: WifeId) => void;
  addMemory: (memory: NewMemory) => void;
  removeMemory: (id: string) => void;
  addEvent: (event: NewEvent) => void;
  removeEvent: (id: string) => void;
  resolveCollision: (id: string, mode: "reschedule" | "cancel") => void;
  setGiftStatus: (id: string, status: GiftStatus) => void;
  updateIncident: (id: string, patch: Partial<Incident>) => void;
  addIncidentStep: (id: string, step: IncidentStep) => void;
  stageDraft: (incidentId: string, draftId: string) => void;
  logActivity: (event: NewActivity) => void;
  resetDemo: () => void;
  exportDemo: () => string;
}

const DemoContext = createContext<DemoContextValue | null>(null);

function mergeStored(parsed: Partial<DemoState>): DemoState {
  const base = createInitialState();
  return {
    ...base,
    ...parsed,
    version: base.version,
    commander: { ...base.commander, ...parsed.commander },
    settings: { ...base.settings, ...parsed.settings },
    analytics: { ...base.analytics, ...parsed.analytics },
    wives: parsed.wives?.length === 3 ? parsed.wives : base.wives,
    messages: parsed.messages ?? base.messages,
    memories: parsed.memories ?? base.memories,
    events: parsed.events ?? base.events,
    collisions: parsed.collisions ?? base.collisions,
    gifts: parsed.gifts ?? base.gifts,
    giftHistory: parsed.giftHistory ?? base.giftHistory,
    incidents: parsed.incidents ?? base.incidents,
    activity: parsed.activity ?? base.activity,
  };
}

const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function readStoredState(): DemoState {
  // During prerender there is no storage. Use the fixed anchor so the server
  // HTML is deterministic; the browser seeds against the actual present.
  if (typeof window === "undefined") return createInitialState(DEMO_NOW);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DemoState>;
      if (parsed && parsed.version === 1) return mergeStored(parsed);
    }
  } catch {
    // Corrupt storage falls back to the seeded demo.
  }
  return createInitialState();
}

const subscribeToClient = () => () => {};

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(readStoredState);
  // False during SSR and the hydration pass, true once mounted on the client.
  const hydrated = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Private-mode storage failures should not break the demo.
    }
  }, [state, hydrated]);

  const logActivity = useCallback((event: NewActivity) => {
    setState((prev) => ({
      ...prev,
      activity: [{ ...event, id: uid("act"), at: event.at ?? new Date().toISOString() }, ...prev.activity].slice(0, 40),
    }));
  }, []);

  const updateWife = useCallback((id: WifeId, patch: Partial<Wife>) => {
    setState((prev) => ({
      ...prev,
      wives: prev.wives.map((wife) => (wife.id === id ? { ...wife, ...patch } : wife)),
    }));
  }, []);

  const updateCommander = useCallback((patch: Partial<Commander>) => {
    setState((prev) => ({ ...prev, commander: { ...prev.commander, ...patch } }));
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  }, []);

  const addMessage = useCallback((wifeId: WifeId, message: NewMessage) => {
    const full: Message = { ...message, id: uid("msg"), wifeId, at: new Date().toISOString() };
    setState((prev) => ({ ...prev, messages: [...prev.messages, full] }));
    return full;
  }, []);

  const clearThread = useCallback((wifeId: WifeId) => {
    setState((prev) => ({ ...prev, messages: prev.messages.filter((message) => message.wifeId !== wifeId) }));
  }, []);

  const addMemory = useCallback((memory: NewMemory) => {
    setState((prev) => ({
      ...prev,
      memories: [
        {
          ...memory,
          id: uid("mem"),
          namespace: memory.namespace ?? `ns.${memory.wifeId}.v2`,
          lastAccessed: memory.lastAccessed ?? new Date().toISOString(),
        },
        ...prev.memories,
      ],
    }));
  }, []);

  const removeMemory = useCallback((id: string) => {
    setState((prev) => ({ ...prev, memories: prev.memories.filter((memory) => memory.id !== id) }));
  }, []);

  const addEvent = useCallback((event: NewEvent) => {
    setState((prev) => ({
      ...prev,
      events: [...prev.events, { ...event, id: uid("evt"), status: event.status ?? "confirmed" }],
    }));
  }, []);

  const removeEvent = useCallback((id: string) => {
    setState((prev) => ({ ...prev, events: prev.events.filter((event) => event.id !== id) }));
  }, []);

  const resolveCollision = useCallback((id: string, mode: "reschedule" | "cancel") => {
    setState((prev) => {
      const collision = prev.collisions.find((item) => item.id === id);
      if (!collision) return prev;
      const secondary = prev.events.find((event) => event.id === collision.eventB);
      let events = prev.events;
      if (secondary) {
        if (mode === "reschedule") {
          events = prev.events.map((event) =>
            event.id === secondary.id ? { ...event, start: addDays(new Date(event.start), 1).toISOString() } : event,
          );
        } else {
          events = prev.events.filter((event) => event.id !== secondary.id);
        }
      }
      const activityItem: ActivityEvent = {
        id: uid("act"),
        at: new Date().toISOString(),
        wifeId: secondary?.wifeId ?? "system",
        kind: "calendar",
        title: mode === "reschedule" ? "Collision rescheduled" : "Collision declined",
        detail: secondary ? `${secondary.title} · ${collision.wifeA} / ${collision.wifeB}` : "Calendar updated",
        tone: "ok",
      };
      return {
        ...prev,
        events,
        collisions: prev.collisions.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "resolved",
                resolution:
                  mode === "reschedule"
                    ? "Secondary commitment moved 24 hours. Notifications queued with a plausible reason."
                    : "Secondary commitment declined. Apology drafted, not sent.",
              }
            : item,
        ),
        activity: [activityItem, ...prev.activity].slice(0, 40),
      };
    });
  }, []);

  const setGiftStatus = useCallback((id: string, status: GiftStatus) => {
    setState((prev) => ({
      ...prev,
      gifts: prev.gifts.map((gift) =>
        gift.id === id
          ? {
              ...gift,
              status,
              acquiredAt: status === "purchased" ? new Date().toISOString() : gift.acquiredAt,
            }
          : gift,
      ),
    }));
  }, []);

  const updateIncident = useCallback((id: string, patch: Partial<Incident>) => {
    setState((prev) => ({
      ...prev,
      incidents: prev.incidents.map((incident) => (incident.id === id ? { ...incident, ...patch } : incident)),
    }));
  }, []);

  const addIncidentStep = useCallback((id: string, step: IncidentStep) => {
    setState((prev) => ({
      ...prev,
      incidents: prev.incidents.map((incident) =>
        incident.id === id ? { ...incident, timeline: [...incident.timeline, step] } : incident,
      ),
    }));
  }, []);

  const stageDraft = useCallback((incidentId: string, draftId: string) => {
    setState((prev) => ({
      ...prev,
      incidents: prev.incidents.map((incident) =>
        incident.id === incidentId
          ? {
              ...incident,
              stagedDraftId: draftId,
              timeline: [
                ...incident.timeline,
                {
                  at: new Date().toISOString(),
                  label: "Draft staged",
                  detail: "Response prepared for commander approval. No message has been sent.",
                  actor: "commander",
                },
              ],
            }
          : incident,
      ),
    }));
  }, []);

  const resetDemo = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setState(createInitialState());
  }, []);

  const exportDemo = useCallback(() => JSON.stringify(state, null, 2), [state]);

  const value = useMemo<DemoContextValue>(
    () => ({
      state,
      hydrated,
      updateWife,
      updateCommander,
      updateSettings,
      addMessage,
      clearThread,
      addMemory,
      removeMemory,
      addEvent,
      removeEvent,
      resolveCollision,
      setGiftStatus,
      updateIncident,
      addIncidentStep,
      stageDraft,
      logActivity,
      resetDemo,
      exportDemo,
    }),
    [
      state,
      hydrated,
      updateWife,
      updateCommander,
      updateSettings,
      addMessage,
      clearThread,
      addMemory,
      removeMemory,
      addEvent,
      removeEvent,
      resolveCollision,
      setGiftStatus,
      updateIncident,
      addIncidentStep,
      stageDraft,
      logActivity,
      resetDemo,
      exportDemo,
    ],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemo must be used inside DemoProvider");
  return context;
}

export function useWife(id: WifeId) {
  const { state } = useDemo();
  return state.wives.find((wife) => wife.id === id) ?? state.wives[0];
}

export { STORAGE_KEY };

// Small helper used by calendar + collision views.
export function shiftEvent(event: CalendarEvent, hours: number): CalendarEvent {
  return { ...event, start: addHours(new Date(event.start), hours).toISOString() };
}
