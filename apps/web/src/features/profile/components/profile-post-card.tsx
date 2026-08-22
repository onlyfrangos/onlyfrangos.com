import Image from "next/image";
import { Bookmark, Heart, MessageCircle } from "lucide-react";

import type { ProfilePostItem } from "../types";

type ProfilePostCardProps = {
  post: ProfilePostItem;
  username: string;
  avatarUrl: string;
};

export function ProfilePostCard({ post, username, avatarUrl }: ProfilePostCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-of-border bg-of-surface/90">
      <header className="flex items-center justify-between border-b border-of-border px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-of-border">
            <Image src={avatarUrl} alt={`Avatar de @${username}`} fill className="object-cover" sizes="32px" />
          </div>
          <div>
            <p className="text-sm font-medium text-of-text">@{username}</p>
            <p className="text-xs text-of-muted">{post.createdAtLabel}</p>
          </div>
        </div>
        <button type="button" aria-label="Abrir opcoes da publicacao" className="rounded-md px-2 py-1 text-of-muted hover:bg-white/10 hover:text-of-text">
          ...
        </button>
      </header>

      <div className="relative aspect-[4/5] w-full">
        <Image src={post.imageUrl} alt={post.caption} fill sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
      </div>

      <div className="space-y-2 px-3 py-3">
        <p className="text-sm text-of-text">{post.caption}</p>
        {post.hashtags.length > 0 ? <p className="text-xs text-of-muted">#{post.hashtags.join(" #")}</p> : null}

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
      </div>
    </article>
  );
}
