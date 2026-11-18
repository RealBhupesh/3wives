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
}: {
  kicker: string;
  title: string;
  description: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <div id={id} className="flex scroll-mt-24 flex-col rounded-lg border border-line bg-[#0a0b10] p-4">
      <p className="mono-label">{kicker}</p>
      <h3 className="mt-2.5 text-[19px] font-medium leading-tight tracking-[-0.02em]">{title}</h3>
      <p className="mt-2 min-h-[48px] text-[12px] leading-relaxed text-muted">{description}</p>
      <div className="mt-4 flex-1">{children}</div>
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
            className="group inline-flex items-center gap-2 rounded-md border border-line px-3.5 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            Inspect the engine
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        }
      />

      <div className="mt-14 md:mt-20">
        <FeatureFrame
          id="twin"
          kicker="01 — Identity"
          title="She thinks it's you. Because it sounds exactly like you."
          description="The conversational twin learns vocabulary, rhythm, humor, emoji habits, and the specific way you avoid answering a question. Drafts arrive in your voice, not a customer-support voice."
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
          kicker="02 — Isolation"
          title="What happens in Relationship A stays in Relationship A."
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
          kicker="03 — Coordination"
          title="Because two dinner dates cannot happen at 8 PM."
          description="The collision engine reads three calendars, travel buffers, and conversational commitments. When two versions of your evening collide, it negotiates with itself before it bothers you."
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

      <div className="mt-16 border-t border-line pt-16 md:mt-20 md:pt-20">
        <div className="grid gap-3 lg:grid-cols-3">
          <CompactFeature
            id="anniversary"
            kicker="04 — Memory"
            title="Never forget a date. Never buy the same gift twice."
            description="Occasions are resolved once, then armed across redundant reminders. Gift history is checked before any recommendation reaches you."
          >
            <AnniversaryDemo />
          </CompactFeature>
          <CompactFeature
            id="emotional"
            kicker="05 — Emotion"
            title="Different moods. Different conversations. Same you."
            description="An independent emotional context model per relationship. The recommendation changes before the conversation does."
          >
            <EmotionalDemo />
          </CompactFeature>
          <CompactFeature
            id="gift"
            kicker="06 — Gifts"
            title="Three personalities. Three wishlists. One optimized budget."
            description="Every gift is evaluated on interest match, milestone relevance, and duplicate silhouette across the other two contexts."
          >
            <GiftDemo />
          </CompactFeature>
        </div>
      </div>

      <div className="mt-16 md:mt-20">
        <FeatureFrame
          id="incident"
          kicker="07 — Response"
          title="She's asking who Jessica is."
          description="The emergency protocol freezes outbound drafting, resolves the entity graph, and produces three responses ranked by confidence and exposure risk. Nothing is sent without you."
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
