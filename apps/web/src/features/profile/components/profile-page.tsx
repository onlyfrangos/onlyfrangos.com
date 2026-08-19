import { AppShell } from "../../../components/layout/app-shell";
import { mockProfile } from "../../../lib/mock-data";
import { sdk } from "../../../lib/sdk";

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
      avatarUrl: profile.avatarUrl,
      postsCount: profile.postCount,
      followersCount: profile.followersCount,
      followingCount: profile.followingCount,
      goal: profile.profile.fitnessGoal ?? "Sem meta publica",
      gym: profile.profile.gym ?? "Privado",
      location: profile.profile.location ?? "Privado",
      locationUrl: profile.profile.locationUrl ?? "https://maps.google.com",
      publicStats: {
        weight: profile.profile.physicalInfo?.weight ?? "Privado",
        bodyFat: profile.profile.physicalInfo?.bodyFat ?? "Privado",
        arm: profile.profile.physicalInfo?.arm ?? "Privado"
      },
      posts
    };
  } catch {
    return { ...mockProfile, username };
  }
}

export async function ProfilePage({ username }: ProfilePageProps) {
  const profile = await loadProfile(username);

  return (
    <AppShell>
      <section className="rounded-2xl border border-of-border bg-of-surface/85 p-4 sm:p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <img src={profile.avatarUrl} alt={profile.username} className="h-24 w-24 rounded-full border border-of-border object-cover sm:h-32 sm:w-32" />

          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-[var(--font-heading)] text-5xl leading-none tracking-wide">@{profile.username}</h1>
              <button className="rounded-lg bg-of-primary px-3 py-2 text-sm font-semibold hover:bg-of-primaryHover">
                Seguir
              </button>
            </div>

            <div>
              <p className="text-lg font-semibold">{profile.name}</p>
              <p className="text-sm text-of-muted">{profile.bio}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <p>
                <span className="font-semibold">{profile.postsCount}</span> posts
              </p>
              <p>
                <span className="font-semibold">{profile.followersCount}</span> seguidores
              </p>
              <p>
                <span className="font-semibold">{profile.followingCount}</span> seguindo
              </p>
            </div>

            <div className="rounded-xl border border-of-border bg-black/20 p-3 text-sm">
              <p className="font-semibold">{profile.goal}</p>
              <p className="mt-1 text-of-muted">Academia: {profile.gym}</p>
              <p className="text-of-muted">Local: {profile.location}</p>
              <a href={profile.locationUrl} target="_blank" className="text-of-primary hover:text-of-primaryHover">
                Ver localizacao
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-of-border bg-of-surface/80 p-4">
        <h2 className="mb-3 font-[var(--font-heading)] text-3xl leading-none tracking-wide">Evolucao publica</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-of-border bg-black/20 p-3 text-sm">
            <p className="text-of-muted">Peso</p>
            <p className="text-lg font-semibold">{profile.publicStats.weight}</p>
          </div>
          <div className="rounded-xl border border-of-border bg-black/20 p-3 text-sm">
            <p className="text-of-muted">Gordura corporal</p>
            <p className="text-lg font-semibold">{profile.publicStats.bodyFat}</p>
          </div>
          <div className="rounded-xl border border-of-border bg-black/20 p-3 text-sm">
            <p className="text-of-muted">Braco</p>
            <p className="text-lg font-semibold">{profile.publicStats.arm}</p>
          </div>
        </div>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {profile.posts.map((post) => (
          <article key={post.id} className="overflow-hidden rounded-xl border border-of-border bg-of-surface/80">
            <img src={post.imageUrl} alt={post.caption} className="h-36 w-full object-cover sm:h-48" />
          </article>
        ))}
      </section>
    </AppShell>
  );
}
