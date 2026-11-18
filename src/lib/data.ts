import { addDays, addMinutes, addMonths, format, startOfDay } from "date-fns";
import type {
  ActivityEvent,
  CalendarEvent,
  Collision,
  DemoState,
  Gift,
  GiftHistoryPoint,
  Incident,
  Memory,
  Message,
  Wife,
} from "./types";

const iso = (d: Date) => d.toISOString();

function at(now: Date, offsetDays: number, hours: number, minutes = 0) {
  const d = startOfDay(now);
  const day = addDays(d, offsetDays);
  day.setHours(hours, minutes, 0, 0);
  return day;
}

export const WIFE_ACCENTS: Record<string, string> = {
  sophia: "#f26b1d",
  olivia: "#6e56f8",
  isabella: "#0f9d8a",
};

export function createWives(now = new Date()): Wife[] {
  const base = startOfDay(now);
  return [
    {
      id: "sophia",
      code: "WIFE 01",
      name: "Sophia",
      fullName: "Sophia Marchetti",
      age: 34,
      city: "San Francisco, CA",
      occupation: "Principal Architect, Marchetti Studio",
      status: "stable",
      health: 96,
      healthDelta: 2.4,
      lastInteractionMinutes: 12,
      nextDate: { label: "Anniversary", date: iso(addDays(base, 14)) },
      activity: "Drafting evening message",
      tone: "Warm · precise · wry",
      traits: ["Reads the room", "Keeps receipts", "Hates vague plans"],
      interests: ["Mid-century ceramics", "Coastal drives", "Negronis", "Sunday crosswords"],
      boundaries: [
        "Never cancel dinner the same day",
        "Do not ask 'what's wrong' twice",
        "No lilies — ever",
      ],
      budget: 600,
      anniversary: iso(addDays(base, 14)),
      birthday: iso(addDays(base, 138)),
      palette: { from: "#f26b1d", to: "#ffb347" },
      tagline: "The one who notices everything.",
      voice: "Full sentences. Dry humor. Warmth delivered as observation, not declaration.",
    },
    {
      id: "olivia",
      code: "WIFE 02",
      name: "Olivia",
      fullName: "Olivia Chen-Reyes",
      age: 31,
      city: "Oakland, CA",
      occupation: "Creative Director, Field Notes Agency",
      status: "attention",
      health: 78,
      healthDelta: -4.1,
      lastInteractionMinutes: 120,
      nextDate: { label: "Birthday", date: iso(addDays(base, 8)) },
      activity: "Analyzing recent conversation",
      tone: "Playful · direct · low tolerance for vague plans",
      traits: ["Tests you on purpose", "Notices effort", "Leaves in the middle of stories"],
      interests: ["Vinyl", "Tennis", "Iced matcha", "True crime", "Vintage rings"],
      boundaries: [
        "Do not decide plans at 7 PM",
        "Fluorescent lighting is a dealbreaker",
        "Call her father on Sundays — do not text",
      ],
      budget: 550,
      anniversary: iso(addDays(base, 76)),
      birthday: iso(addDays(base, 8)),
      palette: { from: "#6e56f8", to: "#a99bff" },
      tagline: "The one who keeps you honest.",
      voice: "Lowercase. Short lines. Emoji when amused. Follows a joke with a real question.",
    },
    {
      id: "isabella",
      code: "WIFE 03",
      name: "Isabella",
      fullName: "Isabella Duarte",
      age: 33,
      city: "San Francisco, CA",
      occupation: "Executive Chef, Il Fiorista",
      status: "critical",
      health: 62,
      healthDelta: -8.7,
      lastInteractionMinutes: 240,
      nextDate: { label: "Dinner reservation", date: iso(addDays(base, 2)) },
      activity: "Preparing recovery strategy",
      tone: "Intense · romantic · zero tolerance for distance",
      traits: ["Says the hard thing first", "Remembers exact words", "Shows love by feeding you"],
      interests: ["Flamenco", "Natural wine", "Late dinners", "Linen", "Barcelona"],
      boundaries: [
        "Do not be late without a story she believes",
        "Never discuss work at the table",
        "Thursday is not optional",
      ],
      budget: 650,
      anniversary: iso(addDays(base, 41)),
      birthday: iso(addDays(base, 205)),
      palette: { from: "#0f9d8a", to: "#4fd1b5" },
      tagline: "The one who tells the truth.",
      voice: "Direct. Intimate. Occasional Spanish. Asks the question underneath the question.",
    },
  ];
}

