import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  tone?: "light" | "accent" | "muted" | "dark";
};

const toneClasses = {
  light: "bg-surface-light text-primary border-[var(--color-surface-muted)]",
  accent: "bg-accent text-primary border-[var(--color-accent)]",
  muted: "bg-surface-muted text-primary border-[var(--color-surface-muted)]",
  dark: "bg-card-dark text-[var(--color-white-warm)] border-[var(--color-card-dark)]",
};

export function ClinicalMetricCard({
  label,
  value,
  detail,
  tone = "light",
}: MetricCardProps) {
  const secondaryTextClass = tone === "dark" ? "text-[rgba(247,247,240,0.72)]" : "text-secondary";

  return (
    <article
      className={cn(
        "clinical-metric-card rounded-[32px] border p-5 md:p-6",
        toneClasses[tone],
      )}
    >
      <p className={cn("text-[0.68rem] uppercase tracking-[0.24em]", secondaryTextClass)}>
        {label}
      </p>
      <p className="mt-4 text-[2.65rem] font-semibold tracking-[-0.08em]">
        {value}
      </p>
      <p className={cn("mt-3 text-sm leading-6", secondaryTextClass)}>{detail}</p>
    </article>
  );
}

export const MetricCard = ClinicalMetricCard;
