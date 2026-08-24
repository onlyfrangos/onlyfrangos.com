import type { FeedPost, UserSuggestion } from "@onlyfrangos/types";

import { AppShell } from "../../../components/layout/app-shell";
import { sdk } from "../../../lib/sdk";
import { ProfileMobileNavigation, ProfileSidebar } from "../../profile/components/profile-sidebar";
import { ProfileTopBar } from "../../profile/components/profile-top-bar";

import { FeedRightAside } from "./feed-right-aside";

import { PostCard } from "./post-card";

async function loadFeed(): Promise<FeedPost[] | null> {
  try {
    const result = await sdk.getFeed(20);
    return result.items;
  } catch (err) {
    return null;
  }
}

async function loadSuggestions(): Promise<UserSuggestion[]> {
  try {
    return await sdk.getUserSuggestions(5);
  } catch {
    return [];
  }
}

export async function FeedPage() {
  const [posts, suggestions] = await Promise.all([loadFeed(), loadSuggestions()]);
  if (!posts) {
    return (
      <AppShell leftAside={null} rightAside={null}>
        <article className="rounded-2xl border border-of-border bg-of-surface/90 p-8 text-center text-of-muted">
          Não foi possível carregar o feed. Tente atualizar a página.
        </article>
      </AppShell>
    );
  }

  const viewerUsername = posts[0]?.author.username ?? "extrastickersbr";

  return (
    <AppShell
      leftAside={<ProfileSidebar username={viewerUsername} />}
      rightAsideClassName="border-none bg-transparent p-0"
      rightAside={<FeedRightAside suggestions={suggestions} />}
      mobileNavigation={<ProfileMobileNavigation username={viewerUsername} />}
      mobileNavItems={[
        { href: "/feed", label: "Inicio" },
        { href: `/${viewerUsername}`, label: "Perfil" },
        { href: "#", label: "Explorar" },
        { href: "#", label: "Alertas" }
      ]}
    >
      <ProfileTopBar />

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
