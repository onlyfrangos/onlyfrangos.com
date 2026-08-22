import Link from "next/link";

type AppShellNavItem = {
  href: string;
  label: string;
};

type AppShellProps = {
  children: React.ReactNode;
  leftAside?: React.ReactNode;
  rightAside?: React.ReactNode;
  rightAsideClassName?: string;
  mobileNavItems?: AppShellNavItem[];
};

const navItems: AppShellNavItem[] = [
  { href: "/feed", label: "Feed" },
  { href: "/extrastickersbr", label: "Perfil" },
  { href: "#", label: "Explorar" },
  { href: "#", label: "Notificacoes" }
];

export function AppShell({
  children,
  leftAside,
  rightAside,
  rightAsideClassName,
  mobileNavItems = navItems
}: AppShellProps) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[1400px] px-3 pb-20 pt-4 sm:px-6 lg:grid lg:grid-cols-[240px_minmax(0,1fr)_320px] lg:gap-6 lg:px-8 lg:pb-6">
      {leftAside ? (
        <aside className="hidden rounded-2xl border border-of-border bg-of-surface/80 p-4 lg:sticky lg:top-6 lg:block lg:h-[calc(100vh-3rem)]">
          {leftAside}
        </aside>
      ) : (
        <aside className="hidden rounded-2xl border border-of-border bg-of-surface/80 p-4 lg:sticky lg:top-6 lg:block lg:h-[calc(100vh-3rem)]">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-of-primary" />
            <div>
              <p className="font-[var(--font-heading)] text-2xl leading-none tracking-wide">OnlyFrangos</p>
              <p className="text-xs text-of-muted">forca, foco e comunidade</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block rounded-xl border border-transparent px-3 py-2 text-sm text-of-muted transition hover:border-of-border hover:bg-black/20 hover:text-of-text"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
      )}

      <main className="min-w-0">{children}</main>

      {rightAside ? (
        <aside className={["hidden rounded-2xl border border-of-border bg-of-surface/70 p-4 lg:block", rightAsideClassName ?? ""].join(" ")}>
          {rightAside}
        </aside>
      ) : null}

      <nav className="fixed inset-x-3 bottom-3 z-20 rounded-2xl border border-of-border bg-of-surface/95 p-2 backdrop-blur lg:hidden">
        <ul className="grid grid-cols-4 gap-2 text-center text-sm text-of-muted">
          {mobileNavItems.map((item) => (
            <li key={item.label}>
              <Link href={item.href} className="block rounded-lg px-2 py-2 hover:bg-black/25 hover:text-of-text">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
