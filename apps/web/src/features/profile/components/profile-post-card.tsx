"use client";

import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import type { ProfilePostItem } from "../types";

export function ProfilePostCard({ post, onOpen }: { post: ProfilePostItem; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Abrir publicação: ${post.caption}`}
      className="group relative aspect-square overflow-hidden bg-black text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-of-primary"
    >
      <Image
        src={post.imageUrl}
        alt={post.caption}
        fill
        sizes="(max-width: 640px) 33vw, (max-width: 1200px) 25vw, 20vw"
        className="object-cover transition duration-300 group-hover:scale-[1.02]"
      />
      <span className="absolute inset-0 flex items-center justify-center gap-5 bg-black/60 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100 sm:text-base">
        <span className="inline-flex items-center gap-1.5">
          <Heart className="h-5 w-5 fill-white" />
          {post.likeCount}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MessageCircle className="h-5 w-5 fill-white" />
          {post.commentCount}
        </span>
      </span>
    </button>
  );
}
