import { BadRequestException, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../shared/prisma.service';
import { FollowsService } from './follows.service';

describe('FollowsService', () => {
  const followerId = '0198df9d-bd1a-7fcb-9168-b83799b862bd';
  const followingId = '0198df9e-3a41-73d9-9fdb-f620153c4dbc';
  const prisma = {
    user: {
      findUnique: jest.fn(),
    },
    follow: {
      findUnique: jest.fn(),
      count: jest.fn(),
      upsert: jest.fn(),
      deleteMany: jest.fn(),
    },
  };
  const service = new FollowsService(prisma as unknown as PrismaService);

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.user.findUnique.mockResolvedValue({ id: followingId });
  });

  it('returns the current follow status and followers count', async () => {
    prisma.follow.findUnique.mockResolvedValue({ id: 'follow-id' });
    prisma.follow.count.mockResolvedValue(12);

    await expect(service.getStatus(followerId, followingId)).resolves.toEqual({
      following: true,
      followersCount: 12,
    });
    expect(prisma.follow.findUnique).toHaveBeenCalledWith({
      where: { followerId_followingId: { followerId, followingId } },
      select: { id: true },
    });
  });

  it('creates a follow idempotently and returns the updated count', async () => {
    prisma.follow.upsert.mockResolvedValue({ id: 'follow-id' });
    prisma.follow.count.mockResolvedValue(3);

    await expect(service.follow(followerId, followingId)).resolves.toEqual({
      following: true,
      followersCount: 3,
    });
    expect(prisma.follow.upsert).toHaveBeenCalledWith({
      where: { followerId_followingId: { followerId, followingId } },
      update: {},
      create: {
        id: expect.any(String),
        followerId,
        followingId,
      },
    });
  });

  it('removes a follow idempotently and returns the updated count', async () => {
    prisma.follow.deleteMany.mockResolvedValue({ count: 1 });
    prisma.follow.count.mockResolvedValue(2);

    await expect(service.unfollow(followerId, followingId)).resolves.toEqual({
      following: false,
      followersCount: 2,
    });
    expect(prisma.follow.deleteMany).toHaveBeenCalledWith({
      where: { followerId, followingId },
    });
  });

  it('does not allow a user to follow themselves', async () => {
    await expect(service.follow(followerId, followerId)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.follow.upsert).not.toHaveBeenCalled();
  });

  it('rejects a follow when the target user does not exist', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.follow(followerId, followingId)).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.follow.upsert).not.toHaveBeenCalled();
  });
});
