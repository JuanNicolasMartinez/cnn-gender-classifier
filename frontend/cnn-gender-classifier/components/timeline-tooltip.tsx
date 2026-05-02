"use client";

import type { ReactNode } from "react";

import * as Tooltip from "@radix-ui/react-tooltip";

type TimelineTooltipProps = {
  title: string;
  summary: string;
  detail: string;
  children: ReactNode;
};

export function TimelineTooltip({
  title,
  summary,
  detail,
  children,
}: TimelineTooltipProps) {
  return (
    <Tooltip.Provider delayDuration={140}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            align="center"
            sideOffset={12}
            className="tooltip-card z-50 max-w-[18rem] rounded-[24px] border bg-surface-light px-4 py-3 text-left"
          >
            <p className="text-sm font-semibold text-primary">{title}</p>
            <p className="mt-2 text-sm leading-6 text-secondary">{summary}</p>
            <p className="mt-2 text-xs leading-5 text-secondary">{detail}</p>
            <Tooltip.Arrow className="fill-[var(--color-surface-light)]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