function createMessages(now = new Date()): Message[] {
  const m = (mins: number) => iso(addMinutes(now, -mins));
  const rows: Array<[Message["wifeId"], Message["role"], string, number, Message["source"]]> = [
    ["sophia", "wife", "The tile samples arrived. I've narrowed it to two, which is progress, or a hostage situation. Depends on your schedule.", 340, "seed"],
    ["sophia", "user", "I'll come by at 7. Bringing the good olive oil.", 330, "seed"],
    ["sophia", "wife", "You always say that and then bring the one from the back of the cupboard.", 326, "seed"],
    ["sophia", "user", "That's the good one. It has history.", 318, "seed"],
    ["sophia", "wife", "Saturday is the 2nd, by the way. No pressure. Just a date that continues to exist.", 300, "seed"],
    ["sophia", "user", "I know. I have it handled.", 290, "seed"],
    ["sophia", "wife", "You said that about the Lisbon flights.", 288, "seed"],
    ["sophia", "wife", "Come home before nine and I'll pretend I haven't been negotiating with a tile for two hours.", 12, "seed"],

    ["olivia", "wife", "morning. your coffee machine made a noise like it was resigning", 480, "seed"],
    ["olivia", "user", "It's a $40 machine. It has dreams.", 472, "seed"],
    ["olivia", "wife", "so do i", 470, "seed"],
    ["olivia", "wife", "genuinely though, dinner friday? i'm not doing the thing where we decide at 7pm again", 455, "seed"],
    ["olivia", "user", "Booked. 8pm. I'll send the place.", 440, "seed"],
    ["olivia", "wife", "you said that last time and we ended up at the place with the bad lighting", 438, "seed"],
    ["olivia", "user", "This one has good lighting.", 430, "seed"],
    ["olivia", "wife", "👀", 428, "seed"],
    ["olivia", "wife", "who's jessica", 120, "seed"],

    ["isabella", "wife", "I made the reservation. Thursday, 9pm. Do not be late.", 620, "seed"],
    ["isabella", "user", "I'll be there at 8:50.", 610, "seed"],
    ["isabella", "wife", "You say 8:50. You mean 9:10, smiling, with a story.", 604, "seed"],
    ["isabella", "user", "That was one time.", 598, "seed"],
    ["isabella", "wife", "It is always one time with you.", 596, "seed"],
    ["isabella", "wife", "You've been quiet today. Did I do something, or are you deciding whether to tell me something?", 300, "seed"],
    ["isabella", "user", "Just work. Long day.", 290, "seed"],
    ["isabella", "wife", "Work. Claro. This is the word you use when the sentence is too expensive.", 286, "seed"],
    ["isabella", "wife", "Thursday matters to me. I need to know it matters to you.", 240, "seed"],
  ];

  return rows.map(([wifeId, role, text, minsAgo, source], i) => ({
    id: `seed-msg-${i}`,
    wifeId,
    role,
    text,
    at: m(minsAgo),
    source,
    sentiment: wifeId === "isabella" ? "strained" : wifeId === "olivia" ? "playful" : "warm",
  }));
}

