import { Injectable, NotFoundException } from "@nestjs/common";

import { posts, users } from "../shared/in-memory-store";

@Injectable()
export class PostsService {
  getById(id: string) {
    const post = posts.find((item) => item.id === id);

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    const author = users.find((user) => user.id === post.authorId);

    return {
      ...post,
      author: author
        ? {
            id: author.id,
            username: author.username,
            avatarUrl: author.avatarUrl
          }
        : null
    };
  }

  create(input: { authorId: string; caption: string; imageUrl: string }) {
    const newPost = {
      id: crypto.randomUUID(),
      authorId: input.authorId,
      caption: input.caption,
      imageUrl: input.imageUrl,
      createdAt: new Date().toISOString()
    };

    posts.unshift(newPost);
    return newPost;
  }

  remove(id: string) {
    const index = posts.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new NotFoundException("Post not found");
    }

    posts.splice(index, 1);
    return { success: true };
  }
}
