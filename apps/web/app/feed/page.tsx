import { AuthGuard } from '../../src/features/auth/components/auth-guard';
import { FeedPage } from '../../src/features/feed/components/feed-page';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function FeedRoute() {
  return (
    <AuthGuard>
      <FeedPage />
    </AuthGuard>
  );
}
