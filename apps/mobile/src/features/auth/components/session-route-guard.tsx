import { useRouter, useSegments } from 'expo-router';
import { type PropsWithChildren, useEffect } from 'react';

import { useAuth } from '../../../providers/auth-provider';

export function SessionRouteGuard({ children }: PropsWithChildren) {
  const { status } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const isAuthRoute = segments[0] === '(auth)';

  useEffect(() => {
    if (status === 'unauthenticated' && !isAuthRoute) {
      router.replace('/login');
    } else if (status === 'authenticated' && isAuthRoute) {
      router.replace('/(tabs)');
    }
  }, [isAuthRoute, router, status]);

  if (status === 'restoring') {
    return null;
  }

  return children;
}
