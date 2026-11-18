import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading, FeatureFrame } from "./section";
import { TwinDemo } from "./feature-twin";
import { IsolationDemo } from "./feature-isolation";
import { CollisionDemo } from "./feature-collision";
import { AnniversaryDemo } from "./feature-anniversary";
import { EmotionalDemo } from "./feature-emotional";
import { GiftDemo } from "./feature-gift";
import { IncidentDemo } from "./feature-incident";

function CompactFeature({
  kicker,
  title,
  description,
  children,
  id,
  tone,
}: {
  tone: "sophia" | "olivia" | "isabella";
  kicker: string;
  title: string;
  description: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <div id={id} className="flex scroll-mt-24 flex-col overflow-hidden rounded-[28px] border border-line bg-white">
      <div className={`stage stage-${tone} !rounded-none !p-5`}>
        <div className="relative shadow-[0_18px_40px_-24px_rgba(30,20,90,0.35)]">{children}</div>
      </div>
      <div className="flex-1 p-6">
        <p className="mono-label">{kicker}</p>
        <h3 className="mt-2 text-[20px] font-bold leading-tight tracking-[-0.025em]">{title}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">{description}</p>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="product" className="container-page scroll-mt-20 py-20 md:py-28">
      <SectionHeading
        kicker="The platform"
        title={
          <>
            Seven systems.
            <br />
            <span className="text-muted">One identity.</span>
          </>
        }
        description="Every layer of the stack exists for the same reason: three relationships must feel like three complete lives, while remaining one coherent operation."
        action={
          <Link
            href="/engine"
            className="group inline-flex items-center gap-2 rounded-md border border-line px-3.5 py-2 text-[11.5px] text-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            Inspect the engine
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        }
      />

      <div className="mt-14 md:mt-20">
        <FeatureFrame
          id="twin"
          tone="olivia"
          kicker="Identity"
          title="Replies that sound like you, because they learn from you."
          description="The conversational twin learns vocabulary, rhythm, humor, emoji habits, and tone from your own messages. Drafts arrive in your voice, never a generic one, and nothing is sent without you."
          bullets={[
            "Per-relationship voice model trained on your own messages",
            "Style match scored before any draft is surfaced",
            "Memory-grounded replies with explicit references",
          ]}
          link={{ href: "/dashboard/conversations", label: "Open conversations" }}
        >
          <TwinDemo />
        </FeatureFrame>

        <FeatureFrame
          id="isolation"
          tone="isabella"
          kicker="Isolation"
          title="Each relationship is its own private world."
          description="Each relationship owns a separate vector memory namespace with its own retrieval key. The router resolves identity before it touches memory. There is no shared buffer to leak."
          bullets={[
            "One namespace per relationship, cryptographically separated",
            "Cross-context reads blocked at the policy layer, not the prompt layer",
            "Every access attempt written to an immutable audit trail",
          ]}
          reverse
          link={{ href: "/dashboard/memory", label: "Inspect the memory vault" }}
        >
          <IsolationDemo />
        </FeatureFrame>

        <FeatureFrame
          id="collision"
          tone="sophia"
          kicker="Coordination"
          title="Conflicts resolved before they reach your calendar."
          description="The collision engine reads three calendars, travel buffers, and conversational commitments. When two plans overlap, it proposes a considerate change before the conflict ever reaches you."
          bullets={[
            "Overlap detection across all three calendars",
            "Automatic reschedule with a plausible, per-context reason",
            "Zero cross-context references in the generated explanation",
          ]}
          link={{ href: "/dashboard/calendar", label: "Open calendar & collisions" }}
        >
          <CollisionDemo />
        </FeatureFrame>
      </div>

      <div className="mt-10 md:mt-14">
        <div className="grid gap-5 lg:grid-cols-3">
          <CompactFeature
            id="anniversary"
          tone="sophia"
            kicker="Memory"
            title="Every date remembered. Every gift considered."
            description="Occasions are resolved once, then armed across redundant reminders. Gift history is checked before any recommendation reaches you."
          >
            <AnniversaryDemo />
          </CompactFeature>
          <CompactFeature
            id="emotional"
          tone="olivia"
            kicker="Emotion"
            title="Understand how each person is really feeling."
            description="An independent emotional context model per relationship. The recommendation changes before the conversation does."
          >
            <EmotionalDemo />
          </CompactFeature>
          <CompactFeature
            id="gift"
          tone="isabella"
            kicker="Gifts"
            title="Thoughtful gifts, chosen for who they are."
            description="Every suggestion is weighed against her interests, the occasion, and what you have already given."
          >
            <GiftDemo />
          </CompactFeature>
        </div>
      </div>

      <div className="mt-16 md:mt-20">
        <FeatureFrame
          id="incident"
          tone="danger"
          kicker="Response"
          title="When something goes wrong, a calm plan in seconds."
          description="When a difficult question arrives, 3Wives pauses all drafting, gathers the relevant context, and prepares three considered responses for you to choose from. Nothing is sent without you."
          bullets={[
            "Identity resolution across every namespace in under 300ms",
            "Response staging with confidence and risk scores",
            "Damage control sequence with a complete audit trail",
          ]}
          reverse
          link={{ href: "/dashboard/incidents", label: "Open incident center" }}
        >
          <IncidentDemo />
        </FeatureFrame>
      </div>
    </section>
  );
}
