import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";

import { PrismaService } from "../shared/prisma.service";

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getByPost(postId: string) {
    const list = await this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          include: {
            profile: true
          }
        }
      }
    });

    return list.map((item) => ({
      id: item.id,
      postId: item.postId,
      userId: item.authorId,
      content: item.content,
      createdAt: item.createdAt.toISOString(),
      author: {
        id: item.author.id,
        username: item.author.username,
        name: item.author.profile?.name ?? item.author.username,
        avatarUrl: item.author.profile?.avatarUrl ?? ""
      }
    }));
  }

  async create(postId: string, input: { userId: string; content: string }) {
    const created = await this.prisma.comment.create({
      data: {
        id: randomUUID(),
        postId,
        authorId: input.userId,
        content: input.content
      }
    });

    return {
      id: created.id,
      postId,
      userId: input.userId,
      content: created.content,
      createdAt: created.createdAt.toISOString()
    };
  }
}
