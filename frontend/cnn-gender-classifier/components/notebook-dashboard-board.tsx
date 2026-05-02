import { pipelineTimelineNodes } from "@/lib/model-content";
import { notebookTimelineDetails } from "@/lib/notebook-timeline-details";

import { TimelineTrack } from "@/components/timeline-track";

export function NotebookDashboardBoard() {
  const timelineNodes = pipelineTimelineNodes.map((node) => ({
    ...node,
    ...(notebookTimelineDetails[node.id] ?? {}),
  }));

  return (
    <TimelineTrack
      eyebrow="Notebook walkthrough"
      title="Toda la lectura del laboratorio vive dentro de la timeline"
      description="El dashboard dejó de exponer métricas paralelas. Ahora cada evento del pipeline abre un modal con shapes, split, arquitectura, curvas, tuning, thresholds, artefactos y XAI extraídos de `gender_recognition_using_cnn.ipynb`."
      nodes={timelineNodes}
    />
  );
}
