import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';

import { PrismaService } from '../shared/prisma.service';
import { PolicyAcceptanceDto } from './dto/policy-acceptance.dto';
import { SessionMetadata, SessionService } from './session.service';
import {
  isReservedUsername,
  USERNAME_ALREADY_EXISTS_MESSAGE,
  USERNAME_UNAVAILABLE_MESSAGE,
} from './username-policy';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}

  private signAccessToken(user: { id: string; email: string; username: string }) {
    return this.jwtService.sign(
      { sub: user.id, email: user.email, username: user.username },
      { expiresIn: '15m' },
    );
  }

  getCurrentPolicyVersions() {
    return {
      termsVersion: process.env.TERMS_VERSION ?? '2026-08-25',
      privacyPolicyVersion: process.env.PRIVACY_POLICY_VERSION ?? '2026-08-25',
      communityGuidelinesVersion: process.env.COMMUNITY_GUIDELINES_VERSION ?? '2026-08-25',
      minimumAge: 18,
    };
  }

  async isUsernameAvailable(username: string) {
    const normalizedUsername = username.trim().toLowerCase();

    if (!/^[a-z0-9._]{3,}$/.test(normalizedUsername) || isReservedUsername(username)) {
      return { username: normalizedUsername, available: false };
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { username: normalizedUsername },
      select: { id: true },
    });

    return { username: normalizedUsername, available: !existingUser };
  }

  async register(
    body: {
      username: string;
      email: string;
      password: string;
      fullName: string;
      age: number;
      cityId: number;
      policyAcceptance?: PolicyAcceptanceDto;
    },
    sessionMetadata: SessionMetadata = { clientType: SessionClient.WEB },
  ) {
    const normalizedUsername = body.username.trim().toLowerCase();
    const normalizedEmail = body.email.trim().toLowerCase();
    const normalizedFullName = body.fullName.trim();

    if (isReservedUsername(body.username)) {
      throw new ConflictException(USERNAME_UNAVAILABLE_MESSAGE);
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { username: normalizedUsername }],
      },
    });

    if (existingUser) {
      throw new ConflictException(USERNAME_ALREADY_EXISTS_MESSAGE);
    }

    const passwordHash = await bcrypt.hash(body.password, 12);

    if (body.policyAcceptance) {
      this.validatePolicyAcceptance(body.policyAcceptance);
    }

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
            bio: '',
            showGym: true,
            showCity: true,
            showPhysicalInfo: true,
          },
        },
        ...(body.policyAcceptance
          ? {
              policyAcceptances: {
                create: {
                  id: randomUUID(),
                  ...body.policyAcceptance,
                },
              },
            }
          : {}),
      },
      select: {
        id: true,
        email: true,
        username: true,
        isAdmin: true,
      },
    });

    return {
      user,
      accessToken: this.signAccessToken(user),
      refreshToken: await this.sessionService.issue(user.id, sessionMetadata),
    };
  }

  async login(
    body: { email: string; password: string },
    sessionMetadata: SessionMetadata = { clientType: SessionClient.WEB },
  ) {
    const email = body.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        passwordHash: true,
        isAdmin: true,
      },
    });

    if (!user) {
      throw this.invalidCredentials();
    }

    const passwordMatches = await bcrypt.compare(body.password, user.passwordHash);

    if (!passwordMatches) {
      throw this.invalidCredentials();
    }

    const { passwordHash: _passwordHash, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken: this.signAccessToken(safeUser),
      refreshToken: await this.sessionService.issue(safeUser.id, sessionMetadata),
    };
  }

  async impersonate(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true, isAdmin: true },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return {
      user,
      accessToken: this.signAccessToken(user),
      refreshToken: await this.sessionService.issue(user.id, {
        clientType: SessionClient.WEB,
        deviceName: 'Admin impersonation',
      }),
    };
  }

  async refresh(refreshToken: string, clientType: SessionClient) {
    const rotatedSession = await this.sessionService.rotate(refreshToken, clientType);
    const user = await this.prisma.user.findUnique({
      where: { id: rotatedSession.userId },
      select: { id: true, email: true, username: true, isAdmin: true },
    });

    if (!user) {
      throw new UnauthorizedException({
        code: 'INVALID_REFRESH_TOKEN',
        message: 'A sessão é inválida, expirou ou foi revogada',
      });
    }

    return {
      user,
      accessToken: this.signAccessToken(user),
      refreshToken: rotatedSession.refreshToken,
    };
  }

  async logout(refreshToken: string, clientType: SessionClient): Promise<void> {
    await this.sessionService.revoke(refreshToken, clientType);
  }

  private validatePolicyAcceptance(policyAcceptance: PolicyAcceptanceDto): void {
    const currentVersions = this.getCurrentPolicyVersions();
    const isCurrent =
      policyAcceptance.termsVersion === currentVersions.termsVersion &&
      policyAcceptance.privacyPolicyVersion === currentVersions.privacyPolicyVersion &&
      policyAcceptance.communityGuidelinesVersion === currentVersions.communityGuidelinesVersion;

    if (!isCurrent) {
      throw new BadRequestException({
        code: 'POLICY_VERSION_OUTDATED',
        message: 'Os documentos legais foram atualizados. Revise e aceite as versões atuais.',
        details: currentVersions,
      });
    }
  }

  private invalidCredentials(): UnauthorizedException {
    return new UnauthorizedException({
      code: 'INVALID_CREDENTIALS',
      message: 'E-mail ou senha inválidos',
    });
  }
}
