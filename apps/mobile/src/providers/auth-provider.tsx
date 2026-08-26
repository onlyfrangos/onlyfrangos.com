import type {
  AuthSession,
  LoginRequest,
  PolicyAcceptance,
  RegisterRequest,
} from '@onlyfrangos/types';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform } from 'react-native';

import { type OnlyFrangosSdk, SessionCoordinator } from '../features/auth/session-coordinator';
import { SecureSessionVault } from '../features/auth/session-vault';
import { mobileEnvironment } from '../config/environment';

type AuthStatus = 'authenticated' | 'restoring' | 'unauthenticated';

type AuthContextValue = {
  login(credentials: LoginRequest): Promise<AuthSession>;
  logout(): Promise<void>;
  register(registration: RegisterRequest, policyAcceptance: PolicyAcceptance): Promise<AuthSession>;
  sdk: OnlyFrangosSdk;
  session: AuthSession | null;
  status: AuthStatus;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>('restoring');
  const coordinator = useMemo(
    () =>
      new SessionCoordinator({
        apiBaseUrl: mobileEnvironment.apiBaseUrl,
        deviceName: 'OnlyFrangos mobile',
        platform: Platform.OS === 'ios' ? 'ios' : 'android',
        vault: new SecureSessionVault(),
      }),
    [],
  );

  useEffect(() => {
    const unsubscribe = coordinator.subscribe((nextSession) => {
      setSession(nextSession);
      setStatus(nextSession ? 'authenticated' : 'unauthenticated');
    });

    void coordinator.restore().finally(() => {
      setStatus((currentStatus) =>
        currentStatus === 'restoring' ? 'unauthenticated' : currentStatus,
      );
    });

    return unsubscribe;
  }, [coordinator]);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      login: (credentials) => coordinator.login(credentials),
      logout: () => coordinator.logout(),
      register: (registration, policyAcceptance) =>
        coordinator.register(registration, policyAcceptance),
      sdk: coordinator.sdk,
      session,
      status,
    }),
    [coordinator, session, status],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de AuthProvider');
  }
  return context;
}
