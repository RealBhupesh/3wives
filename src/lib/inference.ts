import type { Memory, Message, Sentiment, Wife } from "./types";
import { clamp, seeded } from "./utils";

export interface GeneratedAlternative {
  label: string;
  text: string;
}

export interface GeneratedResponse {
  id: string;
  text: string;
  alternatives: GeneratedAlternative[];
  confidence: number;
  styleMatch: number;
  sentiment: Sentiment;
  risk: number;
  latencyMs: number;
  intent: string;
  memories: Memory[];
}

type Intent =
  | "jealousy"
  | "apology"
  | "date"
  | "gift"
  | "affection"
  | "support"
  | "greeting"
  | "logistics"
  | "generic";

const INTENT_PATTERNS: Array<[Intent, RegExp]> = [
  ["jealousy", /\b(who('?s| is| was)|jessica|where (were|have) you|why (didn'?t|didnt|are you)|are you (seeing|with)|other woman)\b/i],
  ["apology", /\b(sorry|apolog(y|ize|ise)|my fault|forgive|i messed up|i was wrong)\b/i],
  ["date", /\b(dinner|drinks|friday|thursday|weekend|tonight|tomorrow|reservation|book(ed)?|date night|anniversary)\b/i],
  ["gift", /\b(gift|present|birthday|flowers|surprise|buy you|wishlist)\b/i],
  ["affection", /\b(love you|miss you|thinking (of|about) you|beautiful|amazing|proud of you|adore)\b/i],
  ["support", /\b(tired|rough day|stressed|exhausted|bad day|work is|overwhelmed|long day|hard day)\b/i],
  ["greeting", /^\s*(hey|hi|hello|morning|good morning|good evening|gm|yo)\b/i],
  ["logistics", /\b(time|pick (me )?up|uber|address|plan(s)?|schedule|when|what time|confirm)\b/i],
];

function detectIntent(input: string): Intent {
  for (const [intent, pattern] of INTENT_PATTERNS) {
    if (pattern.test(input)) return intent;
  }
  return "generic";
}

interface VoicePack {
  sentiment: Sentiment;
  labels: [string, string];
  lines: Record<Intent, [string, string, string]>;
}

