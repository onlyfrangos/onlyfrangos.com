import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';
import type { Response } from 'express';

import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../shared/prisma.service';
import { AvatarStorageService } from '../users/avatar-storage.service';
import { SaveGymDto } from './dto/save-gym.dto';

const DEFAULT_GYM_IMAGE =
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80';

type GymMemberSort = 'recent' | 'oldest' | 'followers';

const gymMemberPageSize = 10;

@ApiTags('gyms')
@Controller('gyms')
export class GymsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageStorage: AvatarStorageService,
  ) {}

  @Get()
  async list(
    @Query('page') pageInput?: string,
    @Query('cityId') cityInput?: string,
    @Query('stateId') stateInput?: string,
    @Query('name') nameInput?: string,
  ) {
    const page = Math.max(Number.parseInt(pageInput ?? '1', 10) || 1, 1);
    const cityId = Number(cityInput);
    const stateId = Number(stateInput);
    const where = {
      ...(nameInput?.trim()
        ? { name: { contains: nameInput.trim(), mode: 'insensitive' as const } }
        : {}),
      ...(Number.isInteger(cityId) ? { cityId } : {}),
      ...(!Number.isInteger(cityId) && Number.isInteger(stateId)
        ? { city: { codigoUf: stateId } }
        : {}),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.gym.findMany({
        where,
        include: { city: { include: { state: true } } },
        orderBy: { name: 'asc' },
        skip: (page - 1) * 20,
        take: 20,
      }),
      this.prisma.gym.count({ where }),
    ]);
    return {
      items: items.map((gym) => this.serialize(gym)),
      page,
      pageSize: 20,
      total,
      totalPages: Math.max(Math.ceil(total / 20), 1),
    };
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const gym = await this.prisma.gym.findUnique({
      where: { id },
      include: { city: { include: { state: true } } },
    });
    if (!gym) throw new NotFoundException('Academia não encontrada');
    return this.serialize(gym);
  }

  @Get(':id/members')
  async getMembers(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') pageInput?: string,
    @Query('sort') sortInput?: string,
  ) {
    const gym = await this.prisma.gym.findUnique({ where: { id }, select: { id: true } });
    if (!gym) throw new NotFoundException('Academia não encontrada');

    const page = Math.max(Number.parseInt(pageInput ?? '1', 10) || 1, 1);
    const sort = this.parseMemberSort(sortInput);
    const orderBy =
      sort === 'oldest'
        ? { createdAt: 'asc' as const }
        : sort === 'followers'
          ? { user: { followers: { _count: 'desc' as const } } }
          : { createdAt: 'desc' as const };
    const [profiles, total] = await this.prisma.$transaction([
      this.prisma.profile.findMany({
        where: { gymId: id },
        include: {
          user: { include: { _count: { select: { followers: true, posts: true } } } },
        },
        orderBy: [orderBy, { createdAt: 'desc' }],
        skip: (page - 1) * gymMemberPageSize,
        take: gymMemberPageSize,
      }),
      this.prisma.profile.count({ where: { gymId: id } }),
    ]);

    return {
      items: profiles.map((profile) => ({
        id: profile.user.id,
        username: profile.user.username,
        name: profile.name,
        avatarUrl: profile.avatarUrl ?? '',
        bio: profile.bio ?? '',
        fitnessGoal: profile.fitnessGoal,
        followerCount: profile.user._count.followers,
        postCount: profile.user._count.posts,
        memberSince: profile.createdAt.toISOString(),
      })),
      page,
      pageSize: gymMemberPageSize,
      total,
      totalPages: Math.max(Math.ceil(total / gymMemberPageSize), 1),
      sort,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() body: SaveGymDto) {
    await this.ensureCity(body.cityId);
    const gym = await this.prisma.gym.create({
      data: {
        id: randomUUID(),
        name: body.name.trim(),
        cityId: body.cityId,
        imageUrl: DEFAULT_GYM_IMAGE,
      },
      include: { city: { include: { state: true } } },
    });
    return this.serialize(gym);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() body: SaveGymDto) {
    await this.ensureCity(body.cityId);
    const existing = await this.prisma.gym.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new NotFoundException('Academia não encontrada');
    const gym = await this.prisma.gym.update({
      where: { id },
      data: {
        name: body.name.trim(),
        cityId: body.cityId,
      },
      include: { city: { include: { state: true } } },
    });
    return this.serialize(gym);
  }

  @Post(':id/image')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('image', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async uploadImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file?: { buffer: Buffer; mimetype: string; originalname: string },
  ) {
    if (!file || !['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      throw new BadRequestException('Envie uma imagem JPG, PNG ou WebP de até 5 MB');
    }
    const existing = await this.prisma.gym.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new NotFoundException('Academia não encontrada');

    const imageUrl = await this.imageStorage.saveGym(id, file);
    await this.prisma.gym.update({ where: { id }, data: { imageUrl } });
    return { imageUrl };
  }

  @Get('image-files/:filename')
  async getImageFile(@Param('filename') filename: string, @Res() response: Response) {
    return response.sendFile(await this.imageStorage.getLocalGymFile(filename));
  }

  private async ensureCity(cityId: number) {
    const city = await this.prisma.city.findUnique({
      where: { codigoIbge: cityId },
      select: { codigoIbge: true },
    });
    if (!city) throw new NotFoundException('Cidade não encontrada');
  }

  private parseMemberSort(sortInput?: string): GymMemberSort {
    if (sortInput === 'oldest' || sortInput === 'followers') {
      return sortInput;
    }

    return 'recent';
  }

  private serialize(gym: {
    id: string;
    name: string;
    cityId: number;
    imageUrl: string | null;
    createdAt: Date;
    city: { nome: string; codigoUf: number; state: { uf: string; nome: string } };
  }) {
    return {
      id: gym.id,
      name: gym.name,
      cityId: gym.cityId,
      city: gym.city.nome,
      stateId: gym.city.codigoUf,
      state: gym.city.state.uf,
      stateName: gym.city.state.nome,
      imageUrl: gym.imageUrl || DEFAULT_GYM_IMAGE,
      createdAt: gym.createdAt.toISOString(),
    };
  }
}
