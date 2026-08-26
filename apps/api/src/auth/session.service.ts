import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionClient } from '@prisma/client';
import { createHash, randomBytes, randomUUID } from 'node:crypto';

import { PrismaService } from '../shared/prisma.service';

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type SessionMetadata = {
  clientType: SessionClient;
  deviceId?: string;
  deviceName?: string;
};

type RotatedSession = {
  refreshToken: string;
  userId: string;
};

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async issue(userId: string, metadata: SessionMetadata): Promise<string> {
    const refreshToken = this.generateRefreshToken();
    const now = new Date();

    if (metadata.deviceId) {
      await this.prisma.authenticationSession.updateMany({
        where: {
          userId,
          clientType: metadata.clientType,
          deviceId: metadata.deviceId,
          revokedAt: null,
        },
        data: { revokedAt: now },
      });
    }

    await this.prisma.authenticationSession.create({
      data: {
        id: randomUUID(),
        userId,
        tokenHash: this.hashToken(refreshToken),
        clientType: metadata.clientType,
        deviceId: metadata.deviceId,
        deviceName: metadata.deviceName,
        expiresAt: new Date(now.getTime() + REFRESH_TOKEN_TTL_MS),
        lastUsedAt: now,
      },
    });

    return refreshToken;
  }

  async rotate(refreshToken: string, expectedClient: SessionClient): Promise<RotatedSession> {
    const tokenHash = this.hashToken(refreshToken);
    const session = await this.prisma.authenticationSession.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        userId: true,
        clientType: true,
        expiresAt: true,
        revokedAt: true,
      },
    });
    const now = new Date();

    if (
      !session ||
      session.clientType !== expectedClient ||
      session.revokedAt ||
      session.expiresAt <= now
    ) {
      throw this.invalidRefreshToken();
    }

    const nextRefreshToken = this.generateRefreshToken();
    const rotation = await this.prisma.authenticationSession.updateMany({
      where: {
        id: session.id,
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: now },
      },
      data: {
        tokenHash: this.hashToken(nextRefreshToken),
        expiresAt: new Date(now.getTime() + REFRESH_TOKEN_TTL_MS),
        lastUsedAt: now,
      },
    });

    if (rotation.count !== 1) {
      throw this.invalidRefreshToken();
    }

    return { refreshToken: nextRefreshToken, userId: session.userId };
  }

  async revoke(refreshToken: string, expectedClient: SessionClient): Promise<void> {
    await this.prisma.authenticationSession.updateMany({
      where: {
        tokenHash: this.hashToken(refreshToken),
        clientType: expectedClient,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }

  private generateRefreshToken(): string {
    return randomBytes(48).toString('base64url');
  }

  private hashToken(refreshToken: string): string {
    return createHash('sha256').update(refreshToken).digest('hex');
  }

  private invalidRefreshToken(): UnauthorizedException {
    return new UnauthorizedException({
      code: 'INVALID_REFRESH_TOKEN',
      message: 'A sessão é inválida, expirou ou foi revogada',
    });
  }
}
