import { AuthGuard } from '../../../src/features/auth/components/auth-guard';
import { GymDetailPage } from '../../../src/features/gyms/components/gym-detail-page';

export default async function GymDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AuthGuard>
      <GymDetailPage gymId={id} />
    </AuthGuard>
  );
}
