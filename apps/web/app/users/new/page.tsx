import { AuthGuard } from "../../../src/features/auth/components/auth-guard";
import { UserFormPage } from "../../../src/features/users/components/user-form-page";

export default function NewUserRoute() {
  return (
    <AuthGuard>
      <UserFormPage />
    </AuthGuard>
  );
}
