import { Suspense } from 'react';

import { AuthForm } from '../../src/features/auth/components/auth-form';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="login" />
    </Suspense>
  );
}
