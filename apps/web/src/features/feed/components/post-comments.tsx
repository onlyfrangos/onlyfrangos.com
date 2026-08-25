'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Reply, Send, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { apiFetch, getAuthSession } from '../../../lib/auth';
import { resolveAvatarUrl } from '../../../lib/avatar';
import { ConfirmModal } from '../../../components/ui/confirm-modal';

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  liked: boolean;
  likeCount: number;
  author: { id: string; username: string; name: string; avatarUrl: string };
  replies: Comment[];
};

export function PostComments({
  postId,
  canModerate = false,
  onCountChange,
}: {
  postId: string;
  canModerate?: boolean;
  onCountChange?: (count: number) => void;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const response = await apiFetch(`/posts/${postId}/comments`);
    if (response.ok) {
      const nextComments = (await response.json()) as Comment[];
      setComments(nextComments);
      onCountChange?.(countComments(nextComments));
    }
    setLoading(false);
  }
  useEffect(() => {
    void load();
  }, [postId]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!content.trim()) return;
    const response = await apiFetch(`/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ content, parentId: replyTo?.id ?? null }),
    });
    if (response.ok) {
      setContent('');
      setReplyTo(null);
      await load();
    }
  }

  return (
    <section className="border-t border-of-border px-3 py-3">
      <h3 className="text-sm font-semibold">Comentários</h3>
      {loading ? (
        <p className="mt-3 text-xs text-of-muted">Carregando...</p>
      ) : (
        <div className="mt-3 space-y-4">
          {comments.length ? (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
                onReply={setReplyTo}
                onChanged={load}
                canModerate={canModerate}
              />
            ))
          ) : (
            <p className="text-sm text-of-muted">Seja o primeiro a comentar.</p>
          )}
        </div>
      )}
      <form onSubmit={submit} className="mt-4">
        {replyTo ? (
          <div className="mb-2 flex justify-between text-xs text-of-muted">
            <span>Respondendo a @{replyTo.author.username}</span>
            <button type="button" onClick={() => setReplyTo(null)}>
              Cancelar
            </button>
          </div>
        ) : null}
        <div className="flex gap-2">
          <input
            value={content}
            onChange={(event) => setContent(event.target.value)}
            maxLength={1000}
            placeholder="Escreva um comentário..."
            className="min-w-0 flex-1 rounded-lg border border-of-border bg-black/20 px-3 py-2 text-sm outline-none focus:border-of-primary"
          />
          <button
            className="rounded-lg bg-of-primary p-2 text-white"
            aria-label="Enviar comentário"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-right text-[11px] text-of-muted">{content.length}/1000</p>
      </form>
    </section>
  );
}

function countComments(comments: Comment[]): number {
  return comments.reduce((total, comment) => total + 1 + countComments(comment.replies ?? []), 0);
}

function CommentItem({
  comment,
  postId,
  onReply,
  onChanged,
  canModerate,
}: {
  comment: Comment;
  postId: string;
  onReply: (comment: Comment) => void;
  onChanged: () => Promise<void>;
  canModerate: boolean;
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const ownComment = getAuthSession()?.user.id === comment.author.id;

  async function toggleLike() {
    await apiFetch(`/posts/${postId}/comments/${comment.id}/likes`, {
      method: comment.liked ? 'DELETE' : 'POST',
    });
    await onChanged();
  }

  async function remove() {
    setDeleting(true);
    const response = await apiFetch(`/posts/${postId}/comments/${comment.id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setConfirmingDelete(false);
      await onChanged();
    }
    setDeleting(false);
  }

  return (
    <div>
      <div className="flex gap-2.5">
        <Link
          href={`/${comment.author.username}`}
          className="relative mt-0.5 h-7 w-7 shrink-0 overflow-hidden rounded-full"
        >
          <Image
            src={resolveAvatarUrl(comment.author.avatarUrl, comment.author.username)}
            alt=""
            fill
            sizes="28px"
            className="object-cover"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-sm">
            <Link href={`/${comment.author.username}`} className="font-semibold">
              @{comment.author.username}
            </Link>{' '}
            {comment.content}
          </p>
          <div className="mt-1 flex gap-3 text-xs text-of-muted">
            <button
              type="button"
              onClick={() => onReply(comment)}
              className="inline-flex items-center gap-1"
            >
              <Reply className="h-3 w-3" />
              Responder
            </button>
            <button
              type="button"
              onClick={() => void toggleLike()}
              className={`inline-flex items-center gap-1 ${comment.liked ? 'text-red-400' : ''}`}
            >
              <Heart className={`h-3 w-3 ${comment.liked ? 'fill-current' : ''}`} />
              {comment.likeCount}
            </button>
            {ownComment || canModerate ? (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="inline-flex items-center gap-1 text-red-400"
                aria-label="Excluir comentário"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
      {comment.replies?.length ? (
        <div className="ml-9 mt-3 space-y-3 border-l border-of-border pl-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onReply={onReply}
              onChanged={onChanged}
              canModerate={canModerate}
            />
          ))}
        </div>
      ) : null}
      <ConfirmModal
        open={confirmingDelete}
        title="Excluir comentário?"
        description="Esta ação não pode ser desfeita. Se houver respostas, elas também serão excluídas."
        confirmLabel="Excluir comentário"
        loading={deleting}
        onClose={() => setConfirmingDelete(false)}
        onConfirm={() => void remove()}
      />
    </div>
  );
}
