import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(postId: string, viewerId: string) {
    const likes = await this.prisma.like.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
      include: { user: { include: { profile: true } } },
    });
    return {
      liked: likes.some((like) => like.userId === viewerId),
      count: likes.length,
      items: likes.map((like) => ({
        id: like.user.id,
        username: like.user.username,
        name: like.user.profile?.name ?? like.user.username,
        avatarUrl: like.user.profile?.avatarUrl ?? '',
      })),
    };
  }

  async like(postId: string, userId: string) {
    await this.prisma.like.upsert({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      update: {},
      create: {
        id: randomUUID(),
        postId,
        userId,
      },
    });

    return { liked: true };
  }

  async unlike(postId: string, userId: string) {
    await this.prisma.like.deleteMany({
      where: {
        postId,
        userId,
      },
    });

    return { liked: false };
  }
}
