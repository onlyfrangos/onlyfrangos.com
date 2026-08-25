import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MediaType } from '@prisma/client';

import { PrismaService } from '../shared/prisma.service';
import { AvatarStorageService } from '../users/avatar-storage.service';

type ImageFile = { buffer: Buffer; mimetype: string; originalname: string };

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { media: { orderBy: { order: 'asc' } }, author: { include: { profile: true } } },
    });
    if (!post) throw new NotFoundException('Post not found');
    return this.serialize(post);
  }

  async create(
    authorId: string,
    caption: string,
    files: ImageFile[],
    storage: AvatarStorageService,
  ) {
    this.validateCaption(caption);
    const postId = randomUUID();
    const imageUrls = await Promise.all(files.map((file) => storage.savePostImage(postId, file)));
    const created = await this.prisma.post.create({
      data: {
        id: postId,
        authorId,
        caption: caption.trim(),
        media: { create: this.mediaData(imageUrls) },
      },
      include: { media: { orderBy: { order: 'asc' } } },
    });
    return this.serialize(created);
  }

  async update(
    id: string,
    userId: string,
    caption: string,
    replaceImages: boolean,
    mediaOrderInput: string | undefined,
    files: ImageFile[],
    storage: AvatarStorageService,
  ) {
    this.validateCaption(caption);
    await this.ensureOwner(id, userId);
    const imageUrls = files.length
      ? await Promise.all(files.map((file) => storage.savePostImage(id, file)))
      : [];
    const mediaOrder = mediaOrderInput
      ? this.parseMediaOrder(mediaOrderInput, imageUrls.length)
      : null;
    if (mediaOrder && (mediaOrder.length < 1 || mediaOrder.length > 4))
      throw new BadRequestException('Mantenha de 1 a 4 imagens');
    if (replaceImages && !mediaOrder && files.length === 0)
      throw new BadRequestException('Envie ao menos uma imagem');
    const updated = await this.prisma.$transaction(async (transaction) => {
      if (mediaOrder) {
        const existingIds = mediaOrder
          .filter((item): item is { id: string } => 'id' in item)
          .map((item) => item.id);
        const owned = await transaction.postMedia.count({
          where: { postId: id, id: { in: existingIds } },
        });
        if (owned !== existingIds.length)
          throw new BadRequestException('Uma das imagens não pertence à publicação');
        await transaction.postMedia.deleteMany({
          where: { postId: id, id: { notIn: existingIds } },
        });
        for (const [order, item] of mediaOrder.entries()) {
          if ('id' in item)
            await transaction.postMedia.update({ where: { id: item.id }, data: { order } });
          else
            await transaction.postMedia.create({
              data: {
                id: randomUUID(),
                postId: id,
                mediaUrl: imageUrls[item.newIndex]!,
                mediaType: MediaType.IMAGE,
                order,
              },
            });
        }
      } else if (replaceImages) {
        await transaction.postMedia.deleteMany({ where: { postId: id } });
      }
      return transaction.post.update({
        where: { id },
        data: {
          caption: caption.trim(),
          ...(replaceImages && !mediaOrder ? { media: { create: this.mediaData(imageUrls) } } : {}),
        },
        include: { media: { orderBy: { order: 'asc' } } },
      });
    });
    return this.serialize(updated);
  }

  private parseMediaOrder(value: string, newImageCount: number) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(value);
    } catch {
      throw new BadRequestException('Ordem de imagens inválida');
    }
    if (!Array.isArray(parsed)) throw new BadRequestException('Ordem de imagens inválida');
    return parsed.map((item) => {
      if (item && typeof item === 'object' && typeof (item as { id?: unknown }).id === 'string')
        return { id: (item as { id: string }).id };
      const newIndex =
        item && typeof item === 'object' ? (item as { newIndex?: unknown }).newIndex : undefined;
      if (
        !Number.isInteger(newIndex) ||
        (newIndex as number) < 0 ||
        (newIndex as number) >= newImageCount
      )
        throw new BadRequestException('Ordem de imagens inválida');
      return { newIndex: newIndex as number };
    });
  }

  async remove(id: string, userId: string) {
    await this.ensureOwner(id, userId);
    await this.prisma.post.delete({ where: { id } });
    return { success: true };
  }

  private mediaData(imageUrls: string[]) {
    return imageUrls.map((mediaUrl, order) => ({
      id: randomUUID(),
      mediaUrl,
      mediaType: MediaType.IMAGE,
      order,
    }));
  }

  private validateCaption(caption: string) {
    if (caption.trim().length > 2200)
      throw new BadRequestException('A legenda deve ter até 2200 caracteres');
  }

  private async ensureOwner(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id }, select: { authorId: true } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId)
      throw new ForbiddenException('Você não pode alterar esta publicação');
  }

  private serialize(post: {
    id: string;
    authorId: string;
    caption: string;
    createdAt: Date;
    media: Array<{ id: string; mediaUrl: string }>;
    author?: { id: string; username: string; profile: { avatarUrl: string | null } | null };
  }) {
    const imageUrls = post.media.map((item) => item.mediaUrl);
    return {
      id: post.id,
      authorId: post.authorId,
      caption: post.caption,
      imageUrl: imageUrls[0] ?? '',
      imageUrls,
      media: post.media.map((item) => ({ id: item.id, url: item.mediaUrl })),
      createdAt: post.createdAt.toISOString(),
      ...(post.author
        ? {
            author: {
              id: post.author.id,
              username: post.author.username,
              avatarUrl: post.author.profile?.avatarUrl ?? '',
            },
          }
        : {}),
    };
  }
}
