import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import * as bcrypt from "bcrypt";

import { PrismaService } from "../shared/prisma.service";
import { isReservedUsername, USERNAME_UNAVAILABLE_MESSAGE } from "../auth/username-policy";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async adminList(pageInput = 1, search = "") {
    const page = Math.max(Math.trunc(pageInput) || 1, 1);
    const query = search.trim();
    const where = query
      ? {
          OR: [
            { username: { contains: query, mode: "insensitive" as const } },
            { email: { contains: query, mode: "insensitive" as const } },
            { profile: { is: { name: { contains: query, mode: "insensitive" as const } } } }
          ]
        }
      : {};
    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        include: { profile: { include: { city: { include: { state: true } } } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * 20,
        take: 20
      }),
      this.prisma.user.count({ where })
    ]);
    return {
      items: users.map((user) => this.serializeAdminUser(user)),
      page,
      pageSize: 20,
      total,
      totalPages: Math.max(Math.ceil(total / 20), 1)
    };
  }

  async adminGet(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: { include: { city: { include: { state: true } } } } }
    });
    if (!user) throw new NotFoundException("Usuário não encontrado");
    return this.serializeAdminUser(user);
  }

  async adminCreate(body: {
    name: string;
    username: string;
    email: string;
    password?: string;
    age: number;
    cityId: number;
    isAdmin: boolean;
  }) {
    if (!body.password) throw new BadRequestException("A senha é obrigatória ao criar um usuário");
    const username = body.username.trim().toLowerCase();
    const email = body.email.trim().toLowerCase();
    if (isReservedUsername(username)) throw new ConflictException(USERNAME_UNAVAILABLE_MESSAGE);
    const conflict = await this.prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
    if (conflict) throw new ConflictException("Nome de usuário ou e-mail já está em uso");

    const user = await this.prisma.user.create({
      data: {
        id: randomUUID(),
        username,
        email,
        passwordHash: await bcrypt.hash(body.password, 12),
        isAdmin: body.isAdmin,
        profile: {
          create: { id: randomUUID(), name: body.name.trim(), age: body.age, cityId: body.cityId }
        }
      },
      include: { profile: { include: { city: { include: { state: true } } } } }
    });
    return this.serializeAdminUser(user);
  }

  async adminUpdate(
    id: string,
    body: {
      name: string;
      username: string;
      email: string;
      password?: string;
      age: number;
      cityId: number;
      isAdmin: boolean;
    }
  ) {
    const username = body.username.trim().toLowerCase();
    const email = body.email.trim().toLowerCase();
    if (isReservedUsername(username)) throw new ConflictException(USERNAME_UNAVAILABLE_MESSAGE);
    const conflict = await this.prisma.user.findFirst({
      where: { id: { not: id }, OR: [{ username }, { email }] }
    });
    if (conflict) throw new ConflictException("Nome de usuário ou e-mail já está em uso");
    const existing = await this.prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new NotFoundException("Usuário não encontrado");

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id },
        data: {
          username,
          email,
          isAdmin: body.isAdmin,
          ...(body.password ? { passwordHash: await bcrypt.hash(body.password, 12) } : {})
        }
      }),
      this.prisma.profile.upsert({
        where: { userId: id },
        update: { name: body.name.trim(), age: body.age, cityId: body.cityId },
        create: {
          id: randomUUID(),
          userId: id,
          name: body.name.trim(),
          age: body.age,
          cityId: body.cityId
        }
      })
    ]);
    return this.adminGet(id);
  }

  async adminDelete(id: string, actingUserId: string) {
    if (id === actingUserId) throw new BadRequestException("Você não pode excluir a própria conta");
    const existing = await this.prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new NotFoundException("Usuário não encontrado");
    await this.prisma.user.delete({ where: { id } });
    return { success: true };
  }

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
            gym: true,
            city: { include: { state: true } }
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
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
      name: profile?.name ?? user.username,
      bio: profile?.bio ?? "",
      avatarUrl: profile?.avatarUrl ?? "",
      createdAt: user.createdAt.toISOString(),
      postCount: user._count.posts,
      followersCount,
      followingCount,
      profile: {
        age: profile?.age ?? null,
        gymId: profile?.gymId ?? null,
        gym: profile?.gym?.name ?? null,
        gymImageUrl: profile?.gym?.imageUrl ?? null,
        cityId: profile?.cityId ?? null,
        stateId: profile?.city?.codigoUf ?? null,
        city: profile?.city?.nome ?? null,
        state: profile?.city?.state.uf ?? null,
        fitnessGoal: profile?.fitnessGoal,
        physicalInfo: {
          weight: profile?.weight,
          bodyFat: profile?.bodyFat,
          arm: profile?.arm
        },
        showGym: profile?.showGym ?? true,
        showCity: profile?.showCity ?? true,
        showPhysicalInfo: profile?.showPhysicalInfo ?? true
      }
    };
  }

  async updateProfile(
    id: string,
    body: {
      name: string;
      username: string;
      email: string;
      age: number;
      cityId: number;
      bio?: string;
      gymId?: string | null;
      fitnessGoal?: string;
      weight?: string;
      bodyFat?: string;
      arm?: string;
      showGym: boolean;
      showCity: boolean;
      showPhysicalInfo: boolean;
    }
  ) {
    const username = body.username.trim().toLowerCase();
    const email = body.email.trim().toLowerCase();
    const name = body.name.trim();
    const bio = body.bio?.trim() ?? "";

    if (isReservedUsername(body.username)) {
      throw new ConflictException(USERNAME_UNAVAILABLE_MESSAGE);
    }

    const conflictingUser = await this.prisma.user.findFirst({
      where: { id: { not: id }, OR: [{ username }, { email }] },
      select: { id: true }
    });

    if (conflictingUser) {
      throw new ConflictException("Username or email already in use");
    }

    if (body.gymId) {
      const gym = await this.prisma.gym.findUnique({ where: { id: body.gymId } });
      if (!gym || gym.cityId !== body.cityId) {
        throw new BadRequestException("A academia precisa estar localizada na cidade informada");
      }
    }

    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id }, data: { username, email } }),
      this.prisma.profile.upsert({
        where: { userId: id },
        update: {
          name,
          bio,
          age: body.age,
          cityId: body.cityId,
          gymId: body.gymId ?? null,
          fitnessGoal: body.fitnessGoal?.trim() || null,
          weight: body.weight?.trim() || null,
          bodyFat: body.bodyFat?.trim() || null,
          arm: body.arm?.trim() || null,
          showGym: body.showGym,
          showCity: body.showCity,
          showPhysicalInfo: body.showPhysicalInfo
        },
        create: {
          id: randomUUID(),
          userId: id,
          name,
          bio,
          age: body.age,
          cityId: body.cityId,
          gymId: body.gymId ?? null,
          fitnessGoal: body.fitnessGoal?.trim() || null,
          weight: body.weight?.trim() || null,
          bodyFat: body.bodyFat?.trim() || null,
          arm: body.arm?.trim() || null,
          showGym: body.showGym,
          showCity: body.showCity,
          showPhysicalInfo: body.showPhysicalInfo
        }
      })
    ]);

    return this.getById(id);
  }

  async updateAvatar(id: string, avatarUrl: string) {
    await this.prisma.profile.update({ where: { userId: id }, data: { avatarUrl } });
    return { avatarUrl };
  }

  async getByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        profile: {
          include: {
            gym: true,
            city: { include: { state: true } }
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
        gymId: profile?.showGym ? (profile.gymId ?? null) : null,
        gym: profile?.showGym ? (profile.gym?.name ?? null) : null,
        gymImageUrl: profile?.showGym ? (profile.gym?.imageUrl ?? null) : null,
        city: profile?.showCity ? (profile.city?.nome ?? null) : null,
        state: profile?.showCity ? (profile.city?.state.uf ?? null) : null,
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

  private serializeAdminUser(user: {
    id: string;
    username: string;
    email: string;
    isAdmin: boolean;
    createdAt: Date;
    profile: {
      name: string;
      age: number | null;
      avatarUrl: string | null;
      cityId: number | null;
      city: { nome: string; codigoUf: number; state: { uf: string; nome: string } } | null;
    } | null;
  }) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt.toISOString(),
      name: user.profile?.name ?? user.username,
      age: user.profile?.age ?? null,
      avatarUrl: user.profile?.avatarUrl ?? "",
      cityId: user.profile?.cityId ?? null,
      city: user.profile?.city?.nome ?? null,
      stateId: user.profile?.city?.codigoUf ?? null,
      state: user.profile?.city?.state.uf ?? null
    };
  }
}
