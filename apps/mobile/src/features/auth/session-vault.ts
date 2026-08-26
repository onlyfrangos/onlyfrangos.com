import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'onlyfrangos.refresh-token';
const DEVICE_ID_KEY = 'onlyfrangos.device-id';

export type SessionVault = {
  clearRefreshToken(): Promise<void>;
  getOrCreateDeviceId(): Promise<string>;
  getRefreshToken(): Promise<string | null>;
  saveRefreshToken(refreshToken: string): Promise<void>;
};

export class SecureSessionVault implements SessionVault {
  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  }

  async saveRefreshToken(refreshToken: string): Promise<void> {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  }

  async clearRefreshToken(): Promise<void> {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  }

  async getOrCreateDeviceId(): Promise<string> {
    const storedDeviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
    if (storedDeviceId) {
      return storedDeviceId;
    }

    const deviceId = createDeviceId();
    await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    return deviceId;
  }
}

function createDeviceId(): string {
  const randomPart = Array.from({ length: 4 }, () => Math.random().toString(36).slice(2)).join('');
  return `mobile-${Date.now().toString(36)}-${randomPart}`;
}
