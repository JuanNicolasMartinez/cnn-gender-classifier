export type XaiOutput = "gradcam" | "saliency";

export type ApiHealthResponse = {
  status: string;
  model_loaded: boolean;
};

export type ClinicalIconKey =
  | "dashboard"
  | "pipeline"
  | "model"
  | "profile"
  | "runtime"
  | "dataset"
  | "image"
  | "split"
  | "training"
  | "metrics"
  | "deploy"
  | "xai"
  | "upload"
  | "camera"
  | "search";

export type ModelMetadata = {
  model_name: string;
  input_size: {
    width: number;
    height: number;
    channels: number;
  };
  classes: {
    positive: string;
    negative: string;
  };
  threshold: number;
  accepted_mime_types: string[];
  supports_xai: boolean;
  xai_outputs: XaiOutput[];
};

export type PredictionResponse = {
  predicted_class: string;
  confidence: number;
  probabilities: Record<string, number>;
  raw_score: number;
  gradcam: string | null;
  saliency: string | null;
};

export type NavigationItem = {
  href: string;
  label: string;
  eyebrow: string;
  icon: ClinicalIconKey;
};

export type HeroHighlight = {
  label: string;
  value: string;
};

export type MetricDescriptor = {
  label: string;
  value: string;
  detail: string;
  tone?: "light" | "accent" | "muted" | "dark";
};

export type ChartAsset = {
  title: string;
  description: string;
  src: string;
  alt: string;
};

export type PipelineStage = {
  id: string;
  title: string;
  summary: string;
  detail: string;
  badge: string;
};

export type TimelineNodeTone = "default" | "active" | "muted";

export type TimelineNodeSize = "sm" | "md" | "lg" | "xl";

export type TimelineNodeLane = "top" | "bottom";

export type TimelineNodeStat = {
  label: string;
  value: string;
};

export type TimelineNodeSection = {
  title: string;
  items: string[];
};

export type TimelineNode = {
  id: string;
  label: string;
  shortLabel: string;
  summary: string;
  detail: string;
  badgeCount?: number;
  tone: TimelineNodeTone;
  icon: ClinicalIconKey;
  size: TimelineNodeSize;
  lane: TimelineNodeLane;
  complexity: string;
  stats?: TimelineNodeStat[];
  sections: TimelineNodeSection[];
};

export type PatientOverviewDetail = {
  label: string;
  value: string;
  icon: ClinicalIconKey;
};

export type PatientOverviewCardData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  meta: string;
  status: string;
  details: PatientOverviewDetail[];
};

export type SourceMode = "upload" | "camera";
