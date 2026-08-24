import Image from "next/image";
import { Bookmark, Heart, MessageCircle } from "lucide-react";

import type { FeedPost } from "@onlyfrangos/types";
import Link from "next/link";

import { resolveAvatarUrl } from "../../../lib/avatar";

type PostCardProps = {
  post: FeedPost;
};

export function PostCard({ post }: PostCardProps) {
  const avatarUrl = resolveAvatarUrl(post.author.avatarUrl, post.author.username);
  const createdAtLabel = new Date(post.createdAt).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  });

  return (
    <article className="overflow-hidden rounded-xl border border-of-border bg-of-surface/90">
      <header className="flex items-center justify-between border-b border-of-border px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <Link
            href={`/${post.author.username}`}
            className="relative h-8 w-8 overflow-hidden rounded-full border border-of-border"
          >
            <Image src={avatarUrl} alt={`Avatar de @${post.author.username}`} fill className="object-cover" sizes="32px" />
          </Link>
          <div>
            <Link
              href={`/${post.author.username}`}
            >
              <p className="text-sm font-medium text-of-text">@{post.author.username}</p>
            </Link>
            <p className="text-xs text-of-muted">{createdAtLabel}</p>
          </div>
        </div>
        <button type="button" aria-label="Abrir opcoes da publicacao" className="rounded-md px-2 py-1 text-of-muted hover:bg-white/10 hover:text-of-text">
          ...
        </button>
      </header>

      <div className="relative aspect-[4/5] w-full">
        <Image src={post.imageUrl} alt={post.caption} fill sizes="(max-width: 640px) 100vw, (max-width: 1200px) 70vw, 55vw" className="object-cover" />
      </div>

      <div className="space-y-2 px-3 py-3">
        <p className="text-sm text-of-text">
          <span className="font-semibold">@{post.author.username}</span> {post.caption}
        </p>

        <div className="flex items-center justify-between text-of-muted">
          <div className="flex items-center gap-4 text-sm">
            <p className="inline-flex items-center gap-1.5" aria-label={`${post.likeCount} curtidas`}>
              <Heart className="h-4 w-4 text-red-500" />
              {post.likeCount}
            </p>
            <p className="inline-flex items-center gap-1.5" aria-label={`${post.commentCount} comentarios`}>
              <MessageCircle className="h-4 w-4" />
              {post.commentCount}
            </p>
          </div>
          <button type="button" aria-label="Salvar publicacao" className="rounded-md p-1.5 hover:bg-white/10 hover:text-of-text">
            <Bookmark className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-of-muted">{post.author.name}</p>
      </div>
    </article>
  );
}
