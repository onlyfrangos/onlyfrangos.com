"use client";

import Image from "next/image";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Pencil,
  Trash2,
  X
} from "lucide-react";
import { useEffect, useState } from "react";

import type { FeedPost } from "@onlyfrangos/types";
import Link from "next/link";

import { resolveAvatarUrl } from "../../../lib/avatar";
import { apiFetch, getAuthSession } from "../../../lib/auth";
import { PostComments } from "./post-comments";
import { ConfirmModal } from "../../../components/ui/confirm-modal";

type PostCardProps = {
  post: FeedPost;
  onChanged?: () => void;
};

export function PostCard({ post, onChanged }: PostCardProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [likesOpen, setLikesOpen] = useState(false);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [likes, setLikes] = useState<{
    liked: boolean;
    count: number;
    items: Array<{ id: string; username: string; name: string; avatarUrl: string }>;
  }>({ liked: false, count: post.likeCount, items: [] });
  const ownPost = getAuthSession()?.user.id === post.author.id;
  const images = post.imageUrls?.length ? post.imageUrls : [post.imageUrl];
  async function loadLikes() {
    const response = await apiFetch(`/posts/${post.id}/likes`);
    if (response.ok) setLikes(await response.json());
  }
  useEffect(() => {
    void loadLikes();
  }, [post.id]);

  async function togglePostLike() {
    const response = await apiFetch(`/posts/${post.id}/likes`, {
      method: likes.liked ? "DELETE" : "POST"
    });
    if (response.ok)
      setLikes((value) => ({
        ...value,
        liked: !value.liked,
        count: value.count + (value.liked ? -1 : 1)
      }));
  }

  async function removePost() {
    setDeleting(true);
    const response = await apiFetch(`/posts/${post.id}`, { method: "DELETE" });
    if (response.ok) {
      setConfirmingDelete(false);
      onChanged?.();
    }
    setDeleting(false);
  }
  const avatarUrl = resolveAvatarUrl(post.author.avatarUrl, post.author.username);
  const createdAtLabel = new Date(post.createdAt).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  });

  return (
    <article className="overflow-hidden rounded-xl border border-of-border bg-of-surface/90">
      <header className="relative flex items-center justify-between border-b border-of-border px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <Link
            href={`/${post.author.username}`}
            className="relative h-8 w-8 overflow-hidden rounded-full border border-of-border"
          >
            <Image
              src={avatarUrl}
              alt={`Avatar de @${post.author.username}`}
              fill
              className="object-cover"
              sizes="32px"
            />
          </Link>
          <div>
            <Link href={`/${post.author.username}`}>
              <p className="text-sm font-medium text-of-text">@{post.author.username}</p>
            </Link>
            <p className="text-xs text-of-muted">{createdAtLabel}</p>
          </div>
        </div>
        {ownPost ? (
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Abrir opcoes da publicacao"
            className="rounded-md px-2 py-1 text-of-muted hover:bg-white/10 hover:text-of-text"
          >
            ...
          </button>
        ) : null}
        {menuOpen && ownPost ? (
          <div className="absolute right-3 top-12 z-20 w-40 rounded-lg border border-of-border bg-of-surface p-1 shadow-xl">
            <Link
              href={`/posts/${post.id}/edit`}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-white/5"
            >
              <Pencil className="h-4 w-4" />
              Editar
            </Link>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setConfirmingDelete(true);
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </button>
          </div>
        ) : null}
      </header>

      <div className="relative aspect-[4/5] w-full">
        <Image
          src={images[imageIndex] ?? post.imageUrl}
          alt={post.caption}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 70vw, 55vw"
          className="object-cover"
        />
        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => setImageIndex((value) => (value - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 rounded-full bg-black/60 p-2"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setImageIndex((value) => (value + 1) % images.length)}
              className="absolute right-2 top-1/2 rounded-full bg-black/60 p-2"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute right-3 top-3 rounded-full bg-black/65 px-2 py-1 text-xs">
              {imageIndex + 1}/{images.length}
            </span>
          </>
        ) : null}
      </div>

      <div className="space-y-2 px-3 py-3">
        <p className="text-sm text-of-text">
          <span className="font-semibold">@{post.author.username}</span>{" "}
          {captionExpanded || post.caption.length <= 240
            ? post.caption
            : `${post.caption.slice(0, 240).trimEnd()}…`}
        </p>
        {post.caption.length > 240 ? (
          <button
            type="button"
            onClick={() => setCaptionExpanded((value) => !value)}
            className="text-xs font-medium text-of-muted hover:text-of-text"
          >
            {captionExpanded ? "Ver menos" : "Ver mais"}
          </button>
        ) : null}

        <div className="flex items-center justify-between text-of-muted">
          <div className="flex items-center gap-4 text-sm">
            <button
              type="button"
              onClick={() => void togglePostLike()}
              className="inline-flex items-center gap-1.5"
              aria-label={likes.liked ? "Descurtir" : "Curtir"}
            >
              <Heart className={`h-4 w-4 text-red-500 ${likes.liked ? "fill-current" : ""}`} />
            </button>
            <button
              type="button"
              onClick={() => {
                setLikesOpen(true);
                void loadLikes();
              }}
              className="-ml-3 hover:text-of-text"
            >
              {likes.count}
            </button>
            <button
              type="button"
              onClick={() => setCommentsOpen((value) => !value)}
              className="inline-flex items-center gap-1.5"
              aria-label={`${commentCount} comentarios`}
            >
              <MessageCircle className="h-4 w-4" />
              {commentCount}
            </button>
          </div>
          <button
            type="button"
            aria-label="Salvar publicacao"
            className="rounded-md p-1.5 hover:bg-white/10 hover:text-of-text"
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-of-muted">{post.author.name}</p>
      </div>
      {commentsOpen ? (
        <PostComments postId={post.id} canModerate={ownPost} onCountChange={setCommentCount} />
      ) : null}
      {likesOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLikesOpen(false);
          }}
        >
          <div className="max-h-[70vh] w-full max-w-sm overflow-y-auto rounded-2xl border border-of-border bg-of-surface p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Curtido por</h3>
              <button type="button" onClick={() => setLikesOpen(false)} aria-label="Fechar">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {likes.items.length ? (
                likes.items.map((user) => (
                  <Link
                    key={user.id}
                    href={`/${user.username}`}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/5"
                  >
                    <span className="relative h-9 w-9 overflow-hidden rounded-full">
                      <Image
                        src={resolveAvatarUrl(user.avatarUrl, user.username)}
                        alt=""
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </span>
                    <span>
                      <strong className="block text-sm">{user.name}</strong>
                      <span className="text-xs text-of-muted">@{user.username}</span>
                    </span>
                  </Link>
                ))
              ) : (
                <p className="py-5 text-center text-sm text-of-muted">Nenhuma curtida ainda.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
      <ConfirmModal
        open={confirmingDelete}
        title="Excluir publicação?"
        description="A publicação, suas curtidas e seus comentários serão excluídos permanentemente."
        confirmLabel="Excluir publicação"
        loading={deleting}
        onClose={() => setConfirmingDelete(false)}
        onConfirm={() => void removePost()}
      />
    </article>
  );
}
