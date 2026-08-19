import { randomUUID } from "node:crypto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { MediaType } from "@prisma/client";

import { PrismaService } from "../shared/prisma.service";

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        media: {
          orderBy: { order: "asc" },
          take: 1
        },
        author: {
          include: {
            profile: true
          }
        }
      }
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    const firstMedia = post.media[0];

    return {
      id: post.id,
      authorId: post.authorId,
      caption: post.caption,
      imageUrl: firstMedia?.mediaUrl ?? "",
      createdAt: post.createdAt.toISOString(),
      author: {
        id: post.author.id,
        username: post.author.username,
        avatarUrl: post.author.profile?.avatarUrl ?? ""
      }
    };
  }

  async create(input: { authorId: string; caption: string; imageUrl: string }) {
    const postId = randomUUID();

    const created = await this.prisma.post.create({
      data: {
        id: postId,
        authorId: input.authorId,
        caption: input.caption,
        media: {
          create: {
            id: randomUUID(),
            mediaUrl: input.imageUrl,
            mediaType: MediaType.IMAGE,
            order: 0
          }
        }
      },
      include: {
        media: {
          orderBy: { order: "asc" },
          take: 1
        }
      }
    });

    return {
      id: created.id,
      authorId: created.authorId,
      caption: created.caption,
      imageUrl: created.media[0]?.mediaUrl ?? "",
      createdAt: created.createdAt.toISOString()
    };
  }

  async remove(id: string) {
    const exists = await this.prisma.post.findUnique({ where: { id }, select: { id: true } });

    if (!exists) {
      throw new NotFoundException("Post not found");
    }

    await this.prisma.post.delete({ where: { id } });
    return { success: true };
  }
}
