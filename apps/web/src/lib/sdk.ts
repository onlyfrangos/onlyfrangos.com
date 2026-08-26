import { createOnlyFrangosSdk } from '@onlyfrangos/sdk';

const defaultBaseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://api.onlyfrangos.com/api/v1'
    : 'http://localhost:3001/api/v1';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? defaultBaseUrl;

export const sdk = createOnlyFrangosSdk({ baseUrl });
