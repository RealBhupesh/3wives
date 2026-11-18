import * as React from "react";
import { cn } from "@/lib/utils";

const base =
  "flex h-9 w-full rounded-md border border-line bg-ink/[0.025] px-3 py-1 text-[13px] text-ink shadow-none transition-colors placeholder:text-faint focus-visible:border-line-strong focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-50";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input type={type} className={cn(base, className)} ref={ref} {...props} />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea className={cn(base, "h-auto min-h-[92px] resize-none py-2.5 leading-relaxed", className)} ref={ref} {...props} />
  ),
);
Textarea.displayName = "Textarea";

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-[11px] font-medium uppercase tracking-[0.1em] text-muted", className)}
      {...props}
    />
  ),
);
Label.displayName = "Label";

export const NativeSelect = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(base, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 fill=%22none%22 stroke=%22%238c8d99%22 stroke-width=%22.8%22><path d=%22M2 4l4 4 4-4%22/></svg>')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8", className)}
      {...props}
    >
      {children}
    </select>
  ),
);
NativeSelect.displayName = "NativeSelect";
