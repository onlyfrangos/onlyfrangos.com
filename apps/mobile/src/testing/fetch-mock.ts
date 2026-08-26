type MockJsonResponse = {
  body: unknown;
  status?: number;
};

export function createFetchMock(mockResponse: MockJsonResponse): jest.MockedFunction<typeof fetch> {
  const status = mockResponse.status ?? 200;
  const response = new Response(JSON.stringify(mockResponse.body), {
    headers: { 'content-type': 'application/json' },
    status,
  });

  const fetchMock: jest.MockedFunction<typeof fetch> = jest.fn();
  fetchMock.mockResolvedValue(response);

  return fetchMock;
}
