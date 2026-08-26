import { createFetchMock } from '../src/testing/fetch-mock';

describe('createFetchMock', () => {
  it('cria uma resposta JSON tipada para testes de integração', async () => {
    const fetchMock = createFetchMock({ body: { items: [] } });

    const response = await fetchMock('https://api.onlyfrangos.com/api/v1/feed');

    await expect(response.json()).resolves.toEqual({ items: [] });
    expect(response.status).toBe(200);
  });
});
