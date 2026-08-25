import type { GymCardData, ProfileSummaryItem, WorkoutFrequency } from "../types";

import { GymCard } from "./gym-card";
import { WorkoutFrequencyCard } from "./workout-frequency-card";

type ProfileFitnessDashboardProps = {
  workoutFrequency?: WorkoutFrequency;
  gymCard?: GymCardData;
  summaryItems?: ProfileSummaryItem[];
};

export function ProfileFitnessDashboard({
  workoutFrequency,
  gymCard,
  summaryItems
}: ProfileFitnessDashboardProps) {
  return (
    <div className="space-y-3">
      {workoutFrequency ? <WorkoutFrequencyCard data={workoutFrequency} /> : null}
      {gymCard ? <GymCard gym={gymCard} /> : null}
      {summaryItems?.length ? (
        <section className="rounded-2xl border border-of-border bg-of-surface/90 p-4">
          <h3 className="text-base font-semibold text-of-text">Objetivo e físico</h3>
          <dl className="mt-3 grid grid-cols-2 gap-3">
            {summaryItems.map((item) => (
              <div key={item.id} className="rounded-xl bg-black/20 p-3">
                <dt className="text-xs text-of-muted">{item.label}</dt>
                <dd className="mt-1 text-sm font-semibold text-of-text">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  );
}
