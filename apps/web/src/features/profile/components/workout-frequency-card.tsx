import { Flame } from 'lucide-react';

import type { WorkoutFrequency } from '../types';

type WorkoutFrequencyCardProps = {
  data: WorkoutFrequency;
};

export function WorkoutFrequencyCard({ data }: WorkoutFrequencyCardProps) {
  return (
    <section className="rounded-2xl border border-of-border bg-of-surface/90 p-4">
      <h3 className="text-base font-semibold text-of-text">Frequencia de treino</h3>
      <p className="mt-2 inline-flex items-center gap-2 text-sm text-of-text">
        <Flame className="h-4 w-4 text-red-500" />
        <span className="font-semibold">{data.totalThisMonth} treinos</span>
        <span className="text-of-muted">este mes</span>
      </p>

      <div className="mt-4 grid grid-cols-7 gap-2 text-center">
        {data.days.map((day) => (
          <div key={`${day.label}-${day.trained ? '1' : '0'}`}>
            <p className="text-xs text-of-muted">{day.label}</p>
            <span
              className={[
                'mx-auto mt-1 block h-3.5 w-3.5 rounded-full border',
                day.trained ? 'border-red-600 bg-red-600' : 'border-of-muted/70 bg-transparent',
              ].join(' ')}
              aria-label={day.trained ? `${day.label}: treinou` : `${day.label}: sem treino`}
              title={day.trained ? 'Treinou' : 'Sem treino'}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
