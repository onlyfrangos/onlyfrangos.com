import type { UserPost, UserProfile } from "@onlyfrangos/types";

import { AppShell } from "../../../components/layout/app-shell";
import { sdk } from "../../../lib/sdk";

import { createProfilePageMock } from "../mocks/profile-page-mock";
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
  const fallback = createProfilePageMock(username);

  try {
    const [profile, posts] = await Promise.all([sdk.getUserByUsername(username), sdk.getUserPosts(username)]);

    return {
      ...fallback,
      id: profile.id,
      username: profile.username,
      name: profile.name,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      postsCount: formatCompactCount(profile.postCount),
      followersCount: formatCompactCount(profile.followersCount),
      followingCount: formatCompactCount(profile.followingCount),
      goalWeightLabel: profile.profile.fitnessGoal ?? fallback.goalWeightLabel,
      gymLabel: profile.profile.gym ?? fallback.gymLabel,
      naturalLabel: fallback.naturalLabel,
      actionMode: username === "extrastickersbr" ? "self" : "visitor",
      fitnessSummary: buildSummary(profile, fallback.fitnessSummary),
      posts: buildPosts(posts, profile, fallback),
      gymCard: fallback.gymCard
        ? {
            ...fallback.gymCard,
            name: profile.profile.gym ?? fallback.gymCard.name,
            addressLine1: profile.profile.location ?? fallback.gymCard.addressLine1,
            ctaHref: profile.profile.locationUrl ?? fallback.gymCard.ctaHref
          }
        : undefined
    };
  } catch {
    return fallback;
  }
}

export async function ProfilePage({ username }: ProfilePageProps) {
  const profile = (await loadProfile(username)) as ProfileViewData;

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
