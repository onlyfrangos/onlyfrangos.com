import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";

import { PrismaService } from "../shared/prisma.service";
import { isReservedUsername, USERNAME_ALREADY_EXISTS_MESSAGE, USERNAME_UNAVAILABLE_MESSAGE } from "./username-policy";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  private signAccessToken(user: { id: string; email: string; username: string }) {
    return this.jwtService.sign(
      { sub: user.id, email: user.email, username: user.username },
      { expiresIn: "15m" }
    );
  }

  private signRefreshToken(user: { id: string; email: string; username: string }) {
    return this.jwtService.sign({ sub: user.id, type: "refresh" }, { expiresIn: "7d" });
  }

  async isUsernameAvailable(username: string) {
    const normalizedUsername = username.trim().toLowerCase();

    if (!/^[a-z0-9._]{3,}$/.test(normalizedUsername) || isReservedUsername(username)) {
      return { username: normalizedUsername, available: false };
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { username: normalizedUsername },
      select: { id: true }
    });

    return { username: normalizedUsername, available: !existingUser };
  }

  async register(body: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    age: number;
    cityId: number;
  }) {
    const normalizedUsername = body.username.trim().toLowerCase();
    const normalizedEmail = body.email.trim().toLowerCase();
    const normalizedFullName = body.fullName.trim();

    if (isReservedUsername(body.username)) {
      throw new ConflictException(USERNAME_UNAVAILABLE_MESSAGE);
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { username: normalizedUsername }]
      }
    });

    if (existingUser) {
      throw new ConflictException(USERNAME_ALREADY_EXISTS_MESSAGE);
    }

    const passwordHash = await bcrypt.hash(body.password, 12);

    const user = await this.prisma.user.create({
      data: {
        id: randomUUID(),
        username: normalizedUsername,
        email: normalizedEmail,
        passwordHash,
        profile: {
          create: {
            id: randomUUID(),
            name: normalizedFullName,
            age: body.age,
            cityId: body.cityId,
            bio: "",
            showGym: true,
            showCity: true,
            showPhysicalInfo: true
          }
        }
      },
      select: {
        id: true,
        email: true,
        username: true,
        isAdmin: true
      }
    });

    return {
      user,
      accessToken: this.signAccessToken(user),
      refreshToken: this.signRefreshToken(user)
    };
  }

  async login(body: { email: string; password: string }) {
    const email = body.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        passwordHash: true,
        isAdmin: true
      }
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordMatches = await bcrypt.compare(body.password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const { passwordHash: _passwordHash, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken: this.signAccessToken(safeUser),
      refreshToken: this.signRefreshToken(safeUser)
    };
  }

  async impersonate(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true, isAdmin: true }
    });

    if (!user) {
      throw new UnauthorizedException("Usuário não encontrado");
    }

    return {
      user,
      accessToken: this.signAccessToken(user),
      refreshToken: this.signRefreshToken(user)
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<{ sub: string; type?: string }>(refreshToken);

      if (payload.type !== "refresh") {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, username: true, isAdmin: true }
      });

      if (!user) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      return {
        user,
        accessToken: this.signAccessToken(user)
      };
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }
}
