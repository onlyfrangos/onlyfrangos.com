import { createOnlyFrangosSdk } from '@onlyfrangos/sdk';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api/v1';

export const sdk = createOnlyFrangosSdk({ baseUrl });
