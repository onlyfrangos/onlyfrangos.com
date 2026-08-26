export type AuthUser = {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
};

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
};

const defaultBaseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://api.onlyfrangos.com/api/v1'
    : 'http://localhost:3001/api/v1';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? defaultBaseUrl;
let inMemorySession: AuthSession | null = null;
let refreshPromise: Promise<AuthSession | null> | null = null;

export function saveAuthSession(session: AuthSession) {
  inMemorySession = session;
}

export function getAuthSession(): AuthSession | null {
  return inMemorySession;
}

export function clearAuthSession() {
  inMemorySession = null;
}

export function updateAuthUser(user: AuthUser) {
  if (inMemorySession) {
    inMemorySession = { ...inMemorySession, user };
  }
}

export async function logoutUser() {
  try {
    await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } finally {
    clearAuthSession();
  }
}

export async function loginUser(payload: { email: string; password: string }) {
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message ?? 'Falha ao fazer login');
  }

  const session = (await response.json()) as AuthSession;
  saveAuthSession(session);
  return session;
}

export async function checkUsernameAvailability(username: string) {
  const response = await fetch(
    `${baseUrl}/auth/username-availability?username=${encodeURIComponent(username)}`,
  );

  if (!response.ok) {
    throw new Error('Não foi possível verificar o nome de usuário');
  }

  return (await response.json()) as { username: string; available: boolean };
}

export async function registerUser(payload: {
  username: string;
  email: string;
  password: string;
  fullName: string;
  age: number;
  cityId: number;
}) {
  const response = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message ?? 'Falha ao criar conta');
  }

  const session = (await response.json()) as AuthSession;
  saveAuthSession(session);
  return session;
}

export async function refreshAuthSession() {
  refreshPromise ??= performRefresh().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

async function performRefresh() {
  const response = await fetch(`${baseUrl}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    clearAuthSession();
    return null;
  }

  const payload = (await response.json()) as { accessToken?: string; user?: AuthUser };
  if (!payload.accessToken) {
    clearAuthSession();
    return null;
  }

  const currentSession = getAuthSession();
  const user = payload.user ?? currentSession?.user;

  if (!user) {
    clearAuthSession();
    return null;
  }

  const nextSession = {
    accessToken: payload.accessToken,
    user,
  };

  saveAuthSession(nextSession);
  return nextSession;
}

export async function apiFetch(input: string, init: RequestInit = {}) {
  const session = getAuthSession();
  const headers = new Headers(init.headers || {});

  if (session?.accessToken) {
    headers.set('Authorization', `Bearer ${session.accessToken}`);
  }

  const response = await fetch(`${baseUrl}${input.startsWith('/') ? input : `/${input}`}`, {
    ...init,
    credentials: 'include',
    headers,
  });

  if (response.status !== 401) {
    return response;
  }

  const refreshedSession = await refreshAuthSession();
  if (!refreshedSession) {
    throw new Error('Sessão expirada');
  }

  const retryHeaders = new Headers(init.headers || {});
  retryHeaders.set('Authorization', `Bearer ${refreshedSession.accessToken}`);

  return fetch(`${baseUrl}${input.startsWith('/') ? input : `/${input}`}`, {
    ...init,
    credentials: 'include',
    headers: retryHeaders,
  });
}
