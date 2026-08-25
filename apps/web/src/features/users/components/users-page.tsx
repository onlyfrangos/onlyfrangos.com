'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  LogIn,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useDeferredValue, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AppShell } from '../../../components/layout/app-shell';
import { ConfirmModal } from '../../../components/ui/confirm-modal';
import { apiFetch, getAuthSession, saveAuthSession, type AuthSession } from '../../../lib/auth';
import { resolveAvatarUrl } from '../../../lib/avatar';
import { ProfileMobileNavigation, ProfileSidebar } from '../../profile/components/profile-sidebar';
import type { AdminUsersPage } from '../types';

export function UsersPage() {
  const router = useRouter();
  const session = getAuthSession();
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<AdminUsersPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [impersonatingId, setImpersonatingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!session?.user.isAdmin) router.replace('/feed');
  }, [router, session?.user.isAdmin]);

  useEffect(() => {
    if (!session?.user.isAdmin) return;
    let active = true;
    setLoading(true);
    const query = new URLSearchParams({ page: String(page) });
    if (deferredSearch.trim()) query.set('search', deferredSearch.trim());
    void apiFetch(`/users/admin/list?${query}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Não foi possível carregar os usuários');
        return response.json() as Promise<AdminUsersPage>;
      })
      .then((payload) => {
        if (active) {
          setData(payload);
          setError('');
        }
      })
      .catch((requestError) => {
        if (active)
          setError(requestError instanceof Error ? requestError.message : 'Erro ao carregar');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [deferredSearch, page, session?.user.isAdmin]);

  async function remove() {
    if (!deleteTarget) return;
    setDeleting(true);
    const response = await apiFetch(`/users/admin/${deleteTarget.id}`, { method: 'DELETE' });
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(payload?.message ?? 'Não foi possível excluir o usuário');
      setDeleting(false);
      return;
    }
    setData((current) =>
      current
        ? {
            ...current,
            items: current.items.filter((item) => item.id !== deleteTarget.id),
            total: current.total - 1,
          }
        : current,
    );
    setDeleting(false);
    setDeleteTarget(null);
  }

  async function impersonate(id: string) {
    setImpersonatingId(id);
    setError('');
    try {
      const response = await apiFetch(`/auth/admin/impersonate/${id}`, { method: 'POST' });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? 'Não foi possível entrar como este usuário');
      }
      saveAuthSession((await response.json()) as AuthSession);
      router.push('/feed');
      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível entrar como este usuário',
      );
    } finally {
      setImpersonatingId(null);
    }
  }

  const username = session?.user.username ?? 'usuario';
  return (
    <AppShell
      leftAside={<ProfileSidebar username={username} />}
      mobileNavigation={<ProfileMobileNavigation username={username} />}
    >
      <section className="rounded-2xl border border-of-border bg-of-surface/90 p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-of-primary">
              Administração
            </p>
            <h1 className="mt-1 font-[var(--font-heading)] text-4xl tracking-wide">Usuários</h1>
            <p className="mt-1 text-sm text-of-muted">Gerencie as contas da comunidade.</p>
          </div>
          <Link
            href="/users/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-of-primary px-4 py-3 text-sm font-semibold text-white hover:bg-of-primaryHover"
          >
            <Plus className="h-4 w-4" />
            Cadastrar usuário
          </Link>
        </div>
        <label className="relative mt-6 block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-of-muted" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nome, usuário ou e-mail"
            className="w-full rounded-xl border border-of-border bg-black/20 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-of-primary"
          />
        </label>
        {error ? (
          <p className="mt-5 rounded-xl bg-red-500/10 p-3 text-sm text-red-400">{error}</p>
        ) : null}
        {loading ? (
          <div className="grid min-h-64 place-items-center text-sm text-of-muted">
            Carregando usuários...
          </div>
        ) : null}
        {!loading && data?.items.length === 0 ? (
          <div className="grid min-h-64 place-items-center text-of-muted">
            Nenhum usuário encontrado.
          </div>
        ) : null}
        {!loading && data?.items.length ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.items.map((user) => (
              <article
                key={user.id}
                className="relative rounded-2xl border border-of-border bg-black/15 p-4"
              >
                <button
                  type="button"
                  onClick={() => void impersonate(user.id)}
                  disabled={impersonatingId !== null || user.id === session?.user.id}
                  title="Entrar como este usuário"
                  aria-label={`Entrar como ${user.name}`}
                  className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg border border-of-border bg-of-surface text-of-muted transition hover:border-of-primary/50 hover:text-of-primary disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <LogIn className="h-4 w-4" />
                </button>
                <div className="flex items-start gap-3 pr-10">
                  <Image
                    src={resolveAvatarUrl(user.avatarUrl, user.username)}
                    alt={user.name}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full border border-of-border object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/${user.username}`}
                        className="truncate font-semibold hover:text-of-primary"
                      >
                        {user.name}
                      </Link>
                      {user.isAdmin ? (
                        <ShieldCheck
                          className="h-4 w-4 shrink-0 text-of-primary"
                          aria-label="Administrador"
                        />
                      ) : null}
                    </div>
                    <Link href={`/${user.username}`} className="truncate text-xs text-of-muted">
                      @{user.username}
                    </Link>
                    <p className="mt-1 block truncate text-xs text-of-muted hover:text-of-text">
                      {user.email}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-of-muted">
                  {user.city ? `${user.city}/${user.state}` : 'Cidade não informada'}
                </p>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/users/${user.id}/edit`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-of-border px-3 py-2 text-sm hover:bg-white/5"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ id: user.id, name: user.name })}
                    disabled={user.id === session?.user.id}
                    aria-label={`Excluir ${user.name}`}
                    className="rounded-xl border border-red-500/30 px-3 py-2 text-red-400 hover:bg-red-500/10 disabled:opacity-30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
        {data && data.totalPages > 1 ? (
          <nav className="mt-7 flex items-center justify-between border-t border-of-border pt-5">
            <button
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-xl border border-of-border px-3 py-2 text-sm disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            <span className="text-sm text-of-muted">
              Página {data.page} de {data.totalPages}
            </span>
            <button
              onClick={() => setPage((value) => Math.min(data.totalPages, value + 1))}
              disabled={page === data.totalPages}
              className="inline-flex items-center gap-1 rounded-xl border border-of-border px-3 py-2 text-sm disabled:opacity-40"
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        ) : null}
      </section>
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Excluir usuário?"
        description={`A conta de ${deleteTarget?.name ?? 'este usuário'} e todos os dados relacionados serão excluídos permanentemente.`}
        confirmLabel="Excluir usuário"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void remove()}
      />
    </AppShell>
  );
}
