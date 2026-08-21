import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../shared/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            gym: true
          }
        },
        _count: {
          select: {
            posts: true
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const [followersCount, followingCount] = await Promise.all([
      this.prisma.follow.count({ where: { followingId: user.id } }),
      this.prisma.follow.count({ where: { followerId: user.id } })
    ]);

    const profile = user.profile;
    const shouldShowPhysicalInfo = Boolean(profile?.showPhysicalInfo);

    return {
      id: user.id,
      username: user.username,
      name: profile?.name ?? user.username,
      bio: profile?.bio ?? "",
      avatarUrl: profile?.avatarUrl ?? "",
      postCount: user._count.posts,
      followersCount,
      followingCount,
      profile: {
        gym: profile?.showGym ? (profile.gym?.name ?? null) : null,
        location: profile?.showLocation ? profile.location : null,
        locationUrl: profile?.showLocation ? profile.locationUrl : null,
        fitnessGoal: profile?.fitnessGoal,
        physicalInfo: shouldShowPhysicalInfo
          ? {
              weight: profile?.weight,
              bodyFat: profile?.bodyFat,
              arm: profile?.arm
            }
          : null
      }
    };
  }

  async getByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        profile: {
          include: {
            gym: true
          }
        },
        _count: {
          select: {
            posts: true
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const [followersCount, followingCount] = await Promise.all([
      this.prisma.follow.count({ where: { followingId: user.id } }),
      this.prisma.follow.count({ where: { followerId: user.id } })
    ]);

    const profile = user.profile;
    const shouldShowPhysicalInfo = Boolean(profile?.showPhysicalInfo);

    return {
      id: user.id,
      username: user.username,
      name: profile?.name ?? user.username,
      bio: profile?.bio ?? "",
      avatarUrl: profile?.avatarUrl ?? "",
      postCount: user._count.posts,
      followersCount,
      followingCount,
      profile: {
        gym: profile?.showGym ? (profile.gym?.name ?? null) : null,
        location: profile?.showLocation ? profile.location : null,
        locationUrl: profile?.showLocation ? profile.locationUrl : null,
        fitnessGoal: profile?.fitnessGoal,
        physicalInfo: shouldShowPhysicalInfo
          ? {
              weight: profile?.weight,
              bodyFat: profile?.bodyFat,
              arm: profile?.arm
            }
          : null
      }
    };
  }

  async getPostsByUsername(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const userPosts = await this.prisma.post.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        media: {
          orderBy: { order: "asc" },
          take: 1
        }
      }
    });

    return userPosts.map((post) => ({
      id: post.id,
      caption: post.caption,
      imageUrl: post.media[0]?.mediaUrl ?? "",
      createdAt: post.createdAt.toISOString()
    }));
  }
}
