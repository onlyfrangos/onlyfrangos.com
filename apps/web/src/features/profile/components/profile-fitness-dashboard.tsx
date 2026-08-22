import type { GymCardData, ProfileSummaryItem, WorkoutFrequency } from "../types";

import { FitnessSummaryCard } from "./fitness-summary-card";
import { GymCard } from "./gym-card";
import { WorkoutFrequencyCard } from "./workout-frequency-card";

type ProfileFitnessDashboardProps = {
  summary: ProfileSummaryItem[];
  workoutFrequency: WorkoutFrequency;
  gymCard?: GymCardData;
};

export function ProfileFitnessDashboard({
  summary,
  workoutFrequency,
  gymCard
}: ProfileFitnessDashboardProps) {
  return (
    <div className="space-y-3">
      <FitnessSummaryCard items={summary} />
      <WorkoutFrequencyCard data={workoutFrequency} />
      {gymCard ? <GymCard gym={gymCard} /> : null}
    </div>
  );
}