function createMemories(now = new Date()): Memory[] {
  const m = (hoursAgo: number) => iso(addMinutes(now, -hoursAgo * 60));
  const rows: Array<Omit<Memory, "id" | "namespace" | "lastAccessed">> = [
    { wifeId: "sophia", kind: "milestone", title: "Anniversary — December 2", detail: "Four years. First date was at a tile warehouse. She still brings it up as evidence that you have always been like this.", importance: 5, source: "calendar", pinned: true },
    { wifeId: "sophia", kind: "sensitive", title: "Lilies are off-limits", detail: "Lilies were at her father's funeral. Never send them, not even as a filler stem.", importance: 5, source: "conversation" },
    { wifeId: "sophia", kind: "preference", title: "The olive oil rule", detail: "Single-estate Greek finishing oil. The tin, not the bottle. She checks.", importance: 3, source: "conversation" },
    { wifeId: "sophia", kind: "sensitive", title: "The Lisbon flight", detail: "Postponed twice. She has a theory about why and she has not said it out loud yet.", importance: 4, source: "conversation" },
    { wifeId: "sophia", kind: "gift", title: "Green tile lamp — Studio Kō", detail: "Saved to her studio board three weeks ago. Do not buy directly from the link; she will notice the referral.", importance: 4, source: "conversation" },
    { wifeId: "sophia", kind: "preference", title: "6:40, balcony, no phone", detail: "Espresso before conversation. If you speak before the first sip, you are background noise.", importance: 3, source: "manual" },
    { wifeId: "sophia", kind: "logistics", title: "Tile order pickup", detail: "Mission Tile, 9th Street. Order under Marchetti. They close at 4.", importance: 2, source: "calendar" },

    { wifeId: "olivia", kind: "milestone", title: "Birthday — November 26", detail: "Wants a surprise. Hates being surprised badly. The difference is entirely in the planning.", importance: 5, source: "calendar", pinned: true },
    { wifeId: "olivia", kind: "sensitive", title: "Jessica", detail: "Closest friend from art school. Recently divorced. Currently not speaking — reason unknown. Do not reference unprompted.", importance: 5, source: "conversation" },
    { wifeId: "olivia", kind: "gift", title: "Rumours — 1977 Japanese pressing", detail: "She has watched the same listing twice. The seller raised the price after the first view.", importance: 4, source: "conversation" },
    { wifeId: "olivia", kind: "preference", title: "Lighting is a dealbreaker", detail: "Will leave a restaurant if the lighting is fluorescent. Window table or nothing.", importance: 3, source: "conversation" },
    { wifeId: "olivia", kind: "preference", title: "Matcha, precise", detail: "Iced, oat, one extra scoop. Never hot after 11am. She will send it back.", importance: 2, source: "manual" },
    { wifeId: "olivia", kind: "logistics", title: "Marbella — June", detail: "Her sister's wedding. Two days minimum. One day is a message, not a trip.", importance: 4, source: "calendar" },
    { wifeId: "olivia", kind: "sensitive", title: "Sunday calls to her father", detail: "Call, do not text. He never answers texts and she takes it personally.", importance: 3, source: "conversation" },

    { wifeId: "isabella", kind: "logistics", title: "Thursday, 9pm — Il Fiorista", detail: "Reserved under her name. Tasting menu. The table by the kitchen is the good one.", importance: 5, source: "calendar", pinned: true },
    { wifeId: "isabella", kind: "preference", title: "Flamenco, carefully", detail: "She danced until she was 19. Never ask her to perform casually, and never call it a hobby.", importance: 4, source: "conversation" },
    { wifeId: "isabella", kind: "sensitive", title: "Lisbon, the 'should'", detail: "She says Lisbon is where she should have stayed. The 'should' is the entire conversation.", importance: 5, source: "conversation" },
    { wifeId: "isabella", kind: "gift", title: "Grandmother's tablecloth", detail: "Hand-embroidered, from her grandmother's village. The original was lost in 2019. A replacement must not be presented as the original.", importance: 4, source: "conversation" },
    { wifeId: "isabella", kind: "preference", title: "Natural wine, no shortcuts", detail: "No sulfites, no 'funky' as a personality. Bodega Garzón is always safe.", importance: 2, source: "manual" },
    { wifeId: "isabella", kind: "sensitive", title: "Sunday calls to her mother", detail: "Do not ask how it went unless she opens the door. It is usually a door.", importance: 4, source: "conversation" },
  ];

  return rows.map((row, i) => ({
    ...row,
    id: `mem-${row.wifeId}-${i}`,
    namespace: `ns.${row.wifeId}.v2`,
    lastAccessed: m((i % 7) * 3 + 1),
  }));
}

