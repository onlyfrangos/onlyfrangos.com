import type { GymCardData, ProfileSummaryItem, WorkoutFrequency } from "../types";

import { GymCard } from "./gym-card";
import { WorkoutFrequencyCard } from "./workout-frequency-card";

type ProfileFitnessDashboardProps = {
  workoutFrequency?: WorkoutFrequency;
  gymCard?: GymCardData;
};

export function ProfileFitnessDashboard({
  workoutFrequency,
  gymCard
}: ProfileFitnessDashboardProps) {
  return (
    <div className="space-y-3">
      {workoutFrequency ? <WorkoutFrequencyCard data={workoutFrequency} /> : null}
      {gymCard ? <GymCard gym={gymCard} /> : null}
    </div>
  );
}
