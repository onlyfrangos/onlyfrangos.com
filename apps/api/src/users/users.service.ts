import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../shared/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getSuggestions(limit = 5) {
    const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(Math.trunc(limit), 1), 20) : 5;
    const users = await this.prisma.user.findMany({
      take: safeLimit,
      orderBy: { createdAt: "desc" },
      include: { profile: true }
    });

    return users.map((user) => ({
      id: user.id,
      username: user.username,
      name: user.profile?.name ?? user.username,
      avatarUrl: user.profile?.avatarUrl ?? ""
    }));
  }

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
      createdAt: user.createdAt.toISOString(),
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
      createdAt: user.createdAt.toISOString(),
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
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    return userPosts.map((post) => ({
      id: post.id,
      caption: post.caption,
      imageUrl: post.media[0]?.mediaUrl ?? "",
      createdAt: post.createdAt.toISOString(),
      likeCount: post._count.likes,
      commentCount: post._count.comments
    }));
  }
}
