import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiFetch, clearAuthSession, getAuthSession, logoutUser, saveAuthSession } from './auth';

describe('apiFetch', () => {
  beforeEach(() => {
    clearAuthSession();
    vi.restoreAllMocks();
  });

  it('refreshes the session when the request returns 401', async () => {
    saveAuthSession({
      accessToken: 'expired-token',
      user: {
        id: 'user-1',
        email: 'user@example.com',
        username: 'user',
        isAdmin: false,
      },
    });

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: 'Unauthorized' }), {
          status: 401,
          headers: { 'content-type': 'application/json' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            accessToken: 'new-access-token',
            user: { id: 'user-1', email: 'user@example.com', username: 'user' },
          }),
          {
            status: 200,
            headers: { 'content-type': 'application/json' },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
      );

    vi.stubGlobal('fetch', fetchMock as typeof fetch);

    const response = await apiFetch('/profile/me', { method: 'GET' });

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(3);

    const firstCallInit = fetchMock.mock.calls[0][1] as RequestInit;
    const secondCallInit = fetchMock.mock.calls[1][1] as RequestInit;
    const thirdCallInit = fetchMock.mock.calls[2][1] as RequestInit;

    const readHeader = (headers: HeadersInit | undefined, key: string) => {
      if (!headers) return undefined;
      if (headers instanceof Headers) return headers.get(key);
      if (Array.isArray(headers)) {
        const item = headers.find(([headerKey]) => headerKey.toLowerCase() === key.toLowerCase());
        return item?.[1];
      }
      return (
        (headers as Record<string, string>)[key] ??
        (headers as Record<string, string>)[key.toLowerCase()]
      );
    };

    expect(readHeader(firstCallInit.headers, 'Authorization')).toBe('Bearer expired-token');
    expect(secondCallInit.credentials).toBe('include');
    expect(readHeader(thirdCallInit.headers, 'Authorization')).toBe('Bearer new-access-token');
  });
});

describe('logoutUser', () => {
  beforeEach(() => {
    clearAuthSession();
    vi.restoreAllMocks();
  });

  it('clears the local session and invalidates the refresh cookie', async () => {
    saveAuthSession({
      accessToken: 'access-token',
      user: { id: 'user-1', email: 'user@example.com', username: 'user', isAdmin: false },
    });
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock as typeof fetch);

    await logoutUser();

    expect(getAuthSession()).toBeNull();
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  });
});
