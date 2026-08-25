"use client";

import { X } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmModal({ open, title, description, confirmLabel, loading = false, onClose, onConfirm }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title" onMouseDown={(event) => { if (event.target === event.currentTarget && !loading) onClose(); }}>
      <div className="w-full max-w-sm rounded-2xl border border-of-border bg-of-surface p-5 shadow-2xl">
        <div className="flex justify-end"><button type="button" onClick={onClose} disabled={loading} className="rounded-lg p-1.5 text-of-muted hover:bg-white/5 hover:text-of-text" aria-label="Fechar"><X className="h-5 w-5" /></button></div>
        <h2 id="confirm-modal-title" className="text-lg font-semibold text-of-text">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-of-muted">{description}</p>
        <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onClose} disabled={loading} className="rounded-xl border border-of-border px-4 py-2 text-sm hover:bg-white/5">Cancelar</button><button type="button" onClick={onConfirm} disabled={loading} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50">{loading ? "Excluindo..." : confirmLabel}</button></div>
      </div>
    </div>
  );
}