const VOICES: Record<Wife["id"], VoicePack> = {
  sophia: {
    sentiment: "warm",
    labels: ["Warmer", "More direct"],
    lines: {
      jealousy: [
        "That's a very specific question for a Tuesday. I'll answer it, but I'd rather do it looking at you.",
        "I'm not going to pretend that's a small question. Ask me plainly and you'll get a plain answer.",
        "You already know the answer, or you wouldn't have asked it like that. Come home and ask me again.",
      ],
      apology: [
        "I don't need the apology. I need the thing you're apologizing for to not happen again. But yes, come over.",
        "Apology received. I'm not keeping score — I'm keeping a calendar, which is worse.",
        "You're forgiven. Bring the olive oil from the front of the cupboard, not the back, and we'll call it even.",
      ],
      date: [
        "I've already moved things around, which you know I hate doing. Seven, and don't be charming about being late.",
        "Seven works. I'll pretend I wasn't going to be there at 6:45 anyway.",
        "Booked. I've picked the place, so you can spend your energy on arriving on time.",
      ],
      gift: [
        "You're asking about gifts, which means you've remembered something. I'm cautiously impressed.",
        "Don't buy me something because a date is approaching. Buy me the thing I pointed at in March.",
        "I don't need a grand gesture. I need you to have noticed the lamp.",
      ],
      affection: [
        "You're being charming. It's working, which is inconvenient.",
        "I love you too. I'm saying it plainly so you don't have to guess.",
        "That's the version of you I married. Keep him around.",
      ],
      support: [
        "Come home. I'll make the thing you like and we don't have to talk about it until you're ready.",
        "You don't have to perform being fine with me. Just come home.",
        "Tell me the short version now and the long version after dinner.",
      ],
      greeting: [
        "Morning. There's espresso. It's 6:40, so I assume you're not going to say anything profound.",
        "Good morning. I've already answered three emails and negotiated with a tile. What's your day looking like?",
        "Hello. The balcony is warm and the phone is inside. That's the whole update.",
      ],
      logistics: [
        "Fine. But write it down, because I'm not going to be the only one holding this week together.",
        "Confirmed. I've put it in the calendar. Please don't make me be the calendar.",
        "That works. I'll handle the reservation if you handle the part where you show up.",
      ],
      generic: [
        "That's a lot of words for someone who hasn't had coffee. Say the important one again, slower.",
        "I hear you. I'm also watching you decide whether to say the second thing.",
        "Okay. Tell me the part you almost left out.",
      ],
    },
  },
  olivia: {
    sentiment: "playful",
    labels: ["Softer", "Shorter"],
    lines: {
      jealousy: [
        "that's not an answer. but okay. i'll ask again when i'm less annoyed 😌",
        "you're doing the thing where you give me a sentence instead of the truth. try again",
        "who's jessica. i'm not asking for a biography. i'm asking why you paused.",
      ],
      apology: [
        "apology acknowledged. probation continues 🫡",
        "okay. but you're buying the coffee for a week and i'm not reminding you",
        "i don't need a speech. i need friday to actually happen.",
      ],
      date: [
        "okay but if the lighting is bad i'm leaving and you're coming with me",
        "friday. 8. and don't say 'i'll send the place' unless you actually send the place",
        "yes. i'm already thinking about what to wear, which is your problem now",
      ],
      gift: [
        "you're hinting. it's cute. i'm not helping.",
        "i want the thing i sent you. not a version of it. the thing.",
        "surprise me, but read the room first. and the lighting.",
      ],
      affection: [
        "you're lucky you're cute when you're being sincere",
        "okay that was actually nice. i'm keeping it.",
        "don't get mushy, i'm wearing mascara 😭",
      ],
      support: [
        "come over. i'll pretend to be normal for an hour and then we can talk about it",
        "that sounds like a day. do you want advice or do you want me to order food",
        "i'm not going to fix it. i'm going to sit next to you and be annoying until you laugh. okay?",
      ],
      greeting: [
        "morning. your coffee machine is still alive. barely.",
        "hi. i've been awake for four hours. don't ask.",
        "good morning 🌤️ i'm already behind schedule and it's 8am",
      ],
      logistics: [
        "send it in writing or it didn't happen",
        "okay but you're responsible for the details. i'm just showing up and looking great",
        "fine. put it in the calendar before you forget and then blame me.",
      ],
      generic: [
        "that's a very you thing to say. continue.",
        "hmm. say more. i can tell there's more.",
        "i'm listening. mostly. the tennis match is on.",
      ],
    },
  },
  isabella: {
    sentiment: "strained",
    labels: ["Softer", "More direct"],
    lines: {
      jealousy: [
        "No me gusta esta pregunta. But I will answer it, because I don't lie. Ask what you actually mean.",
        "I heard the pause before the question. Say the real one.",
        "You want me to be calm about this. I can be honest instead.",
      ],
      apology: [
        "I don't want the apology. I want the next four Thursdays.",
        "An apology is a sentence. I'm waiting for the verb.",
        "Okay. Come here. But don't make me ask twice next time.",
      ],
      date: [
        "Thursday. 9pm. You will be there at 8:50 and you will mean it.",
        "I reserved the table by the kitchen. It is the good one. Don't waste it.",
        "Nine. Not 9:10 with a story. Nine.",
      ],
      gift: [
        "A gift is not an apology. But I would like to know what you're planning.",
        "Don't buy me something to end a conversation. Buy me something because you were listening.",
        "I don't want expensive. I want specific.",
      ],
      affection: [
        "Dime otra vez. I want to hear it without the joke at the end.",
        "I love you. I said it first. I always do.",
        "You say it like you're testing the word. Say it like you mean it.",
      ],
      support: [
        "Come. I'll feed you and you don't have to explain. But don't disappear into yourself for four hours.",
        "I can't fix your day. I can make sure you don't spend it alone.",
        "Tell me the truth. The short one. Then eat something.",
      ],
      greeting: [
        "Good morning. Did you sleep, or did you just close your eyes and call it sleep?",
        "Buenos días. There is coffee. There is also a conversation waiting.",
        "Morning. You were far away last night. Even in the same room.",
      ],
      logistics: [
        "Write it down. I'm tired of being the memory for both of us.",
        "Confirmed. But I want to hear you say the time back to me.",
        "Okay. And if it changes, you tell me before it changes. Not after.",
      ],
      generic: [
        "You're saying something. I'm waiting for the part you're not saying.",
        "I'm listening. But look at me when you say it.",
        "Maybe. Tell me what you actually want.",
      ],
    },
  },
};

