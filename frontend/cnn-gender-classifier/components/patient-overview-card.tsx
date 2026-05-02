"use client";

import type { PatientOverviewCardData } from "@/lib/types";

import { useApiHealth } from "@/hooks/use-api-health";

import { AccentBadge } from "@/components/accent-badge";
import { TimelineEventIcon } from "@/components/timeline-event-icon";

type PatientOverviewCardProps = {
  data: PatientOverviewCardData;
};

export function PatientOverviewCard({ data }: PatientOverviewCardProps) {
  const { health, error, isLoading } = useApiHealth();

  const healthIndicator = getHealthIndicator({
    health,
    error,
    isLoading,
    fallbackStatus: data.status,
  });

  return (
    <section className="clinical-card flex h-full flex-col gap-5 p-5">
      <div className="flex items-start gap-4">
        <div className="grid h-18 w-18 shrink-0 place-items-center rounded-[26px] bg-surface-light">
          <TimelineEventIcon icon="profile" className="h-8 w-8 text-primary" />
        </div>

        <div className="min-w-0">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-secondary">
            {data.eyebrow}
          </p>
          <h2 className="mt-2 text-[1.55rem] font-semibold tracking-[-0.06em] text-primary">
            {data.title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-secondary">{data.subtitle}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.22em] text-secondary">
            {data.meta}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-[24px] bg-surface-light px-4 py-3">
        <div>
          <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
            Estado
          </p>
          <p className="mt-1 text-sm font-medium text-primary">
            {healthIndicator.status}
          </p>
        </div>
        <AccentBadge tone={healthIndicator.tone}>
          {healthIndicator.badge}
        </AccentBadge>
      </div>

      <div className="grid gap-3">
        {data.details.map((detail) => (
          <div
            key={detail.label}
            className="clinical-detail-row flex items-center gap-3 rounded-[24px] px-4 py-3"
          >
            <div className="grid h-10 w-10 place-items-center rounded-full bg-surface-light">
              <TimelineEventIcon
                icon={detail.icon}
                className="h-[1rem] w-[1rem] text-secondary"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
                {detail.label}
              </p>
              <p className="mt-1 text-sm font-medium text-primary">
                {detail.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function getHealthIndicator({
  health,
  error,
  isLoading,
  fallbackStatus,
}: {
  health: { status: string; model_loaded: boolean } | null;
  error: string | null;
  isLoading: boolean;
  fallbackStatus: string;
}) {
  if (isLoading) {
    return {
      status: "Verificando runtime",
      badge: "CHECKING",
      tone: "muted" as const,
    };
  }

  if (error) {
    return {
      status: "API no disponible",
      badge: "OFFLINE",
      tone: "danger" as const,
    };
  }

  if (health?.status === "ok" && health.model_loaded) {
    return {
      status: fallbackStatus,
      badge: "LIVE",
      tone: "accent" as const,
    };
  }

  if (health?.status === "ok" && !health.model_loaded) {
    return {
      status: "API activa sin modelo cargado",
      badge: "DEGRADED",
      tone: "muted" as const,
    };
  }

  return {
    status: "Estado no verificado",
    badge: "UNKNOWN",
    tone: "muted" as const,
  };
}
