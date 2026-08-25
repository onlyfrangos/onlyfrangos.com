'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MapPin, Pencil, Plus, RotateCcw, Search } from 'lucide-react';
import { useDeferredValue, useEffect, useState } from 'react';

import { AppShell } from '../../../components/layout/app-shell';
import { CustomSelect } from '../../../components/ui/custom-select';
import { apiFetch, getAuthSession } from '../../../lib/auth';
import type { CityOption, StateOption } from '../../locations/location-selects';
import { ProfileMobileNavigation, ProfileSidebar } from '../../profile/components/profile-sidebar';
import type { GymPage } from '../types';

const selectClass =
  'rounded-xl border border-of-border bg-black/20 px-3 py-2.5 text-sm text-of-text outline-none focus:border-of-primary';

export function GymsPage() {
  const session = getAuthSession();
  const [states, setStates] = useState<StateOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [stateId, setStateId] = useState('');
  const [cityId, setCityId] = useState('');
  const [name, setName] = useState('');
  const deferredName = useDeferredValue(name);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<GymPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    void apiFetch('/locations/states')
      .then((response) => response.json())
      .then((items) => setStates(items as StateOption[]));
  }, []);

  useEffect(() => {
    setCityId('');
    if (!stateId) {
      setCities([]);
      return;
    }
    void apiFetch(`/locations/cities?stateId=${stateId}`)
      .then((response) => response.json())
      .then((items) => setCities(items as CityOption[]));
  }, [stateId]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const query = new URLSearchParams({ page: String(page) });
    if (stateId) query.set('stateId', stateId);
    if (cityId) query.set('cityId', cityId);
    if (deferredName.trim()) query.set('name', deferredName.trim());
    void apiFetch(`/gyms?${query}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Não foi possível carregar as academias');
        return response.json() as Promise<GymPage>;
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
  }, [page, stateId, cityId, deferredName]);

  const username = session?.user.username ?? 'usuario';
  const isAdmin = Boolean(session?.user.isAdmin);

  return (
    <AppShell
      leftAside={<ProfileSidebar username={username} />}
      mobileNavigation={<ProfileMobileNavigation username={username} />}
    >
      <section className="rounded-2xl border border-of-border bg-of-surface/90 p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-of-primary">
              Encontre seu treino
            </p>
            <h1 className="mt-1 font-[var(--font-heading)] text-4xl tracking-wide text-of-text">
              Academias
            </h1>
            <p className="mt-1 text-sm text-of-muted">Descubra academias em todo o Brasil.</p>
          </div>
          {isAdmin ? (
            <Link
              href="/gyms/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-of-primary px-4 py-3 text-sm font-semibold text-white hover:bg-of-primaryHover"
            >
              <Plus className="h-4 w-4" />
              Cadastrar academia
            </Link>
          ) : null}
        </div>

        <div className="mt-6 grid gap-3 rounded-2xl border border-of-border bg-black/15 p-4 md:grid-cols-3">
          <label>
            <span className="mb-1.5 block text-xs font-medium text-of-muted">Nome da academia</span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-of-muted" />
              <input
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setPage(1);
                }}
                placeholder="Ex.: Iron"
                className={`${selectClass} w-full pl-9`}
              />
            </span>
          </label>
          <label className="relative z-20">
            <span className="mb-1.5 block text-xs font-medium text-of-muted">Estado</span>
            <CustomSelect
              value={stateId}
              onChange={(value) => {
                setStateId(value);
                setPage(1);
              }}
              options={[
                { value: '', label: 'Todos os estados' },
                ...states.map((state) => ({
                  value: String(state.codigoUf),
                  label: `${state.nome} (${state.uf})`,
                })),
              ]}
              placeholder="Todos os estados"
              ariaLabel="Filtrar por estado"
              className={`${selectClass} w-full`}
            />
          </label>
          <label className="relative z-10">
            <span className="mb-1.5 block text-xs font-medium text-of-muted">Cidade</span>
            <CustomSelect
              value={cityId}
              onChange={(value) => {
                setCityId(value);
                setPage(1);
              }}
              options={[
                { value: '', label: 'Todas as cidades' },
                ...cities.map((city) => ({ value: String(city.codigoIbge), label: city.nome })),
              ]}
              placeholder="Todas as cidades"
              ariaLabel="Filtrar por cidade"
              disabled={!stateId}
              className={`${selectClass} w-full disabled:opacity-50`}
            />
          </label>
          <div className="flex justify-end md:col-span-3">
            <button
              type="button"
              disabled={!name && !stateId && !cityId}
              onClick={() => {
                setName('');
                setStateId('');
                setCityId('');
                setPage(1);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-of-border px-3 py-2 text-sm text-of-muted transition hover:bg-white/5 hover:text-of-text disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" />
              Limpar filtros
            </button>
          </div>
        </div>

        {error ? (
          <p className="mt-6 rounded-xl bg-red-500/10 p-4 text-sm text-red-400">{error}</p>
        ) : null}
        {loading ? (
          <div className="grid min-h-64 place-items-center text-sm text-of-muted">
            Carregando academias...
          </div>
        ) : null}
        {!loading && data?.items.length === 0 ? (
          <div className="grid min-h-64 place-items-center text-center">
            <div>
              <p className="text-lg font-semibold">Nenhuma academia encontrada</p>
              <p className="mt-1 text-sm text-of-muted">Tente alterar os filtros.</p>
            </div>
          </div>
        ) : null}

        {!loading && data?.items.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.items.map((gym) => (
              <article
                key={gym.id}
                className="group relative overflow-hidden rounded-2xl border border-of-border bg-black/20 transition hover:-translate-y-0.5 hover:border-red-500/40"
              >
                <Link href={`/gyms/${gym.id}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-black/30">
                    <Image
                      src={gym.imageUrl}
                      alt={`Academia ${gym.name}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-of-text">{gym.name}</h2>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-of-muted">
                      <MapPin className="h-4 w-4 text-of-primary" />
                      {gym.city}, {gym.state}
                    </p>
                  </div>
                </Link>
                {isAdmin ? (
                  <Link
                    href={`/gyms/${gym.id}/edit`}
                    aria-label={`Editar ${gym.name}`}
                    className="absolute right-3 top-3 rounded-full bg-black/75 p-2 text-white backdrop-blur hover:bg-of-primary"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}

        {data && data.totalPages > 1 ? (
          <nav
            className="mt-7 flex items-center justify-between border-t border-of-border pt-5"
            aria-label="Paginação"
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
              Página <strong className="text-of-text">{data.page}</strong> de {data.totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((value) => Math.min(value + 1, data.totalPages))}
              disabled={page === data.totalPages}
              className="inline-flex items-center gap-1 rounded-xl border border-of-border px-3 py-2 text-sm disabled:opacity-40"
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        ) : null}
      </section>
    </AppShell>
  );
}
