'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { getAuthSession, refreshAuthSession } from '../../../lib/auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      const session = getAuthSession();

      if (session?.accessToken) {
        if (!cancelled) {
          setReady(true);
        }
        return;
      }

      const refreshed = await refreshAuthSession().catch(() => null);
      if (cancelled) {
        return;
      }

      if (refreshed?.accessToken) {
        setReady(true);
        return;
      }

      const next = encodeURIComponent(pathname || '/feed');
      router.replace(`/login?redirect=${next}`);
    }

    void checkSession();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}
