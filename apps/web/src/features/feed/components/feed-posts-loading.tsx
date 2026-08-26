type FeedPostsLoadingProps = {
  postCount?: number;
};

export function FeedPostsLoading({ postCount = 2 }: FeedPostsLoadingProps) {
  return (
    <section
      className="space-y-4"
      aria-label="Carregando publicações"
      aria-busy="true"
      role="status"
    >
      {Array.from({ length: postCount }, (_, index) => (
        <article
          key={index}
          className="overflow-hidden rounded-xl border border-of-border bg-of-surface/90"
        >
          <header className="flex animate-pulse items-center gap-2.5 border-b border-of-border px-3 py-2.5">
            <span className="h-8 w-8 rounded-full bg-white/10" />
            <span className="space-y-2">
              <span className="block h-3 w-28 rounded bg-white/10" />
              <span className="block h-2.5 w-20 rounded bg-white/10" />
            </span>
          </header>
          <div className="aspect-[4/5] w-full animate-pulse bg-white/[0.07]" />
          <div className="animate-pulse space-y-3 px-3 py-4">
            <span className="block h-3 w-full rounded bg-white/10" />
            <span className="block h-3 w-3/4 rounded bg-white/10" />
            <div className="flex gap-4 pt-1">
              <span className="h-4 w-12 rounded bg-white/10" />
              <span className="h-4 w-12 rounded bg-white/10" />
            </div>
          </div>
        </article>
      ))}
      <span className="sr-only">Aguarde enquanto as publicações são carregadas.</span>
    </section>
  );
}

export function FeedComposerLoading() {
  return (
    <div
      className="mb-4 animate-pulse rounded-xl border border-of-border bg-of-surface/90 p-4"
      aria-hidden="true"
    >
      <div className="h-20 rounded-xl bg-white/[0.07]" />
      <div className="mt-3 flex items-center justify-between">
        <span className="h-9 w-28 rounded-lg bg-white/10" />
        <span className="h-9 w-24 rounded-lg bg-white/10" />
      </div>
    </div>
  );
}
