import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";

import { PrismaService } from "../shared/prisma.service";

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  async like(postId: string, userId: string) {
    await this.prisma.like.upsert({
      where: {
        userId_postId: {
          userId,
          postId
        }
      },
      update: {},
      create: {
        id: randomUUID(),
        postId,
        userId
      }
    });

    return { liked: true };
  }

  async unlike(postId: string, userId: string) {
    await this.prisma.like.deleteMany({
      where: {
        postId,
        userId
      }
    });

    return { liked: false };
  }
}
