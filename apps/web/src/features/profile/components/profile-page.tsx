import type { UserPost, UserProfile } from "@onlyfrangos/types";

import { AppShell } from "../../../components/layout/app-shell";
import { resolveAvatarUrl } from "../../../lib/avatar";
import { sdk } from "../../../lib/sdk";

import type { ProfileViewData } from "../types";

import { ProfileFitnessDashboard } from "./profile-fitness-dashboard";
import { ProfileHeader } from "./profile-header";
import { ProfilePostGrid } from "./profile-post-grid";
import { ProfileMobileNavigation, ProfileSidebar } from "./profile-sidebar";
import { ProfileTabs } from "./profile-tabs";
import { ProfileTopBar } from "./profile-top-bar";

type ProfilePageProps = {
  username: string;
};

async function loadProfile(username: string): Promise<ProfileViewData | null> {
  try {
    const [profile, posts] = await Promise.all([
      sdk.getUserByUsername(username),
      sdk.getUserPosts(username)
    ]);

    return {
      id: profile.id,
      username: profile.username,
      name: profile.name,
      bio: profile.bio,
      joinedLabel: formatJoinedLabel(profile.createdAt),
      avatarUrl: resolveAvatarUrl(profile.avatarUrl, profile.username),
      gymLabel: profile.profile.gym ?? undefined,
      gymHref: profile.profile.gymId ? `/gyms/${profile.profile.gymId}` : undefined,
      cityLabel: profile.profile.city ?? undefined,
      goalWeightLabel: profile.profile.fitnessGoal ?? undefined,
      postsCount: formatCompactCount(profile.postCount),
      followersCount: formatCompactCount(profile.followersCount),
      followingCount: formatCompactCount(profile.followingCount),
      actionMode: "visitor",
      posts: buildPosts(posts, profile),
      tabs: [{ id: "posts", label: "Publicacoes" }],
      physicalSummary: [
        profile.profile.fitnessGoal
          ? { id: "goal", label: "Objetivo", value: profile.profile.fitnessGoal }
          : null,
        profile.profile.physicalInfo?.weight
          ? { id: "weight", label: "Peso", value: profile.profile.physicalInfo.weight }
          : null,
        profile.profile.physicalInfo?.bodyFat
          ? {
              id: "bodyFat",
              label: "Gordura corporal",
              value: profile.profile.physicalInfo.bodyFat
            }
          : null,
        profile.profile.physicalInfo?.arm
          ? { id: "arm", label: "Braço", value: profile.profile.physicalInfo.arm }
          : null
      ].filter((item): item is { id: string; label: string; value: string } => Boolean(item)),
      gymCard: profile.profile.gym
        ? {
            name: profile.profile.gym,
            addressLine1: profile.profile.city ?? "",
            addressLine2: "",
            memberCountLabel: "",
            logoUrl: profile.profile.gymImageUrl ?? "",
            members: [],
            ctaLabel: "Ver academia",
            ctaHref: profile.profile.gymId ? `/gyms/${profile.profile.gymId}` : undefined
          }
        : undefined
    };
  } catch {
    return null;
  }
}

export async function ProfilePage({ username }: ProfilePageProps) {
  const profile = await loadProfile(username);

  if (!profile) {
    return (
      <AppShell leftAside={null} rightAside={null}>
        <div className="rounded-2xl border border-of-border bg-of-surface/90 p-8 text-center">
          <h2 className="text-xl font-semibold text-of-text">
            Não foi possível carregar os dados do perfil
          </h2>
          <p className="mt-2 text-sm text-of-muted">
            Tente atualizar a página ou volte mais tarde.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      leftAside={<ProfileSidebar username={profile.username} />}
      rightAsideClassName="border-none bg-transparent p-0"
      mobileNavigation={<ProfileMobileNavigation username={profile.username} />}
      rightAside={
        <div className="sticky top-6">
          <ProfileFitnessDashboard
            workoutFrequency={profile.workoutFrequency}
            gymCard={profile.gymCard}
            summaryItems={profile.physicalSummary}
          />
        </div>
      }
      mobileNavItems={[
        { href: "/feed", label: "Inicio" },
        { href: "/profile", label: "Perfil" },
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
        gymHref={profile.gymHref}
        cityLabel={profile.cityLabel}
        naturalLabel={profile.naturalLabel}
        postsCount={profile.postsCount}
        followersCount={profile.followersCount}
        followingCount={profile.followingCount}
        actionMode={profile.actionMode}
      />
      <ProfileTabs items={profile.tabs} activeTab="posts" />

      <section className="mt-4 lg:hidden">
        <ProfileFitnessDashboard
          workoutFrequency={profile.workoutFrequency}
          gymCard={profile.gymCard}
          summaryItems={profile.physicalSummary}
        />
      </section>

      <ProfilePostGrid
        posts={profile.posts}
        username={profile.username}
        avatarUrl={profile.avatarUrl}
      />
    </AppShell>
  );
}

function formatCompactCount(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

function buildPosts(posts: UserPost[], profile: UserProfile) {
  return posts.map((post) => ({
    id: post.id,
    caption: post.caption,
    imageUrl: post.imageUrl,
    createdAtLabel: formatDateLabel(post.createdAt),
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    hashtags: [profile.username]
  }));
}

function formatJoinedLabel(value: string): string | undefined {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  const joinedAt = date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return `Entrou em ${joinedAt}`;
}

function formatDateLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recente";
  }

  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
