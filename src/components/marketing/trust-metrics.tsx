import { Clock3, Gift, Lock, Users } from "lucide-react";
import { Portrait } from "./art";

const PEOPLE = [
  {
    key: "sophia" as const,
    name: "Sophia",
    since: "Together 9 years",
    stage: "stage-sophia",
    color: "#f26b1d",
    tint: "#fff3ea",
    text: "#b4500f",
    mood: "Warm",
    memories: ["Allergic to lilies", "Anniversary: Fri, Dec 5", "Mom's lemon tart, Sundays"],
  },
  {
    key: "olivia" as const,
    name: "Olivia",
    since: "Together 4 years",
    stage: "stage-olivia",
    color: "#6e56f8",
    tint: "#f0edff",
    text: "#4b35d6",
    mood: "Playful",
    memories: ["Sister Clara's recital", "Birthday in 8 days", "Collects tiny plants"],
  },
  {
    key: "isabella" as const,
    name: "Isabella",
    since: "Together 2 years",
    stage: "stage-isabella",
    color: "#0f9d8a",
    tint: "#e6f8f4",
    text: "#0b7a6b",
    mood: "Intense",
    memories: ["Wants a call by 9 PM", "Brunch spot: Marlowe", "Training for a half marathon"],
  },
];

const METRICS = [
  { icon: Lock, value: "99.99%", label: "Context isolation, audited quarterly", from: "#8f7bff", to: "#5b4cf5" },
  { icon: Gift, value: "0", label: "Anniversaries forgotten since launch", from: "#ffa66b", to: "#f26b1d" },
  { icon: Clock3, value: "286ms", label: "Median time to a reply in your voice", from: "#4fd1b5", to: "#0f9d8a" },
  { icon: Users, value: "41k", label: "Members who rely on 3Wives every day", from: "#7dd3fc", to: "#0284c7" },
];

export function TrustMetrics() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-page">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="mono-label justify-center">
            <span className="triad" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            Why 3Wives
          </p>
          <h2 className="heading mt-5 text-[clamp(36px,5vw,64px)]">Three people. Three worlds. One you.</h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[17px] leading-[1.6] text-muted">
            Each relationship gets its own memory, its own voice and its own calendar, so you can give each person
            your full attention.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PEOPLE.map((p) => (
            <article key={p.key} className={`stage ${p.stage} !p-0`}>
              <div className="flex items-end justify-between px-6 pt-6">
                <Portrait spec={p.key} size={96} rounded="xl" className="shadow-[0_14px_30px_-12px_rgba(9,9,11,0.35)]" />
                <span
                  className="rounded-full px-2.5 py-1 text-[12px] font-semibold"
                  style={{ background: "#fff", color: p.text }}
                >
                  {p.mood}
                </span>
              </div>
              <div className="px-6 pb-6 pt-5">
                <h3 className="text-[22px] font-bold tracking-[-0.02em]">{p.name}</h3>
                <p className="text-[13.5px] text-muted">{p.since}</p>
                <ul className="mt-5 space-y-2">
                  {p.memories.map((m) => (
                    <li
                      key={m}
                      className="flex items-center gap-2.5 rounded-xl bg-white/85 px-3 py-2.5 text-[13.5px] shadow-[0_1px_2px_rgba(9,9,11,0.05)]"
                    >
                      <span className="size-2 shrink-0 rounded-full" style={{ background: p.color }} />
                      {m}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center gap-2 text-[12.5px]" style={{ color: p.text }}>
                  <Lock className="size-3.5" />
                  Private namespace, never shared
                </div>
              </div>
            </article>
          ))}
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {METRICS.map(({ icon: Icon, value, label, from, to }) => (
            <div key={label} className="rounded-3xl border border-line bg-white p-6 shadow-[0_1px_2px_rgba(9,9,11,0.04)]">
              <span
                className="icon-tile size-10"
                style={{ background: `linear-gradient(135deg, ${from}, ${to})`, ["--tile-shadow" as string]: `${to}99` }}
              >
                <Icon className="size-5" />
              </span>
              <dt className="sr-only">{label}</dt>
              <dd className="mt-6 text-[clamp(36px,4.2vw,52px)] font-extrabold leading-none tracking-[-0.04em] tabular-nums">
                {value}
              </dd>
              <dd className="mt-3 max-w-[220px] text-[14px] leading-snug text-muted">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
