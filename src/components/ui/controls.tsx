"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as SliderPrimitive from "@radix-ui/react-slider";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      "peer inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer items-center rounded-full border border-line-strong bg-surface-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ground disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-accent/50 data-[state=checked]:bg-accent",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "pointer-events-none block size-[14px] rounded-full bg-ink shadow transition-transform data-[state=checked]:translate-x-[18px] data-[state=unchecked]:translate-x-[2px] data-[state=checked]:bg-[#1a050b]",
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-[3px] w-full grow overflow-hidden rounded-full bg-white/10">
      <SliderPrimitive.Range className="absolute h-full bg-accent" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block size-[13px] rounded-full border border-accent/60 bg-ink transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ground disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { indicatorClassName?: string }
>(({ className, value, indicatorClassName, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]", className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn("h-full w-full flex-1 bg-accent transition-transform duration-700 ease-out", indicatorClassName)}
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-w-[260px] rounded-md border border-line-strong bg-surface-2 px-2.5 py-1.5 text-[11.5px] leading-relaxed text-ink shadow-xl",
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Switch, Slider, Progress, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent };
