import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type IconCircleButtonProps = {
  icon: ReactNode;
  label: string;
  tone?: "light" | "accent" | "dark";
  className?: string;
  interactive?: boolean;
};

const toneClasses = {
  light: "bg-surface-light text-primary border-[var(--color-surface-muted)]",
  accent: "bg-accent text-primary border-[var(--color-accent)]",
  dark: "bg-card-dark text-[var(--color-white-warm)] border-[var(--color-card-dark)]",
};

export function IconCircleButton({
  icon,
  label,
  tone = "light",
  className,
  interactive = false,
}: IconCircleButtonProps) {
  const content = (
    <span
      aria-hidden={!interactive}
      className={cn(
        "icon-circle-button inline-flex h-11 w-11 items-center justify-center rounded-full border transition-transform duration-200 hover:-translate-y-0.5",
        toneClasses[tone],
        className,
      )}
    >
      {icon}
    </span>
  );

  if (!interactive) {
    return content;
  }

  return (
    <button type="button" aria-label={label}>
      {content}
    </button>
  );
}
