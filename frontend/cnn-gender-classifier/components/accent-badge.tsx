import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AccentBadgeProps = {
  children: ReactNode;
  className?: string;
  tone?: "accent" | "muted" | "danger";
};

const toneClasses = {
  accent: "bg-accent text-primary",
  muted: "bg-surface-muted text-primary",
  danger: "bg-clinical-pink text-primary",
};

export function AccentBadge({
  children,
  className,
  tone = "accent",
}: AccentBadgeProps) {
  return (
    <span
      className={cn(
        "accent-badge inline-flex min-w-6 items-center justify-center px-2 py-1 text-[0.68rem] font-semibold leading-none",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
