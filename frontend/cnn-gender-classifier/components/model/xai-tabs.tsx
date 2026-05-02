"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { SectionCard } from "@/components/section-card";

type XaiTabsProps = {
  originalSrc: string | null;
  gradcam: string | null;
  saliency: string | null;
  includeXai: boolean;
  isLoading: boolean;
};

type TabKey = "original" | "gradcam" | "saliency";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "original", label: "Original" },
  { key: "gradcam", label: "Grad-CAM" },
  { key: "saliency", label: "Saliency" },
];

export function XaiTabs({
  originalSrc,
  gradcam,
  saliency,
  includeXai,
  isLoading,
}: XaiTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("original");

  const sources = {
    original: originalSrc,
    gradcam,
    saliency,
  };

  const activeSource = sources[activeTab];
  const xaiUnavailable = !includeXai && activeTab !== "original";

  return (
    <SectionCard
      eyebrow="Interpretabilidad"
      title="Panel XAI"
      description="Alterna entre la imagen original y los overlays generados por el backend."
      className="h-full"
    >
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={cn(
              "glass-pill px-4 py-3 text-sm font-medium transition-transform duration-200 hover:-translate-y-0.5",
              activeTab === tab.key && "glass-pill-active",
            )}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
        <div className="glass-pill ml-auto px-4 py-3 text-sm text-secondary">
          {includeXai ? "Overlays habilitados" : "Overlays pausados"}
        </div>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div className="skeleton-block aspect-[4/3] rounded-[24px]" />
        ) : activeSource ? (
          <div className="preview-frame relative aspect-[4/3] overflow-hidden rounded-[24px]">
            <Image
              src={activeSource}
              alt={`Vista ${activeTab} del resultado del modelo.`}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        ) : xaiUnavailable ? (
          <div className="clinical-empty rounded-[24px] p-5 text-sm leading-6 text-secondary">
            XAI fue desactivado para esta inferencia. Activa el toggle y vuelve a
            lanzar la predicción para ver los overlays.
          </div>
        ) : (
          <div className="clinical-empty rounded-[24px] p-5 text-sm leading-6 text-secondary">
            Este tab se llenará cuando exista una imagen base y la API devuelva
            el overlay correspondiente.
          </div>
        )}
      </div>
    </SectionCard>
  );
}
