import type { ReactNode } from "react";

import { navigationItems } from "@/lib/model-content";

import { TabNav } from "@/components/tab-nav";

type WorkspaceShellProps = {
  children: ReactNode;
};

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  return (
    <div className="min-h-screen bg-background px-2 py-3 md:px-3 md:py-4">
      <div className="tablet-frame mx-auto flex min-h-[calc(100vh-1rem)] w-full max-w-[1820px] flex-col border-[4px] border-black p-2 md:p-3">
        <div className="tablet-surface flex min-h-full flex-1 flex-col overflow-hidden rounded-[42px] bg-surface">
          <header className="flex flex-col gap-4 px-4 pb-3 pt-4 md:px-5 md:pb-4 md:pt-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[var(--color-surface-muted)] bg-surface-light text-[1.55rem] font-semibold tracking-[-0.06em] text-primary">
                Dr+
              </div>
              <div className="min-w-0">
                <p className="text-[0.68rem] uppercase tracking-[0.28em] text-secondary">
                  Clinical ML tablet
                </p>
                <h1 className="truncate text-[1.8rem] font-semibold tracking-[-0.07em] text-primary md:text-[2.15rem]">
                  CNN Gender Classifier
                </h1>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-secondary md:text-base">
                  Pipeline del notebook e inferencia productiva con XAI.
                </p>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
              <TabNav items={navigationItems} />
            </div>
          </header>

          <main className="flex-1 px-3 pb-4 pt-2 md:px-4 md:pb-5 md:pt-3 xl:px-5">
            {children}
          </main>

          <footer className="mx-3 mb-3 mt-auto flex flex-wrap gap-2 border-t border-[var(--color-surface-muted)] pt-3 text-xs uppercase tracking-[0.22em] text-secondary md:mx-5 md:mb-5">
            <span className="glass-pill px-3 py-2">
              Dataset 5,418
            </span>
            <span className="glass-pill px-3 py-2">
              Input 224 x 224
            </span>
            <span className="glass-pill px-3 py-2">
              Runtime FastAPI
            </span>
            <span className="glass-pill px-3 py-2">
              XAI on demand
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}
