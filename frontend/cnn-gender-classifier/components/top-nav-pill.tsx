import Link from "next/link";

import type { NavigationItem } from "@/lib/types";
import { cn } from "@/lib/utils";

import { TimelineEventIcon } from "@/components/timeline-event-icon";

type TopNavPillProps = {
  item: NavigationItem;
  isActive: boolean;
};

export function TopNavPill({ item, isActive }: TopNavPillProps) {
  return (
    <Link
      href={item.href}
      className={cn(
        "top-nav-pill inline-flex min-w-[10rem] items-center gap-3 rounded-full border px-4 py-3 text-sm transition-colors duration-200 hover:bg-surface-light",
        isActive ? "top-nav-pill-active" : "top-nav-pill-inactive",
      )}
    >
      <span
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full border",
          isActive
            ? "border-[var(--color-surface-muted)] bg-surface-light text-primary"
            : "border-transparent bg-[rgba(247,247,240,0.52)] text-secondary",
        )}
      >
        <TimelineEventIcon icon={item.icon} className="h-[1rem] w-[1rem]" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[0.66rem] uppercase tracking-[0.24em] text-secondary">
          {item.eyebrow}
        </span>
        <span className="mt-1 block truncate font-medium text-primary">
          {item.label}
        </span>
      </span>
    </Link>
  );
}
