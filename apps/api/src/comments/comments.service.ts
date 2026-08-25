import { randomUUID } from 'node:crypto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getByPost(postId: string, viewerId: string) {
    const list = await this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: { author: { include: { profile: true } }, likes: { select: { userId: true } } },
    });
    const serialized = list.map((item) => ({
      id: item.id,
      postId: item.postId,
      parentId: item.parentId,
      content: item.content,
      createdAt: item.createdAt.toISOString(),
      likeCount: item.likes.length,
      liked: item.likes.some((like) => like.userId === viewerId),
      author: {
        id: item.author.id,
        username: item.author.username,
        name: item.author.profile?.name ?? item.author.username,
        avatarUrl: item.author.profile?.avatarUrl ?? '',
      },
      replies: [] as unknown[],
    }));
    const byId = new Map(serialized.map((item) => [item.id, item]));
    const result: typeof serialized = [];
    for (const item of serialized) {
      if (item.parentId && byId.has(item.parentId)) byId.get(item.parentId)?.replies.push(item);
      else result.push(item);
    }
    return result;
  }

  async create(postId: string, userId: string, contentInput: string, parentId?: string | null) {
    const content = contentInput?.trim();
    if (!content || content.length > 1000)
      throw new BadRequestException('O comentário deve ter entre 1 e 1000 caracteres');
    if (parentId) {
      const parent = await this.prisma.comment.findUnique({
        where: { id: parentId },
        select: { postId: true },
      });
      if (!parent || parent.postId !== postId)
        throw new NotFoundException('Comentário pai não encontrado');
    }
    return this.prisma.comment.create({
      data: { id: randomUUID(), postId, authorId: userId, content, parentId: parentId ?? null },
    });
  }

  async like(commentId: string, userId: string) {
    await this.prisma.commentLike.upsert({
      where: { userId_commentId: { userId, commentId } },
      update: {},
      create: { id: randomUUID(), userId, commentId },
    });
    return { liked: true };
  }

  async remove(postId: string, commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: { post: { select: { authorId: true } } },
    });
    if (!comment || comment.postId !== postId)
      throw new NotFoundException('Comentário não encontrado');
    if (comment.authorId !== userId && comment.post.authorId !== userId) {
      throw new BadRequestException('Você não pode excluir este comentário');
    }
    await this.prisma.comment.delete({ where: { id: commentId } });
    return { success: true };
  }

  async unlike(commentId: string, userId: string) {
    await this.prisma.commentLike.deleteMany({ where: { userId, commentId } });
    return { liked: false };
  }
}
