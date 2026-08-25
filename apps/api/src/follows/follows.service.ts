import { randomUUID } from 'node:crypto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class FollowsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatus(followerId: string, followingId: string) {
    await this.ensureValidTarget(followerId, followingId);

    const [follow, followersCount] = await Promise.all([
      this.prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
        select: { id: true },
      }),
      this.prisma.follow.count({ where: { followingId } }),
    ]);

    return { following: Boolean(follow), followersCount };
  }

  async follow(followerId: string, followingId: string) {
    await this.ensureValidTarget(followerId, followingId);

    await this.prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
      update: {},
      create: {
        id: randomUUID(),
        followerId,
        followingId,
      },
    });

    const followersCount = await this.prisma.follow.count({ where: { followingId } });
    return { following: true, followersCount };
  }

  async unfollow(followerId: string, followingId: string) {
    await this.ensureValidTarget(followerId, followingId);

    await this.prisma.follow.deleteMany({
      where: {
        followerId,
        followingId,
      },
    });

    const followersCount = await this.prisma.follow.count({ where: { followingId } });
    return { following: false, followersCount };
  }

  private async ensureValidTarget(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('Você não pode seguir a si mesmo');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: followingId },
      select: { id: true },
    });

    if (!targetUser) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }
}
