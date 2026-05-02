"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

import type { TimelineNode as TimelineNodeData } from "@/lib/types";
import { cn } from "@/lib/utils";

import { AccentBadge } from "@/components/accent-badge";
import { TimelineEventIcon } from "@/components/timeline-event-icon";
import { TimelineNode } from "@/components/timeline-node";

type TimelineTrackProps = {
  eyebrow: string;
  title: string;
  description: string;
  nodes: TimelineNodeData[];
};

export function TimelineTrack({
  eyebrow,
  title,
  description,
  nodes,
}: TimelineTrackProps) {
  const timelineLayoutStyles = {
    "--timeline-top-lane": "20rem",
    "--timeline-middle-lane": "6rem",
    "--timeline-bottom-lane": "20rem",
    "--timeline-total-height":
      "calc(var(--timeline-top-lane) + var(--timeline-middle-lane) + var(--timeline-bottom-lane))",
  } as CSSProperties;

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  useEffect(() => {
    if (!selectedNode) {
      document.body.style.removeProperty("overflow");
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedNodeId(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedNode]);

  return (
    <>
      <section className="clinical-card overflow-visible p-5 md:p-6">
        <header className="max-w-5xl">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.26em] text-secondary">
              {eyebrow}
            </p>
            <h2 className="mt-3 max-w-5xl text-[2rem] font-semibold tracking-[-0.08em] text-primary md:text-[2.7rem]">
              {title}
            </h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-secondary md:text-base">
              {description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="glass-pill px-3 py-2 text-sm text-secondary">
                Click en un hito para abrir toda su evidencia.
              </span>
              <span className="glass-pill px-3 py-2 text-sm text-secondary">
                El resto del tablero se difumina mientras lees el detalle.
              </span>
              <span className="glass-pill px-3 py-2 text-sm text-secondary">
                El tamaño del nodo sigue representando complejidad en el notebook.
              </span>
            </div>
          </div>
        </header>

        <div className="timeline-scroll mt-8 overflow-x-auto pb-2">
          <div
            className="relative min-w-full px-3 pb-6 pt-8"
            style={timelineLayoutStyles}
          >
            <div className="relative z-10 flex w-max min-w-full items-start gap-3">
              {nodes.map((node, index) => (
                <TimelineNode
                  key={node.id}
                  node={node}
                  isFirst={index === 0}
                  isLast={index === nodes.length - 1}
                  isSelected={selectedNodeId === node.id}
                  isDimmed={selectedNodeId !== null && selectedNodeId !== node.id}
                  onSelect={setSelectedNodeId}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {selectedNode ? (
        <>
          <button
            type="button"
            aria-label="Cerrar detalle del hito"
            className="fixed inset-0 z-[40] bg-[rgba(217,217,207,0.32)] backdrop-blur-[10px]"
            onClick={() => setSelectedNodeId(null)}
          />

          <div className="fixed inset-x-0 top-1/2 z-[80] mx-auto w-[min(92vw,68rem)] -translate-y-1/2 px-3">
            <div
              className="max-h-[88vh] overflow-y-auto rounded-[34px] border p-5 md:p-6"
              style={{
                backgroundColor: "rgba(247, 247, 240, 0.98)",
                borderColor: "rgba(143, 145, 142, 0.42)",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="glass-pill inline-flex items-center gap-2 px-3 py-2 text-sm text-secondary">
                      <TimelineEventIcon
                        icon={selectedNode.icon}
                        className="h-4 w-4"
                      />
                      {selectedNode.shortLabel}
                    </span>
                    <AccentBadge>{selectedNode.badgeCount ?? 0}</AccentBadge>
                    <span className="glass-pill px-3 py-2 text-sm text-secondary">
                      {selectedNode.complexity}
                    </span>
                  </div>

                  <h3 className="mt-4 text-[1.7rem] font-semibold tracking-[-0.07em] text-primary md:text-[2.2rem]">
                    {selectedNode.label}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-secondary">
                    {selectedNode.summary}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-secondary">
                    {selectedNode.detail}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedNodeId(null)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-surface-muted)] bg-[var(--color-white-warm)] text-primary"
                  aria-label="Cerrar modal"
                >
                  <X className="h-4 w-4" strokeWidth={1.8} />
                </button>
              </div>

              <div
                className={cn(
                  "mt-6 grid gap-4",
                  selectedNode.stats?.length
                    ? "xl:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)]"
                    : "xl:grid-cols-1",
                )}
              >
                <div
                  className={cn(
                    "grid gap-4",
                    selectedNode.sections.length <= 1
                      ? "md:grid-cols-1"
                      : selectedNode.sections.length === 2
                        ? "md:grid-cols-2"
                        : "md:grid-cols-2 2xl:grid-cols-3",
                  )}
                >
                  {selectedNode.sections.map((section) => (
                    <section
                      key={section.title}
                      className="rounded-[28px] border p-4"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "rgba(143, 145, 142, 0.3)",
                      }}
                    >
                      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-secondary">
                        {section.title}
                      </p>
                      <ul className="mt-3 space-y-3 text-sm leading-6 text-primary">
                        {section.items.map((item) => (
                          <li
                            key={item}
                            className="rounded-[20px] border px-3 py-3"
                            style={{
                              backgroundColor: "var(--color-surface-light)",
                              borderColor: "var(--color-surface-muted)",
                            }}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>

                {selectedNode.stats?.length ? (
                  <aside className="grid content-start gap-3">
                    {selectedNode.stats.map((stat) => (
                      <article
                        key={stat.label}
                        className="rounded-[24px] border p-4"
                        style={{
                          backgroundColor: "var(--color-surface)",
                          borderColor: "rgba(143, 145, 142, 0.3)",
                        }}
                      >
                        <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
                          {stat.label}
                        </p>
                        <p className="mt-2 text-2xl font-semibold tracking-[-0.06em] text-primary">
                          {stat.value}
                        </p>
                      </article>
                    ))}
                  </aside>
                ) : null}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
