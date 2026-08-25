import { AuthGuard } from "../../src/features/auth/components/auth-guard";
import { OwnProfilePage } from "../../src/features/profile/components/own-profile-page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ProfileRoute() {
  return (
    <AuthGuard>
      <OwnProfilePage />
    </AuthGuard>
  );
}
