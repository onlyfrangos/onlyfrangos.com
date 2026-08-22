import Image from "next/image";
import Link from "next/link";
import { Bell, Bookmark, Compass, Dumbbell, Flame, Home, Medal, MessageCircle, Plus, User2, Users } from "lucide-react";

type SidebarItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  badge?: number;
};

type ProfileSidebarProps = {
  username: string;
};

const sidebarItems: SidebarItem[] = [
  { href: "/feed", label: "Inicio", icon: Home, active: true },
  { href: "#", label: "Explorar", icon: Compass },
  { href: "#", label: "Notificacoes", icon: Bell, badge: 8 },
  { href: "#", label: "Mensagens", icon: MessageCircle },
  { href: "#", label: "Salvos", icon: Bookmark },
  { href: "#", label: "Desafios", icon: Flame },
  { href: "#", label: "Rankings", icon: Medal },
  { href: "#", label: "Academias", icon: Dumbbell },
  { href: "#", label: "Grupos", icon: Users }
];

export function ProfileSidebar({ username }: ProfileSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-8">
        <Link href="/feed" aria-label="Ir para o feed">
          <Image
            src="/branding/onlyfrangos-logo.png"
            alt="Only Frangos"
            width={190}
            height={190}
            className="h-auto w-full max-w-[190px]"
            draggable={false}
            priority
          />
        </Link>
      </div>

      <nav className="space-y-1.5">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={[
                "flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition",
                item.active
                  ? "border-red-500/30 bg-red-500/10 text-of-text"
                  : "border-transparent text-of-muted hover:border-of-border hover:bg-of-surface/70 hover:text-of-text"
              ].join(" ")}
            >
              <span className="flex items-center gap-2.5">
                <Icon className="h-4 w-4" />
                {item.label}
              </span>
              {item.badge ? (
                <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold text-white">{item.badge}</span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-of-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-of-primaryHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70"
      >
        <Plus className="h-4 w-4" />
        Criar publicacao
      </button>

      <div className="mt-auto rounded-xl border border-of-border bg-black/20 p-1 px-2">
        <div className="flex items-center justify-between">
          <Link href={`/${username}`} className="flex items-center gap-3 rounded-lg px-1 py-1 text-sm hover:bg-white/5">
            <div className="grid h-9 w-9 place-items-center rounded-full border border-of-border bg-of-surface text-of-muted">
              <User2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-of-text">@{username}</p>
              <p className="text-xs text-of-muted">Ver perfil</p>
            </div>
          </Link>
          <button
            type="button"
            aria-label="Abrir menu de usuario"
            className="rounded-lg border border-transparent px-2 py-1.5 text-of-muted transition hover:border-of-border hover:text-of-text"
          >
            ...
          </button>
        </div>
      </div>
    </div>
  );
}
