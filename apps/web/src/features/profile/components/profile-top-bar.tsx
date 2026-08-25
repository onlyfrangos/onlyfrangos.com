import { Bell, Plus, Search } from "lucide-react";
import Link from "next/link";

export function ProfileTopBar() {
  return (
    <header className="mb-4 rounded-2xl border border-of-border bg-of-surface/85 px-3 py-3 sm:px-4 lg:mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-of-muted" />
          <input
            type="search"
            placeholder="Buscar frangos, academias, publicações..."
            className="h-10 w-full rounded-xl border border-of-border bg-black/20 pl-9 pr-3 text-sm text-of-text placeholder:text-of-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
            aria-label="Buscar frangos, academias e publicações"
          />
        </label>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/feed?compose=1"
            className="hidden items-center gap-1.5 rounded-xl border border-of-border bg-white/5 px-3 py-2 text-sm text-of-text transition hover:bg-white/10 sm:inline-flex"
          >
            <Plus className="h-4 w-4" />
            Publicar
          </Link>

          <button type="button" aria-label="Notificacoes" className="relative rounded-lg border border-of-border p-2 text-of-muted hover:text-of-text">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-red-600 text-[10px] font-semibold text-white">8</span>
          </button>
        </div>
      </div>
    </header>
  );
}
