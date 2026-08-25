'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AppShell } from '../../../components/layout/app-shell';
import { apiFetch, getAuthSession } from '../../../lib/auth';
import { LocationSelects } from '../../locations/location-selects';
import { ProfileMobileNavigation, ProfileSidebar } from '../../profile/components/profile-sidebar';
import type { Gym } from '../types';

const inputClass =
  'w-full rounded-xl border border-of-border bg-black/20 px-3 py-2.5 text-sm text-of-text outline-none focus:border-of-primary focus:ring-2 focus:ring-of-primary/20';

export function GymFormPage({ gymId }: { gymId?: string }) {
  const router = useRouter();
  const session = getAuthSession();
  const [form, setForm] = useState({ name: '', stateId: '', cityId: '', imageUrl: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(Boolean(gymId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  useEffect(() => {
    if (!session?.user.isAdmin) {
      router.replace('/gyms');
      return;
    }
    if (!gymId) return;
    void apiFetch(`/gyms/${gymId}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Academia não encontrada');
        return response.json() as Promise<Gym>;
      })
      .then((gym) =>
        setForm({
          name: gym.name,
          stateId: String(gym.stateId),
          cityId: String(gym.cityId),
          imageUrl: gym.imageUrl,
        }),
      )
      .catch((requestError) =>
        setError(requestError instanceof Error ? requestError.message : 'Erro ao carregar'),
      )
      .finally(() => setLoading(false));
  }, [gymId, router, session?.user.isAdmin]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await apiFetch(gymId ? `/gyms/${gymId}` : '/gyms', {
        method: gymId ? 'PATCH' : 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          cityId: Number(form.cityId),
        }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string | string[];
        } | null;
        throw new Error(
          Array.isArray(payload?.message)
            ? payload.message[0]
            : (payload?.message ?? 'Não foi possível salvar'),
        );
      }
      const savedGym = (await response.json()) as Gym;
      if (imageFile) {
        const imageData = new FormData();
        imageData.append('image', imageFile);
        const imageResponse = await apiFetch(`/gyms/${savedGym.id}/image`, {
          method: 'POST',
          body: imageData,
        });
        if (!imageResponse.ok)
          throw new Error('A academia foi salva, mas não foi possível enviar a imagem');
      }
      router.push(`/gyms/${savedGym.id}`);
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Não foi possível salvar');
    } finally {
      setSaving(false);
    }
  }

  const username = session?.user.username ?? 'usuario';
  return (
    <AppShell
      leftAside={<ProfileSidebar username={username} />}
      mobileNavigation={<ProfileMobileNavigation username={username} />}
    >
      <section className="w-full rounded-2xl border border-of-border bg-of-surface/90 p-5 sm:p-7">
        <Link
          href="/gyms"
          className="inline-flex items-center gap-2 text-sm text-of-muted hover:text-of-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <h1 className="mt-5 font-[var(--font-heading)] text-4xl tracking-wide">
          {gymId ? 'Editar academia' : 'Cadastrar academia'}
        </h1>
        <p className="mt-1 text-sm text-of-muted">
          {gymId ? 'Atualize os dados desta unidade.' : 'Adicione uma nova academia à comunidade.'}
        </p>
        {loading ? (
          <p className="mt-8 text-sm text-of-muted">Carregando...</p>
        ) : (
          <form onSubmit={submit} className="mt-7 grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium">Nome</span>
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className={inputClass}
                minLength={2}
                maxLength={120}
                required
              />
            </label>
            <LocationSelects
              stateId={form.stateId}
              cityId={form.cityId}
              onStateChange={(stateId) => setForm({ ...form, stateId, cityId: '' })}
              onCityChange={(cityId) => setForm({ ...form, cityId })}
              className={inputClass}
            />
            <div className="sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium">Imagem da academia</span>
              {previewUrl || (gymId && form.imageUrl) ? (
                <div className="relative mb-3 aspect-[16/7] overflow-hidden rounded-xl border border-of-border">
                  <Image
                    src={previewUrl || form.imageUrl}
                    alt={previewUrl ? 'Nova imagem selecionada' : 'Imagem atual da academia'}
                    fill
                    sizes="640px"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <label className="block">
                <span className="sr-only">Selecionar imagem da academia</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                  className="block w-full rounded-xl border border-dashed border-of-border bg-black/20 p-3 text-sm text-of-muted file:mr-3 file:rounded-lg file:border-0 file:bg-of-primary file:px-3 file:py-2 file:font-semibold file:text-white"
                />
              </label>
              <span className="mt-1 block text-xs text-of-muted">
                JPG, PNG ou WebP, até 5 MB.{gymId ? ' Deixe vazio para manter a imagem atual.' : ''}
              </span>
            </div>
            {error ? (
              <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-400 sm:col-span-2">
                {error}
              </p>
            ) : null}
            <div className="flex justify-end gap-3 sm:col-span-2">
              <Link
                href="/gyms"
                className="rounded-xl border border-of-border px-4 py-2.5 text-sm hover:bg-white/5"
              >
                Cancelar
              </Link>
              <button
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-of-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-of-primaryHover disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Salvando...' : 'Salvar academia'}
              </button>
            </div>
          </form>
        )}
      </section>
    </AppShell>
  );
}
