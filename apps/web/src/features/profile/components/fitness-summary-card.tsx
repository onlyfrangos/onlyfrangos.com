import { Goal, Ruler, Scale } from "lucide-react";

import type { ProfileSummaryItem } from "../types";

type FitnessSummaryCardProps = {
  items: ProfileSummaryItem[];
};

const iconById: Record<string, React.ComponentType<{ className?: string }>> = {
  weight: Scale,
  height: Ruler,
  goal: Goal
};

export function FitnessSummaryCard({ items }: FitnessSummaryCardProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-of-border bg-of-surface/90 p-4">
      <h3 className="mb-3 text-base font-semibold text-of-text">Resumo fisico</h3>
      <ul className="space-y-3">
        {items.map((item) => {
          const Icon = iconById[item.id];
          return (
            <li key={item.id} className="flex items-center justify-between gap-3 border-b border-of-border/60 pb-3 last:border-0 last:pb-0">
              <div className="min-w-0 inline-flex items-center gap-2">
                {Icon ? <Icon className="h-4 w-4 text-of-muted" /> : null}
                <p className="text-sm text-of-muted">{item.label}</p>
              </div>
              <p className="text-xl font-semibold text-of-text">{item.value}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
