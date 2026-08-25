'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, GripVertical, ImagePlus, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AppShell } from '../../../components/layout/app-shell';
import { apiFetch, getAuthSession } from '../../../lib/auth';
import { validateAndCompressImages } from '../../../lib/image-compression';
import { ProfileMobileNavigation, ProfileSidebar } from '../../profile/components/profile-sidebar';

type EditablePost = {
  id: string;
  authorId: string;
  caption: string;
  media: Array<{ id: string; url: string }>;
};
type ImageItem = { key: string; url: string; existingId?: string; file?: File };

export function PostEditPage({ postId }: { postId: string }) {
  const router = useRouter();
  const session = getAuthSession();
  const [post, setPost] = useState<EditablePost | null>(null);
  const [caption, setCaption] = useState('');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [draggedKey, setDraggedKey] = useState<string | null>(null);

  useEffect(() => {
    void apiFetch(`/posts/${postId}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Publicação não encontrada');
        return response.json() as Promise<EditablePost>;
      })
      .then((value) => {
        if (value.authorId !== getAuthSession()?.user.id) {
          router.replace('/feed');
          return;
        }
        setPost(value);
        setCaption(value.caption);
        setImages(
          value.media.map((item) => ({ key: item.id, existingId: item.id, url: item.url })),
        );
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Erro ao carregar'));
  }, [postId, router]);

  function dropOn(targetKey: string) {
    if (!draggedKey || draggedKey === targetKey) {
      setDraggedKey(null);
      return;
    }
    setImages((current) => {
      const sourceIndex = current.findIndex((item) => item.key === draggedKey);
      const targetIndex = current.findIndex((item) => item.key === targetKey);
      if (sourceIndex < 0 || targetIndex < 0) return current;
      const next = [...current];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved!);
      return next;
    });
    setDraggedKey(null);
  }

  function remove(index: number) {
    setImages((current) => {
      const removed = current[index];
      if (removed?.file) URL.revokeObjectURL(removed.url);
      return current.filter((_, itemIndex) => itemIndex !== index);
    });
  }

  function addFiles(selected: File[]) {
    if (images.length + selected.length > 4) {
      setError('A publicação pode ter no máximo 4 imagens');
      return;
    }
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    const invalid = selected.find(
      (file) => !allowed.includes(file.type) || file.size > 5 * 1024 * 1024,
    );
    if (invalid) {
      setError('Use apenas imagens JPG, PNG ou WebP de até 5 MB');
      return;
    }
    setImages((current) => [
      ...current,
      ...selected.map((file) => ({
        key: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        url: URL.createObjectURL(file),
      })),
    ]);
    setError('');
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (images.length === 0) {
      setError('Mantenha ao menos uma imagem na publicação');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const newItems = images.filter((item): item is ImageItem & { file: File } =>
        Boolean(item.file),
      );
      const compressed = newItems.length
        ? await validateAndCompressImages(newItems.map((item) => item.file))
        : [];
      const newIndexByKey = new Map(newItems.map((item, index) => [item.key, index]));
      const mediaOrder = images.map((item) =>
        item.existingId ? { id: item.existingId } : { newIndex: newIndexByKey.get(item.key) },
      );
      const data = new FormData();
      data.append('caption', caption);
      data.append('replaceImages', 'false');
      data.append('mediaOrder', JSON.stringify(mediaOrder));
      compressed.forEach((file) => data.append('images', file));
      const response = await apiFetch(`/posts/${postId}`, { method: 'PATCH', body: data });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message ?? 'Não foi possível salvar');
      }
      router.push('/profile');
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível salvar');
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
      <section className="rounded-2xl border border-of-border bg-of-surface/90 p-5 sm:p-7">
        <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-of-muted">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <h1 className="mt-5 font-[var(--font-heading)] text-2xl">Editar publicação</h1>
        {!post && !error ? (
          <p className="mt-6 text-of-muted">Carregando...</p>
        ) : (
          <form onSubmit={save} className="mt-6 space-y-5">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Legenda</span>
              <textarea
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                maxLength={2200}
                rows={7}
                className="w-full resize-none rounded-xl border border-of-border bg-black/20 p-3 text-sm outline-none focus:border-of-primary"
              />
              <span className="mt-1 block text-right text-xs text-of-muted">
                {caption.length}/2200
              </span>
            </label>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Fotos</span>
                <span className="text-xs text-of-muted">{images.length}/4</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.map((item, index) => (
                  <div
                    key={item.key}
                    draggable
                    onDragStart={(event) => {
                      setDraggedKey(item.key);
                      event.dataTransfer.effectAllowed = 'move';
                      event.dataTransfer.setData('text/plain', item.key);
                    }}
                    onDragEnd={() => setDraggedKey(null)}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = 'move';
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      dropOn(item.key);
                    }}
                    className={`group relative aspect-square cursor-grab overflow-hidden rounded-xl border bg-black/20 transition active:cursor-grabbing ${draggedKey === item.key ? 'scale-95 border-of-primary opacity-50' : 'border-of-border hover:border-of-primary/60'}`}
                  >
                    <Image
                      src={item.url}
                      alt={`Foto ${index + 1}`}
                      fill
                      unoptimized={Boolean(item.file)}
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={() => remove(index)}
                      className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/80 text-white shadow-lg transition hover:bg-red-600"
                      aria-label="Excluir imagem"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="pointer-events-none absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-lg bg-black/75 px-2 py-1 text-xs text-white">
                      <GripVertical className="h-3.5 w-3.5" />
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
              {images.length < 4 ? (
                <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-of-border px-4 py-2.5 text-sm hover:bg-white/5">
                  <ImagePlus className="h-4 w-4" />
                  Adicionar imagens
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(event) => {
                      addFiles(Array.from(event.target.files ?? []));
                      event.target.value = '';
                    }}
                  />
                </label>
              ) : null}
              <p className="mt-1 text-xs text-of-muted">
                Arraste e solte as imagens para alterar a ordem. JPG, PNG ou WebP, até 5 MB cada.
              </p>
            </div>
            {error ? (
              <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>
            ) : null}
            <div className="flex justify-end">
              <button
                disabled={saving || images.length === 0}
                className="inline-flex items-center gap-2 rounded-xl bg-of-primary px-4 py-2.5 font-semibold text-white disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </form>
        )}
      </section>
    </AppShell>
  );
}
