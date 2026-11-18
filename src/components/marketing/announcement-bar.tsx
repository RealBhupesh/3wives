import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AnnouncementBar() {
  return (
    <Link
      href="/pricing"
      className="group flex h-9 items-center justify-center gap-3 bg-ink px-4 text-[13px] text-white/70 transition-colors hover:text-white"
    >
      <span className="rounded-full border border-white/20 px-2 py-px text-[11.5px] font-medium text-white">News</span>
      <span className="truncate">
        <span className="text-white">3Wives raises $1.2B Series C</span>
        <span className="hidden sm:inline"> to build the future of relationship intelligence</span>
      </span>
      <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
