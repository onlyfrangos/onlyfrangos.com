import { Injectable, NotFoundException } from "@nestjs/common";

import { posts, users } from "../shared/in-memory-store";
import { findUserByUsername, sortPostsChronologically } from "../shared/helpers";

@Injectable()
export class UsersService {
  getByUsername(username: string) {
    const user = findUserByUsername(users, username);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const postCount = posts.filter((post) => post.authorId === user.id).length;

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      postCount,
      profile: {
        gym: user.showGym ? user.gym : null,
        location: user.showLocation ? user.location : null,
        locationUrl: user.showLocation ? user.locationUrl : null,
        fitnessGoal: user.fitnessGoal,
        physicalInfo: user.showPhysicalInfo
          ? {
              weight: user.weight,
              bodyFat: user.bodyFat,
              arm: user.arm
            }
          : null
      }
    };
  }

  getPostsByUsername(username: string) {
    const user = findUserByUsername(users, username);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return sortPostsChronologically(posts.filter((post) => post.authorId === user.id));
  }
}
