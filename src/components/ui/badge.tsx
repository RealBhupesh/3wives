import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-line bg-white/[0.04] text-muted",
        outline: "border-line-strong bg-transparent text-ink",
        accent: "border-accent/30 bg-accent/10 text-[#ff8da9]",
        success: "border-green/25 bg-green/[0.08] text-green",
        warning: "border-amber/25 bg-amber/[0.08] text-amber",
        danger: "border-red/30 bg-red/[0.09] text-red",
        violet: "border-violet/25 bg-violet/[0.09] text-violet",
        muted: "border-transparent bg-surface-2 text-faint",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
