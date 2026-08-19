export type AuthUser = {
  id: string;
  email: string;
  username: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

const AUTH_STORAGE_KEY = "onlyfrangos-auth";
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api/v1";

export function saveAuthSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export async function loginUser(payload: { email: string; password: string }) {
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
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
