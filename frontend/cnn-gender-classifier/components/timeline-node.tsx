import type { TimelineNode as TimelineNodeData } from "@/lib/types";
import { cn } from "@/lib/utils";

import { AccentBadge } from "@/components/accent-badge";
import { TimelineEventIcon } from "@/components/timeline-event-icon";

type TimelineNodeProps = {
  node: TimelineNodeData;
  isFirst: boolean;
  isLast: boolean;
  isSelected: boolean;
  isDimmed: boolean;
  onSelect: (nodeId: string) => void;
};

const nodeToneClasses = {
  default: "bg-surface-light text-primary border-[var(--color-surface-muted)]",
  active: "bg-accent text-primary border-[var(--color-accent)]",
  muted: "bg-surface text-primary border-[var(--color-surface-muted)]",
};

const iconToneClasses = {
  default: "border-[var(--color-surface-muted)] bg-surface text-primary",
  active: "border-[var(--color-accent)] bg-surface-light text-primary",
  muted: "border-[var(--color-surface-muted)] bg-surface-light text-secondary",
};

const markerToneClasses = {
  default: "bg-[var(--color-surface-muted)]",
  active: "bg-accent",
  muted: "bg-[rgba(143,145,142,0.72)]",
};

const sizeClasses = {
  sm: {
    wrapper: "w-[13rem]",
    card: "w-[11rem] min-h-[10rem] p-4",
    title: "text-base",
  },
  md: {
    wrapper: "w-[15rem]",
    card: "w-[13rem] min-h-[12rem] p-5",
    title: "text-[1.05rem]",
  },
  lg: {
    wrapper: "w-[17rem]",
    card: "w-[15rem] min-h-[14rem] p-5",
    title: "text-[1.16rem]",
  },
  xl: {
    wrapper: "w-[20rem]",
    card: "w-[18rem] min-h-[16rem] p-6",
    title: "text-[1.28rem]",
  },
};

export function TimelineNode({
  node,
  isFirst,
  isLast,
  isSelected,
  isDimmed,
  onSelect,
}: TimelineNodeProps) {
  const size = sizeClasses[node.size];

  return (
    <div
      className={cn(
        "relative shrink-0 transition-[opacity,transform,filter] duration-200",
        size.wrapper,
        isSelected && "z-[70]",
        isDimmed && "opacity-25 blur-[1.4px]",
      )}
      style={{ height: "var(--timeline-total-height)" }}
    >
      <div
        className="grid h-full"
        style={{
          gridTemplateRows:
            "var(--timeline-top-lane) var(--timeline-middle-lane) var(--timeline-bottom-lane)",
        }}
      >
        <div className="flex items-end justify-center">
          {node.lane === "top" ? (
            <NodeButton
              node={node}
              size={size}
              isSelected={isSelected}
              onSelect={onSelect}
            />
          ) : (
            <div />
          )}
        </div>

        <div className="relative flex items-center justify-center">
          {!isFirst ? (
            <span className="absolute left-[-0.75rem] right-1/2 top-1/2 h-px -translate-y-1/2 bg-[var(--color-surface-muted)]" />
          ) : null}
          {!isLast ? (
            <span className="absolute left-1/2 right-[-0.75rem] top-1/2 h-px -translate-y-1/2 bg-[var(--color-surface-muted)]" />
          ) : null}
          {node.lane === "top" ? (
            <span className="absolute bottom-1/2 top-0 w-px bg-[var(--color-surface-muted)]" />
          ) : (
            <span className="absolute bottom-0 top-1/2 w-px bg-[var(--color-surface-muted)]" />
          )}
          <span
            className={cn(
              "absolute left-1/2 top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-background)]",
              markerToneClasses[node.tone],
            )}
          />
        </div>

        <div className="flex items-start justify-center">
          {node.lane === "bottom" ? (
            <NodeButton
              node={node}
              size={size}
              isSelected={isSelected}
              onSelect={onSelect}
            />
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}

function NodeButton({
  node,
  size,
  isSelected,
  onSelect,
}: {
  node: TimelineNodeData;
  size: (typeof sizeClasses)[keyof typeof sizeClasses];
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(node.id)}
      className={cn(
        "timeline-node-button relative rounded-[30px] border text-left transition-[transform,opacity,border-color] duration-200 hover:-translate-y-1",
        size.card,
        nodeToneClasses[node.tone],
        isSelected && "scale-[1.02] border-[var(--color-text-primary)]",
      )}
    >
      {node.badgeCount ? (
        <AccentBadge className="absolute right-4 top-4 z-20">
          {node.badgeCount}
        </AccentBadge>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border",
            iconToneClasses[node.tone],
          )}
        >
          <TimelineEventIcon icon={node.icon} className="h-5 w-5" />
        </span>

        <span className="glass-pill px-3 py-2 text-[0.68rem] uppercase tracking-[0.24em] text-secondary">
          {node.complexity}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-[0.68rem] uppercase tracking-[0.26em] text-secondary">
          {node.shortLabel}
        </p>
        <h3
          className={cn(
            "mt-2 font-semibold leading-tight tracking-[-0.05em] text-primary",
            size.title,
          )}
        >
          {node.label}
        </h3>
        <p className="mt-3 text-sm leading-6 text-secondary">{node.summary}</p>
      </div>
    </button>
  );
}
