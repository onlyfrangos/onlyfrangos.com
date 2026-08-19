import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";

import { PrismaService } from "../shared/prisma.service";

@Injectable()
export class FollowsService {
  constructor(private readonly prisma: PrismaService) {}

  async follow(followerId: string, followingId: string) {
    await this.prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      },
      update: {},
      create: {
        id: randomUUID(),
        followerId,
        followingId
      }
    });

    return { following: true };
  }

  async unfollow(followerId: string, followingId: string) {
    await this.prisma.follow.deleteMany({
      where: {
        followerId,
        followingId
      }
    });

    return { following: false };
  }
}
