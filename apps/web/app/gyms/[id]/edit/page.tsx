import { AuthGuard } from '../../../../src/features/auth/components/auth-guard';
import { GymFormPage } from '../../../../src/features/gyms/components/gym-form-page';

export default async function EditGymRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AuthGuard>
      <GymFormPage gymId={id} />
    </AuthGuard>
  );
}
