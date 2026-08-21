import { AuthGuard } from "../../src/features/auth/components/auth-guard";
import { ProfilePage } from "../../src/features/profile/components/profile-page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProfileRouteProps = {
  params: {
    username: string;
  };
};

export default function ProfileRoute({ params }: ProfileRouteProps) {
  return (
    <AuthGuard>
      <ProfilePage username={params.username} />
    </AuthGuard>
  );
}
