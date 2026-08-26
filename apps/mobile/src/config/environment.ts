const DEFAULT_LOCAL_API_BASE_URL = 'http://localhost:3001/api/v1';

export type MobileEnvironment = {
  apiBaseUrl: string;
  isLocalApi: boolean;
};

export function resolveMobileEnvironment(
  configuredApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL,
): MobileEnvironment {
  const apiBaseUrl = (configuredApiBaseUrl || DEFAULT_LOCAL_API_BASE_URL).trim().replace(/\/$/, '');

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(apiBaseUrl);
  } catch {
    throw new Error('EXPO_PUBLIC_API_BASE_URL precisa ser uma URL válida');
  }

  const isLocalApi = ['localhost', '127.0.0.1', '10.0.2.2'].includes(parsedUrl.hostname);
  if (parsedUrl.protocol !== 'https:' && !isLocalApi) {
    throw new Error('EXPO_PUBLIC_API_BASE_URL precisa usar HTTPS fora do ambiente local');
  }

  return { apiBaseUrl, isLocalApi };
}

export const mobileEnvironment = resolveMobileEnvironment();