const INTENT_LABEL: Record<Intent, string> = {
  jealousy: "Interpersonal inquiry",
  apology: "Repair attempt",
  date: "Logistics / intimacy",
  gift: "Gift planning",
  affection: "Affection",
  support: "Emotional support",
  greeting: "Greeting",
  logistics: "Coordination",
  generic: "Open conversation",
};

function relevantMemories(wifeId: Wife["id"], input: string, memories: Memory[]): Memory[] {
  const pool = memories.filter((m) => m.wifeId === wifeId);
  const words = input.toLowerCase().split(/[^a-z0-9']+/).filter((w) => w.length > 3);
  const scored = pool
    .map((memory) => {
      const haystack = `${memory.title} ${memory.detail} ${memory.kind}`.toLowerCase();
      const keywordHits = words.filter((word) => haystack.includes(word)).length;
      return { memory, score: keywordHits * 4 + memory.importance + (memory.pinned ? 2 : 0) };
    })
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((s) => s.memory);
}

function sentimentFor(wife: Wife, intent: Intent): Sentiment {
  if (intent === "jealousy") return "guarded";
  if (wife.health < 70) return intent === "affection" ? "strained" : "guarded";
  if (intent === "support" || intent === "affection") return "warm";
  if (wife.id === "olivia") return "playful";
  return wife.health >= 90 ? "warm" : "neutral";
}

export function generateResponse(input: {
  wife: Wife;
  memories: Memory[];
  history: Message[];
  text: string;
  variantSeed?: number;
}): GeneratedResponse {
  const { wife, memories, history, text } = input;
  const intent = detectIntent(text);
  const voice = VOICES[wife.id];
  const seed = `${wife.id}-${text.length}-${history.length}-${input.variantSeed ?? 0}`;
  const jitter = seeded(seed);
  const lines = voice.lines[intent];
  const primaryIndex = Math.floor(jitter * lines.length) % lines.length;
  const ordered = [lines[primaryIndex], ...lines.filter((_, i) => i !== primaryIndex)];
  const confidence = Math.round(
    clamp(
      72 + (intent === "generic" ? 0 : 9) + Math.min(text.length / 9, 9) + (wife.health / 100) * 6 + jitter * 4,
      58,
      98,
    ),
  );
  const risk = Math.round(
    clamp(
      (intent === "jealousy" ? 58 : intent === "gift" ? 22 : 12) +
        (100 - wife.health) * 0.28 +
        (intent === "generic" ? 8 : 0),
      4,
      92,
    ),
  );

  return {
    // Derived from inputs, not the clock: inference also runs during prerender,
    // where an unstable id would fail the build and break hydration.
    id: `gen-${wife.id}-${Math.round(jitter * 1_000_000)}-${input.variantSeed ?? 0}`,
    text: ordered[0],
    alternatives: [
      { label: voice.labels[0], text: ordered[1] },
      { label: voice.labels[1], text: ordered[2] },
    ],
    confidence,
    styleMatch: Math.round(clamp(confidence + 3 + jitter * 3, 60, 99)),
    sentiment: sentimentFor(wife, intent),
    risk,
    latencyMs: Math.round(240 + jitter * 190),
    intent: INTENT_LABEL[intent],
    memories: relevantMemories(wife.id, text, memories),
  };
}

export const STARTER_PROMPTS: Record<Wife["id"], string[]> = {
  sophia: ["I'm sorry about last night.", "I booked Saturday. 7pm.", "Tell me about the tile."],
  olivia: ["Who's Jessica?", "Dinner Friday? I'll book it.", "You still awake?"],
  isabella: ["I'll be there at 8:50.", "I'm sorry I went quiet.", "How was your mother?"],
};

export const EMOJI_HABITS: Record<Wife["id"], string> = {
  sophia: "Rare. Never for emphasis. One period, not three.",
  olivia: "Frequent, lowercase, 👀 for suspicion, 😌 for victory.",
  isabella: "Almost never in text. Warmth is expressed as specificity.",
};
