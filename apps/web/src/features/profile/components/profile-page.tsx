import { AppShell } from "../../../components/layout/app-shell";
import { mockProfile } from "../../../lib/mock-data";

type ProfilePageProps = {
  username: string;
};

export function ProfilePage({ username }: ProfilePageProps) {
  const profile = { ...mockProfile, username };

  return (
    <AppShell>
      <section className="rounded-2xl border border-of-border bg-of-surface/85 p-4 sm:p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <img
            src="https://images.unsplash.com/photo-1517963628607-235ccdd5476d?q=80&w=400"
            alt={profile.username}
            className="h-24 w-24 rounded-full border border-of-border object-cover sm:h-32 sm:w-32"
          />

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
