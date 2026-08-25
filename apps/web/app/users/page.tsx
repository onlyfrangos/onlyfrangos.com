import { AuthGuard } from "../../src/features/auth/components/auth-guard";
import { UsersPage } from "../../src/features/users/components/users-page";

export default function UsersRoute() {
  return (
    <AuthGuard>
      <UsersPage />
    </AuthGuard>
  );
}
