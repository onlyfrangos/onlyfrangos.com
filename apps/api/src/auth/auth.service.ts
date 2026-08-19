import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";

import { PrismaService } from "../shared/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  private signAccessToken(user: { id: string; email: string; username: string }) {
    return this.jwtService.sign({ sub: user.id, email: user.email, username: user.username }, { expiresIn: "15m" });
  }

  private signRefreshToken(user: { id: string; email: string; username: string }) {
    return this.jwtService.sign({ sub: user.id, type: "refresh" }, { expiresIn: "7d" });
  }

  async register(body: { username: string; email: string; password: string }) {
    const normalizedUsername = body.username.trim();
    const normalizedEmail = body.email.trim().toLowerCase();

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { username: normalizedUsername }]
      }
    });

    if (existingUser) {
      throw new ConflictException("User already exists");
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
            name: normalizedUsername,
            bio: "",
            showGym: true,
            showLocation: true,
            showPhysicalInfo: true
          }
        }
      },
      select: {
        id: true,
        email: true,
        username: true
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
        passwordHash: true
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

  async refresh(body: { refreshToken: string }) {
    try {
      const payload = this.jwtService.verify<{ sub: string; type?: string }>(body.refreshToken);

      if (payload.type !== "refresh") {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, username: true }
      });

      if (!user) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      return {
        accessToken: this.signAccessToken(user)
      };
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }
}
