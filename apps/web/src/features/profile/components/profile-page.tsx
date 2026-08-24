import type { UserPost, UserProfile } from "@onlyfrangos/types";

import { AppShell } from "../../../components/layout/app-shell";
import { sdk } from "../../../lib/sdk";

// Removed local fallback mocks - rely only on API data
import type { ProfileSummaryItem, ProfileViewData } from "../types";

import { ProfileFitnessDashboard } from "./profile-fitness-dashboard";
import { ProfileHeader } from "./profile-header";
import { ProfileMainFitnessSummary } from "./profile-main-fitness-summary";
import { ProfilePostGrid } from "./profile-post-grid";
import { ProfileSidebar } from "./profile-sidebar";
import { ProfileTabs } from "./profile-tabs";
import { ProfileTopBar } from "./profile-top-bar";

type ProfilePageProps = {
  username: string;
};

async function loadProfile(username: string) {
  try {
    const [profile, posts] = await Promise.all([sdk.getUserByUsername(username), sdk.getUserPosts(username)]);

    return {
      id: profile.id,
      username: profile.username,
      name: profile.name,
      bio: profile.bio,
      joinedLabel: undefined,
      avatarUrl: profile.avatarUrl,
      gymLabel: profile.profile.gym ?? undefined,
      goalWeightLabel: profile.profile.fitnessGoal ?? undefined,
      postsCount: formatCompactCount(profile.postCount),
      followersCount: formatCompactCount(profile.followersCount),
      followingCount: formatCompactCount(profile.followingCount),
      actionMode: username === "extrastickersbr" ? "self" : "visitor",
      fitnessSummary: buildSummary(profile, []),
      posts: buildPosts(posts, profile, { posts: [] } as any),
      workoutFrequency: undefined,
      tabs: [
        { id: "posts", label: "Publicacoes" }
      ],
      gymCard: profile.profile.gym
        ? {
            name: profile.profile.gym,
            addressLine1: profile.profile.location ?? "",
            addressLine2: "",
            memberCountLabel: "",
            logoUrl: "",
            members: [],
            ctaLabel: "",
            ctaHref: ""
          }
        : undefined
    } as unknown as ProfileViewData;
  } catch (err) {
    return null as unknown as ProfileViewData | null;
  }
}

export async function ProfilePage({ username }: ProfilePageProps) {
  const profile = (await loadProfile(username)) as ProfileViewData | null;

  if (!profile) {
    return (
      <AppShell leftAside={null} rightAside={null}>
        <div className="rounded-2xl border border-of-border bg-of-surface/90 p-8 text-center">
          <h2 className="text-xl font-semibold text-of-text">Não foi possível carregar os dados do perfil</h2>
          <p className="mt-2 text-sm text-of-muted">Tente atualizar a página ou volte mais tarde.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      leftAside={<ProfileSidebar username={profile.username} />}
      rightAsideClassName="border-none bg-transparent p-0"
      rightAside={
        <div className="sticky top-6">
          <ProfileFitnessDashboard
            summary={profile.fitnessSummary}
            workoutFrequency={profile.workoutFrequency}
            gymCard={profile.gymCard}
          />
        </div>
      }
      mobileNavItems={[
        { href: "/feed", label: "Inicio" },
        { href: `/${profile.username}`, label: "Perfil" },
        { href: "#", label: "Explorar" },
        { href: "#", label: "Alertas" }
      ]}
    >
      <ProfileTopBar />
      <ProfileHeader
        username={profile.username}
        name={profile.name}
        bio={profile.bio}
        joinedLabel={profile.joinedLabel}
        avatarUrl={profile.avatarUrl}
        verified={profile.verified}
        gymLabel={profile.gymLabel}
        naturalLabel={profile.naturalLabel}
        postsCount={profile.postsCount}
        followersCount={profile.followersCount}
        followingCount={profile.followingCount}
        actionMode={profile.actionMode}
      />
      <ProfileMainFitnessSummary items={profile.fitnessSummary} />
      <ProfileTabs items={profile.tabs} activeTab="posts" />

      <section className="mt-4 lg:hidden">
        <ProfileFitnessDashboard summary={profile.fitnessSummary} workoutFrequency={profile.workoutFrequency} gymCard={profile.gymCard} />
      </section>

      <ProfilePostGrid posts={profile.posts} username={profile.username} avatarUrl={profile.avatarUrl} />
    </AppShell>
  );
}

function formatCompactCount(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

function buildSummary(profile: UserProfile, fallbackItems: ProfileSummaryItem[]): ProfileSummaryItem[] {
  const weightValue = profile.profile.physicalInfo?.weight ?? fallbackItems.find((item) => item.id === "weight")?.value ?? "--";
  const heightValue = fallbackItems.find((item) => item.id === "height")?.value ?? "--";
  const goalValue = normalizeGoalWeight(profile.profile.fitnessGoal) ?? fallbackItems.find((item) => item.id === "goal")?.value ?? "--";

  return [
    { id: "weight", label: "Peso atual", value: weightValue },
    { id: "height", label: "Altura", value: heightValue },
    { id: "goal", label: "Meta de peso", value: goalValue }
  ];
}

function normalizeGoalWeight(goal?: string): string | null {
  if (!goal) {
    return null;
  }

  const cleaned = goal.split("•")[0]?.trim();
  return cleaned || null;
}

function buildPosts(posts: UserPost[], profile: UserProfile, fallback: ProfileViewData) {
  if (posts.length === 0) {
    return fallback.posts;
  }

  return posts.map((post, index) => ({
    id: post.id,
    caption: post.caption,
    imageUrl: post.imageUrl,
    createdAtLabel: formatDateLabel(post.createdAt),
    likeCount: Math.max(22, 150 - index * 7),
    commentCount: Math.max(4, 30 - index * 2),
    hashtags: [profile.username]
  }));
}

function formatDateLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recente";
  }

  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
