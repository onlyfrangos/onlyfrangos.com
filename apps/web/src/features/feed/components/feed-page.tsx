import type { FeedPost } from "@onlyfrangos/types";

import { AppShell } from "../../../components/layout/app-shell";
import { mockFeedPosts, mockSuggestions } from "../../../lib/mock-data";
import { sdk } from "../../../lib/sdk";
import { ProfileSidebar } from "../../profile/components/profile-sidebar";
import { ProfileTopBar } from "../../profile/components/profile-top-bar";

import { FeedRightAside } from "./feed-right-aside";

import { PostCard } from "./post-card";

async function loadFeed(): Promise<FeedPost[]> {
  try {
    const result = await sdk.getFeed(20);
    return result.items;
  } catch {
    return mockFeedPosts.map((post) => ({
      id: post.id,
      caption: post.caption,
      imageUrl: post.imageUrl,
      createdAt: new Date().toISOString(),
      likeCount: post.likes,
      commentCount: post.comments,
      author: {
        id: post.username,
        username: post.username,
        name: post.name,
        avatarUrl: post.avatarUrl
      }
    }));
  }
}

export async function FeedPage() {
  const posts = await loadFeed();
  const viewerUsername = posts[0]?.author.username ?? "extrastickersbr";

  return (
    <AppShell
      leftAside={<ProfileSidebar username={viewerUsername} />}
      rightAsideClassName="border-none bg-transparent p-0"
      rightAside={<FeedRightAside suggestions={mockSuggestions} />}
      mobileNavItems={[
        { href: "/feed", label: "Inicio" },
        { href: `/${viewerUsername}`, label: "Perfil" },
        { href: "#", label: "Explorar" },
        { href: "#", label: "Alertas" }
      ]}
    >
      <ProfileTopBar />

      <header className="mb-4 rounded-2xl border border-of-border bg-of-surface/85 px-4 py-4 sm:px-5">
        <h1 className="text-2xl font-semibold text-of-text sm:text-3xl">Feed</h1>
        <p className="mt-1 text-sm text-of-muted">Cronologico, sem algoritmo oculto.</p>
      </header>

      <section className="space-y-4">
        {posts.length === 0 ? (
          <article className="rounded-2xl border border-of-border bg-of-surface/90 p-8 text-center text-of-muted">
            Nenhum post por enquanto. Volte em alguns minutos.
          </article>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </section>
    </AppShell>
  );
}
