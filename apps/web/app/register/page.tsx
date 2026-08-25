import { Suspense } from 'react';

import { AuthForm } from '../../src/features/auth/components/auth-form';

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="register" />
    </Suspense>
  );
}
