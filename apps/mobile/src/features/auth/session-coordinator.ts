import { createOnlyFrangosSdk } from '@onlyfrangos/sdk';
import type {
  AuthSession,
  LoginRequest,
  MobilePlatform,
  PolicyAcceptance,
  RegisterRequest,
} from '@onlyfrangos/types';

import type { SessionVault } from './session-vault';

export type OnlyFrangosSdk = ReturnType<typeof createOnlyFrangosSdk>;
export type SessionListener = (session: AuthSession | null) => void;

type SessionCoordinatorOptions = {
  apiBaseUrl: string;
  deviceName: string;
  platform: MobilePlatform;
  vault: SessionVault;
};

export class SessionCoordinator {
  readonly sdk: OnlyFrangosSdk;

  private accessToken: string | null = null;
  private currentSession: AuthSession | null = null;
  private readonly deviceName: string;
  private readonly listeners = new Set<SessionListener>();
  private readonly platform: MobilePlatform;
  private refreshPromise: Promise<string | null> | null = null;
  private readonly vault: SessionVault;

  constructor(options: SessionCoordinatorOptions) {
    this.deviceName = options.deviceName;
    this.platform = options.platform;
    this.vault = options.vault;
    this.sdk = createOnlyFrangosSdk({
      authentication: {
        getAccessToken: () => this.accessToken,
        onSessionExpired: () => this.clearLocalSession(),
        refreshAccessToken: () => this.refreshAccessToken(),
      },
      baseUrl: options.apiBaseUrl,
    });
  }

  subscribe(listener: SessionListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async login(credentials: LoginRequest): Promise<AuthSession> {
    const device = await this.getDevice();
    const mobileSession = await this.sdk.mobileLogin({ ...credentials, device });
    return this.saveSession(mobileSession);
  }

  async register(
    registration: RegisterRequest,
    policyAcceptance: PolicyAcceptance,
  ): Promise<AuthSession> {
    const device = await this.getDevice();
    const mobileSession = await this.sdk.mobileRegister({
      ...registration,
      device,
      policyAcceptance,
    });
    return this.saveSession(mobileSession);
  }

  async restore(): Promise<AuthSession | null> {
    const refreshToken = await this.vault.getRefreshToken();
    if (!refreshToken) {
      await this.clearLocalSession();
      return null;
    }

    try {
      await this.refreshAccessToken();
      return this.currentSession;
    } catch {
      await this.clearLocalSession();
      return null;
    }
  }

  async logout(): Promise<void> {
    const refreshToken = await this.vault.getRefreshToken();

    try {
      if (refreshToken) {
        await this.sdk.mobileLogout(refreshToken);
      }
    } catch {
      // Remote revocation is best-effort; local credentials must always be removed.
    } finally {
      await this.clearLocalSession();
    }
  }

  async refreshAccessToken(): Promise<string | null> {
    this.refreshPromise ??= this.performRefresh().finally(() => {
      this.refreshPromise = null;
    });
    return this.refreshPromise;
  }

  private async performRefresh(): Promise<string | null> {
    const refreshToken = await this.vault.getRefreshToken();
    if (!refreshToken) {
      await this.clearLocalSession();
      return null;
    }

    try {
      const mobileSession = await this.sdk.mobileRefresh(refreshToken);
      await this.saveSession(mobileSession);
      return mobileSession.accessToken;
    } catch (refreshError) {
      await this.clearLocalSession();
      throw refreshError;
    }
  }

  private async saveSession(mobileSession: {
    accessToken: string;
    refreshToken: string;
    user: AuthSession['user'];
  }): Promise<AuthSession> {
    await this.vault.saveRefreshToken(mobileSession.refreshToken);
    this.accessToken = mobileSession.accessToken;
    this.currentSession = {
      accessToken: mobileSession.accessToken,
      user: mobileSession.user,
    };
    this.notify();
    return this.currentSession;
  }

  private async clearLocalSession(): Promise<void> {
    this.accessToken = null;
    this.currentSession = null;
    await this.vault.clearRefreshToken();
    this.notify();
  }

  private async getDevice() {
    return {
      id: await this.vault.getOrCreateDeviceId(),
      name: this.deviceName,
      platform: this.platform,
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.currentSession);
    }
  }
}
