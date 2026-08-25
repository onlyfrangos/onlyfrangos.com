'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  MapPin,
  Pencil,
  Target,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { AppShell } from '../../../components/layout/app-shell';
import { apiFetch, getAuthSession } from '../../../lib/auth';
import { resolveAvatarUrl } from '../../../lib/avatar';
import { ProfileMobileNavigation, ProfileSidebar } from '../../profile/components/profile-sidebar';
import type { Gym, GymMembersPage } from '../types';

export function GymDetailPage({ gymId }: { gymId: string }) {
  const session = getAuthSession();
  const [gym, setGym] = useState<Gym | null>(null);
  const [members, setMembers] = useState<GymMembersPage | null>(null);
  const [page, setPage] = useState(1);
  const [loadingGym, setLoadingGym] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    void apiFetch(`/gyms/${gymId}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Academia não encontrada');
        return response.json() as Promise<Gym>;
      })
      .then((payload) => {
        if (active) setGym(payload);
      })
      .catch((requestError) => {
        if (active)
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Não foi possível carregar a academia',
          );
      })
      .finally(() => {
        if (active) setLoadingGym(false);
      });
    return () => {
      active = false;
    };
  }, [gymId]);

  useEffect(() => {
    let active = true;
    setLoadingMembers(true);
    void apiFetch(`/gyms/${gymId}/members?page=${page}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Não foi possível carregar os membros');
        return response.json() as Promise<GymMembersPage>;
      })
      .then((payload) => {
        if (active) setMembers(payload);
      })
      .catch((requestError) => {
        if (active)
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Não foi possível carregar os membros',
          );
      })
      .finally(() => {
        if (active) setLoadingMembers(false);
      });
    return () => {
      active = false;
    };
  }, [gymId, page]);

  const username = session?.user.username ?? 'usuario';
  const isAdmin = Boolean(session?.user.isAdmin);

  return (
    <AppShell
      leftAside={<ProfileSidebar username={username} />}
      mobileNavigation={<ProfileMobileNavigation username={username} />}
    >
      {loadingGym ? (
        <div className="grid min-h-[70vh] place-items-center text-sm text-of-muted">
          Carregando academia...
        </div>
      ) : null}
      {error && !gym ? (
        <div className="rounded-2xl border border-of-border bg-of-surface p-8 text-center text-red-400">
          {error}
        </div>
      ) : null}
      {gym ? (
        <>
          <section className="overflow-hidden rounded-2xl border border-of-border bg-of-surface/90">
            <div className="relative h-64 sm:h-80">
              <Image
                src={gym.imageUrl}
                alt={`Academia ${gym.name}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/10" />
              <Link
                href="/gyms"
                className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-xl bg-black/70 px-3 py-2 text-sm text-white backdrop-blur hover:bg-black/90"
              >
                <ArrowLeft className="h-4 w-4" />
                Academias
              </Link>
              {isAdmin ? (
                <Link
                  href={`/gyms/${gym.id}/edit`}
                  className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-xl bg-of-primary px-3 py-2 text-sm font-semibold text-white hover:bg-of-primaryHover"
                >
                  <Pencil className="h-4 w-4" />
                  Editar
                </Link>
              ) : null}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                  Academia
                </p>
                <h1 className="mt-1 font-[var(--font-heading)] text-4xl tracking-wide text-white sm:text-5xl">
                  {gym.name}
                </h1>
                <p className="mt-2 flex items-center gap-2 text-sm text-white/75">
                  <MapPin className="h-4 w-4 text-of-primary" />
                  {gym.city}, {gym.stateName}
                </p>
              </div>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7">
              <div className="rounded-xl border border-of-border bg-black/15 p-4">
                <p className="text-xs text-of-muted">Localização</p>
                <p className="mt-1 font-medium">
                  {gym.city} — {gym.state}
                </p>
              </div>
              <div className="rounded-xl border border-of-border bg-black/15 p-4">
                <p className="text-xs text-of-muted">Pessoas cadastradas</p>
                <p className="mt-1 flex items-center gap-2 font-medium">
                  <Users className="h-4 w-4 text-of-primary" />
                  {members?.total ?? 0} {members?.total === 1 ? 'membro' : 'membros'}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-2xl border border-of-border bg-of-surface/90 p-5 sm:p-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-of-primary">
                Comunidade
              </p>
              <h2 className="mt-1 text-2xl font-semibold">Quem treina aqui</h2>
              <p className="mt-1 text-sm text-of-muted">
                Conheça os membros cadastrados nesta academia.
              </p>
            </div>
            {loadingMembers ? (
              <div className="grid min-h-52 place-items-center text-sm text-of-muted">
                Carregando membros...
              </div>
            ) : null}
            {!loadingMembers && members?.items.length === 0 ? (
              <div className="grid min-h-52 place-items-center text-center">
                <div>
                  <Users className="mx-auto h-8 w-8 text-of-muted" />
                  <p className="mt-3 font-medium">Ainda não há membros cadastrados</p>
                  <p className="mt-1 text-sm text-of-muted">
                    Os perfis vinculados à academia aparecerão aqui.
                  </p>
                </div>
              </div>
            ) : null}
            {!loadingMembers && members?.items.length ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {members.items.map((member) => (
                  <Link
                    key={member.id}
                    href={`/${member.username}`}
                    className="group flex gap-4 rounded-2xl border border-of-border bg-black/15 p-4 transition hover:border-red-500/40 hover:bg-black/25"
                  >
                    <Image
                      src={resolveAvatarUrl(member.avatarUrl, member.username)}
                      alt={member.name}
                      width={72}
                      height={72}
                      className="h-16 w-16 shrink-0 rounded-full border border-of-border object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold group-hover:text-of-primary">
                        {member.name}
                      </h3>
                      <p className="truncate text-xs text-of-muted">@{member.username}</p>
                      {member.bio ? (
                        <p className="mt-2 line-clamp-2 text-sm text-of-text/80">{member.bio}</p>
                      ) : null}
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-of-muted">
                        {member.fitnessGoal ? (
                          <span className="flex items-center gap-1">
                            <Target className="h-3.5 w-3.5" />
                            {member.fitnessGoal}
                          </span>
                        ) : null}
                        <span className="flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5" />
                          {member.postCount} publicações
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Desde {formatYear(member.memberSince)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
            {members && members.totalPages > 1 ? (
              <nav
                className="mt-7 flex items-center justify-between border-t border-of-border pt-5"
                aria-label="Paginação dos membros"
              >
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.max(value - 1, 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 rounded-xl border border-of-border px-3 py-2 text-sm disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </button>
                <span className="text-sm text-of-muted">
                  Página <strong className="text-of-text">{members.page}</strong> de{' '}
                  {members.totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.min(value + 1, members.totalPages))}
                  disabled={page === members.totalPages}
                  className="inline-flex items-center gap-1 rounded-xl border border-of-border px-3 py-2 text-sm disabled:opacity-40"
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            ) : null}
          </section>
        </>
      ) : null}
    </AppShell>
  );
}

function formatYear(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { year: 'numeric' }).format(new Date(value));
}
