import { Redirect } from 'expo-router';

import { useAuth } from '../src/providers/auth-provider';

export default function IndexRoute() {
  const { status } = useAuth();

  if (status === 'restoring') {
    return null;
  }

  return <Redirect href={status === 'authenticated' ? '/(tabs)' : '/login'} />;
}
