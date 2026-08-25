import { AuthGuard } from "../../src/features/auth/components/auth-guard";
import { GymsPage } from "../../src/features/gyms/components/gyms-page";

export default function GymsRoute() {
  return (
    <AuthGuard>
      <GymsPage />
    </AuthGuard>
  );
}
