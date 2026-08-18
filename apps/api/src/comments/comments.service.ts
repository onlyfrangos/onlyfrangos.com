import { Injectable } from "@nestjs/common";

import { comments } from "../shared/in-memory-store";

@Injectable()
export class CommentsService {
  getByPost(postId: string) {
    return comments.filter((item) => item.postId === postId);
  }

  create(postId: string, input: { userId: string; content: string }) {
    const newComment = {
      id: crypto.randomUUID(),
      postId,
      userId: input.userId,
      content: input.content,
      createdAt: new Date().toISOString()
    };

    comments.push(newComment);
    return newComment;
  }
}
