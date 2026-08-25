'use client';

import Image from 'next/image';
import { ImagePlus, Send, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { apiFetch } from '../../../lib/auth';
import { validateAndCompressImages } from '../../../lib/image-compression';

export function PostComposer({ onCreated }: { onCreated: () => void }) {
  const searchParams = useSearchParams();
  const captionRef = useRef<HTMLTextAreaElement>(null);
  const [caption, setCaption] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [files]);

  useEffect(() => {
    if (searchParams.get('compose') !== '1') return;
    captionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    captionRef.current?.focus();
  }, [searchParams]);

  async function publish(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const compressed = await validateAndCompressImages(files);
      const data = new FormData();
      data.append('caption', caption);
      compressed.forEach((file) => data.append('images', file));
      const response = await apiFetch('/posts', { method: 'POST', body: data });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? 'Não foi possível publicar');
      }
      setCaption('');
      setFiles([]);
      onCreated();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Não foi possível publicar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={publish}
      className="mb-4 rounded-xl border border-of-border bg-of-surface/90 p-4"
    >
      <textarea
        ref={captionRef}
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
        maxLength={2200}
        rows={3}
        placeholder="Compartilhe seu treino..."
        className="w-full resize-none rounded-xl border border-of-border bg-black/20 p-3 text-sm outline-none focus:border-of-primary"
      />
      <p className="mt-1 text-right text-xs text-of-muted">{caption.length}/2200</p>
      {previews.length ? (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {previews.map((url, index) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={url}
                alt={`Prévia ${index + 1}`}
                fill
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  setFiles((items) => items.filter((_, itemIndex) => itemIndex !== index))
                }
                className="absolute right-1 top-1 rounded-full bg-black/75 p-1"
                aria-label="Remover imagem"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      <div className="mt-3 flex items-center justify-between gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-of-border px-3 py-2 text-sm hover:bg-white/5">
          <ImagePlus className="h-4 w-4" /> Imagens ({files.length}/4)
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => {
              const selected = Array.from(event.target.files ?? []);
              if (selected.length > 4) setError('Selecione no máximo 4 imagens');
              else {
                setFiles(selected);
                setError('');
              }
              event.target.value = '';
            }}
          />
        </label>
        <button
          disabled={saving || files.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-of-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {saving ? 'Publicando...' : 'Publicar'}
        </button>
      </div>
    </form>
  );
}