function createEvents(now = new Date()): CalendarEvent[] {
  const defs: Array<{
    wifeId: CalendarEvent["wifeId"];
    title: string;
    offset: number;
    hour: number;
    minute?: number;
    durationMins: number;
    kind: CalendarEvent["kind"];
    location: string;
    status?: CalendarEvent["status"];
    notes?: string;
  }> = [
    { wifeId: "sophia", title: "Dinner at Il Nido", offset: 1, hour: 19, durationMins: 120, kind: "date", location: "Il Nido, Hayes Valley" },
    { wifeId: "isabella", title: "Dinner — tasting menu", offset: 2, hour: 21, durationMins: 150, kind: "date", location: "Il Fiorista" },
    { wifeId: "sophia", title: "Anniversary dinner", offset: 3, hour: 20, durationMins: 180, kind: "date", location: "Reserved — Le Fantôme" },
    { wifeId: "olivia", title: "Drinks with Priya", offset: 3, hour: 20, minute: 30, durationMins: 120, kind: "obligation", location: "Bar Part Time" },
    { wifeId: "olivia", title: "Florist — final confirm", offset: 4, hour: 10, durationMins: 45, kind: "obligation", location: "Bloom & Stem", status: "tentative" },
    { wifeId: "isabella", title: "Gallery opening — Hauser & Wirth", offset: 5, hour: 18, durationMins: 120, kind: "date", location: "Hauser & Wirth, 901 16th St" },
    { wifeId: "sophia", title: "Dinner with her parents", offset: 7, hour: 19, durationMins: 150, kind: "family", location: "Sausalito" },
    { wifeId: "isabella", title: "Dinner with her editor", offset: 7, hour: 19, minute: 30, durationMins: 120, kind: "date", location: "Zuni Café" },
    { wifeId: "olivia", title: "Birthday dinner", offset: 8, hour: 20, durationMins: 180, kind: "date", location: "Held — undisclosed", notes: "Do not let her pick. She will pick somewhere with bad lighting." },
    { wifeId: "sophia", title: "Pick up tile order", offset: 9, hour: 12, durationMins: 45, kind: "obligation", location: "Mission Tile", status: "tentative" },
    { wifeId: "olivia", title: "Tennis clinic", offset: 10, hour: 9, durationMins: 90, kind: "obligation", location: "Golden Gate Park" },
    { wifeId: "isabella", title: "Flamenco — Sadler's Wells", offset: 11, hour: 20, durationMins: 150, kind: "date", location: "Palace of Fine Arts", status: "tentative" },
    { wifeId: "sophia", title: "Walk — Land's End", offset: 12, hour: 10, durationMins: 90, kind: "date", location: "Land's End Trail", status: "tentative" },
    { wifeId: "olivia", title: "Sunday lunch with her father", offset: 13, hour: 13, durationMins: 120, kind: "family", location: "Albany" },
    { wifeId: "sophia", title: "Dinner at home", offset: -1, hour: 20, durationMins: 120, kind: "date", location: "Home", status: "resolved" },
    { wifeId: "isabella", title: "Wine tasting — Bodega Garzón", offset: -3, hour: 19, durationMins: 120, kind: "date", location: "Bar Jabuticaba", status: "resolved" },
    { wifeId: "olivia", title: "CALL — insurance", offset: -2, hour: 11, durationMins: 30, kind: "obligation", location: "Phone", status: "resolved" },
    { wifeId: "sophia", title: "Anniversary — calendar lock", offset: 14, hour: 0, durationMins: 30, kind: "obligation", location: "System" },
  ];

  const events = defs.map((d, i) => ({
    id: `evt-${i}`,
    wifeId: d.wifeId,
    title: d.title,
    start: iso(at(now, d.offset, d.hour, d.minute ?? 0)),
    durationMins: d.durationMins,
    kind: d.kind,
    location: d.location,
    status: d.status ?? ("confirmed" as const),
    notes: d.notes,
  }));

  return events;
}

function createCollisions(events: CalendarEvent[]): Collision[] {
  if (!events.length) return [];
  return [
    {
      id: "col-1",
      eventA: "evt-2",
      eventB: "evt-3",
      wifeA: "sophia",
      wifeB: "olivia",
      overlapMins: 150,
      severity: "critical",
      status: "open",
    },
    {
      id: "col-2",
      eventA: "evt-6",
      eventB: "evt-7",
      wifeA: "sophia",
      wifeB: "isabella",
      overlapMins: 120,
      severity: "high",
      status: "open",
    },
  ];
}

