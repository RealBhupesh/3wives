import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-[13px] font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ground [&_svg]:pointer-events-none [&_svg]:shrink-0 active:translate-y-px",
  {
    variants: {
      variant: {
        default: "bg-ink text-ground hover:bg-white",
        accent: "bg-accent text-[#190409] hover:bg-[#ff628b] shadow-[0_0_0_1px_rgba(255,71,120,0.3),0_8px_30px_-12px_rgba(255,71,120,0.6)]",
        outline: "border border-line-strong bg-white/[0.02] text-ink hover:bg-white/[0.06]",
        ghost: "text-muted hover:bg-white/[0.05] hover:text-ink",
        subtle: "bg-surface-2 text-ink border border-line hover:bg-surface-3",
        destructive: "bg-red text-white hover:bg-[#ff5464]",
        dangerOutline: "border border-red/40 text-red bg-red/[0.06] hover:bg-red/[0.12]",
        link: "text-ink underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-9 px-4 [&_svg]:size-4",
        sm: "h-8 px-3 text-xs [&_svg]:size-3.5",
        lg: "h-11 px-5 text-sm [&_svg]:size-4",
        xl: "h-12 px-6 text-sm [&_svg]:size-4",
        icon: "size-9 [&_svg]:size-4",
        iconSm: "size-7 [&_svg]:size-3.5",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
