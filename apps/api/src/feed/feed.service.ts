import { Injectable } from "@nestjs/common";

import { PrismaService } from "../shared/prisma.service";

@Injectable()
export class FeedService {
  constructor(private readonly prisma: PrismaService) {}

  async getFeed(limit = 20, cursor?: string) {
    const sorted = await this.prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        media: {
          orderBy: { order: "asc" },
          take: 1
        },
        author: {
          include: {
            profile: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    const startIndex = cursor ? sorted.findIndex((post) => post.id === cursor) + 1 : 0;
    const page = sorted.slice(startIndex, startIndex + limit);
    const nextCursor = page.length === limit ? page[page.length - 1]?.id : null;

    const items = page.map((post) => {
      const author = post.author;
      const firstMedia = post.media[0];

      const profile = author.profile;

      return {
        id: post.id,
        caption: post.caption,
        imageUrl: firstMedia?.mediaUrl ?? "",
        createdAt: post.createdAt.toISOString(),
        likeCount: post._count.likes,
        commentCount: post._count.comments,
        author: {
          id: author.id,
          username: author.username,
          name: profile?.name ?? author.username,
          avatarUrl: profile?.avatarUrl ?? ""
        }
      };
    });

    return {
      items,
      pageInfo: {
        nextCursor,
        limit
      }
    };
  }
}
