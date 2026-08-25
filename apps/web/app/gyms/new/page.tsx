import { AuthGuard } from '../../../src/features/auth/components/auth-guard';
import { GymFormPage } from '../../../src/features/gyms/components/gym-form-page';

export default function NewGymRoute() {
  return (
    <AuthGuard>
      <GymFormPage />
    </AuthGuard>
  );
}
