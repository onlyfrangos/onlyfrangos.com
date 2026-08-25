import { AuthGuard } from "../../../../src/features/auth/components/auth-guard";
import { UserFormPage } from "../../../../src/features/users/components/user-form-page";

export default async function EditUserRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AuthGuard>
      <UserFormPage userId={id} />
    </AuthGuard>
  );
}
