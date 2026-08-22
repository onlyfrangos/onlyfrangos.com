import { Goal, Ruler, Scale } from "lucide-react";

import type { ProfileSummaryItem } from "../types";

type ProfileMainFitnessSummaryProps = {
  items: ProfileSummaryItem[];
};

const iconById: Record<string, React.ComponentType<{ className?: string }>> = {
  weight: Scale,
  height: Ruler,
  goal: Goal
};

const toneById: Record<string, string> = {
  weight: "text-red-500",
  height: "text-green-500",
  goal: "text-amber-400"
};

export function ProfileMainFitnessSummary({ items }: ProfileMainFitnessSummaryProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mt-4 rounded-2xl border border-of-border bg-of-surface/90 p-4">
      <ul className="grid gap-3 sm:grid-cols-3">
        {items.slice(0, 3).map((item) => {
          const Icon = iconById[item.id] ?? Scale;
          return (
            <li key={item.id} className="flex justify-center items-center gap-3 rounded-xl border border-of-border/70 bg-black/20 p-1 sm:border-0 sm:bg-transparent sm:px-2">
              <Icon className={["h-5 w-5", toneById[item.id] ?? "text-of-muted"].join(" ")} />
              <div>
                <p className="text-xl font-semibold leading-none text-of-text">{item.value}</p>
                <p className="mt-1 text-sm text-of-muted">{item.label}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
