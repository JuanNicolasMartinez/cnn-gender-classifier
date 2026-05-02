import {
  Activity,
  BarChart3,
  BrainCircuit,
  Camera,
  Database,
  ImageIcon,
  LayoutDashboard,
  Rocket,
  ScanSearch,
  Search,
  ServerCog,
  Split,
  Upload,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import type { ClinicalIconKey } from "@/lib/types";

const iconMap = {
  dashboard: LayoutDashboard,
  pipeline: Workflow,
  model: ScanSearch,
  profile: BrainCircuit,
  runtime: ServerCog,
  dataset: Database,
  image: ImageIcon,
  split: Split,
  training: Activity,
  metrics: BarChart3,
  deploy: Rocket,
  xai: BrainCircuit,
  upload: Upload,
  camera: Camera,
  search: Search,
} satisfies Record<ClinicalIconKey, LucideIcon>;

type TimelineEventIconProps = {
  icon: ClinicalIconKey;
  className?: string;
};

export function TimelineEventIcon({
  icon,
  className,
}: TimelineEventIconProps) {
  const Icon = iconMap[icon];

  return <Icon className={className} strokeWidth={1.8} />;
}
