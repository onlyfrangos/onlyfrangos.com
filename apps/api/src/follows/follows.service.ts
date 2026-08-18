import { Injectable } from "@nestjs/common";

import { follows } from "../shared/in-memory-store";

@Injectable()
export class FollowsService {
  follow(followerId: string, followingId: string) {
    const exists = follows.some((item) => item.followerId === followerId && item.followingId === followingId);
    if (!exists) {
      follows.push({ followerId, followingId });
    }
    return { following: true };
  }

  unfollow(followerId: string, followingId: string) {
    const index = follows.findIndex((item) => item.followerId === followerId && item.followingId === followingId);
    if (index !== -1) {
      follows.splice(index, 1);
    }
    return { following: false };
  }
}
