'use client';

import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ProfilePostItem } from '../types';
import { ProfilePostCard } from './profile-post-card';
import { ProfilePostModal } from './profile-post-modal';

type Props = { posts: ProfilePostItem[]; username: string; avatarUrl: string; canManage?: boolean };
type SortOrder = 'recent' | 'oldest' | 'liked';
const sortLabels: Record<SortOrder, string> = {
  recent: 'Mais recentes',
  oldest: 'Mais antigas',
  liked: 'Mais curtidas',
};

export function ProfilePostGrid({ posts, username, avatarUrl, canManage = false }: Props) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('recent');
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ProfilePostItem | null>(null);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const visiblePosts = useMemo(
    () =>
      posts.map((post) => ({ ...post, commentCount: commentCounts[post.id] ?? post.commentCount })),
    [commentCounts, posts],
  );
  const sortedPosts = useMemo(
    () =>
      [...visiblePosts].sort((a, b) => {
        if (sortOrder === 'liked')
          return b.likeCount - a.likeCount || Date.parse(b.createdAt) - Date.parse(a.createdAt);
        const difference = Date.parse(b.createdAt) - Date.parse(a.createdAt);
        return sortOrder === 'oldest' ? -difference : difference;
      }),
    [sortOrder, visiblePosts],
  );

  return (
    <section className="mt-4 rounded-2xl border border-of-border bg-of-surface/85 p-3 sm:p-4">
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-of-text">Todas as publicações</h2>
        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((value) => !value)}
            aria-haspopup="listbox"
            aria-expanded={sortOpen}
            className="inline-flex min-w-36 items-center justify-between gap-2 rounded-lg border border-of-border bg-black/10 px-3 py-2 text-sm text-of-text transition hover:bg-white/5"
          >
            {sortLabels[sortOrder]}
            <ChevronDown className={`h-4 w-4 transition ${sortOpen ? 'rotate-180' : ''}`} />
          </button>
          {sortOpen ? (
            <div
              role="listbox"
              aria-label="Ordenar publicações"
              className="absolute right-0 top-full z-30 mt-2 w-44 rounded-xl border border-of-border bg-[#171717] p-1.5 shadow-2xl"
            >
              {(Object.keys(sortLabels) as SortOrder[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  role="option"
                  aria-selected={sortOrder === value}
                  onClick={() => {
                    setSortOrder(value);
                    setSortOpen(false);
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${sortOrder === value ? 'bg-of-primary/15 text-of-primary' : 'hover:bg-white/5'}`}
                >
                  {sortLabels[value]}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </header>
      {sortedPosts.length ? (
        <div className="grid grid-cols-3 gap-1 sm:gap-2">
          {sortedPosts.map((post) => (
            <ProfilePostCard key={post.id} post={post} onOpen={() => setSelectedPost(post)} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-sm text-of-muted">Nenhuma publicação ainda.</p>
      )}
      {selectedPost ? (
        <ProfilePostModal
          post={selectedPost}
          username={username}
          avatarUrl={avatarUrl}
          canManage={canManage}
          onCommentCountChange={(count) => {
            setCommentCounts((current) => ({ ...current, [selectedPost.id]: count }));
            setSelectedPost((current) => (current ? { ...current, commentCount: count } : current));
          }}
          onClose={() => setSelectedPost(null)}
        />
      ) : null}
    </section>
  );
}
