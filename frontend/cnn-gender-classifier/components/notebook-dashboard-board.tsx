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
      nodes={timelineNodes}
    />
  );
}
