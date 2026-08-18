import { ProfilePage } from "../../src/features/profile/components/profile-page";

type ProfileRouteProps = {
  params: {
    username: string;
  };
};

export default function ProfileRoute({ params }: ProfileRouteProps) {
  return <ProfilePage username={params.username} />;
}