function createGifts(now = new Date()): Gift[] {
  const rows: Array<Omit<Gift, "id">> = [
    { wifeId: "sophia", name: "Hand-thrown matcha bowl", category: "Ceramics", price: 180, match: 94, occasion: "Anniversary", rationale: "Same kiln as the cup she broke in March. She mentioned the glaze twice.", status: "idea" },
    { wifeId: "sophia", name: "First edition — 'Remainder'", category: "Books", price: 420, match: 88, occasion: "Anniversary", rationale: "Her annotated copy is falling apart. This is the edition she borrowed from the library in 2014.", status: "idea" },
    { wifeId: "sophia", name: "Weekend — Post Ranch Inn", category: "Travel", price: 2400, match: 91, occasion: "Anniversary", rationale: "She saved the drive in a private board titled 'later'. Budget requires approval.", status: "idea" },
    { wifeId: "olivia", name: "Rumours — 1977 Japanese pressing", category: "Vinyl", price: 260, match: 97, occasion: "Birthday", rationale: "Watched the same listing twice. Price has increased 12% since the first view.", status: "idea" },
    { wifeId: "olivia", name: "Vintage signet ring, 9k", category: "Jewelry", price: 890, match: 89, occasion: "Birthday", rationale: "Saved three variations. This is the only one with the flat bezel she described as 'not trying'.", status: "idea" },
    { wifeId: "olivia", name: "Court-side tennis clinic", category: "Experience", price: 600, match: 84, occasion: "Birthday", rationale: "She booked a trial session and told no one. Calendar evidence only.", status: "idea" },
    { wifeId: "isabella", name: "Natural wine allocation — 6 bottles", category: "Wine", price: 340, match: 92, occasion: "Recovery", rationale: "Bodega Garzón plus two producers she has not tried. Avoid anything labelled 'funky'.", status: "idea" },
    { wifeId: "isabella", name: "Flamenco — front row, Sadler's Wells", category: "Experience", price: 220, match: 95, occasion: "No occasion", rationale: "She stopped dancing at 19. She has never stopped watching.", status: "idea" },
    { wifeId: "isabella", name: "Hand-embroidered linen tablecloth", category: "Home", price: 480, match: 86, occasion: "Anniversary", rationale: "From her grandmother's village. Must be framed as a find, never a replacement.", status: "idea" },
    { wifeId: "sophia", name: "Olive oil — 3L tin", category: "Pantry", price: 95, match: 99, occasion: "Just because", rationale: "Running low. She will not ask. This is the third tin; she notices the difference.", status: "purchased", acquiredAt: iso(addDays(now, -18)) },
    { wifeId: "olivia", name: "Iced matcha set", category: "Pantry", price: 74, match: 90, occasion: "Just because", rationale: "Replacement for the one she left at the studio. Same brand, different glass.", status: "purchased", acquiredAt: iso(addDays(now, -9)) },
    { wifeId: "isabella", name: "Linen apron — Ivory", category: "Home", price: 130, match: 82, occasion: "No occasion", rationale: "She complained about the straps on the current one. Twice, which is once for her.", status: "purchased", acquiredAt: iso(addDays(now, -4)) },
  ];
  return rows.map((row, i) => ({ ...row, id: `gift-${i}` }));
}

function createGiftHistory(now = new Date()): GiftHistoryPoint[] {
  const base: Array<[number, number, number]> = [
    [180, 260, 120],
    [240, 140, 340],
    [95, 320, 210],
    [420, 180, 160],
    [130, 240, 390],
    [95, 74, 130],
  ];
  return base.map(([s, o, i], idx) => ({
    month: format(addMonths(now, idx - 5), "MMM"),
    sophia: s,
    olivia: o,
    isabella: i,
  }));
}

