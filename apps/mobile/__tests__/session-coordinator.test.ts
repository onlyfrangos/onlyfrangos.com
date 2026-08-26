import type { SessionVault } from '../src/features/auth/session-vault';
import { SessionCoordinator } from '../src/features/auth/session-coordinator';

const user = {
  email: 'person@example.com',
  id: '0198df9d-bd1a-7fcb-9168-b83799b862bd',
  isAdmin: false,
  username: 'person',
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    headers: { 'content-type': 'application/json' },
    status,
  });
}

function createVault(refreshToken: string | null = null) {
  let storedRefreshToken = refreshToken;
  const vault: SessionVault = {
    clearRefreshToken: jest.fn(async () => {
      storedRefreshToken = null;
    }),
    getOrCreateDeviceId: jest.fn(async () => 'device-12345678'),
    getRefreshToken: jest.fn(async () => storedRefreshToken),
    saveRefreshToken: jest.fn(async (nextRefreshToken: string) => {
      storedRefreshToken = nextRefreshToken;
    }),
  };
  return vault;
}

describe('SessionCoordinator', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('restores a session while persisting only the rotated refresh token', async () => {
    const vault = createVault('stored-refresh-token');
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(
      jsonResponse({
        accessToken: 'memory-access-token',
        refreshToken: 'rotated-refresh-token',
        user,
      }),
    );
    const coordinator = new SessionCoordinator({
      apiBaseUrl: 'https://api.onlyfrangos.com/api/v1',
      deviceName: 'Phone',
      platform: 'android',
      vault,
    });

    await expect(coordinator.restore()).resolves.toEqual({
      accessToken: 'memory-access-token',
      user,
    });
    expect(vault.saveRefreshToken).toHaveBeenCalledWith('rotated-refresh-token');
    expect(vault.saveRefreshToken).not.toHaveBeenCalledWith('memory-access-token');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('coordinates simultaneous refresh requests', async () => {
    const vault = createVault('stored-refresh-token');
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(
      jsonResponse({
        accessToken: 'fresh-access-token',
        refreshToken: 'fresh-refresh-token',
        user,
      }),
    );
    const coordinator = new SessionCoordinator({
      apiBaseUrl: 'https://api.onlyfrangos.com/api/v1',
      deviceName: 'Phone',
      platform: 'ios',
      vault,
    });

    await expect(
      Promise.all([coordinator.refreshAccessToken(), coordinator.refreshAccessToken()]),
    ).resolves.toEqual(['fresh-access-token', 'fresh-access-token']);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('clears the local session when remote logout fails', async () => {
    const vault = createVault('stored-refresh-token');
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('offline'));
    const coordinator = new SessionCoordinator({
      apiBaseUrl: 'https://api.onlyfrangos.com/api/v1',
      deviceName: 'Phone',
      platform: 'android',
      vault,
    });

    await expect(coordinator.logout()).resolves.toBeUndefined();
    expect(vault.clearRefreshToken).toHaveBeenCalledTimes(1);
  });
});
