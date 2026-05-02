import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionCardProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
  children: ReactNode;
};

export function SectionCard({
  eyebrow,
  title,
  description,
  className,
  children,
}: SectionCardProps) {
  return (
    <section className={cn("clinical-card p-5 md:p-6", className)}>
      {(eyebrow || title || description) && (
        <header className="mb-5 space-y-2">
          {eyebrow ? (
            <p className="text-[0.66rem] uppercase tracking-[0.24em] text-secondary">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="text-[1.35rem] font-semibold tracking-[-0.05em] text-primary">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="max-w-3xl text-sm leading-6 text-secondary md:text-[0.96rem]">
              {description}
            </p>
          ) : null}
        </header>
      )}
      {children}
    </section>
  );
}