function createIncidents(now = new Date()): Incident[] {
  const at = (mins: number) => iso(addMinutes(now, -mins));
  return [
    {
      id: "inc-1",
      code: "INC-0847",
      title: "WIFE 02 HAS ASKED ABOUT WIFE 01",
      wifeId: "olivia",
      severity: "severe",
      status: "open",
      exposureRisk: 94,
      urgency: "CRITICAL",
      openedAt: at(42),
      summary:
        "Olivia asked who Jessica is. The identity resolver returned three candidate entities across two namespaces. One of them is Sophia's gallery contact. Outbound drafting has been paused pending review.",
      evidence: [
        "Olivia: \"who's jessica\" — received 20:14",
        "Identity resolver: 3 candidate entities named Jessica",
        "Namespace ns.sophia.v2 contains 1 matching entity",
        "Shared-device calendar preview was visible for 11 seconds",
        "Auto-drafting halted by cross-context safety check",
      ],
      analysis: [
        "Three entities named Jessica exist in the system. Two belong to Olivia's context. One belongs to Sophia's.",
        "The message is a two-word query with no punctuation. Historical pattern maps this to Olivia testing a suspicion, not asking for information.",
        "Probability that a generic answer increases suspicion: 62%. Probability that an over-specific answer creates a new thread: 31%.",
        "Recommended posture: minimal disclosure, immediate redirection to an existing shared plan. Do not volunteer a surname, employer, or neighborhood.",
        "Do not use the word 'just' in the first sentence. She reads it as a tell.",
      ],
      drafts: [
        {
          id: "draft-1a",
          label: "Minimal disclosure",
          text: "Jess is a work contact. Boring. Tell me about the florist — did they confirm?",
          confidence: 88,
          risk: 18,
          tone: "Low commitment",
        },
        {
          id: "draft-1b",
          label: "Clarify, hold position",
          text: "Which Jessica? I know a few. You'll have to be more specific.",
          confidence: 64,
          risk: 34,
          tone: "Neutral",
        },
        {
          id: "draft-1c",
          label: "Deflect — not recommended",
          text: "My cousin's friend. She's been helping with the gallery thing. Why?",
          confidence: 71,
          risk: 62,
          tone: "Over-explains",
        },
      ],
      timeline: [
        { at: at(42), label: "Message received", detail: "Inbound classified as relationship-risk query.", actor: "system" },
        { at: at(41), label: "Identity resolution", detail: "Three candidate entities returned under threshold ambiguity.", actor: "ai" },
        { at: at(41), label: "Safety check failed", detail: "Cross-context reference probability above 90%.", actor: "system" },
        { at: at(40), label: "Drafting paused", detail: "All outbound responses for Wife 02 are held for commander approval.", actor: "system" },
      ],
    },
    {
      id: "inc-2",
      code: "INC-0846",
      title: "Duplicate gift vector detected",
      wifeId: "isabella",
      severity: "high",
      status: "open",
      exposureRisk: 38,
      urgency: "HIGH",
      openedAt: at(190),
      summary:
        "The signet ring shortlisted for Olivia matches a saved item in Isabella's memory vault. Fulfillment has been paused before procurement.",
      evidence: [
        "Gift match: 89% — vintage signet ring, 9k",
        "Isabella memory: 'signet rings' saved 14 months ago",
        "No purchase executed. No delivery scheduled.",
      ],
      analysis: [
        "This is a pre-procurement collision, not an exposure event. No external signal has been emitted.",
        "The ring is available in two sizes. A second, differently sourced piece would resolve the visual overlap without breaking either preference.",
        "Recommendation: proceed with Olivia's ring, replace Isabella's placeholder with the linen tablecloth. Do not mention the substitution in either context.",
      ],
      drafts: [
        {
          id: "draft-2a",
          label: "Internal note",
          text: "Swap Isabella's gift slot to the linen tablecloth. Keep Olivia's ring. No cross-context mention.",
          confidence: 93,
          risk: 9,
          tone: "Operational",
        },
      ],
      timeline: [
        { at: at(190), label: "Gift graph collision", detail: "Same category, same silhouette, two namespaces.", actor: "system" },
        { at: at(188), label: "Procurement frozen", detail: "No vendor was contacted.", actor: "system" },
      ],
    },
    {
      id: "inc-3",
      code: "INC-0839",
      title: "Calendar proximity anomaly — 380m",
      wifeId: "sophia",
      severity: "moderate",
      status: "resolved",
      exposureRisk: 12,
      urgency: "ROUTINE",
      openedAt: at(1440),
      summary:
        "Two relationships held reservations within 380 meters on consecutive evenings. No shared staff, no shared table, no overlap window. Reservation moved as a precaution.",
      evidence: [
        "Sophia: Il Nido, Thursday 19:00",
        "Olivia: Bar Part Time, Friday 20:30",
        "Distance: 380m. Shared staff probability: low.",
      ],
      analysis: [
        "No temporal overlap. The risk was architectural, not behavioral.",
        "Reservation moved to Le Fantôme. Sophia prefers the room. Olivia keeps the bar.",
        "No further action required. Monitoring continues for 14 days.",
      ],
      drafts: [],
      timeline: [
        { at: at(1440), label: "Proximity detected", detail: "Same neighborhood, consecutive evenings.", actor: "system" },
        { at: at(1380), label: "Venue rotated", detail: "Sophia's reservation moved to Le Fantôme.", actor: "commander" },
        { at: at(1370), label: "Incident contained", detail: "Exposure risk reduced to baseline.", actor: "system" },
      ],
    },
  ];
}

