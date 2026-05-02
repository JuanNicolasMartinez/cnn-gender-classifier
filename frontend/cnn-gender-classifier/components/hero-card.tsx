import type { ReactNode } from "react";

import type { HeroHighlight } from "@/lib/types";

type HeroCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: HeroHighlight[];
  aside?: ReactNode;
};

export function HeroCard({
  eyebrow,
  title,
  description,
  highlights,
  aside,
}: HeroCardProps) {
  return (
    <section className="clinical-card relative overflow-hidden p-6 md:p-7">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-secondary">
            {eyebrow}
          </p>
          <h2 className="mt-3 max-w-3xl text-[2rem] font-semibold leading-tight tracking-[-0.07em] text-primary md:text-[2.4rem]">
            {title}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-secondary">
            {description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {highlights.map((highlight) => (
              <div
                key={highlight.label}
                className="rounded-full border border-[var(--color-surface-muted)] bg-surface-light px-4 py-3"
              >
                <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
                  {highlight.label}
                </p>
                <p className="mt-2 text-base font-semibold tracking-[-0.03em] text-primary">
                  {highlight.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {aside ? <div className="flex">{aside}</div> : null}
      </div>
    </section>
  );
}
