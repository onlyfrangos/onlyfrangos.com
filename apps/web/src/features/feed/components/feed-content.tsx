'use client';

import type { FeedPost } from '@onlyfrangos/types';
import { useRouter } from 'next/navigation';

import { PostCard } from './post-card';
import { PostComposer } from './post-composer';

export function FeedContent({ posts }: { posts: FeedPost[] }) {
  const router = useRouter();
  return (
    <>
      <PostComposer onCreated={() => router.refresh()} />
      <section className="space-y-4">
        {posts.length === 0 ? (
          <article className="rounded-2xl border border-of-border bg-of-surface/90 p-8 text-center text-of-muted">
            Nenhum post por enquanto.
          </article>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onChanged={() => router.refresh()} />
          ))
        )}
      </section>
    </>
  );
}
