import type { UserSuggestion } from '@onlyfrangos/types';
import Link from 'next/link';
import { Flame, TrendingUp, Users } from 'lucide-react';

type FeedRightAsideProps = {
  suggestions?: UserSuggestion[] | null;
};

export function FeedRightAside({ suggestions }: FeedRightAsideProps) {
  return (
    <div className="sticky top-6 space-y-3">
      {suggestions && suggestions.length > 0 ? (
        <section className="rounded-2xl border border-of-border bg-of-surface/90 p-4">
          <h2 className="text-base font-semibold text-of-text">Sugestoes</h2>
          <ul className="mt-3 space-y-2.5">
            {suggestions.map((person) => (
              <li key={person.id} className="flex items-center justify-between text-sm">
                <Link href={`/${person.username}`} className="text-of-muted hover:text-of-text">
                  @{person.username}
                </Link>
                <button
                  type="button"
                  className="rounded-lg border border-of-border px-2 py-1 text-xs text-of-text hover:bg-white/10"
                >
                  Seguir
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-of-border bg-of-surface/90 p-4">
        <h3 className="text-base font-semibold text-of-text">Radar</h3>
        <ul className="mt-3 space-y-3 text-sm text-of-muted">
          <li className="inline-flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-red-500" />
            Treinos de peito em alta
          </li>
          <li className="inline-flex items-center gap-2">
            <Flame className="h-4 w-4 text-red-500" />
            1.2k frangos ativos hoje
          </li>
          <li className="inline-flex items-center gap-2">
            <Users className="h-4 w-4 text-red-500" />
            38 grupos com desafios novos
          </li>
        </ul>
      </section>
    </div>
  );
}
