import { PrismaService } from '../shared/prisma.service';
import { UsersService } from './users.service';

describe('UsersService suggestions', () => {
  const viewerId = '0198df9d-bd1a-7fcb-9168-b83799b862bd';
  const prisma = {
    user: {
      findMany: jest.fn(),
    },
  };
  const service = new UsersService(prisma as unknown as PrismaService);

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.user.findMany.mockResolvedValue([]);
  });

  it('excludes the viewer and users they already follow', async () => {
    await service.getSuggestions(5, viewerId);

    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: {
        id: { not: viewerId },
        followers: { none: { followerId: viewerId } },
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { profile: true },
    });
  });
});
