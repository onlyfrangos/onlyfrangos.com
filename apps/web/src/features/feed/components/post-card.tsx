import type { FeedPost } from "../../../lib/mock-data";

type PostCardProps = {
  post: FeedPost;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-of-border bg-of-surface shadow-card">
      <div className="flex items-center gap-3 border-b border-of-border px-4 py-3">
        <img src={post.avatarUrl} alt={post.username} className="h-10 w-10 rounded-full object-cover" />
        <div>
          <p className="text-sm font-semibold">@{post.username}</p>
          <p className="text-xs text-of-muted">{post.name}</p>
        </div>
      </div>

      <img src={post.imageUrl} alt={post.caption} className="h-[320px] w-full object-cover sm:h-[460px]" />

      <div className="space-y-3 px-4 py-4">
        <div className="flex items-center gap-5 text-sm">
          <button className="rounded-lg bg-of-primary px-3 py-1.5 font-medium transition hover:bg-of-primaryHover">
            Curtir
          </button>
          <button className="text-of-muted transition hover:text-of-text">Comentar</button>
          <button className="text-of-muted transition hover:text-of-text">Compartilhar</button>
        </div>

        <p className="text-sm">
          <span className="font-semibold">@{post.username}</span> {post.caption}
        </p>

        <p className="text-xs text-of-muted">
          {post.likes} curtidas · {post.comments} comentarios · {post.createdAtLabel}
        </p>
      </div>
    </article>
  );
}
