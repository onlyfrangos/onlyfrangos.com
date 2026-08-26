'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  FileText,
  MapPin,
  Pencil,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { AppShell } from '../../../components/layout/app-shell';
import { CustomSelect } from '../../../components/ui/custom-select';
import { apiFetch, getAuthSession } from '../../../lib/auth';
import { resolveAvatarUrl } from '../../../lib/avatar';
import { ProfileMobileNavigation, ProfileSidebar } from '../../profile/components/profile-sidebar';
import type { Gym, GymMemberSort, GymMembersPage } from '../types';

const memberSortOptions: Array<{ value: GymMemberSort; label: string }> = [
  { value: 'recent', label: 'Recém chegados' },
  { value: 'oldest', label: 'Mais antigos' },
  { value: 'followers', label: 'Mais seguidores' },
];

export function GymDetailPage({ gymId }: { gymId: string }) {
  const session = getAuthSession();
  const [gym, setGym] = useState<Gym | null>(null);
  const [members, setMembers] = useState<GymMembersPage | null>(null);
  const [page, setPage] = useState(1);
  const [memberSort, setMemberSort] = useState<GymMemberSort>('recent');
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
    void apiFetch(`/gyms/${gymId}/members?page=${page}&sort=${memberSort}`)
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
  }, [gymId, memberSort, page]);

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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-of-primary">
                  Comunidade
                </p>
                <h2 className="mt-1 text-2xl font-semibold">Quem treina aqui</h2>
                <p className="mt-1 text-sm text-of-muted">
                  Conheça os membros cadastrados nesta academia.
                </p>
              </div>
              <div className="w-full sm:w-52">
                <span className="mb-1.5 block text-xs font-medium text-of-muted">Ordenar por</span>
                <CustomSelect
                  value={memberSort}
                  options={memberSortOptions}
                  onChange={(sortValue) => {
                    setMemberSort(sortValue as GymMemberSort);
                    setPage(1);
                  }}
                  placeholder="Ordenar membros"
                  ariaLabel="Ordenar membros da academia"
                  className="h-10 rounded-xl border border-of-border bg-black/20 px-3 text-sm text-of-text outline-none transition focus:border-of-primary focus:ring-2 focus:ring-red-500/20"
                />
              </div>
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
              <div className="mt-6 grid gap-3 md:grid-cols-3 xl:grid-cols-5">
                {members.items.map((member) => (
                  <Link
                    key={member.id}
                    href={`/${member.username}`}
                    className="group min-w-0 overflow-hidden rounded-2xl border border-of-border bg-black/15 transition hover:-translate-y-0.5 hover:border-red-500/40 hover:bg-black/25"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-white/5">
                      <Image
                        src={resolveAvatarUrl(member.avatarUrl, member.username)}
                        alt={member.name}
                        fill
                        sizes="(max-width: 767px) 100vw, (max-width: 1279px) 33vw, 20vw"
                        className="object-cover transition duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="min-w-0 p-3">
                      <h3 className="truncate text-sm font-semibold group-hover:text-of-primary">
                        {member.name}
                      </h3>
                      <p className="truncate text-xs text-of-muted">@{member.username}</p>
                      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-of-border pt-3 text-[11px] text-of-muted">
                        <span className="flex min-w-0 items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span className="truncate">
                            {formatCompactNumber(member.followerCount)} seguidores
                          </span>
                        </span>
                        <span className="flex min-w-0 items-center justify-end gap-1">
                          <FileText className="h-3 w-3" />
                          <span className="truncate">
                            {formatCompactNumber(member.postCount)} postagens
                          </span>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
            {members && members.total > 0 ? (
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
                <div className="hidden items-center gap-1 sm:flex">
                  {getVisiblePages(members.page, members.totalPages).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      aria-label={`Ir para a página ${pageNumber}`}
                      aria-current={pageNumber === members.page ? 'page' : undefined}
                      className={`grid h-9 w-9 place-items-center rounded-lg border text-sm transition ${
                        pageNumber === members.page
                          ? 'border-of-primary bg-of-primary text-white'
                          : 'border-of-border text-of-muted hover:border-red-500/40 hover:text-of-text'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-of-muted sm:hidden">
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

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(value);
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const visiblePageCount = Math.min(totalPages, 5);
  const maximumStartPage = Math.max(totalPages - visiblePageCount + 1, 1);
  const startPage = Math.min(Math.max(currentPage - 2, 1), maximumStartPage);

  return Array.from({ length: visiblePageCount }, (_, index) => startPage + index);
}