function createActivity(now = new Date()): ActivityEvent[] {
  const at = (mins: number) => iso(addMinutes(now, -mins));
  return [
    { id: "act-1", at: at(2), wifeId: "system", kind: "system", title: "All contexts synchronized", detail: "3 namespaces · 2,418 vectors · 0 cross-reads", tone: "ok" },
    { id: "act-2", at: at(6), wifeId: "olivia", kind: "message", title: "Draft prepared", detail: "96% style match · awaiting approval", tone: "ok" },
    { id: "act-3", at: at(11), wifeId: "sophia", kind: "calendar", title: "Anniversary protocol armed", detail: "T-14 days · gift shortlist locked", tone: "ok" },
    { id: "act-4", at: at(18), wifeId: "isabella", kind: "alert", title: "Emotional debt threshold crossed", detail: "58 / 100 · recovery strategy prepared", tone: "warn" },
    { id: "act-5", at: at(26), wifeId: "olivia", kind: "alert", title: "Cross-context proximity flagged", detail: "Identity resolver paused outbound drafting", tone: "critical" },
    { id: "act-6", at: at(34), wifeId: "system", kind: "memory", title: "Memory index updated", detail: "12 new vectors · importance ≥ 3", tone: "ok" },
    { id: "act-7", at: at(51), wifeId: "sophia", kind: "gift", title: "Gift shortlist updated", detail: "Green tile lamp — 94% match", tone: "ok" },
    { id: "act-8", at: at(78), wifeId: "isabella", kind: "message", title: "Response staged for approval", detail: "Tone: direct · risk: low", tone: "ok" },
  ];
}

export function createInitialState(now = new Date()): DemoState {
  const wives = createWives(now);
  const events = createEvents(now);
  return {
    version: 1,
    startedAt: iso(now),
    commander: {
      name: "Commander",
      email: "commander@3wives.ai",
      plan: "triple",
      timezone: "America/Los_Angeles",
    },
    wives,
    messages: createMessages(now),
    memories: createMemories(now),
    events,
    collisions: createCollisions(events),
    gifts: createGifts(now),
    giftHistory: createGiftHistory(now),
    incidents: createIncidents(now),
    activity: createActivity(now),
    settings: {
      autoDraft: true,
      strictIsolation: true,
      collisionAlerts: true,
      emotionalAlerts: true,
      giftAlerts: false,
      toneMirroring: 87,
      emojiFidelity: 92,
      latencyTarget: 400,
      greeting: "Good evening, Commander.",
    },
    analytics: {
      stability: Array.from({ length: 14 }, (_, i) => {
        const s = [91, 92, 93, 93, 94, 94, 95, 94, 95, 96, 95, 96, 96, 96][i];
        const o = [84, 83, 85, 84, 82, 81, 83, 82, 80, 79, 80, 78, 79, 78][i];
        const b = [71, 72, 70, 69, 68, 66, 67, 65, 64, 63, 64, 62, 63, 62][i];
        return {
          label: format(addDays(now, i - 13), "MMM d"),
          sophia: s,
          olivia: o,
          isabella: b,
        };
      }),
      attention: [
        { wifeId: "sophia", value: 38 },
        { wifeId: "olivia", value: 34 },
        { wifeId: "isabella", value: 28 },
      ],
      emotionalDebt: [
        { wifeId: "sophia", value: 12, trend: -3 },
        { wifeId: "olivia", value: 34, trend: 6 },
        { wifeId: "isabella", value: 58, trend: 11 },
      ],
      latency: [312, 288, 340, 402, 366, 295, 318, 280, 305, 292, 336, 298, 276, 302],
      leakage: 0.4,
      coverage: [
        { wifeId: "sophia", value: 92 },
        { wifeId: "olivia", value: 74 },
        { wifeId: "isabella", value: 61 },
      ],
      inferenceVolume: [142, 168, 151, 190, 204, 187, 176, 212, 231, 208, 244, 219, 236, 258],
    },
  };
}

/**
 * Fixed anchor used by marketing previews. Prerendering forbids computing the
 * current time during render, and a fixed anchor also keeps the server HTML and
 * the client hydration byte-identical.
 */
export const DEMO_NOW = new Date("2026-11-18T20:16:00-08:00");
