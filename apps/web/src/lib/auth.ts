export type AuthUser = {
  id: string;
  email: string;
  username: string;
};

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api/v1";
let inMemorySession: AuthSession | null = null;

export function saveAuthSession(session: AuthSession) {
  inMemorySession = session;
}

export function getAuthSession(): AuthSession | null {
  return inMemorySession;
}

export function clearAuthSession() {
  inMemorySession = null;
}

export async function loginUser(payload: { email: string; password: string }) {
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message ?? "Falha ao fazer login");
  }

  const session = (await response.json()) as AuthSession;
  saveAuthSession(session);
  return session;
}

export async function registerUser(payload: { username: string; email: string; password: string }) {
  const response = await fetch(`${baseUrl}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message ?? "Falha ao criar conta");
  }

  const session = (await response.json()) as AuthSession;
  saveAuthSession(session);
  return session;
}

export async function refreshAuthSession() {
  const response = await fetch(`${baseUrl}/auth/refresh`, {
    method: "POST",
    credentials: "include"
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
    user
  };

  saveAuthSession(nextSession);
  return nextSession;
}

export async function apiFetch(input: string, init: RequestInit = {}) {
  const session = getAuthSession();
  const headers = new Headers(init.headers || {});

  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  const response = await fetch(`${baseUrl}${input.startsWith("/") ? input : `/${input}`}`, {
    ...init,
    credentials: "include",
    headers
  });

  if (response.status !== 401) {
    return response;
  }

  const refreshedSession = await refreshAuthSession();
  if (!refreshedSession) {
    throw new Error("Sessão expirada");
  }

  const retryHeaders = new Headers(init.headers || {});
  retryHeaders.set("Authorization", `Bearer ${refreshedSession.accessToken}`);

  return fetch(`${baseUrl}${input.startsWith("/") ? input : `/${input}`}`, {
    ...init,
    credentials: "include",
    headers: retryHeaders
  });
}
