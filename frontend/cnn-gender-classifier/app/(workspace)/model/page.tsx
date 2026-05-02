import { modelHeroHighlights, modelOverviewCard } from "@/lib/model-content";

import { ModelWorkbench } from "@/components/model/model-workbench";
import { HeroCard } from "@/components/hero-card";
import { PatientOverviewCard } from "@/components/patient-overview-card";

export default function ModelPage() {
  return (
    <div className="space-y-6">
      <HeroCard
        eyebrow="Model"
        title="Inferencia clínica visual con upload, cámara y overlays explicativos."
        description="La interacción sigue usando el backend real para predecir clase, confidence, probabilidades y raw score, pero el espacio visual se redibuja como una consola médica minimalista y premium."
        highlights={modelHeroHighlights}
        aside={<PatientOverviewCard data={modelOverviewCard} />}
      />

      <ModelWorkbench />
    </div>
  );
}
