type ProfileStatsProps = {
  postsCount: string;
  followersCount: string;
  followingCount: string;
};

export function ProfileStats({ postsCount, followersCount, followingCount }: ProfileStatsProps) {
  return (
    <section className="mt-4 grid grid-cols-3 rounded-2xl border border-of-border bg-of-surface/85 px-3 py-4 text-center sm:px-5">
      <StatItem value={postsCount} label="publicações" />
      <StatItem value={followersCount} label="seguidores" />
      <StatItem value={followingCount} label="seguindo" />
    </section>
  );
}

type StatItemProps = {
  value: string;
  label: string;
};

function StatItem({ value, label }: StatItemProps) {
  return (
    <div>
      <p className="text-xl font-semibold text-of-text sm:text-2xl">{value}</p>
      <p className="text-xs text-of-muted sm:text-sm">{label}</p>
    </div>
  );
}
