import { Injectable } from '@nestjs/common';

import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class FeedService {
  constructor(private readonly prisma: PrismaService) {}

  async getFeed(limit = 20, cursor?: string) {
    const pageLimit = Number.isFinite(limit) ? Math.min(Math.max(Math.trunc(limit), 1), 50) : 20;
    const posts = await this.prisma.post.findMany({
      take: pageLimit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: {
        media: {
          orderBy: { order: 'asc' },
        },
        author: {
          include: {
            profile: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    const hasNextPage = posts.length > pageLimit;
    const page = hasNextPage ? posts.slice(0, pageLimit) : posts;
    const nextCursor = hasNextPage ? (page[page.length - 1]?.id ?? null) : null;

    const items = page.map((post) => {
      const author = post.author;
      const imageUrls = post.media.map((item) => item.mediaUrl);

      const profile = author.profile;

      return {
        id: post.id,
        caption: post.caption,
        imageUrl: imageUrls[0] ?? '',
        imageUrls,
        createdAt: post.createdAt.toISOString(),
        likeCount: post._count.likes,
        commentCount: post._count.comments,
        author: {
          id: author.id,
          username: author.username,
          name: profile?.name ?? author.username,
          avatarUrl: profile?.avatarUrl ?? '',
        },
      };
    });

    return {
      items,
      pageInfo: {
        nextCursor,
        limit: pageLimit,
      },
    };
  }
}
