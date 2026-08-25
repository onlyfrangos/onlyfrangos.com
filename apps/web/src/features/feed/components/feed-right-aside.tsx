'use client';

import type { UserSuggestion } from '@onlyfrangos/types';
import Image from 'next/image';
import Link from 'next/link';
import { Flame, TrendingUp, UserPlus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

import { apiFetch } from '../../../lib/auth';
import { resolveAvatarUrl } from '../../../lib/avatar';

export function FeedRightAside() {
  const [visibleSuggestions, setVisibleSuggestions] = useState<UserSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  const [followingUserId, setFollowingUserId] = useState<string | null>(null);
  const [followError, setFollowError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setIsLoadingSuggestions(true);
    setFollowError(null);

    apiFetch('/users/me/suggestions?limit=5')
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Não foi possível carregar as sugestões');
        }

        return (await response.json()) as UserSuggestion[];
      })
      .then((availableSuggestions) => {
        if (active) {
          setVisibleSuggestions(availableSuggestions);
        }
      })
      .catch(() => {
        if (active) {
          setVisibleSuggestions([]);
          setFollowError('Não foi possível carregar as sugestões');
        }
      })
      .finally(() => {
        if (active) {
          setIsLoadingSuggestions(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function followSuggestion(person: UserSuggestion) {
    setFollowingUserId(person.id);
    setFollowError(null);

    try {
      const response = await apiFetch(`/users/${person.id}/follow`, { method: 'POST' });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string | string[];
        } | null;
        const message = Array.isArray(payload?.message) ? payload.message[0] : payload?.message;
        throw new Error(message ?? `Não foi possível seguir @${person.username}`);
      }

      setVisibleSuggestions((current) => current.filter(({ id }) => id !== person.id));
    } catch (requestError) {
      setFollowError(
        requestError instanceof Error
          ? requestError.message
          : `Não foi possível seguir @${person.username}`,
      );
    } finally {
      setFollowingUserId(null);
    }
  }

  return (
    <div className="sticky top-6 space-y-3">
      <section className="overflow-hidden rounded-2xl border border-of-border bg-of-surface/90">
        <header className="flex items-center gap-2 border-b border-of-border px-4 py-3.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-red-500/10 text-red-400">
            <UserPlus className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-of-text">Sugestões para você</h2>
            <p className="text-xs text-of-muted">Descubra novos perfis</p>
          </div>
        </header>

        {isLoadingSuggestions ? (
          <div className="space-y-3 p-4" aria-label="Carregando sugestões">
            {[0, 1, 2].map((index) => (
              <div key={index} className="flex animate-pulse items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-white/10" />
                <span className="h-3 flex-1 rounded bg-white/10" />
                <span className="h-7 w-14 rounded-lg bg-white/10" />
              </div>
            ))}
          </div>
        ) : visibleSuggestions.length > 0 ? (
          <ul className="divide-y divide-of-border">
            {visibleSuggestions.map((person) => (
              <li key={person.id} className="flex items-center gap-3 px-4 py-3">
                <Link
                  href={`/${person.username}`}
                  className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-of-border"
                >
                  <Image
                    src={resolveAvatarUrl(person.avatarUrl, person.username)}
                    alt={`Avatar de ${person.name}`}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </Link>
                <Link href={`/${person.username}`} className="min-w-0 flex-1 hover:opacity-80">
                  <p className="truncate text-sm font-medium text-of-text">{person.name}</p>
                  <p className="truncate text-xs text-of-muted">@{person.username}</p>
                </Link>
                <button
                  type="button"
                  onClick={() => followSuggestion(person)}
                  disabled={followingUserId !== null}
                  className="rounded-lg bg-of-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-of-primaryHover disabled:cursor-wait disabled:opacity-60"
                >
                  {followingUserId === person.id ? 'Aguarde...' : 'Seguir'}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-6 text-center text-sm text-of-muted">
            Você já segue todas as sugestões disponíveis.
          </p>
        )}

        {followError ? (
          <p className="border-t border-of-border px-4 py-3 text-xs text-red-400" role="alert">
            {followError}
          </p>
        ) : null}
      </section>

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
