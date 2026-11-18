import { Portrait } from "./art";

const QUOTES = [
  {
    quote:
      "I used to carry three calendars in my head. 3Wives carries them now, and for the first time in years I'm actually present at dinner.",
    who: "Founder, fintech company",
    initials: "D.K.",
    portrait: "m1" as const,
  },
  {
    quote:
      "It noticed I was about to share a story in the wrong conversation and paused the draft. That one moment was worth the subscription.",
    who: "Partner, law firm",
    initials: "R.M.",
    portrait: "m2" as const,
  },
  { quote: "Nothing important slips anymore.", who: "VP Sales, EMEA", initials: "A.S.",
    portrait: "m3" as const, feature: true },
  {
    quote:
      "The privacy architecture is what convinced me. Each relationship genuinely is its own world, and I can see the audit trail that proves it.",
    who: "CTO, health-tech company",
    initials: "J.T.",
    portrait: "m4" as const,
  },
  {
    quote: "I spend less time managing my life and more time living it.",
    who: "Managing director, private equity",
    initials: "M.H.",
    portrait: "m5" as const,
    feature: true,
  },
  {
    quote: "Setup took a minute. The difference showed up the same evening.",
    who: "Head of Growth, consumer app",
    initials: "L.P.",
    portrait: "m6" as const,
  },
];

export function Testimonials() {
  return (
    <section id="customers" className="scroll-mt-24 border-t border-line bg-surface-2 py-24 md:py-32">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="heading max-w-[640px] text-[clamp(38px,5.2vw,68px)]">Trusted with what matters most.</h2>
          <p className="max-w-[360px] text-[15px] leading-relaxed text-muted">
            Our members share their stories on the condition of anonymity. We think that&apos;s the right default.
          </p>
        </div>

        <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {QUOTES.map((q) => (
            <figure key={q.initials} className={q.feature ? "stage stage-olivia mb-4 break-inside-avoid !p-7" : "mb-4 break-inside-avoid rounded-3xl border border-line bg-white p-7 shadow-[0_1px_2px_rgba(9,9,11,0.04)]"}>
              <blockquote
                className={
                  q.feature
                    ? "text-[28px] font-bold leading-[1.15] tracking-[-0.03em]"
                    : "text-[16px] leading-[1.65] text-ink"
                }
              >
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3 border-t border-line pt-5">
                <Portrait spec={q.portrait} size={40} />
                <span className="text-[13.5px] leading-tight">
                  <span className="block font-semibold text-ink">Verified member</span>
                  <span className="text-muted">{q.who}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
