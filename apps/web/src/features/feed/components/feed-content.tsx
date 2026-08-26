'use client';

import type { CursorPage, FeedPost } from '@onlyfrangos/types';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';

import { apiFetch } from '../../../lib/auth';
import { FeedPostsLoading } from './feed-posts-loading';
import { PostCard } from './post-card';
import { PostComposer } from './post-composer';

type FeedContentProps = {
  posts: FeedPost[];
  initialNextCursor: string | null;
};

export function FeedContent({ posts, initialNextCursor }: FeedContentProps) {
  const router = useRouter();
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const isLoadingMoreRef = useRef(false);
  const [visiblePosts, setVisiblePosts] = useState(posts);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState('');
  const [isRefreshing, startRefreshTransition] = useTransition();

  useEffect(() => {
    setVisiblePosts(posts);
    setNextCursor(initialNextCursor);
  }, [initialNextCursor, posts]);

  function refreshFeed() {
    setLoadMoreError('');
    startRefreshTransition(() => {
      router.refresh();
    });
  }

  const loadMorePosts = useCallback(async () => {
    if (!nextCursor || isLoadingMoreRef.current) {
      return;
    }

    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    setLoadMoreError('');

    try {
      const query = new URLSearchParams({ limit: '20', cursor: nextCursor });
      const response = await apiFetch(`/feed?${query.toString()}`);
      if (!response.ok) {
        throw new Error('Não foi possível carregar mais postagens');
      }

      const nextPage = (await response.json()) as CursorPage<FeedPost>;
      setVisiblePosts((currentPosts) => {
        const currentPostIds = new Set(currentPosts.map((post) => post.id));
        const newPosts = nextPage.items.filter((post) => !currentPostIds.has(post.id));
        return [...currentPosts, ...newPosts];
      });
      setNextCursor(nextPage.pageInfo.nextCursor);
    } catch (requestError) {
      setLoadMoreError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível carregar mais postagens',
      );
    } finally {
      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [nextCursor]);

  useEffect(() => {
    const trigger = loadMoreTriggerRef.current;
    if (!trigger || !nextCursor || loadMoreError) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void loadMorePosts();
        }
      },
      { rootMargin: '500px 0px' },
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [loadMoreError, loadMorePosts, nextCursor]);

  return (
    <>
      <PostComposer onCreated={refreshFeed} />
      {isRefreshing ? (
        <FeedPostsLoading />
      ) : (
        <section className="space-y-4" aria-live="polite">
          {visiblePosts.length === 0 ? (
            <article className="rounded-2xl border border-of-border bg-of-surface/90 p-8 text-center text-of-muted">
              Nenhum post por enquanto.
            </article>
          ) : (
            visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} onChanged={refreshFeed} />
            ))
          )}
        </section>
      )}
      {isLoadingMore ? (
        <div
          className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-of-border bg-of-surface/70 p-4 text-sm text-of-muted"
          role="status"
        >
          <LoaderCircle className="h-4 w-4 animate-spin text-of-primary" />
          Carregando mais postagens...
        </div>
      ) : null}
      {loadMoreError ? (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-center">
          <p className="text-sm text-red-400" role="alert">
            {loadMoreError}
          </p>
          <button
            type="button"
            onClick={() => void loadMorePosts()}
            className="mt-2 rounded-lg border border-of-border px-3 py-2 text-sm hover:bg-white/5"
          >
            Tentar novamente
          </button>
        </div>
      ) : null}
      <div ref={loadMoreTriggerRef} className="h-1" aria-hidden="true" />
    </>
  );
}
