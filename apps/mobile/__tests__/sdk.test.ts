import {
  createOnlyFrangosSdk,
  type OnlyFrangosApiError,
  type SdkHttpRequest,
  type SdkHttpResponse,
  type SdkTransport,
} from '@onlyfrangos/sdk';

function response(status: number, body: unknown): SdkHttpResponse {
  return { body, headers: new Headers(), status };
}

describe('OnlyFrangos SDK', () => {
  it('injects the transport, normalizes JSON and sends authentication', async () => {
    const transport = jest.fn<ReturnType<SdkTransport>, Parameters<SdkTransport>>();
    transport.mockResolvedValue(
      response(200, { items: [], pageInfo: { limit: 20, nextCursor: null } }),
    );
    const sdk = createOnlyFrangosSdk({
      authentication: {
        getAccessToken: () => 'access-token',
        refreshAccessToken: async () => null,
      },
      baseUrl: 'https://api.onlyfrangos.com/api/v1/',
      transport,
    });

    await sdk.getFeed();

    expect(transport).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: { Authorization: 'Bearer access-token' },
        method: 'GET',
        url: 'https://api.onlyfrangos.com/api/v1/feed?limit=20',
      }),
    );
  });

  it('uses a single refresh for simultaneous 401 responses and retries both requests', async () => {
    let accessToken = 'expired-token';
    const requests: SdkHttpRequest[] = [];
    const transport: SdkTransport = async (request) => {
      requests.push(request);
      if (request.headers.Authorization === 'Bearer expired-token') {
        return response(401, { code: 'UNAUTHORIZED', message: 'Sessão expirada' });
      }
      return response(200, { items: [] });
    };
    const refreshAccessToken = jest.fn(async () => {
      await Promise.resolve();
      accessToken = 'fresh-token';
      return accessToken;
    });
    const sdk = createOnlyFrangosSdk({
      authentication: {
        getAccessToken: () => accessToken,
        refreshAccessToken,
      },
      baseUrl: 'https://api.onlyfrangos.com/api/v1',
      transport,
    });

    await Promise.all([sdk.getMyUserSuggestions(), sdk.getMe()]);

    expect(refreshAccessToken).toHaveBeenCalledTimes(1);
    expect(requests).toHaveLength(4);
    expect(
      requests.slice(2).every((request) => request.headers.Authorization === 'Bearer fresh-token'),
    ).toBe(true);
  });

  it('exposes discriminated API errors without leaking response internals', async () => {
    const sdk = createOnlyFrangosSdk({
      baseUrl: 'https://api.onlyfrangos.com/api/v1',
      transport: async () =>
        response(401, {
          code: 'INVALID_CREDENTIALS',
          message: 'E-mail ou senha inválidos',
        }),
    });

    const loginPromise = sdk.mobileLogin({
      device: { id: 'device-12345678', platform: 'android' },
      email: 'person@example.com',
      password: 'secret123',
    });

    await expect(loginPromise).rejects.toMatchObject<Partial<OnlyFrangosApiError>>({
      code: 'INVALID_CREDENTIALS',
      message: 'E-mail ou senha inválidos',
      status: 401,
    });
  });

  it('preserves multipart bodies without setting a JSON content type', async () => {
    const transport = jest.fn<ReturnType<SdkTransport>, Parameters<SdkTransport>>();
    transport.mockResolvedValue(response(201, { id: 'post-id' }));
    const sdk = createOnlyFrangosSdk({
      baseUrl: 'https://api.onlyfrangos.com/api/v1',
      transport,
    });
    const formData = new FormData();
    formData.append('caption', 'Treino concluído');

    await sdk.createPost(formData);

    expect(transport).toHaveBeenCalledWith(
      expect.objectContaining({ body: formData, headers: {}, method: 'POST' }),
    );
  });
});
