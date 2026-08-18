import { Injectable } from "@nestjs/common";

import { likes, posts, users } from "../shared/in-memory-store";
import { sortPostsChronologically } from "../shared/helpers";

@Injectable()
export class FeedService {
  getFeed(limit = 20, cursor?: string) {
    const sorted = sortPostsChronologically(posts);

    const startIndex = cursor ? sorted.findIndex((post) => post.id === cursor) + 1 : 0;
    const page = sorted.slice(startIndex, startIndex + limit);
    const nextCursor = page.length === limit ? page[page.length - 1]?.id : null;

    const items = page.map((post) => {
      const author = users.find((user) => user.id === post.authorId);
      const likeCount = likes.filter((like) => like.postId === post.id).length;

      return {
        id: post.id,
        caption: post.caption,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt,
        likeCount,
        author: author
          ? {
              id: author.id,
              username: author.username,
              name: author.name,
              avatarUrl: author.avatarUrl
            }
          : null
      };
    });

    return {
      items,
      pageInfo: {
        nextCursor,
        limit
      }
    };
  }
}
