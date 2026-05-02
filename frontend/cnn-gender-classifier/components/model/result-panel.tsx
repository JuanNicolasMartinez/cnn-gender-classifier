import type { PredictionResponse } from "@/lib/types";
import { formatPercent, titleize } from "@/lib/utils";

import { SectionCard } from "@/components/section-card";

type ResultPanelProps = {
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
  result: PredictionResponse | null;
  lastFileName: string | null;
  positiveClass: string;
  negativeClass: string;
  threshold: number;
};

export function ResultPanel({
  status,
  error,
  result,
  lastFileName,
  positiveClass,
  negativeClass,
  threshold,
}: ResultPanelProps) {
  const rows = result
    ? [
        {
          label: titleize(positiveClass),
          value: result.probabilities[positiveClass] ?? 0,
        },
        {
          label: titleize(negativeClass),
          value: result.probabilities[negativeClass] ?? 0,
        },
      ]
    : [];

  return (
    <SectionCard
      eyebrow="Salida del modelo"
      title="Predicción y score"
      description="La respuesta muestra clase final, confidence, probabilidades por clase y el raw score del positivo."
      className="h-full"
    >
      {status === "idle" ? (
        <div className="clinical-empty rounded-[24px] p-5 text-sm leading-6 text-secondary">
          Selecciona una imagen, ajusta si quieres el toggle de XAI y ejecuta
          la predicción para poblar este panel.
        </div>
      ) : null}

      {status === "loading" ? (
        <div className="space-y-3">
          <div className="skeleton-block h-28 rounded-[1.35rem]" />
          <div className="skeleton-block h-16 rounded-[1.15rem]" />
          <div className="skeleton-block h-16 rounded-[1.15rem]" />
        </div>
      ) : null}

      {status === "error" ? (
        <div className="clinical-alert rounded-[24px] p-5 text-sm leading-6">
          <p className="font-semibold">Predicción fallida</p>
          <p className="mt-2">{error}</p>
        </div>
      ) : null}

      {status === "success" && result ? (
        <div className="space-y-4">
          <div className="rounded-[24px] border border-[var(--color-surface-muted)] bg-surface-light p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[0.66rem] uppercase tracking-[0.24em] text-secondary">
                  Clase predicha
                </p>
                <h3 className="mt-2 text-3xl font-semibold tracking-[-0.08em] text-primary">
                  {titleize(result.predicted_class)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-secondary">
                  Archivo: {lastFileName ?? "sin nombre"}
                </p>
              </div>
              <div className="rounded-[22px] border border-[var(--color-accent)] bg-accent px-4 py-3 text-right text-primary">
                <p className="text-[0.66rem] uppercase tracking-[0.24em] text-primary opacity-70">
                  Confidence
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.06em]">
                  {formatPercent(result.confidence, 1)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {rows.map((row) => (
              <article
                key={row.label}
                className="rounded-[24px] border border-[var(--color-surface-muted)] bg-surface-light p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-primary">{row.label}</p>
                  <p className="text-sm font-semibold text-primary">
                    {formatPercent(row.value, 1)}
                  </p>
                </div>
                <div className="progress-track mt-3">
                  <span
                    className="progress-fill"
                    style={{ width: `${Math.min(row.value * 100, 100)}%` }}
                  />
                </div>
              </article>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <article className="rounded-[24px] border border-[var(--color-surface-muted)] bg-surface-light p-4">
              <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
                Raw score del positivo
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.06em] text-primary">
                {result.raw_score.toFixed(4)}
              </p>
              <p className="mt-2 text-sm leading-6 text-secondary">
                Interprétalo como la probabilidad sigmoide de{" "}
                {titleize(positiveClass)} antes de aplicar el threshold.
              </p>
            </article>

            <article className="rounded-[24px] border border-[var(--color-surface-muted)] bg-surface-light p-4">
              <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
                Threshold de producción
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.06em] text-primary">
                {threshold.toFixed(2)}
              </p>
              <p className="mt-2 text-sm leading-6 text-secondary">
                Si `raw_score` supera este valor, la clase final pasa a ser{" "}
                {titleize(positiveClass)}.
              </p>
            </article>
          </div>
        </div>
      ) : null}
    </SectionCard>
  );
}
