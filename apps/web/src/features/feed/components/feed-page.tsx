import Link from "next/link";

import { AppShell } from "../../../components/layout/app-shell";
import { mockFeedPosts, mockSuggestions } from "../../../lib/mock-data";

import { PostCard } from "./post-card";

export function FeedPage() {
  return (
    <AppShell
      rightAside={
        <div className="space-y-4">
          <h2 className="font-[var(--font-heading)] text-3xl leading-none tracking-wide">Sugestoes</h2>
          <ul className="space-y-3">
            {mockSuggestions.map((username) => (
              <li key={username} className="flex items-center justify-between text-sm">
                <Link href={`/${username}`} className="text-of-muted hover:text-of-text">
                  @{username}
                </Link>
                <button className="rounded-lg border border-of-border px-2 py-1 text-xs hover:bg-black/20">Seguir</button>
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <header className="mb-4 rounded-2xl border border-of-border bg-of-surface/85 px-4 py-4">
        <h1 className="font-[var(--font-heading)] text-5xl leading-none tracking-wide">Feed</h1>
        <p className="mt-2 text-sm text-of-muted">Cronologico, sem algoritmo oculto.</p>
      </header>

      <section className="space-y-4">
        {mockFeedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </AppShell>
  );
}
