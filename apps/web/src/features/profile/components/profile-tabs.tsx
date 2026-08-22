import type { ProfileTabsItem } from "../types";

type ProfileTabsProps = {
  items: ProfileTabsItem[];
  activeTab: string;
};

export function ProfileTabs({ items, activeTab }: ProfileTabsProps) {
  return (
    <nav className="mt-4 overflow-x-auto" aria-label="Navegacao do perfil">
      <ul className="flex min-w-max items-center gap-2 border-b border-of-border px-1 sm:px-2">
        {items.map((item) => {
          const isActive = item.id === activeTab;
          return (
            <li key={item.id}>
              <button
                type="button"
                disabled={item.disabled}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "relative px-3 py-3 text-base transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70",
                  item.disabled ? "cursor-not-allowed text-of-muted/70" : "text-of-muted hover:text-of-text",
                  isActive ? "text-of-text" : ""
                ].join(" ")}
              >
                {item.label}
                {isActive ? <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-red-500" /> : null}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
