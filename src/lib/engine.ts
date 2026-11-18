export interface EngineStage {
  id: string;
  name: string;
  short: string;
  description: string;
  model: string;
  guard: string;
  latency: number;
  input: string;
  output: string;
  log: string;
}

export const ENGINE_STAGES: EngineStage[] = [
  {
    id: "ingest",
    name: "Incoming message",
    short: "Normalize",
    description:
      "Every inbound payload is normalized into a canonical event: sender, channel, timestamp, thread state, attachment hashes. No identity assumptions are made at this layer.",
    model: "ingest.normalizer.v4",
    guard: "Attachment content is hashed and quarantined until the context is resolved.",
    latency: 12,
    input: "raw message · channel metadata",
    output: "canonical.event.v1",
    log: "ingest: canonical event created · 0 identity assumptions",
  },
  {
    id: "identity",
    name: "Identity resolver",
    short: "Resolve",
    description:
      "Resolves the sender and every named entity to a relationship identity. Ambiguity above threshold pauses the pipeline and raises a safety flag rather than guessing.",
    model: "identity.resolver.v3",
    guard: "Ambiguity threshold 0.92. Unresolved entities never enter generation.",
    latency: 34,
    input: "canonical.event.v1",
    output: "identity.context · entity graph",
    log: "identity: 3 candidate entities · ambiguity 0.07 below threshold",
  },
  {
    id: "route",
    name: "Relationship context router",
    short: "Route",
    description:
      "Selects exactly one relationship namespace. The router has no multi-namespace mode; a request that would require two contexts is rejected by design.",
    model: "router.context.v2",
    guard: "Single-namespace invariant. No shared buffer exists.",
    latency: 18,
    input: "identity.context",
    output: "namespace handle · read scope",
    log: "router: routed to ns.olivia.v2 · scope=single",
  },
  {
    id: "memory",
    name: "Isolated memory retrieval",
    short: "Retrieve",
    description:
      "Retrieves the top-k relevant vectors from the selected namespace only. Importance, recency, and pinning are weighted; sensitive memories require higher confidence to surface.",
    model: "retrieval.hybrid.v5",
    guard: "Read key scoped to one namespace. Cross-namespace reads are cryptographically impossible.",
    latency: 46,
    input: "query vector · namespace handle",
    output: "retrieved memories · scores",
    log: "memory: 5 vectors retrieved · 0 cross-namespace reads",
  },
  {
    id: "emotion",
    name: "Emotional state analysis",
    short: "Analyze",
    description:
      "Estimates the current emotional state from message length, punctuation, latency, prior 14 days, and unresolved commitments. Outputs a state vector applied to generation.",
    model: "emotion.state.v2",
    guard: "State is scoped to the relationship. It never informs another context.",
    latency: 38,
    input: "retrieved context · recent history",
    output: "state vector · risk flags",
    log: "emotion: state=guarded · patience low · unresolved thread detected",
  },
  {
    id: "generate",
    name: "Personalized response generation",
    short: "Generate",
    description:
      "Generates three candidate responses in the commander's voice for the selected relationship, each grounded in retrieved memory and constrained by the relationship's boundaries.",
    model: "voice.twin.v6",
    guard: "Boundary constraints applied before ranking. No invented shared history.",
    latency: 96,
    input: "state vector · retrieved memories · voice model",
    output: "3 candidate responses · scores",
    log: "generate: 3 candidates · style match 96% · boundary check pass",
  },
  {
    id: "safety",
    name: "Cross-context safety check",
    short: "Verify",
    description:
      "Scans each candidate for entities, dates, stories, and calendar details that belong to another relationship. Any overlap above threshold blocks the response.",
    model: "safety.crosscontext.v4",
    guard: "Blocking, not warning. The draft cannot be staged while a violation exists.",
    latency: 27,
    input: "candidate responses · full entity graph",
    output: "pass / block · risk score",
    log: "safety: 0 cross-context entities · risk 18% · pass",
  },
  {
    id: "approve",
    name: "Response preview / approval",
    short: "Approve",
    description:
      "Presents the ranked response with confidence, emotional read, and memory references. Nothing is sent automatically; the commander approves or discards.",
    model: "approval.console.v1",
    guard: "Human approval required. No external messaging integration in this environment.",
    latency: 15,
    input: "verified candidate · scores",
    output: "staged draft · approval record",
    log: "approve: draft staged · awaiting commander approval",
  },
];

export const TOTAL_P50 = ENGINE_STAGES.reduce((sum, stage) => sum + stage.latency, 0);
