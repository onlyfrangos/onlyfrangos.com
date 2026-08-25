"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Bookmark,
  Compass,
  Dumbbell,
  Flame,
  Home,
  LogOut,
  Medal,
  Menu,
  MessageCircle,
  Plus,
  User2,
  Users,
  X
} from "lucide-react";

import { getAuthSession, logoutUser } from "../../../lib/auth";

type SidebarItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  badge?: number;
  adminOnly?: boolean;
};

type ProfileSidebarProps = {
  username: string;
};

const sidebarItems: SidebarItem[] = [
  { href: "/feed", label: "Inicio", icon: Home },
  { href: "/users", label: "Usuários", icon: Users, adminOnly: true },
  { href: "/gyms", label: "Academias", icon: Dumbbell },
  { href: "#", label: "Explorar", icon: Compass },
  { href: "#", label: "Notificacoes", icon: Bell, badge: 8 },
  { href: "#", label: "Mensagens", icon: MessageCircle },
  { href: "#", label: "Salvos", icon: Bookmark },
  { href: "#", label: "Desafios", icon: Flame },
  { href: "#", label: "Rankings", icon: Medal }
];

export function ProfileSidebar({ username }: ProfileSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [viewerUsername, setViewerUsername] = useState(username);
  const isAdmin = Boolean(getAuthSession()?.user.isAdmin);

  useEffect(() => {
    setViewerUsername(getAuthSession()?.user.username ?? username);
  }, [username]);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    try {
      await logoutUser();
    } finally {
      setIsMenuOpen(false);
      router.replace("/login");
      router.refresh();
    }
  }

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
        {sidebarItems
          .filter((item) => !item.adminOnly || isAdmin)
          .map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={[
                  "flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition",
                  pathname.startsWith(item.href)
                    ? "border-red-500/30 bg-red-500/10 text-of-text"
                    : "border-transparent text-of-muted hover:border-of-border hover:bg-of-surface/70 hover:text-of-text"
                ].join(" ")}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
                {item.badge ? (
                  <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                    {item.badge}
                  </span>
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

      <div className="relative mt-auto rounded-xl border border-of-border bg-black/20 p-1 px-2">
        {isMenuOpen ? (
          <div className="absolute bottom-full right-0 z-20 mb-2 w-40 rounded-xl border border-of-border bg-of-surface p-1 shadow-xl">
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-400 transition hover:bg-white/5 disabled:cursor-wait disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Saindo..." : "Sair"}
            </button>
          </div>
        ) : null}
        <div className="flex items-center justify-between">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-lg px-1 py-1 text-sm hover:bg-white/5"
          >
            <div className="grid h-9 w-9 place-items-center rounded-full border border-of-border bg-of-surface text-of-muted">
              <User2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-of-text">@{viewerUsername}</p>
              <p className="text-xs text-of-muted">Ver perfil</p>
            </div>
          </Link>
          <button
            type="button"
            aria-label="Abrir menu de usuario"
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="rounded-lg border border-transparent px-2 py-1.5 text-of-muted transition hover:border-of-border hover:text-of-text"
          >
            ...
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProfileMobileNavigation({ username }: ProfileSidebarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [viewerUsername, setViewerUsername] = useState(username);
  const isAdmin = Boolean(getAuthSession()?.user.isAdmin);

  useEffect(() => {
    setViewerUsername(getAuthSession()?.user.username ?? username);
  }, [username]);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    try {
      await logoutUser();
    } finally {
      setIsOpen(false);
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <>
      {isOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          role="presentation"
          onClick={() => setIsOpen(false)}
        >
          <aside
            className="absolute inset-x-3 bottom-3 max-h-[80vh] overflow-y-auto rounded-2xl border border-of-border bg-of-surface p-4 shadow-2xl"
            aria-label="Menu principal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-of-text">Menu</p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Fechar menu"
                className="rounded-lg p-2 text-of-muted hover:bg-white/5 hover:text-of-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="grid grid-cols-2 gap-2">
              {sidebarItems
                .filter((item) => !item.adminOnly || isAdmin)
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 rounded-xl border border-of-border/70 px-3 py-3 text-sm text-of-muted hover:bg-white/5 hover:text-of-text"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                      {item.badge ? (
                        <span className="ml-auto rounded-full bg-red-600 px-1.5 text-[10px] text-white">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
            </nav>

            <button
              type="button"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-of-primary px-4 py-3 text-sm font-semibold text-white hover:bg-of-primaryHover"
            >
              <Plus className="h-4 w-4" />
              Criar publicacao
            </button>

            <div className="mt-3 flex items-center gap-2 border-t border-of-border pt-3">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2 py-2 text-sm text-of-text hover:bg-white/5"
              >
                <User2 className="h-4 w-4 shrink-0" />
                <span className="truncate">@{viewerUsername}</span>
              </Link>
              <button
                type="button"
                onClick={() => void handleLogout()}
                disabled={isLoggingOut}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-400 hover:bg-white/5 disabled:cursor-wait disabled:opacity-60"
              >
                <LogOut className="h-4 w-4" />
                {isLoggingOut ? "Saindo..." : "Sair"}
              </button>
            </div>
          </aside>
        </div>
      ) : null}

      <nav
        className="fixed inset-x-3 bottom-3 z-30 rounded-2xl border border-of-border bg-of-surface/95 p-2 backdrop-blur lg:hidden"
        aria-label="Navegacao mobile"
      >
        <ul className="grid grid-cols-4 gap-1 text-center text-xs text-of-muted">
          <li>
            <Link
              href="/feed"
              className="flex flex-col items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-black/25 hover:text-of-text"
            >
              <Home className="h-4 w-4" />
              Inicio
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex flex-col items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-black/25 hover:text-of-text"
            >
              <Compass className="h-4 w-4" />
              Explorar
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className="flex flex-col items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-black/25 hover:text-of-text"
            >
              <User2 className="h-4 w-4" />
              Perfil
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-expanded={isOpen}
              className="flex w-full flex-col items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-black/25 hover:text-of-text"
            >
              <Menu className="h-4 w-4" />
              Menu
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
