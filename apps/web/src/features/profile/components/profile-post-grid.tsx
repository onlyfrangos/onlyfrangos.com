import { ChevronDown, Grid2x2, List } from "lucide-react";

import type { ProfilePostItem } from "../types";

import { ProfilePostCard } from "./profile-post-card";

type ProfilePostGridProps = {
  posts: ProfilePostItem[];
  username: string;
  avatarUrl: string;
};

export function ProfilePostGrid({ posts, username, avatarUrl }: ProfilePostGridProps) {
  return (
    <section className="mt-4 rounded-2xl border border-of-border bg-of-surface/85 p-3 sm:p-4">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-of-text">Todas as publicacoes</h2>
        <div className="inline-flex items-center gap-2">
          <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-of-border px-3 py-1.5 text-sm text-of-muted hover:text-of-text">
            Mais recentes
            <ChevronDown className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Visualizacao em grade" className="rounded-lg border border-of-border p-2 text-red-500">
            <Grid2x2 className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Visualizacao em lista" className="rounded-lg border border-of-border p-2 text-of-muted hover:text-of-text">
            <List className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <ProfilePostCard key={post.id} post={post} username={username} avatarUrl={avatarUrl} />
        ))}
      </div>
    </section>
  );
}
