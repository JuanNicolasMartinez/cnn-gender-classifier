import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { IconCircleButton } from "@/components/icon-circle-button";
import { SectionCard } from "@/components/section-card";

type ChartPanelProps = {
  title: string;
  description: string;
  src: string;
  alt: string;
};

export function ChartPanel({
  title,
  description,
  src,
  alt,
}: ChartPanelProps) {
  return (
    <SectionCard
      title={title}
      description={description}
      className="h-full"
    >
      <div className="mb-4 flex items-center justify-end">
        <IconCircleButton
          icon={<ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />}
          label={`Abrir ${title}`}
        />
      </div>
      <div className="chart-frame relative overflow-hidden rounded-[32px]">
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={900}
          className="h-auto w-full object-cover"
        />
      </div>
    </SectionCard>
  );
}
