"use client";

import { ArrowUpRight } from "lucide-react";

import { useModelMetadata } from "@/hooks/use-model-metadata";
import { formatDecimal, titleize } from "@/lib/utils";

import { IconCircleButton } from "@/components/icon-circle-button";
import { SectionCard } from "@/components/section-card";

export function ProductionSnapshot() {
  const { metadata, error, isLoading } = useModelMetadata();

  return (
    <SectionCard
      eyebrow="Runtime actual"
      title="Snapshot de producción"
      description="Metadata obtenida desde FastAPI para no duplicar configuración sensible dentro del frontend."
      className="h-full"
    >
      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton-block h-24 rounded-[24px]" />
          ))}
        </div>
      ) : error ? (
        <div className="clinical-alert rounded-[24px] p-4 text-sm leading-6">
          {error}
        </div>
      ) : metadata ? (
        <div className="space-y-4">
          <div className="flex items-center justify-end">
            <IconCircleButton
              icon={<ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />}
              label="Abrir snapshot"
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-[24px] bg-surface-light p-4">
              <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
                Modelo
              </p>
              <p className="mt-2 text-lg font-semibold tracking-[-0.04em] text-primary">
                {metadata.model_name}
              </p>
            </article>

            <article className="rounded-[24px] bg-surface-light p-4">
              <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
                Clases
              </p>
              <p className="mt-2 text-lg font-semibold tracking-[-0.04em] text-primary">
                {titleize(metadata.classes.positive)} /{" "}
                {titleize(metadata.classes.negative)}
              </p>
            </article>

            <article className="rounded-[24px] bg-surface-light p-4">
              <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
                Input size
              </p>
              <p className="mt-2 text-lg font-semibold tracking-[-0.04em] text-primary">
                {metadata.input_size.width} x {metadata.input_size.height} x{" "}
                {metadata.input_size.channels}
              </p>
            </article>

            <article className="rounded-[24px] bg-surface-light p-4">
              <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
                Threshold prod
              </p>
              <p className="mt-2 text-lg font-semibold tracking-[-0.04em] text-primary">
                {formatDecimal(metadata.threshold, 2)}
              </p>
            </article>
          </div>

          <div className="rounded-[24px] border border-[var(--color-surface-muted)] bg-surface px-4 py-4 text-sm leading-6 text-secondary">
            Tipos aceptados: {metadata.accepted_mime_types.join(", ")}. XAI
            disponible: {metadata.xai_outputs.join(" + ")}.
          </div>
        </div>
      ) : null}
    </SectionCard>
  );
}
