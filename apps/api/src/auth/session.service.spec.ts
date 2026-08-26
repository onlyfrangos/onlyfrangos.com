import { UnauthorizedException } from '@nestjs/common';
import { SessionClient } from '@prisma/client';

import { PrismaService } from '../shared/prisma.service';
import { SessionService } from './session.service';

describe('SessionService', () => {
  const userId = '0198df9d-bd1a-7fcb-9168-b83799b862bd';
  const sessionId = '0198df9e-3a41-73d9-9fdb-f620153c4dbc';
  const prisma = {
    authenticationSession: {
      create: jest.fn(),
      findUnique: jest.fn(),
      updateMany: jest.fn(),
    },
  };
  const service = new SessionService(prisma as unknown as PrismaService);

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.authenticationSession.create.mockResolvedValue({ id: sessionId });
    prisma.authenticationSession.updateMany.mockResolvedValue({ count: 1 });
  });

  it('stores only the refresh token hash and revokes the previous device session', async () => {
    const refreshToken = await service.issue(userId, {
      clientType: SessionClient.MOBILE,
      deviceId: 'device-12345678',
      deviceName: 'android: Phone',
    });
    const createdSession = prisma.authenticationSession.create.mock.calls[0]?.[0].data;

    expect(refreshToken).toHaveLength(64);
    expect(createdSession.tokenHash).toHaveLength(64);
    expect(createdSession.tokenHash).not.toBe(refreshToken);
    expect(prisma.authenticationSession.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ deviceId: 'device-12345678', userId }),
      }),
    );
  });

  it('rotates a valid token atomically and rejects its repetition', async () => {
    const refreshToken = await service.issue(userId, { clientType: SessionClient.MOBILE });
    const tokenHash = prisma.authenticationSession.create.mock.calls[0]?.[0].data.tokenHash;
    prisma.authenticationSession.findUnique
      .mockResolvedValueOnce({
        clientType: SessionClient.MOBILE,
        expiresAt: new Date(Date.now() + 60_000),
        id: sessionId,
        revokedAt: null,
        userId,
      })
      .mockResolvedValueOnce(null);

    const rotated = await service.rotate(refreshToken, SessionClient.MOBILE);

    expect(rotated.refreshToken).not.toBe(refreshToken);
    expect(prisma.authenticationSession.updateMany).toHaveBeenLastCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ id: sessionId, tokenHash }) }),
    );
    await expect(service.rotate(refreshToken, SessionClient.MOBILE)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it.each([
    { expiresAt: new Date(Date.now() - 1), revokedAt: null },
    { expiresAt: new Date(Date.now() + 60_000), revokedAt: new Date() },
  ])('rejects an expired or revoked session', async (sessionState) => {
    prisma.authenticationSession.findUnique.mockResolvedValue({
      ...sessionState,
      clientType: SessionClient.MOBILE,
      id: sessionId,
      userId,
    });

    await expect(service.rotate('refresh-token', SessionClient.MOBILE)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(prisma.authenticationSession.updateMany).not.toHaveBeenCalled();
  });

  it('allows only one concurrent rotation to win', async () => {
    const session = {
      clientType: SessionClient.MOBILE,
      expiresAt: new Date(Date.now() + 60_000),
      id: sessionId,
      revokedAt: null,
      userId,
    };
    prisma.authenticationSession.findUnique.mockResolvedValue(session);
    prisma.authenticationSession.updateMany
      .mockResolvedValueOnce({ count: 1 })
      .mockResolvedValueOnce({ count: 0 });

    const rotations = await Promise.allSettled([
      service.rotate('same-refresh-token', SessionClient.MOBILE),
      service.rotate('same-refresh-token', SessionClient.MOBILE),
    ]);

    expect(rotations.filter((rotation) => rotation.status === 'fulfilled')).toHaveLength(1);
    expect(rotations.filter((rotation) => rotation.status === 'rejected')).toHaveLength(1);
  });

  it('revokes a session without exposing its token', async () => {
    await service.revoke('refresh-token', SessionClient.MOBILE);

    expect(prisma.authenticationSession.updateMany).toHaveBeenCalledWith({
      data: { revokedAt: expect.any(Date) },
      where: {
        clientType: SessionClient.MOBILE,
        revokedAt: null,
        tokenHash: expect.not.stringContaining('refresh-token'),
      },
    });
  });
});
