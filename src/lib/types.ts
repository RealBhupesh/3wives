export type WifeId = "sophia" | "olivia" | "isabella";

export type RelationshipStatus = "stable" | "attention" | "critical";

export type Sentiment = "warm" | "playful" | "neutral" | "guarded" | "strained";

export type MessageRole = "user" | "wife" | "system";

export interface Wife {
  id: WifeId;
  code: string;
  name: string;
  fullName: string;
  age: number;
  city: string;
  occupation: string;
  status: RelationshipStatus;
  health: number;
  healthDelta: number;
  lastInteractionMinutes: number;
  nextDate: { label: string; date: string };
  activity: string;
  tone: string;
  traits: string[];
  interests: string[];
  boundaries: string[];
  budget: number;
  anniversary: string;
  birthday: string;
  palette: { from: string; to: string };
  tagline: string;
  voice: string;
}

export interface Message {
  id: string;
  wifeId: WifeId;
  role: MessageRole;
  text: string;
  at: string;
  source: "seed" | "user" | "ai";
  sentiment?: Sentiment;
  memoryRefs?: string[];
}

export type MemoryKind = "preference" | "milestone" | "sensitive" | "logistics" | "gift";

export interface Memory {
  id: string;
  wifeId: WifeId;
  namespace: string;
  kind: MemoryKind;
  title: string;
  detail: string;
  importance: 1 | 2 | 3 | 4 | 5;
  lastAccessed: string;
  source: "conversation" | "calendar" | "manual";
  pinned?: boolean;
}

export type EventKind = "date" | "call" | "family" | "travel" | "obligation";

export interface CalendarEvent {
  id: string;
  wifeId: WifeId;
  title: string;
  start: string;
  durationMins: number;
  kind: EventKind;
  location: string;
  status: "confirmed" | "tentative" | "resolved";
  notes?: string;
}

export type CollisionStatus = "open" | "resolved";

export interface Collision {
  id: string;
  eventA: string;
  eventB: string;
  wifeA: WifeId;
  wifeB: WifeId;
  overlapMins: number;
  severity: "critical" | "high" | "moderate";
  status: CollisionStatus;
  resolution?: string;
}

export type GiftStatus = "idea" | "approved" | "purchased";

export interface Gift {
  id: string;
  wifeId: WifeId;
  name: string;
  category: string;
  price: number;
  match: number;
  occasion: string;
  rationale: string;
  status: GiftStatus;
  acquiredAt?: string;
}

export interface GiftHistoryPoint {
  month: string;
  sophia: number;
  olivia: number;
  isabella: number;
}

export type IncidentSeverity = "severe" | "high" | "moderate" | "low";
export type IncidentStatus = "open" | "analyzing" | "contained" | "resolved";
export type IncidentAction = "analyze" | "generate" | "review" | "contain";

export interface IncidentDraft {
  id: string;
  label: string;
  text: string;
  confidence: number;
  risk: number;
  tone: string;
}

export interface IncidentStep {
  at: string;
  label: string;
  detail: string;
  actor: "system" | "commander" | "ai";
}

export interface Incident {
  id: string;
  code: string;
  title: string;
  wifeId: WifeId;
  severity: IncidentSeverity;
  status: IncidentStatus;
  exposureRisk: number;
  urgency: "CRITICAL" | "HIGH" | "ELEVATED" | "ROUTINE";
  openedAt: string;
  summary: string;
  evidence: string[];
  analysis: string[];
  drafts: IncidentDraft[];
  timeline: IncidentStep[];
  stagedDraftId?: string;
}

export type ActivityKind = "memory" | "message" | "calendar" | "gift" | "alert" | "system";

export interface ActivityEvent {
  id: string;
  at: string;
  wifeId: WifeId | "system";
  kind: ActivityKind;
  title: string;
  detail: string;
  tone: "ok" | "warn" | "critical";
}

export interface Settings {
  autoDraft: boolean;
  strictIsolation: boolean;
  collisionAlerts: boolean;
  emotionalAlerts: boolean;
  giftAlerts: boolean;
  toneMirroring: number;
  emojiFidelity: number;
  latencyTarget: number;
  greeting: string;
}

export interface Commander {
  name: string;
  email: string;
  plan: "monogamy" | "dual" | "triple" | "enterprise";
  timezone: string;
}

export interface AnalyticsPoint {
  label: string;
  sophia: number;
  olivia: number;
  isabella: number;
}

export interface DemoState {
  version: number;
  startedAt: string;
  commander: Commander;
  wives: Wife[];
  messages: Message[];
  memories: Memory[];
  events: CalendarEvent[];
  collisions: Collision[];
  gifts: Gift[];
  giftHistory: GiftHistoryPoint[];
  incidents: Incident[];
  activity: ActivityEvent[];
  settings: Settings;
  analytics: {
    stability: AnalyticsPoint[];
    attention: { wifeId: WifeId; value: number }[];
    emotionalDebt: { wifeId: WifeId; value: number; trend: number }[];
    latency: number[];
    leakage: number;
    coverage: { wifeId: WifeId; value: number }[];
    inferenceVolume: number[];
  };
}
