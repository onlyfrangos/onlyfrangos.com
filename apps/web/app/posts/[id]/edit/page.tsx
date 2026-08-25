import { AuthGuard } from '../../../../src/features/auth/components/auth-guard';
import { PostEditPage } from '../../../../src/features/posts/components/post-edit-page';

export default function EditPostRoute({ params }: { params: { id: string } }) {
  return (
    <AuthGuard>
      <PostEditPage postId={params.id} />
    </AuthGuard>
  );
}
