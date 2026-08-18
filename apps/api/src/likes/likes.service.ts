import { Injectable } from "@nestjs/common";

import { likes } from "../shared/in-memory-store";

@Injectable()
export class LikesService {
  like(postId: string, userId: string) {
    const exists = likes.some((item) => item.postId === postId && item.userId === userId);
    if (!exists) {
      likes.push({ postId, userId });
    }
    return { liked: true };
  }

  unlike(postId: string, userId: string) {
    const index = likes.findIndex((item) => item.postId === postId && item.userId === userId);
    if (index !== -1) {
      likes.splice(index, 1);
    }
    return { liked: false };
  }
}
