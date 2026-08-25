"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, ChevronLeft, ChevronRight, Heart, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/auth";
import { PostComments } from "../../feed/components/post-comments";
import type { ProfilePostItem } from "../types";

type LikesState = { liked: boolean; count: number };

export function ProfilePostModal({
  post,
  username,
  avatarUrl,
  canManage,
  onCommentCountChange,
  onClose
}: {
  post: ProfilePostItem;
  username: string;
  avatarUrl: string;
  canManage: boolean;
  onCommentCountChange: (count: number) => void;
  onClose: () => void;
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const [likes, setLikes] = useState<LikesState>({ liked: false, count: post.likeCount });
  const images = post.imageUrls?.length ? post.imageUrls : [post.imageUrl];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    void apiFetch(`/posts/${post.id}/likes`).then(async (response) => {
      if (response.ok) setLikes((await response.json()) as LikesState);
    });
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose, post.id]);

  async function toggleLike() {
    const response = await apiFetch(`/posts/${post.id}/likes`, {
      method: likes.liked ? "DELETE" : "POST"
    });
    if (response.ok)
      setLikes((value) => ({ liked: !value.liked, count: value.count + (value.liked ? -1 : 1) }));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-0 backdrop-blur-sm sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={`Publicação de @${username}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar publicação"
        className="absolute right-3 top-3 z-20 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
      >
        <X className="h-6 w-6" />
      </button>
      <article className="grid h-full w-full max-w-6xl overflow-hidden bg-of-surface shadow-2xl sm:h-[min(88vh,760px)] sm:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)] sm:rounded-xl sm:border sm:border-of-border">
        <div className="relative min-h-[42vh] bg-black sm:min-h-0">
          <Image
            src={images[imageIndex] ?? post.imageUrl}
            alt={post.caption}
            fill
            sizes="(max-width: 640px) 100vw, 65vw"
            className="object-contain"
            priority
          />
          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() =>
                  setImageIndex((value) => (value - 1 + images.length) % images.length)
                }
                aria-label="Imagem anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setImageIndex((value) => (value + 1) % images.length)}
                aria-label="Próxima imagem"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/65 px-2 py-1 text-xs text-white">
                {imageIndex + 1}/{images.length}
              </span>
            </>
          ) : null}
        </div>
        <div className="flex min-h-0 flex-col border-l border-of-border bg-of-surface">
          <header className="flex items-center gap-3 border-b border-of-border p-4">
            <Link
              href={`/${username}`}
              className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-of-border"
            >
              <Image src={avatarUrl} alt="" fill sizes="36px" className="object-cover" />
            </Link>
            <Link href={`/${username}`} className="text-sm font-semibold">
              @{username}
            </Link>
            <p>
              {/* {post.caption} */}
            </p>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="flex gap-3 p-4 text-sm">
              <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                <Image src={avatarUrl} alt="" fill sizes="32px" className="object-cover" />
              </span>
              <p>
                <strong>@{username}</strong> {post.caption}
              </p>
            </div>
            <PostComments
              postId={post.id}
              canModerate={canManage}
              onCountChange={onCommentCountChange}
            />
          </div>
          <footer className="border-t border-of-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => void toggleLike()}
                  aria-label={likes.liked ? "Descurtir" : "Curtir"}
                >
                  <Heart className={`h-6 w-6 ${likes.liked ? "fill-red-500 text-red-500" : ""}`} />
                </button>
                <span className="inline-flex items-center gap-1.5">
                  <MessageCircle className="h-6 w-6" />
                  {post.commentCount}
                </span>
              </div>
              <button type="button" aria-label="Salvar publicação">
                <Bookmark className="h-6 w-6" />
              </button>
            </div>
            <p className="mt-3 text-sm font-semibold">
              {likes.count} {likes.count === 1 ? "curtida" : "curtidas"}
            </p>
            <p className="mt-1 text-xs uppercase text-of-muted">{post.createdAtLabel}</p>
          </footer>
        </div>
      </article>
    </div>
  );
}
